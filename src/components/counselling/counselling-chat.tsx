"use client";

import { useState, useEffect, useRef } from "react";
import { sendMessage, getSessionMessages } from "@/app/actions/counselling";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Send, Loader2, User } from "lucide-react";
import { toast } from "sonner";

interface CounsellingChatProps {
    session: any;
    currentUser: any;
}

export function CounsellingChat({ session, currentUser }: CounsellingChatProps) {
    const [messages, setMessages] = useState<any[]>(session?.messages || []);
    const [inputValue, setInputValue] = useState("");
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Poll for new messages every 5 seconds
    useEffect(() => {
        if (!session?.id) return;
        const interval = setInterval(async () => {
            const res = await getSessionMessages(session.id);
            if (res.messages) {
                setMessages(res.messages);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [session?.id]);

    // Scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const content = inputValue;
        setInputValue("");
        setSending(true);

        const tempId = "temp-" + Date.now();
        const optimisticMsg = {
            id: tempId,
            senderId: currentUser.id,
            content: content,
            createdAt: new Date(),
            sender: currentUser
        };
        setMessages(prev => [...prev, optimisticMsg]);

        try {
            const res = await sendMessage(session.id, content);
            if (res.error) {
                toast.error(res.error);
            } else {
                const update = await getSessionMessages(session.id);
                if (update.messages) {
                    setMessages(update.messages);
                }
            }
        } catch (error) {
            toast.error("Failed to send message");
        } finally {
            setSending(false);
        }
    };

    const otherUser = session.counsellorId === currentUser.id
        ? session.user
        : session.counsellor;

    const displayName = otherUser ? otherUser.name : "Waiting for Counsellor...";
    const displayImage = otherUser?.image;

    return (
        <Card className="h-[600px] flex flex-col border-2 border-primary/20">
            <CardHeader className="border-b py-3 flex flex-row items-center gap-3 bg-muted/20">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={displayImage || undefined} />
                    <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="font-semibold flex items-center gap-2">
                        {displayName}
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">REAL CHAT</span>
                    </h3>
                    {session.status === "PENDING" && (
                        <p className="text-xs text-muted-foreground">Request Pending - A counsellor will join soon.</p>
                    )}
                    {session.status === "ACTIVE" && (
                        <p className="text-xs text-green-600 font-medium">Online</p>
                    )}
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                        {messages.length === 0 && (
                            <p className="text-center text-sm text-muted-foreground my-10">
                                This is the start of your private session.
                            </p>
                        )}
                        {messages.map((msg) => {
                            const isMe = msg.senderId === currentUser.id;
                            return (
                                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                    <div
                                        className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${isMe ? "bg-primary text-primary-foreground" : "bg-muted"
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>
                <div className="p-4 border-t">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSend();
                        }}
                        className="flex gap-2 items-center"
                    >
                        <Input
                            placeholder={session.status === "PENDING" ? "Waiting for counsellor..." : "Type a message..."}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <Button type="submit" size="icon" disabled={sending || !inputValue.trim()}>
                            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>
    );
}
