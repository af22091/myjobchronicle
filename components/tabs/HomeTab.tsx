'use client'

import type { TabProps } from '@/components/AppShell'
import type { Company } from '@/types'

const STATUS_ORDER = ['気になる', 'ES作成中', 'ES提出済', '選考中', '最終面接', '内定', '辞退', '不合格']
const STATUS_COLORS: Record<string, string> = {
  '気になる': '#7A7268', 'ES作成中': '#7A5C00', 'ES提出済': '#1E4D7A',
  '選考中': '#4A2D8C', '最終面接': '#8B4500', '内定': '#1A5C3A',
  '辞退': '#7A7268', '不合格': '#B81C1C',
}

export default function HomeTab({ companies, events }: TabProps) {
  const today = new Date().toISOString().slice(0, 10)

  // ステータス集計
  const statusCount = STATUS_ORDER.map(s => ({
    status: s,
    count: companies.filter(c => c.status === s).length,
    color: STATUS_COLORS[s],
  })).filter(x => x.count > 0)

  // 直近イベント（今日以降7件）
  const upcomingEvents = events
    .filter(e => e.date_start >= today)
    .slice(0, 7)

  // 締切が近い企業（7日以内）
  const soonDeadlines = companies
    .filter(c => c.deadline && c.deadline >= today)
    .sort((a, b) => (a.deadline ?? '').localeCompare(b.deadline ?? ''))
    .slice(0, 5)

  const card: React.CSSProperties = {
    background: 'var(--card)', border: '1px solid var(--bor)',
    borderRadius: 14, padding: '20px 22px', boxShadow: 'var(--shadow-sm)',
  }

  return (
    <div>
      {/* 概要カード */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 28 }}>
        <div style={{ ...card, textAlign: 'center' }}>
          <p style={{ fontSize: 32, fontWeight: 800, fontFamily: 'var(--sf)', color: 'var(--acc)' }}>
            {companies.length}
          </p>
          <p style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>登録企業数</p>
        </div>
        {statusCount.slice(0, 4).map(s => (
          <div key={s.status} style={{ ...card, textAlign: 'center' }}>
            <p style={{ fontSize: 32, fontWeight: 800, fontFamily: 'var(--sf)', color: s.color }}>
              {s.count}
            </p>
            <p style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>{s.status}</p>
          </div>
        ))}
      </div>

      <div className="home-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* 直近のイベント */}
        <div style={card}>
          <h2 style={{ fontFamily: 'var(--df)', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
            📅 直近のイベント
          </h2>
          {upcomingEvents.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--t3)', textAlign: 'center', padding: '20px 0' }}>
              予定がありません
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {upcomingEvents.map(ev => (
                <div key={ev.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px', background: 'var(--bg)',
                  borderRadius: 8, borderLeft: `3px solid ${ev.color || 'var(--acc)'}`,
                }}>
                  <div style={{ minWidth: 60 }}>
                    <p style={{ fontSize: 10, color: 'var(--t3)', fontFamily: 'var(--sf)' }}>
                      {ev.date_start}
                    </p>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)' }}>{ev.title}</p>
                    <p style={{ fontSize: 11, color: 'var(--t3)' }}>{ev.type}{ev.time ? ` · ${ev.time}` : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 締切が近い企業 */}
        <div style={card}>
          <h2 style={{ fontFamily: 'var(--df)', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
            ⏰ 締切が近い企業
          </h2>
          {soonDeadlines.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--t3)', textAlign: 'center', padding: '20px 0' }}>
              締切登録がありません
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {soonDeadlines.map(co => {
                const daysLeft = Math.ceil(
                  (new Date(co.deadline!).getTime() - new Date(today).getTime()) / 86400000
                )
                return (
                  <div key={co.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 12px', background: 'var(--bg)', borderRadius: 8,
                  }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600 }}>{co.name}</p>
                      <p style={{ fontSize: 11, color: 'var(--t3)' }}>{co.deadline}</p>
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 700, fontFamily: 'var(--sf)',
                      color: daysLeft <= 3 ? 'var(--red)' : daysLeft <= 7 ? 'var(--orange)' : 'var(--t3)',
                      background: 'var(--sur)', borderRadius: 6, padding: '3px 8px',
                    }}>
                      {daysLeft === 0 ? '今日' : `あと${daysLeft}日`}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ステータス内訳 */}
      {statusCount.length > 0 && (
        <div style={{ ...card, marginTop: 20 }}>
          <h2 style={{ fontFamily: 'var(--df)', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
            📊 ステータス内訳
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {statusCount.map(s => (
              <div key={s.status} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', background: 'var(--bg)', borderRadius: 99,
                border: `1.5px solid ${s.color}20`,
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.count}</span>
                <span style={{ fontSize: 12, color: 'var(--t2)' }}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
