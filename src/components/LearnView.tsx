import { useTranslation } from 'react-i18next'

const PRINCIPLES = ['p1', 'p2', 'p3', 'p4', 'p5'] as const

export default function LearnView() {
  const { t } = useTranslation()

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t('learn.title')}</h1>
      {[
        { key: 'wip', icon: '🚦' },
        { key: 'flow', icon: '🌊' },
      ].map(s => (
        <div key={s.key} className="card">
          <div className="flex gap-3">
            <span className="text-2xl">{s.icon}</span>
            <div>
              <h2 className="font-semibold text-gray-900 mb-2">{t(`learn.${s.key}_title`)}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{t(`learn.${s.key}_body`)}</p>
            </div>
          </div>
        </div>
      ))}
      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-3">{t('learn.principles_title')}</h2>
        <ol className="space-y-2">
          {PRINCIPLES.map((p, i) => (
            <li key={p} className="flex gap-3 text-sm text-gray-600">
              <span className="flex-shrink-0 w-5 h-5 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-xs font-semibold">{i+1}</span>
              {t(`learn.${p}`)}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
