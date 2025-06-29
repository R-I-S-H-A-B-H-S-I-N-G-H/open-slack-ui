import { db } from "@/utils/dbUtil";
import type { ChatSchema } from "@/utils/dbUtil";
import { Mail } from "./mail";
import { useEffect, useState } from "react";
import { getUserId } from "@/utils/jwtUtil";


export default function Chat() {
    const [chatList, setChatList] = useState<ChatSchema[]>([]);
    useEffect(() => { 
        getLatestChatsByUser(getUserId()).then(res => { 
            setChatList(res)
        })
    },[])

    return <Mail  chats={chatList} navCollapsedSize={4} />;
}

async function getLatestChatsByUser(currentUserId: string): Promise<ChatSchema[]> {
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
