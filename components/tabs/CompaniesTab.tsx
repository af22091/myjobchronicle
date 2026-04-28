'use client'

import { useState } from 'react'
import type { TabProps } from '@/components/AppShell'
import type { Company, Status, Priority, ChecklistKey } from '@/types'
import CompanyModal from '@/components/modals/CompanyModal'

const STATUSES: Status[] = ['気になる', 'ES作成中', 'ES提出済', '選考中', '最終面接', '内定', '辞退', '不合格']
const PRIORITIES: Priority[] = ['S', 'A', 'B', 'C']
const CHECKLIST_KEYS: ChecklistKey[] = [
  'マイページ登録', 'ES提出', '説明会参加', 'OB/OG訪問',
  'Webテスト', '1次面接', '2次面接', '最終面接'
]
const STATUS_COLORS: Record<string, string> = {
  '気になる': '#7A7268', 'ES作成中': '#7A5C00', 'ES提出済': '#1E4D7A',
  '選考中': '#4A2D8C', '最終面接': '#8B4500', '内定': '#1A5C3A',
  '辞退': '#7A7268', '不合格': '#B81C1C',
}

export default function CompaniesTab({
  companies, onSaveCompany, onDeleteCompany, onToggleChecklist,
}: TabProps) {
  const [filterStatus, setFilterStatus] = useState<Status | ''>('')
  const [filterPriority, setFilterPriority] = useState<Priority | ''>('')
  const [search, setSearch] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [modal, setModal] = useState<Partial<Company> | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // サジェスト候補：検索文字に一致する登録済み企業（idをkeyに使うためオブジェクトで保持）
  const suggestions = search.trim()
    ? companies
        .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
        .slice(0, 8)
    : []

  const filtered = companies.filter(c => {
    if (filterStatus && c.status !== filterStatus) return false
    if (filterPriority && c.priority !== filterPriority) return false
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const cardStyle: React.CSSProperties = {
    background: 'var(--card)', border: '1px solid var(--bor)',
    borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
  }

  const chipStyle = (active: boolean, color?: string): React.CSSProperties => ({
    padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 600,
    cursor: 'pointer', border: 'none', fontFamily: 'var(--bf)',
    background: active ? (color || 'var(--acc)') : 'var(--sur)',
    color: active ? '#fff' : 'var(--t2)',
    transition: 'all 0.15s',
  })

  return (
    <div onClick={() => setShowSuggestions(false)}>
      {/* ツールバー */}
      <div style={{
        display: 'flex', gap: 10, marginBottom: 20,
        flexWrap: 'wrap', alignItems: 'center',
      }}>
        {/* 検索インプット + サジェスト */}
        <div style={{ flex: 1, minWidth: 160, position: 'relative' }} onClick={e => e.stopPropagation()}>
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setShowSuggestions(true) }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={e => {
              if (e.key === 'Enter' && search.trim()) {
                const exact = companies.find(c => c.name.toLowerCase() === search.trim().toLowerCase())
                if (exact) {
                  setSearch(exact.name); setShowSuggestions(false)
                } else {
                  setModal({ name: search.trim() }); setShowSuggestions(false)
                }
              }
              if (e.key === 'Escape') setShowSuggestions(false)
            }}
            placeholder="🔍 企業名を検索（Enter で追加）"
            style={{
              width: '100%', background: 'var(--card)', border: '1.5px solid var(--bor)',
              borderRadius: 8, padding: '8px 14px', fontSize: 13, color: 'var(--t1)',
              fontFamily: 'var(--bf)', outline: 'none',
            }}
          />
          {/* サジェストドロップダウン */}
          {showSuggestions && suggestions.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 200,
              background: 'var(--card)', border: '1.5px solid var(--bor)',
              borderRadius: 8, marginTop: 4, boxShadow: 'var(--shadow-md)',
              overflow: 'hidden',
            }}>
              {suggestions.map(co => (
                <button
                  key={co.id}
                  onClick={() => { setSearch(co.name); setShowSuggestions(false) }}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '9px 14px', fontSize: 13, color: 'var(--t1)',
                    background: 'none', border: 'none', borderBottom: '1px solid var(--bor)',
                    cursor: 'pointer', fontFamily: 'var(--bf)',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--sur)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  🏢 {co.name}
                </button>
              ))}
              {/* 未登録なら「新規追加」オプションを表示 */}
              {search.trim() && !companies.some(c => c.name === search.trim()) && (
                <button
                  onClick={() => {
                    setModal({ name: search.trim() })
                    setShowSuggestions(false)
                  }}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '10px 14px', fontSize: 13, color: 'var(--acc)',
                    background: '#1A1A2E08', border: 'none',
                    borderBottom: '1px solid var(--bor)',
                    cursor: 'pointer', fontFamily: 'var(--bf)', fontWeight: 700,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#1A1A2E14')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#1A1A2E08')}
                >
                  ＋ 「{search.trim()}」を新規追加
                </button>
              )}
              {search.trim() && (
                <button
                  onClick={() => { setSearch(''); setShowSuggestions(false) }}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '7px 14px', fontSize: 11, color: 'var(--t3)',
                    background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--bf)',
                  }}
                >
                  ✕ 検索をクリア
                </button>
              )}
            </div>
          )}
        </div>
        <button
          id="add-company-btn"
          onClick={() => setModal({})}
          style={{
            background: 'var(--acc)', color: '#fff', border: 'none',
            borderRadius: 8, padding: '9px 20px', fontSize: 13, fontWeight: 700,
            fontFamily: 'var(--bf)', cursor: 'pointer',
          }}
        >
          ＋ 企業を追加
        </button>
      </div>

      {/* フィルター */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        <button style={chipStyle(filterStatus === '')} onClick={() => setFilterStatus('')}>すべて</button>
        {STATUSES.map(s => (
          <button key={s} style={chipStyle(filterStatus === s, STATUS_COLORS[s])}
            onClick={() => setFilterStatus(filterStatus === s ? '' : s)}>
            {s}
          </button>
        ))}
        <div style={{ width: 1, background: 'var(--bor)', margin: '0 4px' }} />
        {PRIORITIES.map(p => (
          <button key={p} style={chipStyle(filterPriority === p)}
            onClick={() => setFilterPriority(filterPriority === p ? '' : p)}>
            優先度{p}
          </button>
        ))}
      </div>

      {/* 企業数 */}
      <p style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 14, fontFamily: 'var(--sf)' }}>
        {filtered.length} 社
      </p>

      {/* 企業カード一覧 */}
      {filtered.length === 0 ? (
        <div style={{
          ...cardStyle, padding: '60px 24px', textAlign: 'center',
        }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>🏢</p>
          <p style={{ fontSize: 14, color: 'var(--t3)' }}>
            {companies.length === 0 ? '企業を追加してみましょう' : '条件に合う企業がありません'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(co => {
            const expanded = expandedId === co.id
            const doneCount = Object.values(co.checklist || {}).filter(Boolean).length
            return (
              <div key={co.id} style={cardStyle}>
                {/* ヘッダー行 */}
                <div
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 18px', cursor: 'pointer',
                  }}
                  onClick={() => setExpandedId(expanded ? null : co.id)}
                >
                  {/* 優先度バッジ */}
                  <span style={{
                    width: 26, height: 26, borderRadius: 6, background: 'var(--acc)',
                    color: '#fff', fontSize: 12, fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--mf)', flexShrink: 0,
                  }}>
                    {co.priority}
                  </span>

                  {/* 企業名 */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--t1)' }}>
                      {co.name}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--t3)' }}>
                      {co.industry && `${co.industry} · `}
                      {co.deadline && `締切: ${co.deadline} · `}
                      チェック: {doneCount}/8
                    </p>
                  </div>

                  {/* ステータスバッジ */}
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
                    color: STATUS_COLORS[co.status] || 'var(--t2)',
                    background: `${STATUS_COLORS[co.status]}18` || 'var(--sur)',
                    border: `1px solid ${STATUS_COLORS[co.status]}40`,
                  }}>
                    {co.status}
                  </span>

                  {/* 操作ボタン */}
                  <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => setModal(co)} style={{
                      background: 'var(--sur)', border: '1px solid var(--bor)', borderRadius: 6,
                      padding: '4px 10px', fontSize: 11, color: 'var(--t2)', cursor: 'pointer',
                    }}>
                      編集
                    </button>
                    {deleteConfirm === co.id ? (
                      <button onClick={() => { onDeleteCompany(co.id); setDeleteConfirm(null) }} style={{
                        background: 'var(--red)', border: 'none', borderRadius: 6,
                        padding: '4px 10px', fontSize: 11, color: '#fff', cursor: 'pointer',
                      }}>
                        確認
                      </button>
                    ) : (
                      <button onClick={() => setDeleteConfirm(co.id)} style={{
                        background: 'var(--sur)', border: '1px solid var(--bor)', borderRadius: 6,
                        padding: '4px 10px', fontSize: 11, color: 'var(--red)', cursor: 'pointer',
                      }}>
                        削除
                      </button>
                    )}
                  </div>

                  <span style={{ color: 'var(--t4)', fontSize: 12 }}>{expanded ? '▲' : '▼'}</span>
                </div>

                {/* 展開：チェックリスト */}
                {expanded && (
                  <div style={{
                    borderTop: '1px solid var(--bor)', padding: '16px 18px',
                    background: 'var(--bg)',
                  }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', fontFamily: 'var(--mf)', marginBottom: 10 }}>
                      チェックリスト
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {CHECKLIST_KEYS.map(key => {
                        const done = co.checklist?.[key] ?? false
                        return (
                          <button
                            key={key}
                            onClick={() => onToggleChecklist(co.id, key)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 6,
                              padding: '5px 12px', borderRadius: 99,
                              border: `1.5px solid ${done ? 'var(--grn)' : 'var(--bor)'}`,
                              background: done ? '#1A5C3A10' : 'var(--card)',
                              color: done ? 'var(--grn)' : 'var(--t2)',
                              fontSize: 12, fontWeight: 600, cursor: 'pointer',
                              fontFamily: 'var(--bf)', transition: 'all 0.15s',
                            }}
                          >
                            <span>{done ? '✅' : '○'}</span>
                            <span>{key}</span>
                          </button>
                        )
                      })}
                    </div>
                    {co.note && (
                      <p style={{ fontSize: 13, color: 'var(--t2)', marginTop: 14, lineHeight: 1.7 }}>
                        {co.note}
                      </p>
                    )}
                    {co.url && (
                      <a href={co.url} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 12, color: 'var(--acc)', textDecoration: 'none', marginTop: 8, display: 'block' }}>
                        🔗 採用ページ
                      </a>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* モーダル */}
      {modal !== null && (
        <CompanyModal
          data={modal}
          onSave={d => onSaveCompany(d, (modal as Company).id)}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
