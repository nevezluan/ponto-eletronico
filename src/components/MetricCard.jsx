import styles from './MetricCard.module.css'

export function MetricCard({ label, value, accent }) {
  return (
    <div className={`${styles.card} ${accent ? styles[accent] : ''}`}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </div>
  )
}
