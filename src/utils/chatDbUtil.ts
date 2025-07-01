import { db, type ChatSchema } from "./dbUtil";

export async function getChatsByUserId(userId: string): Promise<ChatSchema[]> {
    console.log(userId);
    
    return await db.chats
        .where("userId")
        .equals(userId)
        .or("recepientId")
        .equals(userId)
        .toArray();
}
