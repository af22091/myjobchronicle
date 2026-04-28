export type Status =
  | '気になる'
  | 'ES作成中'
  | 'ES提出済'
  | '選考中'
  | '最終面接'
  | '内定'
  | '辞退'
  | '不合格'

export type Priority = 'S' | 'A' | 'B' | 'C'

export type ChecklistKey =
  | 'マイページ登録'
  | 'ES提出'
  | '説明会参加'
  | 'OB/OG訪問'
  | 'Webテスト'
  | '1次面接'
  | '2次面接'
  | '最終面接'

export type Checklist = Record<ChecklistKey, boolean>

export interface Analysis {
  strength: string
  weakness: string
  opportunity: string
  threat: string
  culture: string
  whyUs: string
  questions: string
  memo: string
}

export interface Company {
  id: string
  user_id: string
  name: string
  url: string | null
  status: Status
  industry: string | null
  priority: Priority
  note: string | null
  deadline: string | null
  checklist: Checklist
  analysis: Analysis
  created_at: string
}

export type EventType = '説明会' | 'ES締切' | '面接' | '筆記試験' | 'インターン' | '内定'

export interface JobEvent {
  id: string
  user_id: string
  company_id: string | null
  type: EventType | string
  title: string
  date_start: string
  date_end: string
  time: string | null
  note: string | null
  location: string | null
  color: string
  is_multi_day: boolean
  created_at: string
}
