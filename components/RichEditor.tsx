'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { useEffect, useRef } from 'react'

interface Props {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: number
}

const COLORS = [
  '#0F0F0F', '#B81C1C', '#1E4D7A', '#1A5C3A',
  '#7A5C00', '#4A2D8C', '#8B4500', '#7A7268',
]

export default function RichEditor({ value, onChange, placeholder = '入力してください...', minHeight = 200 }: Props) {
  const isInternal = useRef(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: true,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: true,
        },
      }),
      Underline,
      TextStyle,
      Color,
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      isInternal.current = true
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        style: `min-height:${minHeight}px; outline:none; padding:14px 16px; font-size:14px; line-height:1.9; color:var(--t1); font-family:var(--bf);`,
        'data-placeholder': placeholder,
      },
    },
  })

  // 外部からの value 変更に追従（企業切り替え時）
  useEffect(() => {
    if (!editor) return
    if (isInternal.current) { isInternal.current = false; return }
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || '', { emitUpdate: false })
    }
  }, [value, editor])

  if (!editor) return null

  const isActive = (name: string, attrs?: Record<string, unknown>) =>
    editor.isActive(name, attrs)

  const btnStyle = (active: boolean): React.CSSProperties => ({
    background: active ? 'var(--acc)' : 'var(--sur)',
    color: active ? '#fff' : 'var(--t2)',
    border: '1px solid var(--bor)',
    borderRadius: 5, padding: '3px 8px', fontSize: 12,
    fontWeight: 700, cursor: 'pointer', lineHeight: '20px',
    fontFamily: 'var(--sf)', transition: 'all 0.12s',
  })

  return (
    <div style={{
      border: '1.5px solid var(--bor)', borderRadius: 10,
      background: 'var(--bg)', overflow: 'hidden',
    }}>
      {/* ── ツールバー ── */}
      <div style={{
        display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center',
        padding: '8px 12px', borderBottom: '1px solid var(--bor)',
        background: 'var(--card)',
      }}>
        {/* 太字 */}
        <button
          type="button"
          onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleBold().run() }}
          style={btnStyle(isActive('bold'))}
          title="太字 (Ctrl+B)"
        >B</button>

        {/* 下線 */}
        <button
          type="button"
          onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleUnderline().run() }}
          style={{ ...btnStyle(isActive('underline')), textDecoration: 'underline' }}
          title="下線 (Ctrl+U)"
        >U</button>

        {/* 斜体 */}
        <button
          type="button"
          onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleItalic().run() }}
          style={{ ...btnStyle(isActive('italic')), fontStyle: 'italic' }}
          title="斜体 (Ctrl+I)"
        ><em>I</em></button>

        <div style={{ width: 1, height: 18, background: 'var(--bor)', margin: '0 2px' }} />

        {/* 箇条書き */}
        <button
          type="button"
          onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleBulletList().run() }}
          style={btnStyle(isActive('bulletList'))}
          title="箇条書き"
        >• 一覧</button>

        {/* 番号リスト */}
        <button
          type="button"
          onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run() }}
          style={btnStyle(isActive('orderedList'))}
          title="番号リスト"
        >1. 一覧</button>

        <div style={{ width: 1, height: 18, background: 'var(--bor)', margin: '0 2px' }} />

        {/* 文字色 */}
        <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          {COLORS.map(c => (
            <button
              key={c}
              type="button"
              onMouseDown={e => {
                e.preventDefault()
                if (isActive('textStyle', { color: c })) {
                  editor.chain().focus().unsetColor().run()
                } else {
                  editor.chain().focus().setColor(c).run()
                }
              }}
              title={c}
              style={{
                width: 16, height: 16, borderRadius: '50%', background: c,
                border: isActive('textStyle', { color: c }) ? '2.5px solid var(--acc)' : '1.5px solid transparent',
                cursor: 'pointer', outline: 'none', padding: 0,
                boxSizing: 'border-box',
              }}
            />
          ))}
          {/* 色リセット */}
          <button
            type="button"
            onMouseDown={e => { e.preventDefault(); editor.chain().focus().unsetColor().run() }}
            title="色をリセット"
            style={{ ...btnStyle(false), fontSize: 10, padding: '2px 6px' }}
          >✕</button>
        </div>
      </div>

      {/* ── エディタ本体 ── */}
      <style>{`
        .rich-editor-content ul { padding-left: 1.4em; list-style: disc; }
        .rich-editor-content ul li { margin: 2px 0; }
        .rich-editor-content ul ul { list-style: circle; }
        .rich-editor-content ul ul ul { list-style: square; }
        .rich-editor-content ol { padding-left: 1.4em; list-style: decimal; }
        .rich-editor-content ol li { margin: 2px 0; }
        .rich-editor-content p { margin: 0 0 4px; }
        .rich-editor-content p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: var(--t4);
          pointer-events: none;
          position: absolute;
        }
        .rich-editor-content { position: relative; }
        .rich-editor-content:focus-within { outline: none; }
      `}</style>
      <div className="rich-editor-content">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
