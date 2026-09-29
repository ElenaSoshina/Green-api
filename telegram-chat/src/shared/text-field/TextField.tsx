import type { ChangeEvent } from "react";
import styles from "./TextField.module.css";

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  name?: string;
  type?: "text" | "password";
};

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  name,
  type = "text",
}: TextFieldProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      <input
        className={styles.input}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        name={name}
      />
    </label>
  );
}
