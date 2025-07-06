import { db, type ChatSchema } from "./dbUtil";

export async function getChatsByUserId(userId: string): Promise<ChatSchema[]> {
    console.log(userId);
    
    const chats = await db.chats
        .where("userId")
        .equals(userId)
        .or("recepientId")
        .equals(userId)
        .toArray();

    return chats.sort(
        (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

}
