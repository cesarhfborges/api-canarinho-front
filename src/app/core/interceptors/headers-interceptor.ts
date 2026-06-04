import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionService } from '@/app/core/services/session-service';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
    const sessionService = inject(SessionService);
    const token = sessionService.getToken();

    const headers: Record<string, string> = {
        Accept: 'application/json'
    };

    if (!(req.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    // Se houver uma sessão ativa com token, anexa ao cabeçalho
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const clonedReq = req.clone({ setHeaders: headers });
    return next(clonedReq);
};
