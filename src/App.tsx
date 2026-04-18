import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Screen, KanbanBoard } from './types'
import { TEMPLATES, cloneTemplate } from './data/templates'
import BoardDesigner from './components/BoardDesigner'
import TemplatesView from './components/TemplatesView'
import LearnView from './components/LearnView'

const STORAGE_KEY = 'kanban-designer-board'

function loadBoard(): KanbanBoard | null {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') } catch { return null }
}
function saveBoard(b: KanbanBoard) { localStorage.setItem(STORAGE_KEY, JSON.stringify(b)) }

function exportJSON(board: KanbanBoard) {
  const blob = new Blob([JSON.stringify(board, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `kanban-board-${board.name.replace(/\s+/g, '-').toLowerCase()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export default function App() {
  const { t, i18n } = useTranslation()
  const [screen, setScreen] = useState<Screen>('designer')
  const [board, setBoard] = useState<KanbanBoard | null>(loadBoard)

  const updateBoard = (b: KanbanBoard) => { setBoard(b); saveBoard(b) }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const imported = JSON.parse(ev.target?.result as string)
        updateBoard(imported)
        setScreen('designer')
      } catch { alert('Invalid JSON file') }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const navItems: { key: Screen; label: string }[] = [
    { key: 'designer', label: t('nav.designer') },
    { key: 'templates', label: t('nav.templates') },
    { key: 'learn', label: t('nav.learn') },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="px-4 h-14 flex items-center justify-between">
          <button onClick={() => setScreen('designer')} className="font-semibold text-brand-600 hover:text-brand-700">
            {t('app.title')}
            {board && <span className="ml-2 text-gray-400 text-sm font-normal">{board.name}</span>}
          </button>
          <div className="flex items-center gap-1">
            {navItems.map(item => (
              <button key={item.key} onClick={() => setScreen(item.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${screen === item.key ? 'bg-brand-100 text-brand-700' : 'text-gray-500 hover:bg-gray-100'}`}>
                {item.label}
              </button>
            ))}
            {board && screen === 'designer' && (
              <>
                <button onClick={() => exportJSON(board)} className="btn-ghost">{t('designer.export_json')}</button>
                <label className="btn-ghost cursor-pointer">
                  {t('designer.import_json')}
                  <input type="file" accept=".json" className="hidden" onChange={handleImport} />
                </label>
                <button
                  onClick={() => { if (confirm(t('designer.clear_confirm'))) updateBoard({ ...board, columns: [] }) }}
                  className="btn-ghost text-red-400"
                >
                  {t('designer.clear')}
                </button>
              </>
            )}
            <button onClick={() => i18n.changeLanguage(i18n.language.startsWith('ru') ? 'en' : 'ru')}
              className="ml-2 text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100">
              {i18n.language.startsWith('ru') ? 'EN' : 'RU'}
            </button>
          </div>
        </div>
      </header>

      {screen === 'designer' && (
        board ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            <BoardDesigner board={board} onUpdate={updateBoard} />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-4">🗂</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">{t('app.title')}</h1>
              <p className="text-gray-500 mb-6 text-sm">Design your Kanban system from scratch or choose a template.</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => updateBoard(cloneTemplate(TEMPLATES[0]))}
                  className="btn-primary"
                >
                  {t('designer.new_board')}
                </button>
                <button onClick={() => setScreen('templates')} className="btn-secondary">
                  {t('nav.templates')}
                </button>
              </div>
            </div>
          </div>
        )
      )}

      {screen === 'templates' && (
        <div className="flex-1 overflow-y-auto">
          <TemplatesView onLoad={b => { updateBoard(b); setScreen('designer') }} />
        </div>
      )}
      {screen === 'learn' && (
        <div className="flex-1 overflow-y-auto">
          <LearnView />
        </div>
      )}
    </div>
  )
}
