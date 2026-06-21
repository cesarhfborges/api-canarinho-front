import { HttpInterceptorFn } from '@angular/common/http';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
    // const sessionService = inject(SessionService);
    // const token = sessionService.getToken();

    const headers: Record<string, string> = {
        Application: 'web',
        Accept: 'application/json'
    };

    if (!(req.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    // Se houver uma sessão ativa com token, anexa ao cabeçalho
    // if (token) {
    //     headers['Authorization'] = `Bearer ${token}`;
    // }

    const clonedReq = req.clone({
        setHeaders: headers,
        withCredentials: true
    });
    return next(clonedReq);
};
