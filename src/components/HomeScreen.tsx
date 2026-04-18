import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { KanbanBoard } from '../types'
import { TEMPLATES, cloneTemplate } from '../data/templates'

interface Props {
  boards: KanbanBoard[]
  onNew: (board: KanbanBoard) => void
  onOpen: (id: string) => void
  onDelete: (id: string) => void
}

export default function HomeScreen({ boards, onNew, onOpen, onDelete }: Props) {
  const { t } = useTranslation()
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null)
  const [tab, setTab] = useState<'templates' | 'boards'>('templates')

  function useTemplate(tplId: string) {
    const tpl = TEMPLATES.find(x => x.id === tplId)
    if (!tpl) return
    onNew({ ...cloneTemplate(tpl), updatedAt: Date.now() })
  }

  function newBlank() {
    const board: KanbanBoard = {
      id: crypto.randomUUID(),
      name: t('home.default_board_name'),
      columns: [
        { id: crypto.randomUUID(), name: 'To Do', wipLimit: null, cards: [] },
        { id: crypto.randomUUID(), name: 'In Progress', wipLimit: null, cards: [] },
        { id: crypto.randomUUID(), name: 'Done', wipLimit: null, cards: [] },
      ],
      swimLanes: [],
      showWipWarnings: true,
      updatedAt: Date.now(),
    }
    onNew(board)
  }

  const principles = t('home.principlesList', { returnObjects: true }) as string[]

  return (
    <div className="space-y-8">
      <div className="text-center py-6">
        <div className="text-5xl mb-3">📋</div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{t('home.headline')}</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">{t('home.intro')}</p>
        <div className="mt-5 flex justify-center gap-3">
          <button type="button" onClick={newBlank} className="btn-primary">
            + {t('home.newBoard')}
          </button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        {(['templates', 'boards'] as const).map(tabId => (
          <button
            key={tabId}
            type="button"
            onClick={() => setTab(tabId)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === tabId
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tabId === 'templates' ? t('home.templates') : t('home.myBoards')}
            {tabId === 'boards' && boards.length > 0 && (
              <span className="ml-1.5 bg-brand-100 text-brand-700 text-xs rounded-full px-1.5">
                {boards.length}
              </span>
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
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800">{tpl.name}</h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {t(`templates.context.${tpl.contextKey}`)}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedTemplate(expandedTemplate === tpl.id ? null : tpl.id)
                        }
                        className="text-xs text-brand-600 hover:text-brand-800 underline"
                      >
                        {t('home.learnMore')}
                      </button>
                      <button
                        type="button"
                        onClick={() => useTemplate(tpl.id)}
                        className="bg-brand-600 hover:bg-brand-700 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                      >
                        {t('home.useTemplate')}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-1 mt-3 flex-wrap">
                    {tpl.columns.map(col => (
                      <span
                        key={col.id}
                        className="text-xs px-2 py-0.5 rounded-full border border-slate-200 bg-slate-50"
                      >
                        {col.name}
                        {col.wipLimit != null ? ` (${col.wipLimit})` : ''}
                      </span>
                    ))}
                  </div>
                </div>

                {expandedTemplate === tpl.id && (
                  <div className="border-t border-slate-100 p-4 bg-slate-50 text-sm text-slate-600">
                    {t(`templates.context.${tpl.contextKey}`)}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-brand-50 border border-brand-200 rounded-xl p-5">
            <h3 className="font-semibold text-brand-800 mb-2">{t('home.wipExplainer')}</h3>
            <p className="text-sm text-brand-700">{t('home.wipText')}</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-3">{t('learn.principles_title')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Array.isArray(principles) &&
                principles.map((p, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-brand-500 font-bold">{i + 1}.</span>
                    {p}
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
                <div
                  key={board.id}
                  className="bg-white border border-slate-200 rounded-lg px-4 py-3 flex items-center justify-between shadow-sm"
                >
                  <div className="min-w-0">
                    <span className="font-medium text-slate-800">{board.name}</span>
                    <span className="text-slate-400 text-xs ml-3">
                      {board.columns.length} {t('designer.total_columns')}{' '}
                      {board.updatedAt
                        ? `· ${new Date(board.updatedAt).toLocaleDateString()}`
                        : ''}
                    </span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onOpen(board.id)}
                      className="text-brand-600 hover:text-brand-800 text-sm font-medium px-3 py-1 rounded hover:bg-brand-50 transition-colors"
                    >
                      {t('home.continue')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(t('home.delete_confirm'))) onDelete(board.id)
                      }}
                      className="text-red-400 hover:text-red-600 text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors"
                    >
                      {t('home.delete')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
