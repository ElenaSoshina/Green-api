import type { Chat } from "@/entities/chat";
import { TextField } from "@/shared/text-field";
import { Button } from "@/shared/ui/button";
import styles from "./ChatList.module.css";

type ChatListProps = {
  chats: Chat[];
  activeChatId: string | null;
  phone: string;
  onPhoneChange: (phone: string) => void;
  onCreateChat: () => void;
  onSelectChat: (chatId: string) => void;
};

export function ChatList({
  chats,
  activeChatId,
  phone,
  onPhoneChange,
  onCreateChat,
  onSelectChat,
}: ChatListProps) {
  return (
    <aside className={styles.sidebar}>
      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          onCreateChat();
        }}
      >
        <TextField
          label="Номер телефона"
          value={phone}
          onChange={onPhoneChange}
          placeholder="Введите номер телефона"
        />
        <Button type="submit">Создать чат</Button>
      </form>
      <ul className={styles.list}>
        {chats.map((chat) => (
          <li key={chat.id} className={styles.chat}>
            <button
              className={
                chat.id === activeChatId ? styles.chatActive : styles.chat
              }
              type="button"
              onClick={() => onSelectChat(chat.id)}
            >
              {chat.title}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
