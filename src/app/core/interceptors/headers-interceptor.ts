import { HttpInterceptorFn } from '@angular/common/http';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {

    const headers: Record<string, string> = {
        Application: 'web',
        'X-Origin': window.location.origin,
        Accept: 'application/json'
    };

    if (!(req.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const clonedReq = req.clone({
        setHeaders: headers,
        withCredentials: true
    });
    return next(clonedReq);
};
