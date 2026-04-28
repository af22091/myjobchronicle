'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { Company, JobEvent, Checklist, Analysis } from '@/types'
import AppShell from '@/components/AppShell'

const DEFAULT_CHECKLIST: Checklist = {
  'マイページ登録': false,
  'ES提出': false,
  '説明会参加': false,
  'OB/OG訪問': false,
  'Webテスト': false,
  '1次面接': false,
  '2次面接': false,
  '最終面接': false,
}

const DEFAULT_ANALYSIS: Analysis = {
  strength: '', weakness: '', opportunity: '', threat: '',
  culture: '', whyUs: '', questions: '', memo: '',
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [companies, setCompanies] = useState<Company[]>([])
  const [events, setEvents] = useState<JobEvent[]>([])
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace('/auth')
      } else {
        setUser(data.session.user)
        loadData(data.session.user.id)
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace('/auth')
    })
    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadData(userId: string) {
    const [{ data: cos }, { data: evs }] = await Promise.all([
      supabase.from('companies').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('events').select('*').eq('user_id', userId).order('date_start', { ascending: true }),
    ])
    setCompanies((cos as Company[]) || [])
    setEvents((evs as JobEvent[]) || [])
    setLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  async function saveCompany(data: Partial<Company>, id?: string) {
    // 空文字を null に変換（Postgres の date 型は空文字を受け付けない）
    const normalized = {
      ...data,
      deadline: data.deadline || null,
      url:      data.url      || null,
      industry: data.industry || null,
      note:     data.note     || null,
    }
    if (id) {
      const { data: updated, error } = await supabase
        .from('companies').update(normalized).eq('id', id).select().single()
      if (error) { console.error('企業更新エラー:', error.message, '| code:', error.code, '| details:', error.details); return }
      if (updated) setCompanies(prev => prev.map(c => c.id === id ? (updated as Company) : c))
    } else {
      // 同名企業が存在する場合は自動で (1), (2) … を付ける
      const baseName = (normalized.name || '').replace(/ \(\d+\)$/, '')
      let uniqueName = baseName
      let counter = 0
      while (companies.some(c => c.name === uniqueName)) {
        counter++
        uniqueName = `${baseName} (${counter})`
      }
      const { data: created, error } = await supabase.from('companies').insert({
        ...normalized,
        name: uniqueName,
        user_id: user!.id,
        checklist: DEFAULT_CHECKLIST,
        analysis: DEFAULT_ANALYSIS,
      }).select().single()
      if (error) { console.error('企業追加エラー:', error.message, '| code:', error.code, '| details:', error.details, '| hint:', error.hint); return }
      if (created) setCompanies(prev => [created as Company, ...prev])
    }
  }

  async function deleteCompany(id: string) {
    await supabase.from('companies').delete().eq('id', id)
    setCompanies(prev => prev.filter(c => c.id !== id))
    setEvents(prev => prev.filter(e => e.company_id !== id))
  }

  async function toggleChecklist(companyId: string, key: keyof Checklist) {
    const company = companies.find(c => c.id === companyId)
    if (!company) return
    const newChecklist = { ...company.checklist, [key]: !company.checklist[key] }
    await supabase.from('companies').update({ checklist: newChecklist }).eq('id', companyId)
    setCompanies(prev => prev.map(c => c.id === companyId ? { ...c, checklist: newChecklist } : c))
  }

  async function updateAnalysis(companyId: string, analysis: Analysis) {
    await supabase.from('companies').update({ analysis }).eq('id', companyId)
    setCompanies(prev => prev.map(c => c.id === companyId ? { ...c, analysis } : c))
  }

  async function saveEvent(data: Partial<JobEvent>, id?: string) {
    const normalized = {
      ...data,
      time:     data.time     || null,
      location: data.location || null,
      note:     data.note     || null,
      company_id: data.company_id || null,
    }
    if (id) {
      const { data: updated, error } = await supabase.from('events').update(normalized).eq('id', id).select().single()
      if (error) { console.error('イベント更新エラー:', error); return }
      if (updated) setEvents(prev => prev.map(e => e.id === id ? (updated as JobEvent) : e))
    } else {
      const { data: created, error } = await supabase.from('events').insert({
        ...normalized,
        user_id: user!.id,
      }).select().single()
      if (error) { console.error('イベント追加エラー:', error); return }
      if (created) {
        setEvents(prev =>
          [...prev, created as JobEvent].sort((a, b) => a.date_start.localeCompare(b.date_start))
        )
      }
    }
  }

  async function deleteEvent(id: string) {
    await supabase.from('events').delete().eq('id', id)
    setEvents(prev => prev.filter(e => e.id !== id))
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--mf)', fontSize: 13, color: 'var(--t3)',
      }}>
        読み込み中...
      </div>
    )
  }

  return (
    <AppShell
      user={user!}
      companies={companies}
      events={events}
      onLogout={handleLogout}
      onSaveCompany={saveCompany}
      onDeleteCompany={deleteCompany}
      onToggleChecklist={toggleChecklist}
      onUpdateAnalysis={updateAnalysis}
      onSaveEvent={saveEvent}
      onDeleteEvent={deleteEvent}
    />
  )
}
