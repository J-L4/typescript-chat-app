export interface ChatMessage {
  msg: string;
  timestamp: string;
}

export interface ServerToClientEvents {
  "new message": (data: ChatMessage) => void;
}

export interface ClientToServerEvents {
  "send message": (msg: string) => void;
}