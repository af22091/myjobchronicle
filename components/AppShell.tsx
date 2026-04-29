'use client'

import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import type { Company, JobEvent, Checklist, Analysis } from '@/types'
import HomeTab from '@/components/tabs/HomeTab'
import CompaniesTab from '@/components/tabs/CompaniesTab'
import CalendarTab from '@/components/tabs/CalendarTab'
import EventsTab from '@/components/tabs/EventsTab'
import AnalysisTab from '@/components/tabs/AnalysisTab'
import EsTab from '@/components/tabs/EsTab'

type Tab = 'home' | 'companies' | 'calendar' | 'events' | 'analysis' | 'es'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'home',      label: 'ホーム',     icon: '🏠' },
  { id: 'companies', label: '企業',       icon: '🏢' },
  { id: 'calendar',  label: 'カレンダー', icon: '📅' },
  { id: 'events',    label: 'イベント',   icon: '✅' },
  { id: 'analysis',  label: '分析',       icon: '📊' },
  { id: 'es',        label: 'ES',         icon: '📝' },
]

export interface TabProps {
  companies: Company[]
  events: JobEvent[]
  onSaveCompany: (data: Partial<Company>, id?: string) => Promise<void>
  onDeleteCompany: (id: string) => Promise<void>
  onToggleChecklist: (companyId: string, key: keyof Checklist) => Promise<void>
  onUpdateAnalysis: (companyId: string, analysis: Analysis) => Promise<void>
  onSaveEvent: (data: Partial<JobEvent>, id?: string) => Promise<void>
  onDeleteEvent: (id: string) => Promise<void>
}

interface AppShellProps extends TabProps {
  user: User
  onLogout: () => void
}

export default function AppShell({
  user, companies, events, onLogout,
  onSaveCompany, onDeleteCompany, onToggleChecklist, onUpdateAnalysis,
  onSaveEvent, onDeleteEvent,
}: AppShellProps) {
  const [activeTab, setActiveTab] = useState<Tab>('home')

  const tabProps: TabProps = {
    companies, events,
    onSaveCompany, onDeleteCompany, onToggleChecklist, onUpdateAnalysis,
    onSaveEvent, onDeleteEvent,
  }

  return (
    <div style={{ fontFamily: 'var(--bf)', background: 'var(--bg)', minHeight: '100vh', color: 'var(--t1)' }}>
      {/* HEADER */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(245,243,239,0.95)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--bor)',
        padding: '0 20px', height: 52,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: 'var(--df)', fontWeight: 800, fontSize: 15, letterSpacing: '-0.02em' }}>
          My Job Chronicle
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="header-email" style={{ fontSize: 11, color: 'var(--t3)', fontFamily: 'var(--sf)' }}>
            {user.email}
          </span>
          <button
            onClick={onLogout}
            style={{
              background: 'var(--sur)', border: '1px solid var(--bor)',
              borderRadius: 6, padding: '5px 12px', fontSize: 12,
              color: 'var(--t2)', cursor: 'pointer', fontFamily: 'var(--bf)',
            }}
          >
            ログアウト
          </button>
        </div>
      </header>

      {/* TAB NAV */}
      <nav style={{
        background: 'var(--card)', borderBottom: '1px solid var(--bor)',
        display: 'flex', overflowX: 'auto', padding: '0 16px',
        scrollbarWidth: 'none',
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            className="tab-btn"
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: 'none', border: 'none', padding: '12px 14px',
              fontFamily: 'var(--bf)', fontSize: 13, fontWeight: 600,
              color: activeTab === tab.id ? 'var(--acc)' : 'var(--t3)',
              borderBottom: activeTab === tab.id ? '2px solid var(--acc)' : '2px solid transparent',
              cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', gap: 5,
            }}
          >
            <span style={{ fontSize: 14 }}>{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* CONTENT */}
      <main className="main-content" style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px' }}>
        {activeTab === 'home'      && <HomeTab {...tabProps} />}
        {activeTab === 'companies' && <CompaniesTab {...tabProps} />}
        {activeTab === 'calendar'  && <CalendarTab {...tabProps} />}
        {activeTab === 'events'    && <EventsTab {...tabProps} />}
        {activeTab === 'analysis'  && <AnalysisTab {...tabProps} />}
        {activeTab === 'es'        && <EsTab {...tabProps} />}
      </main>
    </div>
  )
}
