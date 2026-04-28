import Link from 'next/link'

const FEATURES = [
  {
    icon: '🏢',
    title: '企業管理',
    desc: '志望企業をS/A/B/Cで優先度管理。ステータス・締切・業界を一元管理できます。',
  },
  {
    icon: '📅',
    title: 'カレンダー',
    desc: '説明会・面接・ES締切をカレンダーで可視化。複数日インターンにも対応。',
  },
  {
    icon: '✅',
    title: 'チェックリスト',
    desc: 'マイページ登録からES提出・面接まで、各企業の進捗を8ステップで管理。',
  },
  {
    icon: '📝',
    title: '企業分析・ES管理',
    desc: 'SWOT分析・志望動機メモ・逆質問リストをまとめて記録。ESの下書きも保存。',
  },
  {
    icon: '☁️',
    title: 'クラウド同期',
    desc: 'PCでもスマホでもデータが同期。どこからでもアクセスできます。',
  },
  {
    icon: '🔒',
    title: 'プライベート',
    desc: 'あなたのデータは完全に非公開。他のユーザーには一切見えません。',
  },
]

const STEPS = [
  { num: '01', title: 'アカウント登録', desc: 'メールアドレスとパスワードで30秒で登録完了。' },
  { num: '02', title: '企業を追加', desc: '志望企業を登録し、ステータスや締切日を設定。' },
  { num: '03', title: '選考を管理', desc: 'カレンダーでスケジュールを確認しながら就活を進める。' },
]

export default function LandingPage() {
  return (
    <div style={{ fontFamily: 'var(--bf)', color: 'var(--t1)', background: 'var(--bg)' }}>

      {/* NAVBAR */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(245,243,239,0.92)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--bor)',
        padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 60,
      }}>
        <div style={{ fontFamily: 'var(--df)', fontWeight: 800, fontSize: 17, color: 'var(--t1)', letterSpacing: '-0.02em' }}>
          My Job Chronicle
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/auth" style={{
            color: 'var(--t2)', textDecoration: 'none', fontSize: 13, fontWeight: 600,
            padding: '7px 16px', borderRadius: 8,
            transition: 'background 0.15s',
          }}>
            ログイン
          </Link>
          <Link href="/auth?mode=signup" style={{
            background: 'var(--acc)', color: '#fff', textDecoration: 'none',
            fontSize: 13, fontWeight: 700, padding: '8px 20px',
            borderRadius: 8, transition: 'opacity 0.15s',
          }}
            className="hover-dim"
          >
            無料で始める
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        maxWidth: 900, margin: '0 auto', padding: '96px 24px 80px',
        textAlign: 'center',
      }}>
        <div className="fade-up" style={{
          display: 'inline-block', background: 'var(--acc)', color: '#fff',
          fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
          padding: '4px 14px', borderRadius: 99, marginBottom: 28,
          fontFamily: 'var(--mf)',
        }}>
          就活生のための管理ツール
        </div>
        <h1 className="fade-up1" style={{
          fontFamily: 'var(--df)', fontSize: 'clamp(36px, 7vw, 68px)',
          fontWeight: 800, lineHeight: 1.15,
          marginBottom: 28, letterSpacing: '-0.03em',
          color: 'var(--t1)',
        }}>
          就活を、丁寧に<br />
          <span style={{ color: 'var(--acc2)' }}>積み重ねる。</span>
        </h1>
        <p className="fade-up2" style={{
          fontSize: 17, color: 'var(--t2)', lineHeight: 1.8,
          maxWidth: 560, margin: '0 auto 44px', fontWeight: 400,
        }}>
          企業管理・選考カレンダー・ES記録まで。<br />
          あなただけの就活手帳を、クラウドで安全に管理。
        </p>
        <div className="fade-up3" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/auth?mode=signup" style={{
            background: 'var(--acc)', color: '#fff', textDecoration: 'none',
            fontSize: 15, fontWeight: 800, padding: '15px 36px',
            borderRadius: 12, letterSpacing: '-0.01em',
          }}
            className="hover-dim"
          >
            無料でアカウント登録
          </Link>
          <Link href="/auth" style={{
            background: 'var(--card)', color: 'var(--t1)', textDecoration: 'none',
            fontSize: 15, fontWeight: 700, padding: '15px 32px',
            borderRadius: 12, border: '1.5px solid var(--bor)',
          }}
            className="hover-lift"
          >
            ログイン
          </Link>
        </div>
        <p style={{ marginTop: 20, fontSize: 12, color: 'var(--t3)' }}>
          無料 · クレジットカード不要 · いつでも削除可能
        </p>
      </section>

      {/* DIVIDER */}
      <div style={{ borderTop: '1px solid var(--bor)', margin: '0 24px' }} />

      {/* FEATURES */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontFamily: 'var(--mf)', fontSize: 11, color: 'var(--t3)', letterSpacing: '0.1em', marginBottom: 12 }}>FEATURES</p>
          <h2 style={{ fontFamily: 'var(--df)', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800 }}>
            就活に必要なすべてが<br />ひとつに
          </h2>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
        }}>
          {FEATURES.map((f, i) => (
            <div key={f.title}
              className={`fade-up${Math.min(i % 3, 2) + 1} hover-lift`}
              style={{
                background: 'var(--card)', border: '1px solid var(--bor)',
                borderRadius: 16, padding: '28px 26px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'var(--df)', fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
              <p style={{ fontSize: 13.5, color: 'var(--t2)', lineHeight: 1.75 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: 'var(--sur)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--mf)', fontSize: 11, color: 'var(--t3)', letterSpacing: '0.1em', marginBottom: 12 }}>HOW IT WORKS</p>
          <h2 style={{ fontFamily: 'var(--df)', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, marginBottom: 56 }}>
            3ステップで始められる
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {STEPS.map((s, i) => (
              <div key={s.num} className={`fade-up${i + 1}`} style={{
                display: 'flex', alignItems: 'center', gap: 28, textAlign: 'left',
                background: 'var(--card)', border: '1px solid var(--bor)',
                borderRadius: 16, padding: '28px 32px',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{
                  fontFamily: 'var(--sf)', fontSize: 40, fontWeight: 800,
                  color: 'var(--acc)', opacity: 0.18, flexShrink: 0, lineHeight: 1,
                  letterSpacing: '-0.03em',
                }}>
                  {s.num}
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--df)', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 700, margin: '0 auto', padding: '96px 24px', textAlign: 'center' }}>
        <h2 style={{
          fontFamily: 'var(--df)', fontSize: 'clamp(28px, 5vw, 44px)',
          fontWeight: 800, marginBottom: 20, lineHeight: 1.2,
        }}>
          今日から就活を<br />整理しよう。
        </h2>
        <p style={{ fontSize: 15, color: 'var(--t2)', marginBottom: 40, lineHeight: 1.8 }}>
          登録は30秒。クレジットカード不要。<br />
          完全無料でご利用いただけます。
        </p>
        <Link href="/auth?mode=signup" style={{
          display: 'inline-block', background: 'var(--acc)', color: '#fff',
          textDecoration: 'none', fontSize: 16, fontWeight: 800,
          padding: '16px 48px', borderRadius: 12, letterSpacing: '-0.01em',
        }}
          className="hover-dim"
        >
          無料で始める →
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid var(--bor)', padding: '32px 24px',
        textAlign: 'center',
      }}>
        <p style={{ fontFamily: 'var(--df)', fontWeight: 800, fontSize: 15, marginBottom: 8 }}>My Job Chronicle</p>
        <p style={{ fontSize: 12, color: 'var(--t3)' }}>就活を丁寧に積み重ねる、あなただけの就活手帳。</p>
      </footer>
    </div>
  )
}
