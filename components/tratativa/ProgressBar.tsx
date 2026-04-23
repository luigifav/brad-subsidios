interface ProgressBarProps {
  totalSections: number
  completedSections: number
  labels: string[]
}

export default function ProgressBar({ totalSections, completedSections, labels }: ProgressBarProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-brand-dark">Progresso do formulário</span>
        <span className="text-sm text-brand-slate font-light">
          {completedSections} de {totalSections} seções concluídas
        </span>
      </div>
      <div className="relative flex items-center">
        {labels.map((label, i) => {
          const isCompleted = i < completedSections
          const isActive = i === completedSections
          return (
            <div key={i} className="flex-1 flex flex-col items-center relative">
              {i < labels.length - 1 && (
                <div
                  className={`absolute top-4 left-1/2 w-full h-0.5 ${
                    isCompleted ? 'bg-brand-mid' : 'bg-gray-200'
                  }`}
                />
              )}
              <div
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                  isCompleted
                    ? 'bg-brand-mid text-white'
                    : isActive
                    ? 'bg-brand-dark text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span className={`mt-2 text-xs text-center ${isCompleted || isActive ? 'text-brand-dark font-semibold' : 'text-brand-slate font-light'}`}>
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
