import { useState } from "react";
import type { FormEvent } from "react";
import { TextField } from "@/shared/text-field";
import { Button } from "@/shared/ui/button";
import styles from "./LoginPage.module.css";

type LoginPageProps = {
  onSuccess: () => void;
};

export function LoginPage({ onSuccess }: LoginPageProps) {
  const [apiUrl, setApiUrl] = useState("https://api.green-api.com");
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");

  const canSubmit =
    apiUrl.trim() !== "" &&
    idInstance.trim() !== "" &&
    apiTokenInstance.trim() !== "";

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSuccess();
  };
  return (
    <main className={styles.page}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1>Вход в чат</h1>
        <TextField label="apiUrl" value={apiUrl} onChange={setApiUrl} />
        <TextField
          label="idInstance"
          value={idInstance}
          onChange={setIdInstance}
        />
        <TextField
          label="apiTokenInstance"
          value={apiTokenInstance}
          onChange={setApiTokenInstance}
          type="password"
        />
        <Button type="submit" disabled={!canSubmit}>
          Войти
        </Button>
      </form>
    </main>
  );
}
