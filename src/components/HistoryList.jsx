import { calcWorkedMinutes, minToStr, dateLabel, isHoliday } from '../utils/dateTime'
import styles from './HistoryList.module.css'

const DAILY_MIN = 480

export function HistoryList({ workDays, records, todayStr }) {
  if (!workDays.length) {
    return <p className={styles.empty}>Sem dias úteis neste mês.</p>
  }

  return (
    <div className={styles.list}>
      {workDays.map(ds => {
        const r = records[ds] || {}
        const min = calcWorkedMinutes(r.entrada, r.saidaAlmoco, r.retornoAlmoco, r.saida)
        const diff = min !== null ? min - DAILY_MIN : null
        const isToday = ds === todayStr
        const punches = [r.entrada, r.saidaAlmoco, r.retornoAlmoco, r.saida].filter(Boolean)

        return (
          <div key={ds} className={`${styles.row} ${isToday ? styles.today : ''}`}>
            <span className={styles.date}>
              {dateLabel(ds)}
              {isToday && <span className={styles.badge}>hoje</span>}
            </span>

            <span className={styles.punches}>
              {punches.length > 0
                ? punches.map((p, i) => <span key={i} className={styles.tag}>{p}</span>)
                : <span className={styles.empty2}>—</span>
              }
            </span>

            <span className={`${styles.hours} ${diff === null ? '' : diff >= 0 ? styles.good : styles.bad}`}>
              {min !== null ? minToStr(min) : '—'}
              {diff !== null && (
                <span className={styles.diff}>{minToStr(diff, true)}</span>
              )}
            </span>
          </div>
        )
      })}
    </div>
  )
}
