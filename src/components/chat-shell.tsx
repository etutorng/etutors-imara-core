"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Flag, Mic, Send } from "lucide-react";
import { useState } from "react";

interface ChatShellProps {
    mentorName: string;
    mentorImage?: string | null;
    onClose: () => void;
}

export function ChatShell({ mentorName, mentorImage }: ChatShellProps) {
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

    const handleReport = () => {
        alert("Report Abuse flow triggered");
    };

    const handleVoiceNote = () => {
        alert("Voice recording started");
    };

    return (
        <div className="flex flex-col h-[100dvh] sm:h-[500px] w-full sm:max-w-md border-0 sm:border rounded-none sm:rounded-lg shadow-none sm:shadow-lg bg-background overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pl-4 py-4 pr-12 border-b bg-muted/50">
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
                <div className="flex items-center gap-1">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                                    onClick={handleReport}
                                >
                                    <Flag className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Report Inappropriate Behavior</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
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
                    className="flex gap-2 items-center"
                >
                    <div className="relative flex-1">
                        <Input
                            placeholder="Type a message..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="pr-10"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                            onClick={handleVoiceNote}
                        >
                            <Mic className="h-4 w-4" />
                        </Button>
                    </div>
                    <Button type="submit" size="icon" className="cursor-pointer hover:bg-primary/90">
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
