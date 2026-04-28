'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSignup, setIsSignup] = useState(searchParams.get('mode') === 'signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    // すでにログイン済みならダッシュボードへ
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/dashboard')
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setLoading(true)

    const ERR: Record<string, string> = {
      'Invalid login credentials':    'メールアドレスまたはパスワードが間違っています',
      'User already registered':       'このメールアドレスは既に登録されています',
      'Password should be at least 6 characters': 'パスワードは6文字以上にしてください',
      'Unable to validate email address: invalid format': 'メールアドレスの形式が正しくありません',
    }

    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setDone(true)
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/dashboard')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setError(ERR[msg] || msg)
    }
    setLoading(false)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'var(--sur)', border: '1.5px solid var(--bor)',
    borderRadius: 8, padding: '11px 14px', fontSize: 14, color: 'var(--t1)',
    fontFamily: 'var(--bf)', marginBottom: 14, display: 'block', outline: 'none',
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, position: 'relative',
    }}>
      {/* Subtle grid background */}
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: 'linear-gradient(var(--bor) 1px,transparent 1px),linear-gradient(90deg,var(--bor) 1px,transparent 1px)',
        backgroundSize: '48px 48px', opacity: 0.3, pointerEvents: 'none',
      }} />

      <div className="scale-in" style={{
        background: 'var(--card)', border: '1px solid var(--bor)',
        borderRadius: 20, padding: 36, width: '100%', maxWidth: 400,
        boxShadow: 'var(--shadow-lg)', position: 'relative',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <h1 style={{
            fontFamily: 'var(--df)', fontSize: 22, fontWeight: 800,
            textAlign: 'center', marginBottom: 6, color: 'var(--t1)',
          }}>
            My Job Chronicle
          </h1>
        </Link>
        <p style={{
          fontFamily: 'var(--mf)', fontSize: 11, color: 'var(--t3)',
          textAlign: 'center', marginBottom: 28,
        }}>
          就活を丁寧に積み重ねる
        </p>

        {done ? (
          /* 確認メール送信完了 */
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📬</div>
            <h2 style={{ fontFamily: 'var(--df)', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              確認メールを送信しました
            </h2>
            <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.7, marginBottom: 24 }}>
              <strong>{email}</strong> に確認メールを送りました。<br />
              メール内のリンクをクリックして登録を完了してください。
            </p>
            <button onClick={() => { setIsSignup(false); setDone(false) }} style={{
              background: 'var(--acc)', color: '#fff', border: 'none',
              borderRadius: 10, padding: '11px 0', width: '100%',
              fontWeight: 800, fontSize: 14, fontFamily: 'var(--bf)',
            }}>
              ログイン画面へ
            </button>
          </div>
        ) : (
          <>
            {/* Tab switcher */}
            <div style={{ display: 'flex', marginBottom: 24, borderBottom: '1px solid var(--bor)' }}>
              {(['ログイン', '新規登録'] as const).map((label, i) => {
                const active = i === 0 ? !isSignup : isSignup
                return (
                  <button key={label} type="button"
                    onClick={() => { setIsSignup(i === 1); setError('') }}
                    style={{
                      flex: 1, background: 'none', border: 'none',
                      padding: '10px 0', fontFamily: 'var(--bf)',
                      fontWeight: 700, fontSize: 13, cursor: 'pointer',
                      color: active ? 'var(--acc)' : 'var(--t3)',
                      borderBottom: active ? '2px solid var(--acc)' : '2px solid transparent',
                      transition: 'all 0.2s', marginBottom: -1,
                    }}>
                    {label}
                  </button>
                )
              })}
            </div>

            <form onSubmit={handleSubmit}>
              <input
                type="email" value={email} required
                onChange={e => setEmail(e.target.value)}
                placeholder="メールアドレス" style={inputStyle}
              />
              <input
                type="password" value={password} required
                onChange={e => setPassword(e.target.value)}
                placeholder={isSignup ? 'パスワード（6文字以上）' : 'パスワード'}
                style={inputStyle}
              />
              {error && (
                <div style={{
                  color: 'var(--red)', fontSize: 12, marginBottom: 14,
                  textAlign: 'center', fontWeight: 700, lineHeight: 1.5,
                }}>
                  {error}
                </div>
              )}
              <button type="submit" disabled={loading} className="hover-dim" style={{
                width: '100%', background: loading ? 'var(--t3)' : 'var(--acc)',
                color: '#fff', border: 'none', borderRadius: 10,
                padding: '13px 0', fontWeight: 800, fontSize: 15,
                fontFamily: 'var(--bf)', opacity: loading ? 0.7 : 1,
                marginBottom: 16,
              }}>
                {loading ? '処理中...' : (isSignup ? 'アカウントを作成' : 'ログイン')}
              </button>
            </form>

            {!isSignup && (
              <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--t3)' }}>
                アカウントをお持ちでない方は{' '}
                <button type="button"
                  onClick={() => { setIsSignup(true); setError('') }}
                  style={{ background: 'none', border: 'none', color: 'var(--acc)', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'var(--bf)', padding: 0 }}>
                  新規登録
                </button>
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  )
}
