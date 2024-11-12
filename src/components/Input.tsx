import styles from './Input.module.css';

type Props = {
  id: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
};

export default function Input({ id, onChange, placeholder, value }: Props) {
  return (
    <input
      className={styles.input}
      id={id}
      type="text"
      placeholder={placeholder}
      onChange={(e) => onChange(e.currentTarget.value)}
      value={value}
    />
  );
}
