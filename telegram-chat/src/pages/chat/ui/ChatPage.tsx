import type { Message } from "@/entities/message";
import type { Chat } from "@/entities/chat";
import { Button } from "@/shared/ui/button";
import { ChatList } from "@/widgets/chat-list";
import { MessageThread } from "@/widgets/message-thread";
import { useState } from "react";
import styles from "./ChatPage.module.css";

type ChatPageProps = {
  onLogout: () => void;
};

export function ChatPage({ onLogout }: ChatPageProps) {
  const [phone, setPhone] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const activeChat = chats.find((chat) => chat.id === activeChatId) ?? null;
  const activeMessages = messages.filter(
    (message) => message.chatId === activeChatId,
  );

  const handleCreateChat = () => {
    const digits = phone.replace(/\D/g, "");
    if (!digits) return;
    const chatId = `${digits}@c.us`;
    const existing = chats.find((chat) => chat.id === chatId);
    if (!existing) {
      setChats((current) => [
        ...current,
        { id: chatId, title: digits, photo: "" },
      ]);
    }
    setActiveChatId(chatId);
    setPhone("");
  };
  const handleSend = (text: string) => {
    if (!activeChatId) return;
    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        chatId: activeChatId,
        text,
        direction: "outgoing",
      },
    ]);
  };
  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <span>Telegram chat</span>
        <Button onClick={onLogout}>Выйти</Button>
      </header>
      <div className={styles.layout}>
        <ChatList
          chats={chats}
          activeChatId={activeChatId}
          phone={phone}
          onPhoneChange={setPhone}
          onCreateChat={handleCreateChat}
          onSelectChat={setActiveChatId}
        />
        <MessageThread
          chat={activeChat}
          messages={activeMessages}
          onSend={handleSend}
        />
      </div>
    </main>
  );
}
