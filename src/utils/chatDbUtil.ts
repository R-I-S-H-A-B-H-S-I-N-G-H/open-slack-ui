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

export async function getLatestChatsByUser(
    currentUserId: string
): Promise<ChatSchema[]> {
    const chats = await db.chats.orderBy("createdAt").reverse().toArray(); // Index scan — fast because sorted by indexed field

    const seen = new Set<string>();
    const result: ChatSchema[] = [];

    for (const chat of chats) {
        const otherUser =
            chat.userId === currentUserId
                ? chat.recepientId
                : chat.recepientId === currentUserId
                ? chat.userId
                : null;

        if (!otherUser || seen.has(otherUser)) continue;

        seen.add(otherUser);
        result.push(chat);
    }

    return result;
}