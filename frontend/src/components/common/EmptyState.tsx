import { ReactNode } from 'react';
import { FileText } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

const EmptyState = ({ title, description, action, icon }: EmptyStateProps) => {
  return (
    <div className="text-center py-16 px-4">
      <div className="flex justify-center mb-4">
        {icon || (
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center">
            <FileText className="w-7 h-7 text-slate-400" />
          </div>
        )}
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;
