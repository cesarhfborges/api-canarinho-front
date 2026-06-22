FROM node:20-alpine AS builder

WORKDIR /app

ENV NODE_OPTIONS="--max-old-space-size=768"

COPY package.json package-lock.json ./

RUN npm install --silent

COPY . .

RUN sed -i "s|http://localhost:8000/api|${SERVER_URL}/api|g" src/environments/environment.ts

RUN npm run build:hm

FROM nginx:alpine

COPY --from=builder /app/dist/browser /usr/share/nginx/html

COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
