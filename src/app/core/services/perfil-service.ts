import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '@/environments/environment';

export interface UserProfile {
    id: number;
    name: string;
    email: string;
    // Adicione outros campos do seu backend aqui
}

@Injectable({
    providedIn: 'root'
})
export class PerfilService {
    public userProfile = signal<UserProfile | null>(null);
    private readonly http = inject(HttpClient);

    public getPerfil(): Observable<UserProfile> {
        return this.http.get<UserProfile>(`${environment.apiUrl}/perfil`).pipe(tap((profile) => this.userProfile.set(profile)));
    }

    public clearPerfil(): void {
        this.userProfile.set(null);
    }
}
