import { formatDistanceToNow } from "date-fns";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ContactSchema } from "@/utils/dbUtil";
interface MailListProps {
    contactList: ContactSchema[];
    onSelect?: (chat: ContactSchema) => void;
}

export function ChatList({ onSelect, contactList }: MailListProps) {
    return (
        <ScrollArea className={cn("h-screen")}>
            <div className="flex flex-col gap-2 p-4 pt-0">
                {contactList.map((contact) => {
                    const selected = false;
                    const recentMessageDate = contact.recentMessageDate ?? "";
                    return (
                        <button
                            key={contact.shortId}
                            className={cn(
                                "hover:bg-accent hover:text-accent-foreground flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all",
                                false && "bg-muted"
                            )}
                            onClick={() => {
                                onSelect?.(contact);
                            }}
                        >
                            <div className="flex w-full flex-col gap-1">
                                <div className="flex items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="font-semibold">
                                            {contact.username}
                                        </div>
                                        {!contact.lastSeen && (
                                            <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                                        )}
                                    </div>
                                    <div
                                        className={cn(
                                            "ml-auto text-xs",
                                            selected
                                                ? "text-foreground"
                                                : "text-muted-foreground"
                                        )}
                                    >
                                        {formatDistanceToNow(
                                            new Date(recentMessageDate),
                                            {
                                                addSuffix: true,
                                            }
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="text-muted-foreground line-clamp-2 text-xs">
                                {contact.recentMessage ?? "".substring(0, 300)}
                            </div>
                        </button>
                    );
                })}
            </div>
        </ScrollArea>
    );
}
