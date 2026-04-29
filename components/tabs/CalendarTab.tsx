'use client'

import { useState } from 'react'
import type { TabProps } from '@/components/AppShell'
import type { JobEvent } from '@/types'
import EventModal from '@/components/modals/EventModal'

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}
function dateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

export default function CalendarTab({ companies, events, onSaveEvent, onDeleteEvent }: TabProps) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [addModal, setAddModal] = useState<string | null>(null)
  const [editEvent, setEditEvent] = useState<JobEvent | null>(null)

  const today = now.toISOString().slice(0, 10)
  const daysInMonth = getDaysInMonth(year, month)
  const firstDow = getFirstDayOfWeek(year, month)

  // イベントを日付にマッピング
  function eventsOnDay(ds: string) {
    return events.filter(e => {
      if (e.is_multi_day) {
        return ds >= e.date_start && ds <= (e.date_end || e.date_start)
      }
      return e.date_start === ds
    })
  }

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  const selectedEvents = selectedDate ? eventsOnDay(selectedDate) : []

  return (
    <div>
      {/* ナビゲーション */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <button onClick={prevMonth} style={{
          background: 'var(--sur)', border: '1px solid var(--bor)',
          borderRadius: 8, padding: '7px 16px', fontSize: 14, cursor: 'pointer',
        }}>‹</button>
        <h2 style={{ fontFamily: 'var(--sf)', fontSize: 22, fontWeight: 700 }}>
          {year}年 {month + 1}月
        </h2>
        <button onClick={nextMonth} style={{
          background: 'var(--sur)', border: '1px solid var(--bor)',
          borderRadius: 8, padding: '7px 16px', fontSize: 14, cursor: 'pointer',
        }}>›</button>
      </div>

      <div className="calendar-layout" style={{ display: 'grid', gridTemplateColumns: selectedDate ? '1fr 300px' : '1fr', gap: 20 }}>
        {/* カレンダーグリッド */}
        <div style={{
          background: 'var(--card)', border: '1px solid var(--bor)',
          borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
        }}>
          {/* 曜日ヘッダー */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--bor)' }}>
            {WEEKDAYS.map((d, i) => (
              <div key={d} style={{
                textAlign: 'center', padding: '10px 4px',
                fontSize: 11, fontWeight: 700, fontFamily: 'var(--sf)',
                color: i === 0 ? 'var(--red)' : i === 6 ? 'var(--acc)' : 'var(--t3)',
              }}>
                {d}
              </div>
            ))}
          </div>

          {/* 日付グリッド */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {/* 空白 */}
            {Array.from({ length: firstDow }).map((_, i) => (
              <div key={`empty-${i}`} style={{ minHeight: 80, borderRight: '1px solid var(--bor)', borderBottom: '1px solid var(--bor)' }} />
            ))}

            {/* 日付セル */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const ds = dateStr(year, month, day)
              const dayEvents = eventsOnDay(ds)
              const isToday = ds === today
              const isSelected = ds === selectedDate
              const dow = (firstDow + i) % 7

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDate(isSelected ? null : ds)}
                  style={{
                    minHeight: 80, padding: '6px 8px',
                    borderRight: '1px solid var(--bor)', borderBottom: '1px solid var(--bor)',
                    background: isSelected ? '#1A1A2E08' : 'transparent',
                    cursor: 'pointer', transition: 'background 0.1s',
                  }}
                >
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: isToday ? 'var(--acc)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 4,
                  }}>
                    <span style={{
                      fontSize: 12, fontWeight: isToday ? 800 : 500,
                      color: isToday ? '#fff' : dow === 0 ? 'var(--red)' : dow === 6 ? 'var(--acc)' : 'var(--t1)',
                    }}>
                      {day}
                    </span>
                  </div>
                  {/* イベントドット */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {dayEvents.slice(0, 3).map(ev => (
                      <div key={ev.id} style={{
                        fontSize: 10, fontWeight: 600, padding: '1px 5px', borderRadius: 3,
                        background: `${ev.color || '#1A1A2E'}22`,
                        color: ev.color || '#1A1A2E',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <span style={{ fontSize: 9, color: 'var(--t3)' }}>+{dayEvents.length - 3}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 選択日のイベント詳細 */}
        {selectedDate && (
          <div style={{
            background: 'var(--card)', border: '1px solid var(--bor)',
            borderRadius: 16, padding: 20, boxShadow: 'var(--shadow-sm)',
            alignSelf: 'start', position: 'sticky', top: 80,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'var(--sf)', fontSize: 15, fontWeight: 700, letterSpacing: 0 }}>
                {selectedDate}
              </h3>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <button onClick={() => setAddModal(selectedDate)} style={{
                  background: 'var(--acc)', color: '#fff', border: 'none',
                  borderRadius: 6, padding: '5px 12px', fontSize: 11, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'var(--bf)',
                }}>
                  ＋ 追加
                </button>
                <button
                  onClick={() => setSelectedDate(null)}
                  title="閉じてカレンダーを全画面に戻す"
                  style={{
                    background: 'var(--sur)', border: '1px solid var(--bor)',
                    borderRadius: 6, width: 28, height: 28,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, color: 'var(--t3)', cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
            {selectedEvents.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--t3)', textAlign: 'center', padding: '20px 0' }}>
                予定なし
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {selectedEvents.map(ev => (
                  <div key={ev.id} style={{
                    padding: 12, borderRadius: 10,
                    borderLeft: `3px solid ${ev.color || 'var(--acc)'}`,
                    background: 'var(--bg)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700 }}>{ev.title}</p>
                        <p style={{ fontSize: 11, color: 'var(--t3)' }}>
                          {ev.type}{ev.time ? ` · ${ev.time}` : ''}{ev.location ? ` · ${ev.location}` : ''}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => setEditEvent(ev)} style={{
                          background: 'none', border: 'none', fontSize: 12, color: 'var(--t3)', cursor: 'pointer',
                        }}>✏️</button>
                        <button onClick={() => onDeleteEvent(ev.id)} style={{
                          background: 'none', border: 'none', fontSize: 12, color: 'var(--red)', cursor: 'pointer',
                        }}>🗑️</button>
                      </div>
                    </div>
                    {ev.note && <p style={{ fontSize: 11, color: 'var(--t2)', marginTop: 4 }}>{ev.note}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* モーダル */}
      {addModal && (
        <EventModal
          companies={companies}
          onSave={d => onSaveEvent({ ...d, date_start: addModal })}
          onClose={() => setAddModal(null)}
        />
      )}
      {editEvent && (
        <EventModal
          data={editEvent}
          companies={companies}
          onSave={d => onSaveEvent(d, editEvent.id)}
          onClose={() => setEditEvent(null)}
        />
      )}
    </div>
  )
}
