interface SectionBannerProps {
  message: string
}

export default function SectionBanner({ message }: SectionBannerProps) {
  return (
    <div className="flex items-start gap-2 bg-brand-mid text-white rounded-lg px-4 py-3 mb-5 text-sm">
      <svg className="shrink-0 mt-0.5 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
      </svg>
      <span className="italic font-light">{message}</span>
    </div>
  )
}
