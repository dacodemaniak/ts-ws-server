import { MessageModel } from "./message-model";
import { UserModel } from "./user-model";

export class ChatMessageModel extends MessageModel {
    public constructor(user: UserModel, message: string) {
        super(user, message);
    }
}