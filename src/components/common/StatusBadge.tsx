import React from 'react';
import { ProjectStatus, LeadStatus, ChangeOrderStatus, Priority } from '../../types';

interface StatusBadgeProps {
  status: ProjectStatus | LeadStatus | ChangeOrderStatus | Priority | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const getBadgeStyles = () => {
    switch (status) {
      // Project statuses
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Planning':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Inspection':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'On Hold':
        return 'bg-rose-50 text-rose-700 border-rose-200';

      // Lead statuses
      case 'New':
        return 'bg-brand-50 text-brand-700 border-brand-200 font-semibold';
      case 'Contacted':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Site Visit Scheduled':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Estimate in Progress':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Estimate Sent':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Converted':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold';
      case 'Lost':
        return 'bg-slate-100 text-slate-600 border-slate-200';

      // Change order statuses
      case 'Draft':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Sent for Approval':
        return 'bg-amber-50 text-amber-700 border-amber-200 font-medium';
      case 'Approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold';
      case 'Rejected':
        return 'bg-red-50 text-red-700 border-red-200';

      // Priority
      case 'Urgent':
        return 'bg-brand-50 text-brand-700 border-brand-200 font-bold';
      case 'High':
        return 'bg-amber-50 text-amber-700 border-amber-200 font-medium';
      case 'Medium':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Low':
        return 'bg-slate-100 text-slate-600 border-slate-200';

      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs sm:text-sm';

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium tracking-tight whitespace-nowrap ${sizeClasses} ${getBadgeStyles()}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 mr-1.5 shrink-0" />
      {status}
    </span>
  );
};
