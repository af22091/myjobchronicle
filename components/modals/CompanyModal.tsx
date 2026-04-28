'use client'

import { useState } from 'react'
import type { Company } from '@/types'
import type { Status, Priority } from '@/types'

const STATUSES: Status[] = ['気になる', 'ES作成中', 'ES提出済', '選考中', '最終面接', '内定', '辞退', '不合格']
const PRIORITIES: Priority[] = ['S', 'A', 'B', 'C']
const INDUSTRIES = ['IT・通信', 'メーカー', '商社', '金融・保険', 'コンサル', '広告・メディア', '小売・流通', '官公庁', 'その他']

interface Props {
  data?: Partial<Company>
  onSave: (data: Partial<Company>) => void
  onClose: () => void
}

export default function CompanyModal({ data, onSave, onClose }: Props) {
  const [form, setForm] = useState({
    name:     data?.name     ?? '',
    url:      data?.url      ?? '',
    industry: data?.industry ?? '',
    status:   data?.status   ?? '気になる' as Status,
    priority: data?.priority ?? 'B' as Priority,
    deadline: data?.deadline ?? '',
    note:     data?.note     ?? '',
  })

  function set<K extends keyof typeof form>(key: K, val: typeof form[K]) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return
    onSave(form)
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
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="scale-in"
        style={{
          background: 'var(--card)', border: '1px solid var(--bor)',
          borderRadius: 20, padding: 28, width: '100%', maxWidth: 520,
          boxShadow: 'var(--shadow-lg)', maxHeight: '90vh', overflowY: 'auto',
        }}
      >
        <h2 style={{ fontFamily: 'var(--df)', fontSize: 20, fontWeight: 800, marginBottom: 22 }}>
          {data ? '企業を編集' : '企業を追加'}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* 企業名 */}
          <div style={row}>
            <label style={label}>企業名 *</label>
            <input id="company-name" style={inp} value={form.name} required
              onChange={e => set('name', e.target.value)} placeholder="例：株式会社〇〇" />
          </div>

          {/* URL */}
          <div style={row}>
            <label style={label}>採用ページURL</label>
            <input id="company-url" style={inp} value={form.url}
              onChange={e => set('url', e.target.value)} placeholder="https://..." />
          </div>

          {/* 業界 */}
          <div style={row}>
            <label style={label}>業界</label>
            <select id="company-industry" style={inp} value={form.industry} onChange={e => set('industry', e.target.value)}>
              <option value="">選択してください</option>
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>

          {/* ステータス・優先度 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={label}>ステータス</label>
              <select id="company-status" style={inp} value={form.status}
                onChange={e => set('status', e.target.value as Status)}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={label}>優先度</label>
              <select id="company-priority" style={inp} value={form.priority}
                onChange={e => set('priority', e.target.value as Priority)}>
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* 締切 */}
          <div style={row}>
            <label style={label}>ES締切日</label>
            <input id="company-deadline" type="date" style={inp} value={form.deadline}
              onChange={e => set('deadline', e.target.value)} />
          </div>

          {/* メモ */}
          <div style={row}>
            <label style={label}>メモ</label>
            <textarea id="company-note" style={{ ...inp, minHeight: 80, resize: 'vertical' }}
              value={form.note} onChange={e => set('note', e.target.value)}
              placeholder="自由にメモを書いてください" />
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
            <button type="submit" id="company-save" style={{
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
