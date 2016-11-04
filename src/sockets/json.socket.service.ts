import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';

// Kudos to the example here:
// https://github.com/PeterKassenaar/ng2-websockets/blob/master/client/app/shared/services/websocket.service.ts

@Injectable()
export class JsonSocketService {
    private subject: Subject<MessageEvent>;

    public connect(url: string): Subject<MessageEvent> {
        if (!this.subject) {
            this.subject = this.create(url);
        }
        return this.subject;
    }

    private create(url: string): Subject<MessageEvent> {
        let ws = new WebSocket(url);

        let buffer: Object[] = [];

        let observable = Observable.create(
            (obs: Observer<MessageEvent>) => {
                ws.onmessage = obs.next.bind(obs);
                ws.onerror = obs.error.bind(obs);
                ws.onclose = obs.complete.bind(obs);
                ws.onopen = () => {
                    let l: number = buffer.length;
                    while (l--) {
                        ws.send(JSON.stringify(buffer[l]));
                        buffer.splice(l, 1);
                    }
                };
                return ws.close.bind(ws);
            });

        let observer = {
            next: (data: Object) => {
                switch (ws.readyState) {
                    case WebSocket.OPEN:
                        ws.send(JSON.stringify(data));
                        break;

                    case WebSocket.CONNECTING:
                        buffer.push(data);
                        break;

                    case WebSocket.CLOSED:
                        alert('WebSocket closed');
                        break;

                    default:
                        break;
                }
            }
        };

        return Subject.create(observer, observable);
    }
}
