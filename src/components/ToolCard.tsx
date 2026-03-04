interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  iconPath: string;
  accentColor: string;
  badge?: string;
}

export default function ToolCard({ title, description, href, iconPath, accentColor, badge }: ToolCardProps) {
  return (
    <a
      href={href}
      className="glass-card group relative flex flex-col gap-4 rounded-2xl p-6 sm:p-8 hover:border-[var(--color-border-glow)] transition-all duration-300"
    >
      {badge && (
        <span
          className="absolute top-4 right-4 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white"
          style={{ backgroundColor: accentColor }}
        >
          {badge}
        </span>
      )}
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
        </svg>
      </div>
      <div>
        <h3
          className="text-lg font-bold text-[var(--color-text-primary)] mb-1"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {title}
        </h3>
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{description}</p>
      </div>
      <div className="mt-auto flex items-center gap-1 text-sm font-medium transition-colors" style={{ color: accentColor }}>
        Try it free
        <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  );
}
