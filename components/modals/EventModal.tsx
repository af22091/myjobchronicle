'use client'

import { useState } from 'react'
import type { Company, JobEvent, EventType } from '@/types'

const EVENT_TYPES: EventType[] = ['説明会', 'ES締切', '面接', '筆記試験', 'インターン', '内定']
const COLORS = ['#1A1A2E', '#2D6A4F', '#1E4D7A', '#7A5C00', '#8B4500', '#4A2D8C', '#B81C1C']

interface Props {
  data?: JobEvent
  companies: Company[]
  onSave: (data: Partial<JobEvent>) => void
  onClose: () => void
}

export default function EventModal({ data, companies, onSave, onClose }: Props) {
  const [form, setForm] = useState({
    title:       data?.title       ?? '',
    type:        data?.type        ?? '説明会' as EventType,
    company_id:  data?.company_id  ?? '',
    date_start:  data?.date_start  ?? '',
    date_end:    data?.date_end    ?? '',
    is_multi_day: data?.is_multi_day ?? false,
    time:        data?.time        ?? '',
    location:    data?.location    ?? '',
    note:        data?.note        ?? '',
    color:       data?.color       ?? '#1A1A2E',
  })

  function set<K extends keyof typeof form>(key: K, val: typeof form[K]) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim() || !form.date_start) return
    const payload = {
      ...form,
      date_end: form.is_multi_day ? form.date_end : form.date_start,
      company_id: form.company_id || null,
    }
    onSave(payload)
    onClose()
  }

  const label: React.CSSProperties = {
    display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--t3)',
    fontFamily: 'var(--mf)', letterSpacing: '0.05em', marginBottom: 5,
  }
  const inp: React.CSSProperties = {
    width: '100%', background: 'var(--bg)', border: '1.5px solid var(--bor)',
    borderRadius: 8, padding: '9px 12px', fontSize: 13, color: 'var(--t1)',
    fontFamily: 'var(--bf)', outline: 'none',
  }
  const row: React.CSSProperties = { marginBottom: 16 }

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="modal-card scale-in"
        style={{
          background: 'var(--card)', border: '1px solid var(--bor)',
          borderRadius: 20, padding: 28, width: '100%', maxWidth: 500,
          boxShadow: 'var(--shadow-lg)', maxHeight: '90vh', overflowY: 'auto',
        }}
      >
        <h2 style={{ fontFamily: 'var(--df)', fontSize: 20, fontWeight: 800, marginBottom: 22 }}>
          {data ? 'イベントを編集' : 'イベントを追加'}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* タイトル */}
          <div style={row}>
            <label style={label}>タイトル *</label>
            <input id="event-title" style={inp} value={form.title} required
              onChange={e => set('title', e.target.value)} placeholder="例：〇〇社 説明会" />
          </div>

          {/* 種別・企業 */}
          <div className="form-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={label}>種別</label>
              <select id="event-type" style={inp} value={form.type}
                onChange={e => set('type', e.target.value as EventType)}>
                {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={label}>企業（任意）</label>
              <select id="event-company" style={inp} value={form.company_id}
                onChange={e => set('company_id', e.target.value)}>
                <option value="">企業を選択</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {/* 日付 */}
          <div style={row}>
            <label style={label}>日付 *</label>
            <input id="event-date" type="date" style={inp} value={form.date_start} required
              onChange={e => set('date_start', e.target.value)} />
          </div>

          {/* 複数日 */}
          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <input id="event-multiday" type="checkbox" checked={form.is_multi_day}
              onChange={e => set('is_multi_day', e.target.checked)}
              style={{ width: 16, height: 16, cursor: 'pointer' }} />
            <label htmlFor="event-multiday" style={{ fontSize: 13, color: 'var(--t2)', cursor: 'pointer' }}>
              複数日にまたがる
            </label>
          </div>
          {form.is_multi_day && (
            <div style={row}>
              <label style={label}>終了日</label>
              <input id="event-date-end" type="date" style={inp} value={form.date_end}
                min={form.date_start}
                onChange={e => set('date_end', e.target.value)} />
            </div>
          )}

          {/* 時刻・場所 */}
          <div className="form-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={label}>時刻</label>
              <input id="event-time" style={inp} value={form.time}
                onChange={e => set('time', e.target.value)} placeholder="例：13:00〜" />
            </div>
            <div>
              <label style={label}>場所・URL</label>
              <input id="event-location" style={inp} value={form.location}
                onChange={e => set('location', e.target.value)} placeholder="例：オンライン" />
            </div>
          </div>

          {/* メモ */}
          <div style={row}>
            <label style={label}>メモ</label>
            <textarea id="event-note" style={{ ...inp, minHeight: 64, resize: 'vertical' }}
              value={form.note} onChange={e => set('note', e.target.value)} />
          </div>

          {/* カラー */}
          <div style={row}>
            <label style={label}>カラー</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {COLORS.map(c => (
                <button key={c} type="button"
                  onClick={() => set('color', c)}
                  style={{
                    width: 24, height: 24, borderRadius: '50%', background: c,
                    border: form.color === c ? '3px solid var(--t1)' : '2px solid transparent',
                    cursor: 'pointer', outline: 'none',
                  }}
                />
              ))}
            </div>
          </div>

          {/* ボタン */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" onClick={onClose} style={{
              background: 'var(--sur)', border: '1px solid var(--bor)',
              borderRadius: 8, padding: '9px 20px', fontSize: 13, color: 'var(--t2)',
              fontFamily: 'var(--bf)', cursor: 'pointer',
            }}>
              キャンセル
            </button>
            <button type="submit" id="event-save" style={{
              background: 'var(--acc)', color: '#fff', border: 'none',
              borderRadius: 8, padding: '9px 24px', fontSize: 13, fontWeight: 700,
              fontFamily: 'var(--bf)', cursor: 'pointer',
            }}>
              {data ? '保存する' : '追加する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
