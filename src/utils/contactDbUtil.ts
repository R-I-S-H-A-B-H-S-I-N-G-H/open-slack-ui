import { getRecipientIdChat } from "@/page/chat/chat-util";
import { getLatestChatsByUser } from "./chatDbUtil";
import { db, type ContactSchema } from "./dbUtil";

export async function getUserName(
    userId: string
): Promise<ContactSchema | null> {
    const contact = await db.contacts.get(userId);
    if (!contact) {
        return null;
    }
    return contact;
}

export async function getAllUserName(userId: string[]) {
    const contact = await db.contacts.bulkGet(userId);
    if (!contact) {
        return null;
    }
    const res: { [key: string]: ContactSchema } = {};
    contact.forEach((ele) => {
        if (ele?.shortId !== undefined) {
            res[ele.shortId] = ele;
        }
    });
    return res;
}

export async function getContactList() {
    return db.contacts.toArray();
}

export async function getContactDisplayList(
    userId: string
): Promise<ContactSchema[]> {
    if (!userId) return [];
    const recentChats = await getLatestChatsByUser(userId);
    const contactList = await getContactList();

    const contactShortIdToContact: { [key: string]: ContactSchema } = {};
    for (const contact of contactList) {
        contactShortIdToContact[contact.shortId] = contact;
    }

    const contactDisplayList: ContactSchema[] = [];

    for (const chat of recentChats) {
        const recipientId = getRecipientIdChat(chat);
        if (!recipientId) continue;
        const contact = contactShortIdToContact[recipientId];
        if (!contact) continue;
        contact.recentMessage = chat.message;
        contact.recentMessageDate = chat.createdAt;
        contactDisplayList.push(contact);
    }

    return contactDisplayList;
}
