import styles from './Input.module.css';

type Props = {
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
};

export default function Input({ onChange, placeholder, value }: Props) {
  return (
    <input
      className={styles.input}
      type="text"
      placeholder={placeholder}
      onChange={(e) => onChange(e.currentTarget.value)}
      value={value}
    />
  );
}
