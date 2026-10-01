import { useState } from "react";
import type { FormEvent } from "react";
import { TextField } from "@/shared/text-field";
import { Button } from "@/shared/ui/button";
import styles from "./LoginPage.module.css";
import type { ApiCredentials } from "@/entities/session";
import { getStateInstance } from "@/shared/api";

type LoginPageProps = {
  onSuccess: (credentials: ApiCredentials) => void;
};

export function LoginPage({ onSuccess }: LoginPageProps) {
  const [apiUrl, setApiUrl] = useState("https://api.green-api.com");
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit =
    apiUrl.trim() !== "" &&
    idInstance.trim() !== "" &&
    apiTokenInstance.trim() !== "";

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const credentials = {
      apiUrl: apiUrl.trim(),
      idInstance: idInstance.trim(),
      apiTokenInstance: apiTokenInstance.trim(),
    };

    try {
      const state = await getStateInstance(credentials);
      if (state.stateInstance !== "authorized") {
        setError(
          "Инстанс не авторизован. Подключите Telegram в кабинете GREEN-API.",
        );
        return;
      }
      onSuccess(credentials);
    } catch (reason) {
      const message =
        reason instanceof Error ? reason.message : "Не удалось войти";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
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
        <Button type="submit" disabled={!canSubmit || isSubmitting}>
          Войти
        </Button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </main>
  );
}
