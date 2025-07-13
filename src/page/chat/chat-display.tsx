import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { ChatSchema, ContactSchema } from "@/utils/dbUtil";
import { getChatsByUserId } from "@/utils/chatDbUtil";
import { useCallback, useEffect, useRef, useState } from "react";
import { sendChat } from "@/api/chatApi";
import { getUserIdFromChat, isSenderUser } from "./chat-util";
import { getUserId } from "@/utils/jwtUtil";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MailDisplayProps {
    chat: ChatSchema | null;
    userIdToUser: {
        [key: string]: ContactSchema;
    };
    contact: ContactSchema | undefined;
}

export function ChatDisplay({
    chat,
    userIdToUser = {},
    contact,
}: MailDisplayProps) {
    if (!contact) return <div>not selected</div>;

    const contactId = contact.shortId;
    const contactUserName = contact.username;

    const [chatHistory, setChatHistory] = useState<ChatSchema[]>([]);
    const [msg, setMessage] = useState("");
    const [expandedMessages, setExpandedMessages] = useState<{
        [id: string]: boolean;
    }>({});
    const scrollRef = useRef<HTMLDivElement>(null);
    const MAX_MESSAGE_LENGTH = 400;

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatHistory]);

    function getUserName(userShortId: string | null) {
        if (!userShortId) return null;
        const user = userIdToUser[userShortId];
        if (!user) return userShortId;
        return user.username;
    }

    useEffect(() => {
        getChatsByUserId(contactId).then((res) => {
            const chatHis = res;
            setChatHistory([...chatHis]);
        });
    }, [chat]);

    const toggleExpand = useCallback((id: string) => {
        setExpandedMessages((prev) => ({ ...prev, [id]: !prev[id] }));
    }, []);

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
            <div
                ref={scrollRef}
                className="flex flex-1 flex-col min-h-0 overflow-y-auto"
            >
                {chatHistory.map((chatItem) => {
                    const userId = getUserIdFromChat(chatItem) ?? "";
                    const message = chatItem.message;
                    const username = getUserName(userId);
                    const isSender = isSenderUser(chatItem);
                    const isExpanded = expandedMessages[chatItem._id];
                    const shouldFold =
                        message.length > MAX_MESSAGE_LENGTH && !isExpanded;
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
                                        {contactUserName
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
                                    {shouldFold ? (
                                        <>
                                            <Markdown
                                                remarkPlugins={[remarkGfm]}
                                            >
                                                {message.slice(
                                                    0,
                                                    MAX_MESSAGE_LENGTH
                                                ) + "..."}
                                            </Markdown>
                                            <Button
                                                variant="link"
                                                size="sm"
                                                className="p-0 mt-1 text-xs"
                                                onClick={() =>
                                                    toggleExpand(chatItem._id)
                                                }
                                            >
                                                Show more
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Markdown
                                                remarkPlugins={[remarkGfm]}
                                            >
                                                {message}
                                            </Markdown>
                                            {message.length >
                                                MAX_MESSAGE_LENGTH && (
                                                <Button
                                                    variant="link"
                                                    size="sm"
                                                    className="p-0 mt-1 text-xs"
                                                    onClick={() =>
                                                        toggleExpand(
                                                            chatItem._id
                                                        )
                                                    }
                                                >
                                                    Show less
                                                </Button>
                                            )}
                                        </>
                                    )}
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
