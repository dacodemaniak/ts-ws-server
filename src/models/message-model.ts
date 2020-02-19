export class MessageModel {
    private _message: string;
    private _data: any;

    public constructor(message: any, data: any) {
        this._message = message;
        this._data = data;
    }

    public get message(): string {
        return this._message;
    }

    public get data(): any {
        return this._data;
    }
}