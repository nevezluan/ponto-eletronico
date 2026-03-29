import styles from './ProgressBar.module.css'

export function ProgressBar({ pct, over }) {
  return (
    <div className={styles.track}>
      <div
        className={`${styles.fill} ${over ? styles.over : ''}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
