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
import { getUserList } from "@/api/chatApi";
import { Separator } from "@/components/ui/separator";

interface userDisplaySchema {
    shortId: string;
    username: string;
    _id: string;
}

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
    const [searchVal, setSearchVal] = useState("");
    const [searchUserList, setSearchUserList] = useState<userDisplaySchema[]>(
        []
    );

    useEffect(() => {
        if (!_contacts) return;
        setContactList([..._contacts]);
    }, [_contacts]);

    function focusUser(selectedDisplayUser: userDisplaySchema) {
        const selectedUser = contactList.find(
            (contact) => contact.shortId == selectedDisplayUser.shortId
        );

        setSearchUserList([]);
        setSearchVal("");

        if (selectedUser) {
            setSelectedContact(selectedUser);
            return;
        }
        const newUser = {
            shortId: selectedDisplayUser.shortId,
            username: selectedDisplayUser.username,
            avatarUrl: "",
            recentMessage: "",
            recentMessageDate: new Date().toString(),
        };
        setContactList((prev) => [newUser, ...prev]);
        setSelectedContact(newUser);
    }

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
                                        value={searchVal}
                                        placeholder="Search"
                                        className="pl-8"
                                        onChange={(e) => {
                                            setSearchVal(e.target.value);
                                            getUserList(e.target.value).then(
                                                (res) => {
                                                    if (!res.userList) return;
                                                    setSearchUserList(
                                                        res.userList
                                                    );
                                                }
                                            );
                                        }}
                                    />
                                </div>

                                {searchUserList.length > 0 && (
                                    <div className="mt-2 space-y-1 rounded-md border bg-muted p-2 max-h-64 overflow-y-auto shadow-sm">
                                        {searchUserList.map((user, index) => (
                                            <>
                                                <div
                                                    key={user.shortId}
                                                    onClick={() => {
                                                        focusUser(user);
                                                    }}
                                                    className="cursor-pointer rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                                                >
                                                    {user.username}
                                                </div>
                                                {index <
                                                    searchUserList.length -
                                                        1 && <Separator />}
                                            </>
                                        ))}
                                    </div>
                                )}
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
