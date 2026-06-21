import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '@/environments/environment';

export interface UserProfile {
    id: number;
    name: string;
    username: string;
    email: string;
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

    public clearPerfil(): void {
        this.userProfile.set(null);
    }
}
