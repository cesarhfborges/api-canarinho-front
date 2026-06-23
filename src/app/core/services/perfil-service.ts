import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '@/environments/environment';

export interface UserProfile {
    id: number;
    name: string;
    username: string;
    email: string;
    theme_color_scheme: 'light' | 'dark' | 'auto';
    is_admin: boolean;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

@Injectable({
    providedIn: 'root'
})
export class PerfilService {
    public userProfile = signal<UserProfile | null>(null);
    private readonly http = inject(HttpClient);

    public getPerfil(): Observable<UserProfile> {
        return this.http
            .get<UserProfile>(`${environment.apiUrl}/admin/me`)
            .pipe(tap((profile) => this.userProfile.set(profile)));
    }

    public updatePerfil(data: { name?: string; email?: string; theme_color_scheme?: 'light' | 'dark' | 'auto' }): Observable<UserProfile> {
        return this.http
            .put<UserProfile>(`${environment.apiUrl}/admin/me`, data)
            .pipe(tap((profile) => this.userProfile.set(profile)));
    }

    public updatePassword(data: any): Observable<any> {
        return this.http.put(`${environment.apiUrl}/admin/me/password`, data);
    }

    public clearPerfil(): void {
        this.userProfile.set(null);
    }
}
