import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { Screen, KanbanBoard } from './types'
import { TEMPLATES, cloneTemplate } from './data/templates'
import BoardDesigner from './components/BoardDesigner'
import TemplatesView from './components/TemplatesView'
import HomeScreen from './components/HomeScreen'
import LearnView from './components/LearnView'

const LEGACY_KEY = 'kanban-designer-board'
const BOARDS_KEY = 'kanban-designer-boards'
const CURRENT_KEY = 'kanban-designer-current-id'

function loadBoards(): KanbanBoard[] {
  try {
    const raw = localStorage.getItem(BOARDS_KEY)
    if (raw) return JSON.parse(raw)
    const legacy = localStorage.getItem(LEGACY_KEY)
    if (legacy) {
      const b = JSON.parse(legacy) as KanbanBoard
      const list = [{ ...b, updatedAt: b.updatedAt ?? Date.now() }]
      localStorage.setItem(BOARDS_KEY, JSON.stringify(list))
      localStorage.removeItem(LEGACY_KEY)
      return list
    }
  } catch {
    /* ignore */
  }
  return []
}

function saveBoards(boards: KanbanBoard[]) {
  localStorage.setItem(BOARDS_KEY, JSON.stringify(boards))
}

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
  const [screen, setScreen] = useState<Screen>('home')
  const [boards, setBoards] = useState<KanbanBoard[]>(loadBoards)
  const [currentId, setCurrentId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(CURRENT_KEY)
    } catch {
      return null
    }
  })

  const board = useMemo(
    () => boards.find(b => b.id === currentId) ?? null,
    [boards, currentId]
  )

  function persistCurrent(id: string | null) {
    setCurrentId(id)
    if (id) localStorage.setItem(CURRENT_KEY, id)
    else localStorage.removeItem(CURRENT_KEY)
  }

  useEffect(() => {
    if (currentId && !boards.some(b => b.id === currentId)) {
      persistCurrent(null)
    }
  }, [boards, currentId])

  const updateBoard = (b: KanbanBoard) => {
    const next = { ...b, updatedAt: Date.now() }
    setBoards(prev => {
      const idx = prev.findIndex(x => x.id === next.id)
      const merged = idx === -1 ? [...prev, next] : prev.map(x => (x.id === next.id ? next : x))
      saveBoards(merged)
      return merged
    })
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const imported = JSON.parse(ev.target?.result as string) as KanbanBoard
        const id = imported.id ?? crypto.randomUUID()
        updateBoard({ ...imported, id, updatedAt: Date.now() })
        persistCurrent(id)
        setScreen('designer')
      } catch {
        alert('Invalid JSON file')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleNewBoard = (b: KanbanBoard) => {
    updateBoard(b)
    persistCurrent(b.id)
    setScreen('designer')
  }

  const handleOpenBoard = (id: string) => {
    persistCurrent(id)
    setScreen('designer')
  }

  const handleDeleteBoard = (id: string) => {
    setBoards(prev => {
      const next = prev.filter(b => b.id !== id)
      saveBoards(next)
      return next
    })
    if (currentId === id) {
      persistCurrent(null)
      setScreen('home')
    }
  }

  const navItems: { key: Screen; label: string }[] = [
    { key: 'home', label: t('nav.home') },
    { key: 'designer', label: t('nav.designer') },
    { key: 'templates', label: t('nav.templates') },
    { key: 'learn', label: t('nav.learn') },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="px-4 h-14 flex items-center justify-between gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setScreen('home')}
            className="font-semibold text-brand-600 hover:text-brand-700"
          >
            {t('app.title')}
            {board && (
              <span className="ml-2 text-gray-400 text-sm font-normal">{board.name}</span>
            )}
          </button>
          <div className="flex items-center gap-1 flex-wrap justify-end">
            {navItems.map(item => (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  if (item.key === 'designer' && !board) setScreen('home')
                  else setScreen(item.key)
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  screen === item.key ? 'bg-brand-100 text-brand-700' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
            {board && screen === 'designer' && (
              <>
                <button type="button" onClick={() => exportJSON(board)} className="btn-ghost">
                  {t('designer.export_json')}
                </button>
                <label className="btn-ghost cursor-pointer">
                  {t('designer.import_json')}
                  <input type="file" accept=".json" className="hidden" onChange={handleImport} />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(t('designer.clear_confirm'))) updateBoard({ ...board, columns: [] })
                  }}
                  className="btn-ghost text-red-400"
                >
                  {t('designer.clear')}
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => i18n.changeLanguage(i18n.language.startsWith('ru') ? 'en' : 'ru')}
              className="ml-2 text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
            >
              {i18n.language.startsWith('ru') ? 'EN' : 'RU'}
            </button>
          </div>
        </div>
      </header>

      {screen === 'home' && (
        <div className="flex-1 overflow-y-auto max-w-5xl mx-auto w-full px-4 py-8">
          <HomeScreen
            boards={boards}
            onNew={handleNewBoard}
            onOpen={handleOpenBoard}
            onDelete={handleDeleteBoard}
          />
        </div>
      )}

      {screen === 'designer' && (
        <>
          {!board ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <div className="text-6xl mb-4">🗂</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-3">{t('app.title')}</h1>
                <p className="text-gray-500 mb-6 text-sm">{t('home.pick_or_create')}</p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      const b = cloneTemplate(TEMPLATES[0])
                      handleNewBoard(b)
                    }}
                    className="btn-primary"
                  >
                    {t('designer.new_board')}
                  </button>
                  <button type="button" onClick={() => setScreen('home')} className="btn-secondary">
                    {t('nav.home')}
                  </button>
                  <button type="button" onClick={() => setScreen('templates')} className="btn-secondary">
                    {t('nav.templates')}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              <BoardDesigner board={board} onUpdate={updateBoard} />
            </div>
          )}
        </>
      )}

      {screen === 'templates' && (
        <div className="flex-1 overflow-y-auto">
          <TemplatesView
            onLoad={b => {
              handleNewBoard({ ...b, updatedAt: Date.now() })
            }}
          />
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
