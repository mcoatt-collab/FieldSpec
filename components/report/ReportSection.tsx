interface ReportSectionProps {
  title: string;
  content: string;
  className?: string;
}

export default function ReportSection({ title, content, className = "" }: ReportSectionProps) {
  return (
    <div className={`bg-white rounded-lg border border-neutral-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-neutral-900 mb-3">{title}</h3>
      <div className="prose prose-sm max-w-none text-neutral-700">
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}
