import { db, type ContactSchema } from "./dbUtil";

export async function getUserName(userId: string): Promise<ContactSchema | null> {
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
    contact.forEach(ele => { 
        if (ele?.shortId !== undefined) {
            res[ele.shortId] = ele;
        }
    })
    return res;
}