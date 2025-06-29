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
import type { ChatSchema } from "@/utils/dbUtil";

interface MailProps {
    chats: ChatSchema[]
    defaultLayout?: number[];
    defaultCollapsed?: boolean;
    navCollapsedSize: number;
}

export function Mail({
    defaultLayout = [20, 32, 48],
    chats
}: MailProps) {
    console.log(chats);
    
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
                            <ChatList items={chats} />
                        </TabsContent>
                        <TabsContent value="unread" className="m-0 h-screen">
                            <ChatList
                                items={chats.filter((item) => !item.isRead)}
                            />
                        </TabsContent>
                    </Tabs>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
                    <ChatDisplay
                        mail={
                            chats.find((item) => item.isSelected || true) ||
                            null
                        }
                    />
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
