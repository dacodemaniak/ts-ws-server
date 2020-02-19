import { MessageModel } from "./message-model";
import { UserModel } from "./user-model";

export class ChatMessageModel extends MessageModel {
    public constructor(message: string, data: any) {
        super(message, data);
    }
}