import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionService } from '@/app/core/services/session-service';
import { PerfilService, UserProfile } from '@/app/core/services/perfil-service';
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
    user: UserProfile;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private sessionService = inject(SessionService);
    private perfilService = inject(PerfilService);

    public login(credentials: LoginCredentials): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${environment.apiUrl}/admin/login`, credentials).pipe(
            tap((response) => {
                this.sessionService.createSession();
                this.perfilService.userProfile.set(response.user);
            })
        );
    }

    public register(userData: any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/admin/register`, userData);
    }

    public logout(): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/admin/logout`, {}).pipe(
            tap((response) => {
                console.log(response);
                this.sessionService.destroySession();
                this.perfilService.clearPerfil();
            })
        );
    }

    public requestPasswordReset(username_or_email: string): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/admin/password/reset-request`, { username_or_email });
    }

    public changePassword(data: any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/admin/password/change`, data);
    }
}
