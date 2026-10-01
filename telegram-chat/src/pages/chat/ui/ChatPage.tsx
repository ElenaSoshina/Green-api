import type { Message } from "@/entities/message";
import type { Chat } from "@/entities/chat";
import { deleteNotification, receiveNotification, sendMessage } from "@/shared/api";
import { ChatList } from "@/widgets/chat-list";
import { MessageThread } from "@/widgets/message-thread";
import { useEffect, useRef, useState } from "react";
import styles from "./ChatPage.module.css";
import type { ApiCredentials } from "@/entities/session";

type ChatPageProps = {
  credentials: ApiCredentials;
  onLogout: () => void;
};

export function ChatPage({ credentials, onLogout }: ChatPageProps) {
  const [phone, setPhone] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sendError, setSendError] = useState("");

  const chatsRef = useRef(chats);
  chatsRef.current = chats;

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
  const handleSend = async (text: string) => {
    if (!activeChatId) return;
    setSendError("");
    try {
      const result = await sendMessage(credentials, activeChatId, text);
      setMessages((current) => [
        ...current,
        {
          id: result.idMessage,
          chatId: activeChatId,
          text,
          direction: "outgoing",
        },
      ]);
    } catch (reason) {
      const message =
        reason instanceof Error
          ? reason.message
          : "Не удалось отправить сообщение";
      setSendError(message);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    let stopped = false;

    const poll = async () => {
      while (!stopped) {
        try {
          const notification = await receiveNotification(
            credentials,
            controller.signal,
          );
          if (!notification) continue;

          await deleteNotification(credentials, notification.receiptId);

          const body = notification.body;
          const text = body.messageData?.textMessageData?.textMessage;
          if (
            body.typeWebhook !== "incomingMessageReceived" ||
            body.messageData?.typeMessage !== "textMessage" ||
            !text
          ) {
            continue;
          }

          const senderPhone = String(body.senderData?.senderPhoneNumber ?? "");
          const matchedChat = chatsRef.current.find((chat) => {
            const phone = chat.id.replace(/@c\.us$/, "");
            return chat.id === body.senderData?.chatId || phone === senderPhone;
          });
          if (!matchedChat) continue;

          setMessages((current) => [
            ...current,
            {
              id: body.idMessage ?? String(notification.receiptId),
              chatId: matchedChat.id,
              text,
              direction: "incoming",
            },
          ]);
        } catch (reason) {
          if (stopped || controller.signal.aborted) return;
          const message =
            reason instanceof Error
              ? reason.message
              : "Не удалось получить сообщение";
          setSendError(message);
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
      }
    };

    void poll();

    return () => {
      stopped = true;
      controller.abort();
    };
  }, [credentials]);

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <ChatList
          chats={chats}
          activeChatId={activeChatId}
          phone={phone}
          onPhoneChange={setPhone}
          onCreateChat={handleCreateChat}
          onSelectChat={setActiveChatId}
          onLogout={onLogout}
        />
        <div className={styles.conversation}>
          {sendError ? <p className={styles.error}>{sendError}</p> : null}
          <MessageThread
            chat={activeChat}
            messages={activeMessages}
            onSend={handleSend}
          />
        </div>
      </div>
    </main>
  );
}
