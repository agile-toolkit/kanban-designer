import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { BoardConfig, View } from './types';
import HomeScreen from './components/HomeScreen';
import BoardDesigner from './components/BoardDesigner';

const STORAGE_KEY = 'kanban-boards';
const CURRENT_KEY = 'kanban-current';

function load<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; }
  catch { return fallback; }
}

function makeEmpty(): BoardConfig {
  return {
    id: crypto.randomUUID(),
    name: 'My Board',
    columns: [],
    lanes: [],
    cards: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export default function App() {
  const { i18n } = useTranslation();
  const [view, setView] = useState<View>('home');
  const [boards, setBoards] = useState<BoardConfig[]>(() => load(STORAGE_KEY, []));
  const [current, setCurrent] = useState<BoardConfig>(() => {
    const id = localStorage.getItem(CURRENT_KEY);
    const all = load<BoardConfig[]>(STORAGE_KEY, []);
    return all.find(b => b.id === id) ?? makeEmpty();
  });

  useEffect(() => { localStorage.setItem(CURRENT_KEY, current.id); }, [current.id]);

  function updateCurrent(patch: Partial<BoardConfig>) {
    const updated = { ...current, ...patch, updatedAt: new Date().toISOString() };
    setCurrent(updated);
    setBoards(prev => {
      const idx = prev.findIndex(b => b.id === updated.id);
      const next = idx >= 0 ? prev.map(b => b.id === updated.id ? updated : b) : [...prev, updated];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  function openBoard(id: string) {
    const found = boards.find(b => b.id === id);
    if (found) { setCurrent(found); setView('board'); }
  }

  function deleteBoard(id: string) {
    setBoards(prev => {
      const next = prev.filter(b => b.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    if (current.id === id) setCurrent(makeEmpty());
  }

  function newBoard(config: BoardConfig) {
    setCurrent(config);
    setBoards(prev => {
      const next = [...prev, config];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    setView('board');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-brand-600 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => setView('home')} className="font-bold text-lg tracking-tight hover:opacity-80">
            Kanban Designer
          </button>
          <button
            onClick={() => i18n.changeLanguage(i18n.language.startsWith('ru') ? 'en' : 'ru')}
            className="text-sm bg-brand-700 hover:bg-brand-500 px-3 py-1 rounded transition-colors"
          >
            {i18n.language.startsWith('ru') ? 'EN' : 'RU'}
          </button>
        </div>
      </header>
      <main className="flex-1">
        {view === 'home' && (
          <div className="max-w-6xl mx-auto px-4 py-6">
            <HomeScreen boards={boards} onNew={newBoard} onOpen={openBoard} onDelete={deleteBoard} />
          </div>
        )}
        {view === 'board' && (
          <BoardDesigner board={current} onChange={updateCurrent} onBack={() => setView('home')} />
        )}
      </main>
    </div>
  );
}
