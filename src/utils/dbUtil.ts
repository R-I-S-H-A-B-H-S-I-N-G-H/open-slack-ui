import Dexie from "dexie";
import type { Table } from "dexie";

export interface ChatSchema {
    _id: string;
    userId: string;
    recepientId: string;
    isRead: boolean;
    isDeleted: boolean;
    message: string;
    shortId: string;
    createdAt: string;
    __v: number;
    isSelected?: boolean;
}

class OpenSlackDB extends Dexie {
    chats!: Table<ChatSchema, string>;

    constructor() {
        super("open-slack");
        this.version(1).stores({
            chats: "_id, userId, recepientId, createdAt, &shortId, isDeleted, isRead",
        });
    }
}

export const db = new OpenSlackDB();
