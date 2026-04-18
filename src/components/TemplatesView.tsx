import { useTranslation } from 'react-i18next'
import { TEMPLATES, cloneTemplate } from '../data/templates'
import type { KanbanBoard } from '../types'

interface Props {
  onLoad: (board: KanbanBoard) => void
}

export default function TemplatesView({ onLoad }: Props) {
  const { t } = useTranslation()

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('templates.title')}</h1>
      <p className="text-gray-500 text-sm mb-6">{t('templates.subtitle')}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TEMPLATES.map(template => (
          <div key={template.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{template.name}</h3>
              <button
                onClick={() => onLoad(cloneTemplate(template))}
                className="btn-primary text-xs py-1 px-3 flex-shrink-0 ml-2"
              >
                {t('templates.load')}
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-3 leading-relaxed">
              {t(`templates.context.${template.contextKey}`)}
            </p>

            {/* Mini board preview */}
            <div className="flex gap-1 flex-wrap">
              {template.columns.map(col => (
                <div key={col.id} className="flex items-center gap-1 bg-gray-100 rounded px-1.5 py-0.5">
                  <span className="text-xs text-gray-600">{col.name}</span>
                  {col.wipLimit !== null && (
                    <span className="text-xs text-brand-600 font-medium">({col.wipLimit})</span>
                  )}
                </div>
              ))}
            </div>

            {template.swimLanes.length > 0 && (
              <div className="flex gap-1 mt-1.5">
                {template.swimLanes.map(lane => (
                  <span key={lane} className="text-xs bg-orange-100 text-orange-700 rounded px-1.5 py-0.5">{lane}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
