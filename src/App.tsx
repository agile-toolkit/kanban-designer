import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import type { Screen, KanbanBoard } from './types'
import { TEMPLATES, cloneTemplate } from './data/templates'
import AppHeader from './components/AppHeader'
import BoardDesigner from './components/BoardDesigner'
import TemplatesView from './components/TemplatesView'
import HomeScreen from './components/HomeScreen'
import LearnView from './components/LearnView'
import ThemeToggle from './components/ThemeToggle'

const LEGACY_KEY = 'kanban-designer-board'
const BOARDS_KEY = 'kanban-designer-boards'
const CURRENT_KEY = 'kanban-designer-current-id'
const LAST_SESSION_KEY = 'kanban-designer:lastSession'
const CURRENT_BOARD_KEY = 'kanban-designer:currentBoard'
const HASH_PREFIX = 'board='

function encodeBoard(board: KanbanBoard): string {
  return btoa(encodeURIComponent(JSON.stringify(board)))
}

function parseBoardFromHash(): KanbanBoard | null {
  try {
    const hash = window.location.hash.slice(1)
    if (!hash.startsWith(HASH_PREFIX)) return null
    return JSON.parse(decodeURIComponent(atob(hash.slice(HASH_PREFIX.length)))) as KanbanBoard
  } catch {
    return null
  }
}

const _urlBoard = parseBoardFromHash()

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

function writeLastSession(activeBoard: KanbanBoard, allBoards: KanbanBoard[]) {
  const cardCount = activeBoard.columns.reduce((sum, col) => sum + col.cards.length, 0)
  localStorage.setItem(LAST_SESSION_KEY, JSON.stringify({
    boardName: activeBoard.name,
    columnCount: activeBoard.columns.length,
    cardCount,
    boardCount: allBoards.length,
    updatedAt: new Date().toISOString(),
  }))
}

function writeCurrentBoard(board: KanbanBoard) {
  localStorage.setItem(CURRENT_BOARD_KEY, JSON.stringify({
    boardName: board.name,
    columns: board.columns.map(col => ({
      name: col.name,
      cards: col.cards.map(card => ({ title: card.title, description: card.description ?? '' })),
    })),
    updatedAt: new Date().toISOString(),
  }))
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
  const { t } = useTranslation()
  const [screen, setScreen] = useState<Screen>(() => (_urlBoard ? 'designer' : 'home'))
  const [boards, setBoards] = useState<KanbanBoard[]>(() => {
    const saved = loadBoards()
    if (!_urlBoard) return saved
    const idx = saved.findIndex(b => b.id === _urlBoard!.id)
    const withTimestamp = { ..._urlBoard!, updatedAt: _urlBoard!.updatedAt ?? Date.now() }
    if (idx !== -1) {
      const merged = [...saved]
      merged[idx] = withTimestamp
      return merged
    }
    return [withTimestamp, ...saved]
  })
  const [currentId, setCurrentId] = useState<string | null>(() => {
    if (_urlBoard) return _urlBoard.id
    try {
      return localStorage.getItem(CURRENT_KEY)
    } catch {
      return null
    }
  })
  const [boardHistory, setBoardHistory] = useState<KanbanBoard[]>([])
  const [boardFuture, setBoardFuture] = useState<KanbanBoard[]>([])
  const [linkCopied, setLinkCopied] = useState(false)
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  useEffect(() => {
    setBoardHistory([])
    setBoardFuture([])
  }, [currentId])

  useEffect(() => {
    if (board) {
      history.replaceState(null, '', `#${HASH_PREFIX}${encodeBoard(board)}`)
    } else {
      history.replaceState(null, '', window.location.pathname + window.location.search)
    }
  }, [board])

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setLinkCopied(true)
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
      copyTimeoutRef.current = setTimeout(() => setLinkCopied(false), 2000)
    })
  }

  const applyBoard = (b: KanbanBoard) => {
    const next = { ...b, updatedAt: Date.now() }
    setBoards(prev => {
      const idx = prev.findIndex(x => x.id === next.id)
      const merged = idx === -1 ? [...prev, next] : prev.map(x => (x.id === next.id ? next : x))
      saveBoards(merged)
      writeLastSession(next, merged)
      writeCurrentBoard(next)
      return merged
    })
  }

  const updateBoard = (b: KanbanBoard) => {
    if (board) {
      setBoardHistory(prev => {
        const hist = [...prev, board]
        return hist.length > 50 ? hist.slice(hist.length - 50) : hist
      })
      setBoardFuture([])
    }
    applyBoard(b)
  }

  const undo = useCallback(() => {
    setBoardHistory(hist => {
      if (hist.length === 0) return hist
      const prev = hist[hist.length - 1]
      setBoardFuture(fut => {
        if (board) return [board, ...fut].slice(0, 50)
        return fut
      })
      applyBoard(prev)
      return hist.slice(0, -1)
    })
  }, [board])  // eslint-disable-line react-hooks/exhaustive-deps

  const redo = useCallback(() => {
    setBoardFuture(fut => {
      if (fut.length === 0) return fut
      const next = fut[0]
      setBoardHistory(hist => {
        if (board) return [...hist, board].slice(-50)
        return hist
      })
      applyBoard(next)
      return fut.slice(1)
    })
  }, [board])  // eslint-disable-line react-hooks/exhaustive-deps

  const undoRef = useRef(undo)
  undoRef.current = undo
  const redoRef = useRef(redo)
  redoRef.current = redo

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return
      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undoRef.current()
      } else if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
        e.preventDefault()
        redoRef.current()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-50" data-accent="cobalt">
      <AppHeader
        title={t('app.title')}
        onTitleClick={() => setScreen('home')}
        navItems={[
          { key: 'home', label: t('nav.boards'), active: screen === 'home', onClick: () => setScreen('home') },
          { key: 'templates', label: t('nav.templates'), active: screen === 'templates', onClick: () => setScreen('templates') },
          { key: 'learn', label: t('nav.learn'), active: screen === 'learn', onClick: () => setScreen('learn') },
        ]}
      >
        <ThemeToggle />
        {board && screen === 'designer' && (
          <>
            <button
              type="button"
              onClick={undo}
              disabled={boardHistory.length === 0}
              className="btn-ghost disabled:opacity-40"
              title={t('designer.undo')}
            >
              {t('designer.undo')}
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={boardFuture.length === 0}
              className="btn-ghost disabled:opacity-40"
              title={t('designer.redo')}
            >
              {t('designer.redo')}
            </button>
            <button type="button" onClick={() => exportJSON(board)} className="btn-ghost">
              {t('designer.export_json')}
            </button>
            <label className="btn-ghost cursor-pointer">
              {t('designer.import_json')}
              <input type="file" accept=".json" className="hidden" onChange={handleImport} />
            </label>
            <button
              type="button"
              onClick={copyLink}
              className={`btn-ghost transition-colors ${linkCopied ? 'text-green-600' : ''}`}
            >
              {linkCopied ? t('designer.link_copied') : t('designer.copy_link')}
            </button>
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
      </AppHeader>

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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-3">{t('app.title')}</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">{t('home.pick_or_create')}</p>
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
