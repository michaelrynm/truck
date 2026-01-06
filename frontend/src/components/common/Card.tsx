import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
  noPadding?: boolean;
}

const Card = ({ title, subtitle, children, className = '', actions, noPadding = false }: CardProps) => {
  return (
    <div className={`bg-white border border-slate-200 rounded-lg shadow-card ${className}`}>
      {(title || actions) && (
        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-200 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            {title && <h3 className="text-sm md:text-base font-semibold text-slate-900">{title}</h3>}
            {subtitle && <p className="text-xs md:text-sm text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center space-x-2 flex-shrink-0">{actions}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-4 md:p-6'}>{children}</div>
    </div>
  );
};

export default Card;
