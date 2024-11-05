export enum WebSocketState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

export const kioskId = import.meta.env.VITE_KIOSK_ID;