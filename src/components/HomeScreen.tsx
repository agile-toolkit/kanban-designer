import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { BoardConfig } from '../types';
import { TEMPLATES } from '../data/templates';

interface Props {
  boards: BoardConfig[];
  onNew: (config: BoardConfig) => void;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function HomeScreen({ boards, onNew, onOpen, onDelete }: Props) {
  const { t } = useTranslation();
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);
  const [tab, setTab] = useState<'templates' | 'boards'>('templates');

  function useTemplate(tid: string) {
    const tpl = TEMPLATES.find(t => t.id === tid)!;
    const config: BoardConfig = {
      id: crypto.randomUUID(),
      name: tpl.name,
      columns: tpl.columns.map(c => ({ ...c, id: crypto.randomUUID() })),
      lanes: [],
      cards: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onNew(config);
  }

  function newBlank() {
    const config: BoardConfig = {
      id: crypto.randomUUID(),
      name: 'New Board',
      columns: [
        { id: crypto.randomUUID(), name: 'To Do', wipLimit: null, color: '#e2e8f0' },
        { id: crypto.randomUUID(), name: 'In Progress', wipLimit: null, color: '#bfdbfe' },
        { id: crypto.randomUUID(), name: 'Done', wipLimit: null, color: '#bbf7d0' },
      ],
      lanes: [],
      cards: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onNew(config);
  }

  const principles: string[] = t('board.principlesList', { returnObjects: true }) as string[];

  return (
    <div className="space-y-8">
      <div className="text-center py-6">
        <div className="text-5xl mb-3">📋</div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{t('home.headline')}</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">{t('home.intro')}</p>
        <div className="mt-5 flex justify-center gap-3">
          <button onClick={newBlank} className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-sm">
            + {t('home.newBoard')}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        {(['templates', 'boards'] as const).map(tab2 => (
          <button
            key={tab2}
            onClick={() => setTab(tab2)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${tab === tab2 ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            {tab2 === 'templates' ? t('home.templates') : t('home.myBoards')}
            {tab2 === 'boards' && boards.length > 0 && (
              <span className="ml-1.5 bg-brand-100 text-brand-700 text-xs rounded-full px-1.5">{boards.length}</span>
            )}
          </button>
        ))}
      </div>

      {tab === 'templates' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TEMPLATES.map(tpl => (
              <div key={tpl.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800">{tpl.name}</h3>
                      <p className="text-sm text-slate-500 mt-1">{tpl.description}</p>
                    </div>
                    <div className="flex gap-2 ml-3 shrink-0">
                      <button
                        onClick={() => setExpandedTemplate(expandedTemplate === tpl.id ? null : tpl.id)}
                        className="text-xs text-brand-600 hover:text-brand-800 underline"
                      >
                        {t('home.learnMore')}
                      </button>
                      <button
                        onClick={() => useTemplate(tpl.id)}
                        className="bg-brand-600 hover:bg-brand-700 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                      >
                        {t('home.useTemplate')}
                      </button>
                    </div>
                  </div>

                  {/* Columns preview */}
                  <div className="flex gap-1 mt-3 flex-wrap">
                    {tpl.columns.map((col, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded-full border border-slate-200" style={{ backgroundColor: col.color }}>
                        {col.name}{col.wipLimit ? ` (${col.wipLimit})` : ''}
                      </span>
                    ))}
                  </div>
                </div>

                {expandedTemplate === tpl.id && (
                  <div className="border-t border-slate-100 p-4 bg-slate-50 space-y-3 text-sm">
                    <div>
                      <span className="font-semibold text-slate-700">{t('home.useCase')}: </span>
                      <span className="text-slate-600">{tpl.useCase}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700 mb-1">✅ {t('home.strengths')}</p>
                      <ul className="space-y-0.5">
                        {tpl.strengths.map((s, i) => <li key={i} className="text-slate-600">· {s}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700 mb-1">⚠️ {t('home.risks')}</p>
                      <ul className="space-y-0.5">
                        {tpl.risks.map((r, i) => <li key={i} className="text-slate-600">· {r}</li>)}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* WIP explainer */}
          <div className="bg-brand-50 border border-brand-200 rounded-xl p-5">
            <h3 className="font-semibold text-brand-800 mb-2">{t('home.wipExplainer')}</h3>
            <p className="text-sm text-brand-700">{t('home.wipText')}</p>
          </div>

          {/* Kanban Principles */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-3">{t('board.principles')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {principles.map((p, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-brand-500 font-bold">{i + 1}.</span>{p}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'boards' && (
        <div>
          {boards.length === 0 ? (
            <p className="text-slate-400 text-sm italic">{t('home.noBoards')}</p>
          ) : (
            <div className="space-y-2">
              {boards.map(board => (
                <div key={board.id} className="bg-white border border-slate-200 rounded-lg px-4 py-3 flex items-center justify-between shadow-sm">
                  <div>
                    <span className="font-medium text-slate-800">{board.name}</span>
                    <span className="text-slate-400 text-xs ml-3">{board.columns.length} columns · {new Date(board.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => onOpen(board.id)} className="text-brand-600 hover:text-brand-800 text-sm font-medium px-3 py-1 rounded hover:bg-brand-50 transition-colors">{t('home.continue')}</button>
                    <button onClick={() => onDelete(board.id)} className="text-red-400 hover:text-red-600 text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors">{t('home.delete')}</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
