"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, X } from "lucide-react";
import { useState } from "react";

interface ChatShellProps {
    mentorName: string;
    mentorImage?: string | null;
    onClose: () => void;
}

export function ChatShell({ mentorName, mentorImage, onClose }: ChatShellProps) {
    const [messages, setMessages] = useState([
        { id: 1, sender: "mentor", content: `Hello! I'm ${mentorName}. How can I help you today?` },
    ]);
    const [inputValue, setInputValue] = useState("");

    const handleSend = () => {
        if (!inputValue.trim()) return;

        setMessages((prev) => [
            ...prev,
            { id: Date.now(), sender: "user", content: inputValue },
        ]);
        setInputValue("");

        // Simulate reply
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { id: Date.now() + 1, sender: "mentor", content: "Thank you for sharing. Let's discuss this further." },
            ]);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-[500px] w-full max-w-md border rounded-lg shadow-lg bg-background overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-muted/50">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={mentorImage || undefined} />
                        <AvatarFallback>{mentorName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold text-sm">{mentorName}</h3>
                        <p className="text-xs text-muted-foreground">Online</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${msg.sender === "user"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted"
                                    }`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t mt-auto">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                    }}
                    className="flex gap-2"
                >
                    <Input
                        placeholder="Type a message..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <Button type="submit" size="icon">
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
