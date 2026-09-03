import { useTranslation } from 'react-i18next'
import type { KanbanBoard } from '../types'
import { CloseIcon } from './icons'

interface Props {
  board: KanbanBoard
  onClose: () => void
}

export default function StatsPanel({ board, onClose }: Props) {
  const { t } = useTranslation()

  const totalCards = board.columns.reduce((s, c) => s + c.cards.length, 0)
  const atCapacity = board.columns.filter(c => c.wipLimit !== null && c.cards.length >= c.wipLimit).length
  const emptyColumns = board.columns.filter(c => c.cards.length === 0).length
  const lastColumn = board.columns[board.columns.length - 1]
  const completionRate = totalCards > 0 && lastColumn
    ? Math.round((lastColumn.cards.length / totalCards) * 100)
    : 0
  const maxCount = Math.max(1, ...board.columns.map(c => c.cards.length))

  return (
    <div className="fixed inset-0 z-40 flex justify-end" role="dialog" aria-label={t('stats.title')}>
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 h-full overflow-y-auto p-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50">{t('stats.title')}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('stats.close')}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-200 text-sm"
          >
            <CloseIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-5">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-50">{totalCards}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{t('stats.total_cards')}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-50">{completionRate}%</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{t('stats.completion_rate')}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
            <div className={`text-lg font-semibold ${atCapacity > 0 ? 'text-red-500' : 'text-gray-900 dark:text-gray-50'}`}>
              {atCapacity}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{t('stats.at_capacity')}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-50">{emptyColumns}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{t('stats.empty_columns')}</div>
          </div>
        </div>

        <div className="space-y-3">
          {board.columns.map(col => {
            const ratio = col.wipLimit ? col.cards.length / col.wipLimit : col.cards.length / maxCount
            const fillPct = Math.min(ratio * 100, 100)
            const barClass = col.wipLimit
              ? ratio >= 1 ? 'bg-red-500' : ratio >= 0.9 ? 'bg-orange-400' : ratio >= 0.6 ? 'bg-amber-400' : 'bg-green-400'
              : 'bg-brand-400'
            const oldest = col.cards[0]
            return (
              <div key={col.id}>
                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300 mb-1">
                  <span className="font-medium truncate">{col.name}</span>
                  <span>{col.cards.length}{col.wipLimit !== null ? `/${col.wipLimit}` : ''}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded" style={{ height: 6 }}>
                  <div className={`h-full rounded transition-all duration-300 ${barClass}`} style={{ width: `${fillPct}%` }} />
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">
                  {t('stats.oldest_card')}: {oldest ? oldest.title : '—'}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
