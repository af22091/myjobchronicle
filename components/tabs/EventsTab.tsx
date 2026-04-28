'use client'

import { useState } from 'react'
import type { TabProps } from '@/components/AppShell'
import type { JobEvent, EventType } from '@/types'
import EventModal from '@/components/modals/EventModal'

const EVENT_TYPES: EventType[] = ['説明会', 'ES締切', '面接', '筆記試験', 'インターン', '内定']

export default function EventsTab({ companies, events, onSaveEvent, onDeleteEvent }: TabProps) {
  const [filterType, setFilterType] = useState<EventType | ''>('')
  const [filterCompany, setFilterCompany] = useState('')
  const [modal, setModal] = useState<'add' | JobEvent | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const today = new Date().toISOString().slice(0, 10)

  const filtered = events.filter(e => {
    if (filterType && e.type !== filterType) return false
    if (filterCompany && e.company_id !== filterCompany) return false
    return true
  })

  // 過去・今後に分割
  const upcoming = filtered.filter(e => e.date_start >= today)
  const past = filtered.filter(e => e.date_start < today)

  function companyName(id: string | null) {
    if (!id) return ''
    return companies.find(c => c.id === id)?.name || ''
  }

  const chipStyle = (active: boolean): React.CSSProperties => ({
    padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 600,
    cursor: 'pointer', border: 'none', fontFamily: 'var(--bf)',
    background: active ? 'var(--acc)' : 'var(--sur)',
    color: active ? '#fff' : 'var(--t2)', transition: 'all 0.15s',
  })

  function EventRow({ ev }: { ev: JobEvent }) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '12px 16px',
        background: 'var(--card)', border: '1px solid var(--bor)',
        borderRadius: 12, borderLeft: `3px solid ${ev.color || 'var(--acc)'}`,
        boxShadow: 'var(--shadow-sm)',
      }}>
        {/* 日付 */}
        <div style={{ minWidth: 70, textAlign: 'center' }}>
          <p style={{ fontSize: 10, color: 'var(--t3)', fontFamily: 'var(--sf)' }}>{ev.date_start}</p>
          {ev.is_multi_day && ev.date_end && ev.date_end !== ev.date_start && (
            <p style={{ fontSize: 9, color: 'var(--t4)' }}>〜{ev.date_end}</p>
          )}
          {ev.time && <p style={{ fontSize: 10, color: 'var(--t3)', fontFamily: 'var(--sf)' }}>{ev.time}</p>}
        </div>

        {/* 種別 */}
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
          background: `${ev.color || '#1A1A2E'}20`, color: ev.color || '#1A1A2E',
          whiteSpace: 'nowrap',
        }}>
          {ev.type}
        </span>

        {/* タイトル・企業 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--t1)' }}>{ev.title}</p>
          <p style={{ fontSize: 11, color: 'var(--t3)' }}>
            {companyName(ev.company_id) && `🏢 ${companyName(ev.company_id)}`}
            {ev.location && ` · 📍 ${ev.location}`}
          </p>
          {ev.note && <p style={{ fontSize: 11, color: 'var(--t2)', marginTop: 2 }}>{ev.note}</p>}
        </div>

        {/* 操作 */}
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={() => setModal(ev)} style={{
            background: 'var(--sur)', border: '1px solid var(--bor)', borderRadius: 6,
            padding: '4px 10px', fontSize: 11, color: 'var(--t2)', cursor: 'pointer',
          }}>
            編集
          </button>
          {deleteConfirm === ev.id ? (
            <button onClick={() => { onDeleteEvent(ev.id); setDeleteConfirm(null) }} style={{
              background: 'var(--red)', border: 'none', borderRadius: 6,
              padding: '4px 10px', fontSize: 11, color: '#fff', cursor: 'pointer',
            }}>
              確認
            </button>
          ) : (
            <button onClick={() => setDeleteConfirm(ev.id)} style={{
              background: 'var(--sur)', border: '1px solid var(--bor)', borderRadius: 6,
              padding: '4px 10px', fontSize: 11, color: 'var(--red)', cursor: 'pointer',
            }}>
              削除
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* ツールバー */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <select
          value={filterCompany}
          onChange={e => setFilterCompany(e.target.value)}
          style={{
            background: 'var(--card)', border: '1.5px solid var(--bor)', borderRadius: 8,
            padding: '8px 12px', fontSize: 13, color: 'var(--t1)', fontFamily: 'var(--bf)', outline: 'none',
          }}
        >
          <option value="">すべての企業</option>
          {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button
          id="add-event-btn"
          onClick={() => setModal('add')}
          style={{
            background: 'var(--acc)', color: '#fff', border: 'none',
            borderRadius: 8, padding: '9px 20px', fontSize: 13, fontWeight: 700,
            fontFamily: 'var(--bf)', cursor: 'pointer', marginLeft: 'auto',
          }}
        >
          ＋ イベントを追加
        </button>
      </div>

      {/* 種別フィルター */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        <button style={chipStyle(filterType === '')} onClick={() => setFilterType('')}>すべて</button>
        {EVENT_TYPES.map(t => (
          <button key={t} style={chipStyle(filterType === t)}
            onClick={() => setFilterType(filterType === t ? '' : t)}>
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{
          background: 'var(--card)', border: '1px solid var(--bor)',
          borderRadius: 14, padding: '60px 24px', textAlign: 'center',
        }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>📅</p>
          <p style={{ fontSize: 14, color: 'var(--t3)' }}>
            {events.length === 0 ? 'イベントを追加してみましょう' : '条件に合うイベントがありません'}
          </p>
        </div>
      ) : (
        <>
          {/* 今後のイベント */}
          {upcoming.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontFamily: 'var(--df)', fontSize: 15, fontWeight: 700, marginBottom: 12, color: 'var(--t1)' }}>
                今後のイベント ({upcoming.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {upcoming.map(ev => <EventRow key={ev.id} ev={ev} />)}
              </div>
            </div>
          )}

          {/* 過去のイベント */}
          {past.length > 0 && (
            <div style={{ opacity: 0.6 }}>
              <h3 style={{ fontFamily: 'var(--df)', fontSize: 15, fontWeight: 700, marginBottom: 12, color: 'var(--t2)' }}>
                過去のイベント ({past.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[...past].reverse().map(ev => <EventRow key={ev.id} ev={ev} />)}
              </div>
            </div>
          )}
        </>
      )}

      {modal && (
        <EventModal
          data={modal === 'add' ? undefined : modal}
          companies={companies}
          onSave={d => onSaveEvent(d, modal === 'add' ? undefined : modal.id)}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
