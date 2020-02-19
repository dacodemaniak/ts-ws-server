import { UserModel } from "./user-model";

export class MessageModel {
    private _user: UserModel;
    private _message: string;

    public constructor(user: UserModel, message: string) {
        this._user = user;
        this._message = message;
    }
}