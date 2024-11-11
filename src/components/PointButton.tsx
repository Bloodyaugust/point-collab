import clsx from 'clsx';

import styles from './PointButton.module.css';

type Props = {
  handlePointClicked: (point: number) => void;
  point: number;
  selected: boolean;
};

export default function PointButton({
  handlePointClicked,
  point,
  selected,
}: Props) {
  return (
    <button
      className={clsx(
        styles.pointButton,
        selected && styles.pointButtonSelected,
      )}
      onClick={() => {
        handlePointClicked(point);
      }}
    >
      <div className={styles.pointButtonInner}>
        <span
          className={clsx(
            styles.pointButtonContent,
            point === -1 && 'material-icons',
          )}
        >
          {point === -1 ? 'coffee' : point}
        </span>
        <span
          className={clsx(
            styles.pointButtonSelectedContent,
            point === -1 && 'material-icons',
          )}
        >
          {point === -1 ? 'coffee' : point}
        </span>
      </div>
    </button>
  );
}
