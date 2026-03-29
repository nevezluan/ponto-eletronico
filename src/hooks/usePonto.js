import { useState } from 'react'
import { useLocalStorage } from './useLocalStorage'
import {
  getWorkDays,
  calcWorkedMinutes,
  today,
  parseDate,
} from '../utils/dateTime'

const DAILY_MINUTES = 8 * 60 // 480 min

export function usePonto() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  // Registros por mês: { 'MM-YYYY': { 'DD-MM-YYYY': { entrada, saidaAlmoco, retornoAlmoco, saida } } }
  const storageKey = `ponto_${pad(month + 1)}-${year}`
  const [records, setRecords] = useLocalStorage(storageKey, {})

  // ── Navigation ──────────────────────────────────────────────────
  function changeMonth(delta) {
    let m = month + delta
    let y = year
    if (m > 11) { m = 0; y++ }
    if (m < 0)  { m = 11; y-- }
    setMonth(m)
    setYear(y)
  }

  // ── Record CRUD ─────────────────────────────────────────────────
  function saveRecord(dateStr, punch) {
    setRecords(prev => ({ ...prev, [dateStr]: punch }))
  }

  function deleteRecord(dateStr) {
    setRecords(prev => {
      const next = { ...prev }
      delete next[dateStr]
      return next
    })
  }

  function getRecord(dateStr) {
    return records[dateStr] || {}
  }

  // ── Monthly metrics ─────────────────────────────────────────────
  const workDays = getWorkDays(year, month)
  const targetMinutes = workDays.length * DAILY_MINUTES

  let workedMinutes = 0
  for (const ds of workDays) {
    const r = records[ds]
    if (r) {
      const min = calcWorkedMinutes(r.entrada, r.saidaAlmoco, r.retornoAlmoco, r.saida)
      if (min !== null) workedMinutes += min
    }
  }

  const balanceMinutes = workedMinutes - targetMinutes
  const progressPct = targetMinutes > 0
    ? Math.min(100, Math.round((workedMinutes / targetMinutes) * 100))
    : 0

  const todayStr = today() // DD-MM-YYYY
  const todayTime = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()

  const isCurrentMonth =
    now.getFullYear() === year && now.getMonth() === month

  // DD-MM-YYYY não ordena alfabeticamente, então comparamos via timestamp
  const remainingDays = isCurrentMonth
    ? workDays.filter(d => parseDate(d).getTime() > todayTime).length
    : year > now.getFullYear() || (year === now.getFullYear() && month > now.getMonth())
      ? workDays.length
      : 0

  return {
    year, month, changeMonth,
    workDays, records,
    targetMinutes, workedMinutes, balanceMinutes, progressPct, remainingDays,
    saveRecord, deleteRecord, getRecord,
    todayStr,
  }
}

function pad(n) { return String(n).padStart(2, '0') }
