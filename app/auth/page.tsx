'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

type AuthMode = 'login' | 'signup' | 'forgot' | 'reset'

function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<AuthMode>(
    searchParams.get('mode') === 'signup' ? 'signup' : 'login'
  )
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    // URLハッシュに recovery トークンがあれば新パスワード入力モードに
    const hash = window.location.hash
    if (hash.includes('type=recovery')) {
      setMode('reset')
      return
    }
    // すでにログイン済みならダッシュボードへ
    supabase.auth.getSession().then(({ data }) => {
      if (data.session && !hash.includes('type=recovery')) {
        router.replace('/dashboard')
      }
    })
  }, [])

  const ERR: Record<string, string> = {
    'Invalid login credentials':    'メールアドレスまたはパスワードが間違っています',
    'User already registered':       'このメールアドレスは既に登録されています',
    'Password should be at least 6 characters': 'パスワードは6文字以上にしてください',
    'Unable to validate email address: invalid format': 'メールアドレスの形式が正しくありません',
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setDone(true)
      } else if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/dashboard')
      } else if (mode === 'forgot') {
        const redirectTo = `${window.location.origin}/auth`
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
        if (error) throw error
        setDone(true)
      } else if (mode === 'reset') {
        if (password !== password2) { setError('パスワードが一致しません'); setLoading(false); return }
        const { error } = await supabase.auth.updateUser({ password })
        if (error) throw error
        setDone(true)
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

  function changeMode(m: AuthMode) { setMode(m); setError(''); setDone(false) }

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

        {/* ── 登録完了 / パスワードリセットメール送信完了 ── */}
        {done ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>
              {mode === 'reset' ? '✅' : '📬'}
            </div>
            <h2 style={{ fontFamily: 'var(--df)', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              {mode === 'reset' ? 'パスワードを変更しました' : mode === 'forgot' ? 'リセットメールを送信しました' : '確認メールを送信しました'}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.7, marginBottom: 24 }}>
              {mode === 'reset'
                ? 'ログイン画面からサインインしてください。'
                : <><strong>{email}</strong> にメールを送りました。<br />メール内のリンクをクリックしてください。</>
              }
            </p>
            <button onClick={() => changeMode('login')} style={{
              background: 'var(--acc)', color: '#fff', border: 'none',
              borderRadius: 10, padding: '11px 0', width: '100%',
              fontWeight: 800, fontSize: 14, fontFamily: 'var(--bf)', cursor: 'pointer',
            }}>
              ログイン画面へ
            </button>
          </div>
        ) : mode === 'reset' ? (
          /* ── 新パスワード入力 ── */
          <>
            <h2 style={{ fontFamily: 'var(--df)', fontSize: 18, fontWeight: 700, marginBottom: 20, textAlign: 'center' }}>
              新しいパスワードを設定
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="password" value={password} required minLength={6}
                onChange={e => setPassword(e.target.value)}
                placeholder="新しいパスワード（6文字以上）" style={inputStyle}
              />
              <input
                type="password" value={password2} required minLength={6}
                onChange={e => setPassword2(e.target.value)}
                placeholder="パスワードを再入力" style={inputStyle}
              />
              {error && (
                <div style={{ color: 'var(--red)', fontSize: 12, marginBottom: 14, textAlign: 'center', fontWeight: 700 }}>
                  {error}
                </div>
              )}
              <button type="submit" disabled={loading} className="hover-dim" style={{
                width: '100%', background: loading ? 'var(--t3)' : 'var(--acc)',
                color: '#fff', border: 'none', borderRadius: 10,
                padding: '13px 0', fontWeight: 800, fontSize: 15,
                fontFamily: 'var(--bf)', opacity: loading ? 0.7 : 1, cursor: 'pointer',
              }}>
                {loading ? '変更中...' : 'パスワードを変更する'}
              </button>
            </form>
          </>
        ) : mode === 'forgot' ? (
          /* ── パスワードリセットメール送信 ── */
          <>
            <button onClick={() => changeMode('login')} style={{
              background: 'none', border: 'none', color: 'var(--t3)', fontSize: 12,
              cursor: 'pointer', marginBottom: 16, padding: 0, fontFamily: 'var(--bf)',
            }}>← ログインに戻る</button>
            <h2 style={{ fontFamily: 'var(--df)', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
              パスワードをリセット
            </h2>
            <p style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 20, lineHeight: 1.6 }}>
              登録したメールアドレスにリセットリンクを送ります。
            </p>
            <form onSubmit={handleSubmit}>
              <input
                type="email" value={email} required
                onChange={e => setEmail(e.target.value)}
                placeholder="メールアドレス" style={inputStyle}
              />
              {error && (
                <div style={{ color: 'var(--red)', fontSize: 12, marginBottom: 14, textAlign: 'center', fontWeight: 700 }}>
                  {error}
                </div>
              )}
              <button type="submit" disabled={loading} className="hover-dim" style={{
                width: '100%', background: loading ? 'var(--t3)' : 'var(--acc)',
                color: '#fff', border: 'none', borderRadius: 10,
                padding: '13px 0', fontWeight: 800, fontSize: 15,
                fontFamily: 'var(--bf)', opacity: loading ? 0.7 : 1, cursor: 'pointer',
              }}>
                {loading ? '送信中...' : 'リセットメールを送る'}
              </button>
            </form>
          </>
        ) : (
          /* ── ログイン / 新規登録 ── */
          <>
            {/* Tab switcher */}
            <div style={{ display: 'flex', marginBottom: 24, borderBottom: '1px solid var(--bor)' }}>
              {(['ログイン', '新規登録'] as const).map((label, i) => {
                const active = i === 0 ? mode === 'login' : mode === 'signup'
                return (
                  <button key={label} type="button"
                    onClick={() => changeMode(i === 0 ? 'login' : 'signup')}
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
                placeholder={mode === 'signup' ? 'パスワード（6文字以上）' : 'パスワード'}
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
                marginBottom: 16, cursor: 'pointer',
              }}>
                {loading ? '処理中...' : (mode === 'signup' ? 'アカウントを作成' : 'ログイン')}
              </button>
            </form>

            {/* パスワードを忘れた場合（ログイン時のみ） */}
            {mode === 'login' && (
              <div style={{ textAlign: 'center', marginBottom: 8 }}>
                <button type="button" onClick={() => changeMode('forgot')} style={{
                  background: 'none', border: 'none', color: 'var(--t3)',
                  fontSize: 12, cursor: 'pointer', fontFamily: 'var(--bf)',
                  textDecoration: 'underline',
                }}>
                  パスワードをお忘れですか？
                </button>
              </div>
            )}

            {mode === 'login' && (
              <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--t3)' }}>
                アカウントをお持ちでない方は{' '}
                <button type="button"
                  onClick={() => changeMode('signup')}
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
