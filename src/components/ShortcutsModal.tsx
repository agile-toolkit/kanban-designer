import { useEffect } from 'react'
import { CloseIcon } from './icons'

interface ShortcutRow {
  keys: string
  label: string
}

interface ShortcutsModalProps {
  onClose: () => void
  title: string
  closeLabel: string
  navigationLabel: string
  cardActionsLabel: string
  boardActionsLabel: string
  mouseLabel: string
  navigationRows: ShortcutRow[]
  cardActionsRows: ShortcutRow[]
  boardActionsRows: ShortcutRow[]
  mouseRows: ShortcutRow[]
}

function ShortcutSection({ title, rows }: { title: string; rows: ShortcutRow[] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-2">{title}</h3>
      <dl className="space-y-1.5">
        {rows.map(row => (
          <div key={row.label} className="flex items-center justify-between gap-4 text-sm">
            <dt className="text-gray-600 dark:text-gray-300">{row.label}</dt>
            <dd className="flex gap-1">
              {row.keys.split('/').map(k => (
                <kbd
                  key={k}
                  className="px-1.5 py-0.5 text-xs font-mono bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-200"
                >
                  {k}
                </kbd>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default function ShortcutsModal({
  onClose,
  title,
  closeLabel,
  navigationLabel,
  cardActionsLabel,
  boardActionsLabel,
  mouseLabel,
  navigationRows,
  cardActionsRows,
  boardActionsRows,
  mouseRows,
}: ShortcutsModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-gray-50">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-5">
          <ShortcutSection title={navigationLabel} rows={navigationRows} />
          <ShortcutSection title={cardActionsLabel} rows={cardActionsRows} />
          <ShortcutSection title={boardActionsLabel} rows={boardActionsRows} />
          <ShortcutSection title={mouseLabel} rows={mouseRows} />
        </div>
      </div>
    </div>
  )
}
