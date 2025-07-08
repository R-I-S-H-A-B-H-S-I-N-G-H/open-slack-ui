import {
    Search,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ChatList } from "./chat-list";
import { ChatDisplay } from "./chat-display";
import type { ChatSchema, ContactSchema } from "@/utils/dbUtil";
import { useEffect, useState } from "react";

interface MailProps {
    contactList: ContactSchema[];
    chats: ChatSchema[];
    userIdToUser: {
        [key: string]: ContactSchema;
    };
    defaultLayout?: number[];
    defaultCollapsed?: boolean;
    navCollapsedSize: number;
}

export function Mail({
    defaultLayout = [20, 32, 48],
    chats,
    userIdToUser,
    contactList: _contacts,
}: MailProps) {
    const [selectedContact, setSelectedContact] = useState<
        ContactSchema | undefined
    >();
    const [contactList, setContactList] = useState<ContactSchema[]>(_contacts);

    useEffect(() => {
        if (!_contacts) return;
        setContactList([..._contacts]);
    }, [_contacts]);

    return (
        <div className="w-full h-dvh">
            <ResizablePanelGroup
                direction="horizontal"
                onLayout={(sizes: number[]) => {
                    document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
                        sizes
                    )}`;
                }}
                className="h-full  items-stretch"
            >
                <ResizablePanel defaultSize={defaultLayout[1]}>
                    <Tabs defaultValue="all">
                        <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 p-4 backdrop-blur">
                            <form>
                                <div className="relative">
                                    <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                                    <Input
                                        placeholder="Search"
                                        className="pl-8"
                                    />
                                </div>
                            </form>
                        </div>
                        <TabsContent value="all" className="m-0 h-screen">
                            <ChatList
                                contactList={contactList}
                                onSelect={setSelectedContact}
                            />
                        </TabsContent>
                    </Tabs>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
                    <ChatDisplay
                        contact={selectedContact}
                        chat={
                            chats.find(
                                (item) =>
                                    item.userId == selectedContact?.shortId ||
                                    item.recepientId == selectedContact?.shortId
                            ) || null
                        }
                        userIdToUser={userIdToUser}
                    />
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
