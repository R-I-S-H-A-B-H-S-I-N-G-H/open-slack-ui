import { db } from "@/utils/dbUtil";
import { Mail } from "./mail";
import { useEffect } from "react";
import { getUserId } from "@/utils/jwtUtil";
import { syncChats, syncContacts } from "@/api/chatApi";
import { getAllUserName, getContactDisplayList } from "@/utils/contactDbUtil";
import { useLiveQuery } from "dexie-react-hooks";
import { getLatestChatsByUser } from "@/utils/chatDbUtil";

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
    const chatList = useLiveQuery(async () => {
        return await getLatestChatsByUser(getUserId());
    }, []);

    const contactList = useLiveQuery(async () => {
        return getContactDisplayList(getUserId());
    });

    const userIdToUser = useLiveQuery(async () => {
        const userIdArray: string[] = [];
        chatList?.forEach((user) => {
            userIdArray.push(user.recepientId);
            userIdArray.push(user.userId);
        });
        return await getAllUserName(userIdArray);
    }, [chatList]);

    useEffect(() => {
        syncChatFromCloud();
    }, []);

    return (
        <Mail
            contactList={contactList ?? []}
            chats={chatList ?? []}
            userIdToUser={userIdToUser ?? {}}
            navCollapsedSize={4}
        />
    );
}
