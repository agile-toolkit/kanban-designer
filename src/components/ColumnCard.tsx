import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { KanbanColumn } from '../types'

interface Props {
  column: KanbanColumn
  showWipWarnings: boolean
  onRename: (name: string) => void
  onWipChange: (limit: number | null) => void
  onDelete: () => void
  onAddCard: (title: string) => void
  onDeleteCard: (cardId: string) => void
}

export default function ColumnCard({
  column, showWipWarnings, onRename, onWipChange, onDelete, onAddCard, onDeleteCard,
}: Props) {
  const { t } = useTranslation()
  const [editName, setEditName] = useState(false)
  const [nameVal, setNameVal] = useState(column.name)
  const [addingCard, setAddingCard] = useState(false)
  const [cardTitle, setCardTitle] = useState('')

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: column.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const isOverWip = showWipWarnings && column.wipLimit !== null && column.cards.length > column.wipLimit

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex-shrink-0 w-56 bg-gray-50 rounded-2xl border-2 flex flex-col transition-colors ${
        isOverWip ? 'border-red-300 bg-red-50' : 'border-gray-200'
      }`}
    >
      {/* Header */}
      <div className="p-3 flex items-center gap-2" {...attributes} {...listeners}>
        <div className="cursor-grab text-gray-300 text-sm select-none">⠿</div>
        {editName ? (
          <input
            autoFocus
            className="flex-1 text-sm font-semibold bg-white border border-brand-300 rounded px-2 py-0.5 outline-none"
            placeholder={t('designer.column_name_placeholder')}
            value={nameVal}
            onChange={e => setNameVal(e.target.value)}
            onBlur={() => { onRename(nameVal || column.name); setEditName(false) }}
            onKeyDown={e => { if (e.key === 'Enter') { onRename(nameVal || column.name); setEditName(false) } }}
          />
        ) : (
          <span
            className="flex-1 text-sm font-semibold text-gray-800 cursor-pointer hover:text-brand-600 truncate"
            onDoubleClick={() => { setNameVal(column.name); setEditName(true) }}
            title={t('designer.rename')}
          >
            {column.name}
          </span>
        )}
        <span className={`text-xs font-medium px-1.5 py-0.5 rounded-lg ${isOverWip ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-500'}`}>
          {column.cards.length}{column.wipLimit !== null ? `/${column.wipLimit}` : ''}
        </span>
        <button onClick={onDelete} title={t('designer.delete_column')} className="text-gray-200 hover:text-red-400 text-xs ml-1">✕</button>
      </div>

      {isOverWip && (
        <div className="mx-3 mb-1 text-xs text-red-600 font-medium">{t('designer.wip_warning')}</div>
      )}

      {/* WIP limit */}
      <div className="px-3 pb-2 flex items-center gap-2">
        <span className="text-xs text-gray-400">{t('designer.wip_limit')}:</span>
        <input
          type="number"
          min={1}
          max={99}
          placeholder={t('designer.no_limit')}
          className="w-12 text-xs text-center border border-gray-200 rounded px-1 py-0.5 bg-white outline-none focus:border-brand-400"
          value={column.wipLimit ?? ''}
          onChange={e => onWipChange(e.target.value ? Number(e.target.value) : null)}
        />
      </div>

      {/* Cards */}
      <div className="flex-1 px-2 pb-2 space-y-1.5 min-h-[40px]">
        {column.cards.map(card => (
          <div key={card.id} className="bg-white rounded-lg border border-gray-200 px-2.5 py-2 text-xs flex items-start gap-2 group shadow-sm">
            <span className="flex-1 text-gray-700 leading-snug">{card.title}</span>
            <button
              onClick={() => onDeleteCard(card.id)}
              title={t('designer.delete_card')}
              className="flex-shrink-0 text-gray-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Add card */}
      <div className="p-2 border-t border-gray-200">
        {addingCard ? (
          <div>
            <input
              autoFocus
              className="w-full text-xs border border-brand-300 rounded px-2 py-1.5 outline-none mb-1.5"
              placeholder={t('designer.card_title_placeholder')}
              value={cardTitle}
              onChange={e => setCardTitle(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && cardTitle.trim()) {
                  onAddCard(cardTitle.trim())
                  setCardTitle('')
                  setAddingCard(false)
                }
                if (e.key === 'Escape') setAddingCard(false)
              }}
            />
            <div className="flex gap-1">
              <button
                onClick={() => { if (cardTitle.trim()) { onAddCard(cardTitle.trim()); setCardTitle('') }; setAddingCard(false) }}
                className="text-xs bg-brand-600 text-white px-2 py-1 rounded-lg"
              >Add</button>
              <button onClick={() => { setAddingCard(false); setCardTitle('') }} className="text-xs text-gray-400 px-2 py-1">✕</button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAddingCard(true)}
            className="w-full text-xs text-gray-400 hover:text-brand-600 text-left px-1 py-1 hover:bg-white rounded-lg transition-colors"
          >
            + {t('designer.add_card')}
          </button>
        )}
      </div>
    </div>
  )
}
