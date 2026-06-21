import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SessionService {
    private readonly _authenticated = signal(false);

    readonly authenticated = this._authenticated.asReadonly();

    public isAuthenticated(): boolean {
        return this._authenticated();
    }

    public createSession(): void {
        this._authenticated.set(true);
    }

    public destroySession(): void {
        this._authenticated.set(false);
    }
}
