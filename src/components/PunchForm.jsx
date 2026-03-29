import { useState, useEffect } from 'react'
import { calcWorkedMinutes, minToStr, isHoliday, isWeekend, today, fmtBR, parseDate } from '../utils/dateTime'
import styles from './PunchForm.module.css'

const FIELDS = [
  { id: 'entrada',      label: 'Entrada' },
  { id: 'saidaAlmoco',  label: 'Saída almoço' },
  { id: 'retornoAlmoco',label: 'Retorno almoço' },
  { id: 'saida',        label: 'Saída' },
]

const DAILY_MIN = 480

// input type="date" exige YYYY-MM-DD — converte de/para DD-MM-YYYY
function toInputValue(dateStrBR) {
  const [dd, mm, yyyy] = dateStrBR.split('-')
  return `${yyyy}-${mm}-${dd}`
}
function fromInputValue(inputVal) {
  const [yyyy, mm, dd] = inputVal.split('-')
  return `${dd}-${mm}-${yyyy}`
}
// data máxima para o input (hoje, no formato YYYY-MM-DD)
function todayInputMax() {
  const d = new Date()
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

export function PunchForm({ getRecord, saveRecord, deleteRecord }) {
  const [date, setDate] = useState(today())          // DD-MM-YYYY internamente
  const [punch, setPunch] = useState({ entrada: '', saidaAlmoco: '', retornoAlmoco: '', saida: '' })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const r = getRecord(date)
    setPunch({
      entrada:       r.entrada       || '',
      saidaAlmoco:   r.saidaAlmoco   || '',
      retornoAlmoco: r.retornoAlmoco || '',
      saida:         r.saida         || '',
    })
    setSaved(false)
  }, [date])

  const workedMin = calcWorkedMinutes(punch.entrada, punch.saidaAlmoco, punch.retornoAlmoco, punch.saida)
  const diff = workedMin !== null ? workedMin - DAILY_MIN : null

  const holiday = isHoliday(date)
  const weekend = isWeekend(date)

  function handleSave() {
    saveRecord(date, punch)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleDelete() {
    deleteRecord(date)
    setPunch({ entrada: '', saidaAlmoco: '', retornoAlmoco: '', saida: '' })
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.dateRow}>
        <input
          type="date"
          className={styles.datePicker}
          value={toInputValue(date)}
          onChange={e => setDate(fromInputValue(e.target.value))}
          max={todayInputMax()}
        />
      </div>

      {(holiday || weekend) && (
        <div className={styles.notice}>
          {holiday ? '📅 Feriado nacional — não contabilizado na meta.' : '📅 Final de semana.'}
        </div>
      )}

      <div className={styles.grid}>
        {FIELDS.map(f => (
          <label key={f.id} className={styles.field}>
            <span className={styles.fieldLabel}>{f.label}</span>
            <input
              type="time"
              className={styles.timeInput}
              value={punch[f.id]}
              onChange={e => { setPunch(p => ({ ...p, [f.id]: e.target.value })); setSaved(false) }}
            />
          </label>
        ))}
      </div>

      {workedMin !== null && (
        <div className={`${styles.preview} ${diff >= 0 ? styles.previewGood : styles.previewBad}`}>
          <span>Total trabalhado: <strong>{minToStr(workedMin)}</strong></span>
          <span>Saldo do dia: <strong>{minToStr(diff, true)}</strong></span>
        </div>
      )}

      <div className={styles.actions}>
        <button className={`${styles.btn} ${styles.btnPrimary} ${saved ? styles.btnSaved : ''}`} onClick={handleSave}>
          {saved ? '✓ Salvo' : 'Salvar'}
        </button>
        <button className={`${styles.btn} ${styles.btnGhost}`} onClick={handleDelete}>
          Apagar
        </button>
      </div>
    </div>
  )
}
