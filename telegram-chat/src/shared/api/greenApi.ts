import type { ApiCredentials } from "@/entities/session";

export type InstanceState = {
  stateInstance: string;
};

export type SendMessage = {
  idMessage: string;
};

export type IncomingNotification = {
  receiptId: number;
  body: {
    typeWebhook: string;
    idMessage?: string;
    senderData?: {
      chatId: string;
      senderPhoneNumber?: number;
    };
    messageData?: {
      typeMessage: string;
      textMessageData?: {
        textMessage: string;
      };
    };
  };
};

function getApiUrl(credentials: ApiCredentials, method: string) {
  const apiUrl = credentials.apiUrl.replace(/\/$/, "");
  return `${apiUrl}/waInstance${credentials.idInstance}/${method}/${credentials.apiTokenInstance}`;
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) {
    const details = await response.text();
    throw new Error(details || `Запрос завершился с кодом ${response.status}`);
  }

  const text = await response.text();
  if (!text) {
    return null as T;
  }

  return JSON.parse(text) as T;
}

export function getStateInstance(credentials: ApiCredentials) {
  return request<InstanceState>(getApiUrl(credentials, "getStateInstance"));
}

export function sendMessage(
  credentials: ApiCredentials,
  chatId: string,
  message: string,
) {
  return request<SendMessage>(getApiUrl(credentials, "sendMessage"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chatId,
      message,
    }),
  });
}

export function receiveNotification(
  credentials: ApiCredentials,
  signal?: AbortSignal,
) {
  const url = `${getApiUrl(credentials, "receiveNotification")}?receiveTimeout=20`;
  return request<IncomingNotification | null>(url, { signal });
}

export function deleteNotification(
  credentials: ApiCredentials,
  receiptId: number,
) {
  return request<unknown>(
    `${getApiUrl(credentials, "deleteNotification")}/${receiptId}`,
    {
      method: "DELETE",
    },
  );
}
