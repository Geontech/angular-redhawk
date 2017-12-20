import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';

// Kudos to the example here:
// https://github.com/PeterKassenaar/ng2-websockets/blob/master/client/app/shared/services/websocket.service.ts

export type WebSocketBinaryType = 'blob' | 'arraybuffer';

/**
 * This is a factory that returns websocket instances in the form of Subjects.
 * The Subject `subscribe` and `unsubscribe` methods are bound to opening and
 * closing the socket, respectively.  When subscribing, map the output to the
 * type you expect.  Sometimes it's helpful to map this response into your own
 * local subject or observable, behaving as the buffer abstraction for your
 * design.  Use `next` to send data back through the socket.
 */
export function basicSocket(url: string, type?: WebSocketBinaryType): Subject<MessageEvent> {
    type = type || 'blob';
    let ws = new WebSocket(url);

    let buffer: Object[] = [];

    function handleData(data: Object): any {
        if (type === 'blob') {
            return JSON.stringify(data);
        } else {
            return data;
        }
    }

    let observable = Observable.create(
        (obs: Observer<MessageEvent>) => {
            ws.binaryType = type;
            ws.onmessage = (msg: MessageEvent) => {
                if (msg.data instanceof ArrayBuffer) {
                    obs.next(msg);
                } else {
                    const newMsg = new MessageEvent(
                        msg.type, {
                            data:   msg.data.replace(/(\s?)(Infinity|-Infinity|NaN)(\s?\,?)/g, '$1\"$2\"$3'),
                            origin: msg.origin,
                            source: msg.source,
                            ports:  msg.ports
                        });
                    obs.next(newMsg);
                }
            };
            ws.onerror = obs.error.bind(obs);
            ws.onclose = obs.complete.bind(obs);
            ws.onopen = () => {
                let l: number = buffer.length;
                while (l--) {
                    ws.send(handleData(buffer[l]));
                    buffer.splice(l, 1);
                }
            };
            return ws.close.bind(ws);
        });

    let observer = {
        next: (data: Object) => {
            switch (ws.readyState) {
                case WebSocket.OPEN:
                    ws.send(handleData(data));
                    break;

                case WebSocket.CONNECTING:
                    buffer.push(data);
                    break;

                case WebSocket.CLOSED:
                    alert('Attempted to send data and WebSocket is closed');
                    break;

                default:
                    break;
            }
        }
    };

    return Subject.create(observer, observable);
}
