import { inject, Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { SessionService } from '@/app/core/services/session-service';

@Injectable({
    providedIn: 'root'
})
export class ReuniaoSocketService {
    private readonly sessionService = inject(SessionService);

    private client?: Client;
    private connected = false;
    private enableDebug = false;

    connect(): void {
        if (this.client?.active) {
            return;
        }

        const token = this.sessionService.getToken();

        if (!token) {
            throw new Error('Unauthorized');
        }

        this.client = new Client({
            brokerURL: `${environment.socketUrl}/ws`,
            reconnectDelay: 5000,

            connectHeaders: {
                Authorization: `Bearer ${token}`
            }
        });

        if (this.enableDebug) {
            this.client.debug = console.log;
        }

        this.client.onConnect = () => {
            this.connected = true;
        };

        this.client.onDisconnect = () => {
            this.connected = false;
        };

        this.client.activate();
    }

    subscribe<T>(destination: string): Observable<T> {
        return new Observable<T>((observer) => {
            if (!this.client) {
                observer.error('Socket não conectado');

                return;
            }

            const waitConnection = setInterval(() => {
                if (!this.connected) {
                    return;
                }

                clearInterval(waitConnection);

                const subscription = this.client!.subscribe(destination, (message: IMessage) => {
                    observer.next(JSON.parse(message.body));
                });

                return () => {
                    subscription.unsubscribe();
                };
            }, 100);
        });
    }
}
