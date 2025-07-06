import type { ChatSchema } from "@/utils/dbUtil";
import { getUserId } from "@/utils/jwtUtil";

export function getRecipientIdChat(chat: ChatSchema | null) {
    if (!chat) return null;
    const userId = getUserId();
    if (chat.userId == userId) return chat.recepientId;
    return chat.userId;
}

export function getUserIdFromChat(chat: ChatSchema | null) {
    if (!chat) return null;
    const userId = getUserId();
    if (chat.userId != userId) return chat.recepientId;
    return chat.userId;
}

export function isSenderUser(chat: ChatSchema | null) {
    return chat?.userId == getUserId();
}