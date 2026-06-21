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
    success: boolean;
    message: string;
    user: {
        id: number;
        name: string;
        username: string;
        email: string;
        created_at: Date;
        updated_at: Date;
    };
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private sessionService = inject(SessionService);

    public login(credentials: LoginCredentials): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${environment.apiUrl}/admin/login`, credentials).pipe(
            tap(() => {
                this.sessionService.createSession();
            })
        );
    }

    public logout(): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/admin/logout`, {}).pipe(
            tap((response) => {
                console.log(response);
                this.sessionService.destroySession();
            })
        );
    }
}
