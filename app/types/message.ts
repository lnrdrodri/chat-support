export interface Message {
  id: string;
  user_id: string;
  content: string;
  type: "text" | "image" | "audio";
  timestamp: string;
}
