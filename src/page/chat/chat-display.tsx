import { format } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { ChatSchema, ContactSchema } from "@/utils/dbUtil";

interface MailDisplayProps {
    mail: ChatSchema | null;
    userIdToUser: {
        [key: string]: ContactSchema;
    };
}

export function ChatDisplay({
    mail: chat,
    userIdToUser = {},
}: MailDisplayProps) {
    function getUserName(userShortId: string) {
        const user = userIdToUser[userShortId];
        if (!user) return userShortId;
        return user.username;
    }

    return (
        <div className="flex h-full flex-col">
            {chat ? (
                <div className="flex flex-1 flex-col">
                    {/* <Separator /> */}
                    <div className="flex justify-center align-middle">
                        <Avatar>
                            <AvatarImage alt={chat?.userId} />
                            <AvatarFallback>
                                {chat?.userId
                                    .split(" ")
                                    .map((chunk) => chunk[0])
                                    .join("")}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 p-4 text-sm whitespace-pre-wrap">
                            {chat.message}
                        </div>
                    </div>
                    <Separator className="mt-auto" />
                    <div className="p-4">
                        <form>
                            <div className="grid gap-4">
                                <Textarea
                                    className="p-4"
                                    placeholder={`Reply ${getUserName(
                                        chat?.recepientId
                                    )}...`}
                                />
                                <div className="flex items-center">
                                    <Button
                                        onClick={(e) => e.preventDefault()}
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
            ) : (
                <div className="text-muted-foreground p-8 text-center">
                    No message selected
                </div>
            )}
        </div>
    );
}


/**
 <div className="flex items-start p-4">
                        <div className="flex items-start gap-4 text-sm">
                            <Avatar>
                                <AvatarImage alt={chat?.userId} />
                                <AvatarFallback>
                                    {chat?.userId
                                        .split(" ")
                                        .map((chunk) => chunk[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1">
                                <div className="font-semibold">
                                    {getUserName(chat.recepientId)}
                                </div>
                                {/* <div className="line-clamp-1 text-xs">
                                    {chat.subject}
                                </div> 
                                <div className="line-clamp-1 text-xs">
                                    <span className="font-medium">
                                        Reply-To:
                                    </span>{" "}
                                    {chat?.email}
                                </div>
                            </div>
                        </div>
                        {chat.createdAt && (
                            <div className="text-muted-foreground ml-auto text-xs">
                                {format(new Date(chat.createdAt), "PPpp")}
                            </div>
                        )}
                    </div>
 */