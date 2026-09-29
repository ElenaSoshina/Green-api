import type { Chat } from "@/entities/chat";
import type { Message } from "@/entities/message";
import { useState } from "react";
import { Button } from "@/shared/ui/button";
import styles from "./MessageThread.module.css";

type MessageThreadProps = {
  chat: Chat | null;
  messages: Message[];
  onSend: (text: string) => void;
};

export function MessageThread({ chat, messages, onSend }: MessageThreadProps) {
  const [text, setText] = useState("");
  if (!chat) {
    return <section>Создайте чат</section>;
  }

  const handleSubmit = () => {
    const nextText = text.trim();
    if (!nextText) return;
    onSend(nextText);
    setText("");
  };

  return (
    <section className={styles.thread}>
      <header className={styles.header}>{chat.title}</header>
      <ul className={styles.messages}>
        {messages.map((message) => (
          <li
            key={message.id}
            className={
              message.direction === "outgoing"
                ? styles.outgoing
                : styles.incoming
            }
          >
            {message.text}
          </li>
        ))}
      </ul>
      <form
        className={styles.composer}
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <input
          className={styles.input}
          value={text}
          placeholder="Сообщение"
          onChange={(event) => setText(event.target.value)}
        />
        <Button type="submit">Щтправить</Button>
      </form>
    </section>
  );
}
