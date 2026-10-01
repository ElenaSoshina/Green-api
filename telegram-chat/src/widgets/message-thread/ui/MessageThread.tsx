import type { Chat } from "@/entities/chat";
import type { Message } from "@/entities/message";
import { useState } from "react";
import styles from "./MessageThread.module.css";

type MessageThreadProps = {
  chat: Chat | null;
  messages: Message[];
  onSend: (text: string) => void;
};

export function MessageThread({ chat, messages, onSend }: MessageThreadProps) {
  const [text, setText] = useState("");
  if (!chat) {
    return (
      <section className={styles.empty}>Создайте чат по номеру телефона</section>
    );
  }

  const handleSubmit = () => {
    const nextText = text.trim();
    if (!nextText) return;
    onSend(nextText);
    setText("");
  };

  return (
    <section className={styles.thread}>
      <header className={styles.header}>
        <span className={styles.avatar}>{chat.title.slice(0, 1)}</span>
        <span>{chat.title}</span>
      </header>
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
        <button className={styles.send} type="submit" aria-label="Отправить">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 12h12M12 6l6 6-6 6" />
          </svg>
        </button>
      </form>
    </section>
  );
}
