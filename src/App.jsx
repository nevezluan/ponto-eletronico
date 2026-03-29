import { useState } from 'react'
import { usePonto } from './hooks/usePonto'
import { minToStr, MONTHS } from './utils/dateTime'
import { MetricCard } from './components/MetricCard'
import { ProgressBar } from './components/ProgressBar'
import { PunchForm } from './components/PunchForm'
import { HistoryList } from './components/HistoryList'
import styles from './App.module.css'

export default function App() {
  const [tab, setTab] = useState('registrar')
  const {
    year, month, changeMonth,
    workDays, records,
    targetMinutes, workedMinutes, balanceMinutes, progressPct, remainingDays,
    saveRecord, deleteRecord, getRecord,
    todayStr,
  } = usePonto()

  const balanceAccent = balanceMinutes > 0 ? 'good' : balanceMinutes < 0 ? 'bad' : ''

  return (
    <div className={styles.app}>
      {/* ── Header ────────────────────────────────────────────── */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>ponto<span className={styles.dot}>.</span></h1>
          <p className={styles.subtitle}>8h/dia · dias úteis · feriados nacionais</p>
        </div>
      </header>

      {/* ── Month nav ─────────────────────────────────────────── */}
      <nav className={styles.monthNav}>
        <button className={styles.navBtn} onClick={() => changeMonth(-1)}>←</button>
        <span className={styles.monthLabel}>
          {MONTHS[month]} <span className={styles.year}>{year}</span>
        </span>
        <button className={styles.navBtn} onClick={() => changeMonth(1)}>→</button>
      </nav>

      {/* ── Metrics ───────────────────────────────────────────── */}
      <div className={styles.metrics}>
        <MetricCard label="Meta" value={minToStr(targetMinutes)} />
        <MetricCard label="Trabalhadas" value={minToStr(workedMinutes)} />
        <MetricCard label="Saldo" value={minToStr(balanceMinutes, true)} accent={balanceAccent} />
        <MetricCard label="Dias restantes" value={remainingDays > 0 ? `${remainingDays}d` : '—'} />
      </div>

      <ProgressBar pct={progressPct} over={workedMinutes > targetMinutes} />

      <div className={styles.progressLabel}>
        <span>{progressPct}% da meta concluída</span>
        <span>{workedMinutes > targetMinutes ? `${minToStr(balanceMinutes, true)} de saldo` : `${minToStr(targetMinutes - workedMinutes)} restantes`}</span>
      </div>

      {/* ── Tabs ──────────────────────────────────────────────── */}
      <div className={styles.tabs}>
        {['registrar', 'histórico'].map(t => (
          <button
            key={t}
            className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Tab content ───────────────────────────────────────── */}
      <main className={styles.content}>
        {tab === 'registrar' && (
          <PunchForm
            getRecord={getRecord}
            saveRecord={saveRecord}
            deleteRecord={deleteRecord}
          />
        )}
        {tab === 'histórico' && (
          <HistoryList
            workDays={workDays}
            records={records}
            todayStr={todayStr}
          />
        )}
      </main>
    </div>
  )
}
