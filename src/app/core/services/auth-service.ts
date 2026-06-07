import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionService } from '@/app/core/services/session-service';
import { Observable, tap } from 'rxjs';
import { environment } from '@/environments/environment';

export interface LoginCredentials {
    username: string;
    password: string;
    remember?: boolean;
}

interface LoginResponse {
    auth_token: string;
    expires_in: Date;
    type: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private sessionService = inject(SessionService);

    public login(credentials: LoginCredentials): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
            tap((response) => {
                this.sessionService.createSession(response.auth_token);
            })
        );
    }

    public logout(): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/auth/logout`, {}).pipe(
            tap((response) => {
                console.log(response);
                this.sessionService.destroySession();
            })
        );
    }
}
