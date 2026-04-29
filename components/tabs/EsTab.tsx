'use client'

import { useState } from 'react'
import type { TabProps } from '@/components/AppShell'
import RichEditor from '@/components/RichEditor'

const ES_SECTIONS = [
  { key: 'whyUs',    label: '志望動機', placeholder: 'なぜこの企業を志望するのか、下書きを書いておこう' },
  { key: 'strength', label: '自己PR・強み', placeholder: '自分の強みをエピソードと共に書く' },
  { key: 'memo',     label: 'ES下書き（その他）', placeholder: 'ガクチカ、長所短所など自由に書く' },
]

export default function EsTab({ companies, onSaveCompany, onUpdateAnalysis }: TabProps) {
  const [selectedId, setSelectedId] = useState('')
  const [activeSection, setActiveSection] = useState('whyUs')
  const [draft, setDraft] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)

  const company = companies.find(c => c.id === selectedId)

  function selectCompany(id: string) {
    setSelectedId(id)
    const co = companies.find(c => c.id === id)
    setDraft({
      whyUs:    co?.analysis?.whyUs    ?? '',
      strength: co?.analysis?.strength ?? '',
      memo:     co?.analysis?.memo     ?? '',
    })
    setSaved(false)
  }

  async function handleSave() {
    if (!selectedId || !company) return
    const newAnalysis = { ...(company.analysis || {}), ...draft }
    await onUpdateAnalysis(selectedId, newAnalysis as never)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const wordCount = (html: string) => {
    const text = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
    return text.length
  }

  return (
    <div>
      {/* 企業選択 */}
      <div style={{ marginBottom: 24 }}>
        <select
          id="es-company-select"
          value={selectedId}
          onChange={e => selectCompany(e.target.value)}
          style={{
            background: 'var(--card)', border: '1.5px solid var(--bor)', borderRadius: 10,
            padding: '10px 16px', fontSize: 14, color: 'var(--t1)',
            fontFamily: 'var(--bf)', outline: 'none', width: '100%', maxWidth: 400,
          }}
        >
          <option value="">企業を選択してください</option>
          {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {!selectedId ? (
        <div style={{
          background: 'var(--card)', border: '1px solid var(--bor)',
          borderRadius: 16, padding: '80px 24px', textAlign: 'center',
        }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>📝</p>
          <p style={{ fontSize: 14, color: 'var(--t3)' }}>
            {companies.length === 0 ? '先に企業を追加してください' : 'ESを書く企業を選択してください'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20 }}>
          {/* セクションナビ */}
          <div style={{
            background: 'var(--card)', border: '1px solid var(--bor)',
            borderRadius: 14, padding: 12, alignSelf: 'start',
          }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', fontFamily: 'var(--mf)', marginBottom: 10, padding: '0 4px' }}>
              {company?.name}
            </p>
            {ES_SECTIONS.map(s => (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '9px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                  background: activeSection === s.key ? '#1A1A2E10' : 'none',
                  color: activeSection === s.key ? 'var(--acc)' : 'var(--t2)',
                  border: 'none', cursor: 'pointer', fontFamily: 'var(--bf)',
                  marginBottom: 2, transition: 'all 0.15s',
                }}
              >
                {s.label}
                <span style={{ display: 'block', fontSize: 10, color: 'var(--t4)', fontWeight: 400 }}>
                  {wordCount(draft[s.key] || '')}文字
                </span>
              </button>
            ))}
          </div>

          {/* エディタ */}
          <div>
            {ES_SECTIONS.filter(s => s.key === activeSection).map(s => (
              <div key={s.key} style={{
                background: 'var(--card)', border: '1px solid var(--bor)',
                borderRadius: 14, padding: 24,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h2 style={{ fontFamily: 'var(--df)', fontSize: 18, fontWeight: 800 }}>
                    {s.label}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 12, color: 'var(--t3)', fontFamily: 'var(--mf)' }}>
                      {wordCount(draft[s.key] || '')} 文字
                    </span>
                    <button
                      id="save-es-btn"
                      onClick={handleSave}
                      style={{
                        background: saved ? 'var(--grn)' : 'var(--acc)',
                        color: '#fff', border: 'none',
                        borderRadius: 8, padding: '8px 20px', fontSize: 13, fontWeight: 700,
                        fontFamily: 'var(--bf)', cursor: 'pointer', transition: 'background 0.2s',
                      }}
                    >
                      {saved ? '✅ 保存済み' : '保存する'}
                    </button>
                  </div>
                </div>
                <RichEditor
                  value={draft[s.key] || ''}
                  onChange={html => {
                    setDraft(prev => ({ ...prev, [s.key]: html }))
                    setSaved(false)
                  }}
                  placeholder={s.placeholder}
                  minHeight={400}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
