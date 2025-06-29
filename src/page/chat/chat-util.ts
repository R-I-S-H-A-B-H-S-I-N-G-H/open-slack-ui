import type { ChatSchema } from "@/utils/dbUtil";
import { getUserId } from "@/utils/jwtUtil";

export function getRecipientId(chat: ChatSchema) {
    const userId = getUserId();
    if (chat.userId == userId) return chat.recepientId;
    return chat.userId;
}