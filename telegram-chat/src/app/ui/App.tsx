import { useState } from "react";
import { ChatPage } from "@/pages/chat";
import { LoginPage } from "@/pages/login";
import type { ApiCredentials } from "@/entities/session";

export function App() {
  const [credentials, setCredentials] = useState<ApiCredentials | null>(null);
  if (!credentials) {
    return <LoginPage onSuccess={setCredentials} />;
  }

  return (
    <ChatPage credentials={credentials} onLogout={() => setCredentials(null)} />
  );
}
