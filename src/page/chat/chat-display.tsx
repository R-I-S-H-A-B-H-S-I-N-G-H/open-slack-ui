import { format } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { ChatSchema } from "@/utils/dbUtil";

interface MailDisplayProps {
    mail: ChatSchema | null;
}

export function ChatDisplay({ mail: chat }: MailDisplayProps) {
    return (
        <div className="flex h-full flex-col">
            {chat ? (
                <div className="flex flex-1 flex-col">
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
                                <div className="font-semibold">{chat.recepientId}</div>
                                {/* <div className="line-clamp-1 text-xs">
                                    {chat.subject}
                                </div> */}
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
                    <Separator />
                    <div className="flex-1 p-4 text-sm whitespace-pre-wrap">
                        {chat.message}
                    </div>
                    <Separator className="mt-auto" />
                    <div className="p-4">
                        <form>
                            <div className="grid gap-4">
                                <Textarea
                                    className="p-4"
                                    placeholder={`Reply ${chat?.name}...`}
                                />
                                <div className="flex items-center">
                                    <Label
                                        htmlFor="mute"
                                        className="flex items-center gap-2 text-xs font-normal"
                                    >
                                        <Switch
                                            id="mute"
                                            aria-label="Mute thread"
                                        />{" "}
                                        Mute this thread
                                    </Label>
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
