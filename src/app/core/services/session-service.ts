import { computed, Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SessionService {
    private tokenSignal = signal<string | null>(localStorage.getItem('auth_token'));

    public hasActiveSession = computed(() => !!this.tokenSignal());

    public getToken(): string | null {
        return this.tokenSignal();
    }

    public createSession(token: string): void {
        localStorage.setItem('auth_token', token);
        this.tokenSignal.set(token);
    }

    public destroySession(): void {
        localStorage.removeItem('auth_token');
        this.tokenSignal.set(null);
    }
}
