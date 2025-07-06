import { format } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { ChatSchema, ContactSchema } from "@/utils/dbUtil";
import { getChatsByUserId } from "@/utils/chatDbUtil";
import { useEffect, useState } from "react";
import { sendChat } from "@/api/chatApi";
import {
    getRecipientIdChat,
    getUserIdFromChat,
    isSenderUser,
} from "./chat-util";
import { getUserId } from "@/utils/jwtUtil";

interface MailDisplayProps {
    chat: ChatSchema | null;
    userIdToUser: {
        [key: string]: ContactSchema;
    };
}

export function ChatDisplay({ chat, userIdToUser = {} }: MailDisplayProps) {
    const contactId = getRecipientIdChat(chat);
    const [chatHistory, setChatHistory] = useState<ChatSchema[]>([]);
    const [msg, setMessage] = useState("");

    function getUserName(userShortId: string | null) {
        if (!userShortId) return null;
        const user = userIdToUser[userShortId];
        if (!user) return userShortId;
        return user.username;
    }

    useEffect(() => {
        getChatsByUserId(chat?.recepientId ?? "").then((res) => {
            const chatHis = res;
            console.log(res);

            setChatHistory([...chatHis]);
        });
    }, [chat]);

    async function sendMessage() {
        console.log(contactId, msg);
        if (!contactId) {
            console.log("cannot send msg");
            return;
        }

        setChatHistory([
            ...chatHistory,
            {
                message: msg,
                recepientId: contactId,
                userId: getUserId(),
                _id: `${Date.now()}`,
                isRead: false,
                isDeleted: false,
                shortId: `${Date.now()}`,
                createdAt: Date.now().toString(),
                __v: 0,
            },
        ]);
        await sendChat({
            message: msg,
            to: contactId,
        });
    }

    return (
        <div className="flex h-full flex-col">
            <div className="flex flex-1 flex-col min-h-0 overflow-y-auto">
                {chatHistory.map((chatItem) => {
                    const userId = getUserIdFromChat(chatItem) ?? "";
                    const message = chatItem.message;
                    const username = getUserName(userId);
                    const isSender = isSenderUser(chatItem);
                    return (
                        <div
                            key={chatItem._id}
                            className={`flex items-start p-4 ${
                                isSender ? "justify-end" : "justify-start"
                            }`}
                        >
                            {!isSender && (
                                <Avatar>
                                    <AvatarImage alt={userId} />
                                    <AvatarFallback>
                                        {username
                                            ?.split(" ")
                                            .map((chunk) => chunk[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                            )}
                            <div className="max-w-xs rounded-lg bg-gray-100 dark:bg-gray-800 p-2 mx-2 break-words overflow-x-auto">
                                <div className="font-semibold text-xs mb-1">
                                    {getUserName(chatItem.userId)}
                                </div>
                                <div className="text-sm whitespace-pre-wrap break-words overflow-x-auto">
                                    {message}
                                </div>
                            </div>
                            {isSender && (
                                <Avatar>
                                    <AvatarImage alt={userId} />
                                    <AvatarFallback>
                                        {username
                                            ?.split(" ")
                                            .map((chunk) => chunk[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    );
                })}
            </div>
            <Separator className="mt-auto" />
            <div className="p-4">
                <form>
                    <div className="grid gap-4">
                        <Textarea
                            className="p-4"
                            placeholder={`Reply ${getUserName(contactId)}...`}
                            value={msg}
                            onChange={(e) => {
                                setMessage(e.target.value);
                            }}
                        />
                        <div className="flex items-center">
                            <Button
                                onClick={(e) => {
                                    e.preventDefault();
                                    sendMessage();
                                }}
                                size="sm"
                                className="ml-auto"
                            >
                                Send
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}