import { useState } from "react";
import { ChatPage } from "@/pages/chat";
import { LoginPage } from "@/pages/login";

type AppScreen = "login" | "chat";

export function App() {
  const [screen, setScreen] = useState<AppScreen>("login");

  if (screen === "login") {
    return <LoginPage onSuccess={() => setScreen("chat")} />;
  }

  return <ChatPage onLogout={() => setScreen("login")} />;
}
