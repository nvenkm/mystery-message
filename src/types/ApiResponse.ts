import { MessageInterface } from "@/models/User";

export interface ApiResponseInterface {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<MessageInterface>;
}
