interface Participant {
  name: string;
  status: "online" | "offline" | "typing";
}

export interface Chat {
  chat_id: string;
  unread_messages: number;
  last_message: string | null;
  last_message_timestamp: string | null;
  participants: Participant[];
}
