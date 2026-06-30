interface MetricCardProps {
  title: string;
  icon: string;
  value: string | number;
  subtitle: string;
  subtitleColor?: string;
  valueColor?: string;
}

export default function MetricCard({ title, icon, value, subtitle, subtitleColor = "text-primary", valueColor = "text-on-surface" }: MetricCardProps) {
  return (
    <div className="bg-surface border border-border rounded-lg p-6 hover:border-border-bright transition-colors flex flex-col justify-between h-32">
      <div className="flex justify-between items-start">
        <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">{title}</span>
        <span className="material-symbols-outlined text-text-muted">{icon}</span>
      </div>
      <div className="flex items-end gap-3">
        <span className={`text-[32px] font-semibold leading-tight ${valueColor}`}>{value}</span>
        <span className={`text-sm font-medium ${subtitleColor}`}>{subtitle}</span>
      </div>
    </div>
  );
}
