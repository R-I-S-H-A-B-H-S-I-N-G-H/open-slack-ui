import Dexie from "dexie";
import type { Table } from "dexie";

export interface Chat {
    _id: string;
    userId: string;
    recepientId: string;
    isRead: boolean;
    isDeleted: boolean;
    message: string;
    shortId: string;
    createdAt: string;
    __v: number;
}


class OpenSlackDB extends Dexie {
    chats!: Table<Chat, string>;

    constructor() {
        super("open-slack");
        this.version(1).stores({
            chats: "_id, &userId, recepientId, createdAt",
        });
    }
}

export const db = new OpenSlackDB();
