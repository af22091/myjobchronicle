'use client'

import { useState, useCallback } from 'react'
import type { TabProps } from '@/components/AppShell'
import type { Analysis } from '@/types'

const SWOT_FIELDS: { key: keyof Analysis; label: string; desc: string; color: string }[] = [
  { key: 'strength',    label: 'Strength（強み）',    desc: '自分の強みや会社の強み', color: '#1A5C3A' },
  { key: 'weakness',   label: 'Weakness（弱み）',    desc: '自分の弱みや会社の課題', color: '#B81C1C' },
  { key: 'opportunity',label: 'Opportunity（機会）', desc: '外部環境のチャンス',       color: '#1E4D7A' },
  { key: 'threat',     label: 'Threat（脅威）',      desc: '外部環境のリスク',         color: '#7A5C00' },
]
const EXTRA_FIELDS: { key: keyof Analysis; label: string; placeholder: string }[] = [
  { key: 'culture', label: '社風・カルチャー',   placeholder: '会社の雰囲気や社風についてメモ' },
  { key: 'whyUs',   label: '志望動機',           placeholder: '志望動機の下書きをここに書く' },
  { key: 'questions',label: '逆質問リスト',       placeholder: '面接での逆質問をリストアップ' },
  { key: 'memo',    label: 'その他メモ',          placeholder: '自由にメモ' },
]

export default function AnalysisTab({ companies, onUpdateAnalysis }: TabProps) {
  const [selectedId, setSelectedId] = useState<string>('')
  const [draft, setDraft] = useState<Analysis>({
    strength: '', weakness: '', opportunity: '', threat: '',
    culture: '', whyUs: '', questions: '', memo: '',
  })
  const [saved, setSaved] = useState(false)

  const company = companies.find(c => c.id === selectedId)

  function selectCompany(id: string) {
    setSelectedId(id)
    const co = companies.find(c => c.id === id)
    if (co?.analysis) {
      setDraft({ ...{ strength: '', weakness: '', opportunity: '', threat: '', culture: '', whyUs: '', questions: '', memo: '' }, ...co.analysis })
    } else {
      setDraft({ strength: '', weakness: '', opportunity: '', threat: '', culture: '', whyUs: '', questions: '', memo: '' })
    }
    setSaved(false)
  }

  const setField = useCallback((key: keyof Analysis, val: string) => {
    setDraft(prev => ({ ...prev, [key]: val }))
    setSaved(false)
  }, [])

  async function handleSave() {
    if (!selectedId) return
    await onUpdateAnalysis(selectedId, draft)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const ta: React.CSSProperties = {
    width: '100%', minHeight: 120, background: 'var(--bg)',
    border: '1.5px solid var(--bor)', borderRadius: 8,
    padding: '10px 12px', fontSize: 13, color: 'var(--t1)',
    fontFamily: 'var(--bf)', outline: 'none', resize: 'vertical', lineHeight: 1.7,
  }

  return (
    <div>
      {/* 企業選択 */}
      <div style={{ marginBottom: 24 }}>
        <select
          id="analysis-company-select"
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
          <p style={{ fontSize: 32, marginBottom: 12 }}>📊</p>
          <p style={{ fontSize: 14, color: 'var(--t3)' }}>
            {companies.length === 0 ? '先に企業を追加してください' : '分析する企業を選択してください'}
          </p>
        </div>
      ) : (
        <>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20,
          }}>
            <h2 style={{ fontFamily: 'var(--df)', fontSize: 20, fontWeight: 800 }}>
              {company?.name}
            </h2>
            <button
              id="save-analysis-btn"
              onClick={handleSave}
              style={{
                background: saved ? 'var(--grn)' : 'var(--acc)', color: '#fff', border: 'none',
                borderRadius: 8, padding: '9px 24px', fontSize: 13, fontWeight: 700,
                fontFamily: 'var(--bf)', cursor: 'pointer', transition: 'background 0.2s',
              }}
            >
              {saved ? '✅ 保存しました' : '保存する'}
            </button>
          </div>

          {/* SWOTグリッド */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontFamily: 'var(--df)', fontSize: 15, fontWeight: 700, marginBottom: 14 }}>
              🔍 SWOT分析
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {SWOT_FIELDS.map(f => (
                <div key={f.key} style={{
                  background: 'var(--card)', border: `1.5px solid ${f.color}30`,
                  borderRadius: 12, padding: 16,
                }}>
                  <p style={{
                    fontSize: 11, fontWeight: 800, color: f.color,
                    fontFamily: 'var(--mf)', marginBottom: 8, letterSpacing: '0.05em',
                  }}>
                    {f.label}
                  </p>
                  <textarea
                    id={`analysis-${f.key}`}
                    style={{ ...ta, minHeight: 100 }}
                    value={draft[f.key]}
                    onChange={e => setField(f.key, e.target.value)}
                    placeholder={f.desc}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* その他フィールド */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {EXTRA_FIELDS.map(f => (
              <div key={f.key} style={{
                background: 'var(--card)', border: '1px solid var(--bor)', borderRadius: 12, padding: 16,
              }}>
                <p style={{
                  fontSize: 11, fontWeight: 700, color: 'var(--t3)',
                  fontFamily: 'var(--mf)', marginBottom: 8, letterSpacing: '0.05em',
                }}>
                  {f.label}
                </p>
                <textarea
                  id={`analysis-${f.key}`}
                  style={ta}
                  value={draft[f.key]}
                  onChange={e => setField(f.key, e.target.value)}
                  placeholder={f.placeholder}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
