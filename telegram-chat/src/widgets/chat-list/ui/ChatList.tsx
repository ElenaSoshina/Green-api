import type { Chat } from "@/entities/chat";
import styles from "./ChatList.module.css";

type ChatListProps = {
  chats: Chat[];
  activeChatId: string | null;
  phone: string;
  onPhoneChange: (phone: string) => void;
  onCreateChat: () => void;
  onSelectChat: (chatId: string) => void;
  onLogout: () => void;
};

export function ChatList({
  chats,
  activeChatId,
  phone,
  onPhoneChange,
  onCreateChat,
  onSelectChat,
  onLogout,
}: ChatListProps) {
  return (
    <aside className={styles.sidebar}>
      <header className={styles.header}>
        <h1 className={styles.title}>Чаты</h1>
        <button className={styles.logout} type="button" onClick={onLogout}>
          Выйти
        </button>
      </header>
      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          onCreateChat();
        }}
      >
        <input
          className={styles.phone}
          value={phone}
          placeholder="Номер телефона"
          aria-label="Номер телефона"
          onChange={(event) => onPhoneChange(event.target.value)}
        />
        <button className={styles.create} type="submit" aria-label="Создать чат">
          +
        </button>
      </form>
      <ul className={styles.list}>
        {chats.map((chat) => (
          <li key={chat.id}>
            <button
              className={
                chat.id === activeChatId ? styles.chatActive : styles.chat
              }
              type="button"
              onClick={() => onSelectChat(chat.id)}
            >
              <span className={styles.avatar}>{chat.title.slice(0, 1)}</span>
              <span className={styles.chatTitle}>{chat.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
