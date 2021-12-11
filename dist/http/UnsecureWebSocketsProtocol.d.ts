/// <reference types="node" />
import { EventEmitter } from 'events';
import type { WebSocket } from 'ws';
import type { HttpRequest } from '../server/HttpRequest';
import { WebSocketHandler } from '../server/WebSocketHandler';
/**
 * Provides live update functionality following
 * the Solid WebSockets API Spec solid-0.1
 */
export declare class UnsecureWebSocketsProtocol extends WebSocketHandler {
    private readonly logger;
    private readonly listeners;
    constructor(source: EventEmitter);
    handle(input: {
        webSocket: WebSocket;
        upgradeRequest: HttpRequest;
    }): Promise<void>;
    private onResourceChanged;
}
