import { useEffect, useState, type ComponentProps } from "react";
import { formatDistanceToNow } from "date-fns";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatSchema, ContactSchema } from "@/utils/dbUtil";
import { getAllUserName } from "@/utils/contactDbUtil";
import { getRecipientIdChat } from "./chat-util";
interface MailListProps {
    items: ChatSchema[];
    userIdToUser: {
        [key: string]: ContactSchema;
    };
}

export function ChatList({ items, userIdToUser = {} }: MailListProps) {
    function getUserName(userShortId: string) {
        const user = userIdToUser[userShortId];
        if (!user) return userShortId;
        return user.username;
    }

    return (
        <ScrollArea className={cn("h-screen")}>
            <div className="flex flex-col gap-2 p-4 pt-0">
                {items.map((item) => (
                    <button
                        key={item._id}
                        className={cn(
                            "hover:bg-accent hover:text-accent-foreground flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all",
                            item?.isSelected && "bg-muted"
                        )}
                        onClick={() => {}}
                    >
                        <div className="flex w-full flex-col gap-1">
                            <div className="flex items-center">
                                <div className="flex items-center gap-2">
                                    <div className="font-semibold">
                                        {getUserName(getRecipientIdChat(item))}
                                    </div>
                                    {!item.isRead && (
                                        <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                                    )}
                                </div>
                                <div
                                    className={cn(
                                        "ml-auto text-xs",
                                        item.isSelected
                                            ? "text-foreground"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    {formatDistanceToNow(
                                        new Date(item.createdAt),
                                        {
                                            addSuffix: true,
                                        }
                                    )}
                                </div>
                            </div>
                            {/* <div className="text-xs font-medium">
                                {item.subject}
                            </div> */}
                        </div>
                        <div className="text-muted-foreground line-clamp-2 text-xs">
                            {item.message.substring(0, 300)}
                        </div>
                        {/* {item.labels.length ? (
                            <div className="flex items-center gap-2">
                                {item.labels.map((label) => (
                                    <Badge
                                        key={label}
                                        variant={getBadgeVariantFromLabel(
                                            label
                                        )}
                                    >
                                        {label}
                                    </Badge>
                                ))}
                            </div>
                        ) : null} */}
                    </button>
                ))}
            </div>
        </ScrollArea>
    );
}

function getBadgeVariantFromLabel(
    label: string
): ComponentProps<typeof Badge>["variant"] {
    if (["work"].includes(label.toLowerCase())) {
        return "default";
    }

    if (["personal"].includes(label.toLowerCase())) {
        return "outline";
    }

    return "secondary";
}
