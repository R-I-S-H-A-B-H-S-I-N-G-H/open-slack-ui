import { db } from "@/utils/dbUtil";
import type { ChatSchema, ContactSchema } from "@/utils/dbUtil";
import { Mail } from "./mail";
import { useEffect, useState } from "react";
import { getUserId } from "@/utils/jwtUtil";
import { syncChats, syncContacts } from "@/api/chatApi";
import { getAllUserName } from "@/utils/contactDbUtil";

function syncChatFromCloud() {
    syncChats().then(async (res) => {
        const chatsSync = res.response;
        await db.chats.bulkPut(chatsSync);
    });

    syncContacts().then((res) => {
        const userList = res.res;
        db.contacts.bulkPut(userList);
    });
}

export default function Chat() {
    const [chatList, setChatList] = useState<ChatSchema[]>([]);
    const [userIdToUser, setUserIdToUser] = useState<{
        [key: string]: ContactSchema;
    }>({});
    useEffect(() => {
        syncChatFromCloud();
        getLatestChatsByUser(getUserId()).then((res) => {
            setChatList(res);
        });
    }, []);

    useEffect(() => {
        updateUserIdMap();
    }, [chatList]);

    async function updateUserIdMap() {
        const userIdArray: string[] = [];
        chatList.forEach((user) => {
            userIdArray.push(user.recepientId);
            userIdArray.push(user.userId);
        });

        getAllUserName(userIdArray).then((res) => {
            console.log(res);
            if (!res) return;
            setUserIdToUser({ ...res });
        });
    }

    return (
        <Mail
            chats={chatList}
            userIdToUser={userIdToUser}
            navCollapsedSize={4}
        />
    );
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
