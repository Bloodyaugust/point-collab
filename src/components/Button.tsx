import clsx from 'clsx';

import styles from './Button.module.css';

type Props = {
  active?: boolean;
  onClick: () => void;
  text: string;
};

export default function Button({ active, onClick, text }: Props) {
  return (
    <button
      className={clsx(styles.button, active && styles.active)}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
