import React from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Role } from '.';

interface Props {
  className?: string;
  title: string;
  description: string;
  selected: boolean;
  value: Role;
  onSelected: (value: Role) => void;
}

export const RoleSelectorItem: React.FC<Props> = ({
  className = '',
  title,
  description,
  selected,
  value,
  onSelected
}) => {
  return (
    <div
      className={cn(
        'm-auto flex justify-between items-start p-4 pb-6 gap-4 max-w-[360px] border-2 rounded-[12px] bg-white cursor-pointer selectcard',
        selected ? 'border-[#FF7A00]' : 'border-white',
        className
      )}
      onClick={() => onSelected(value)}
    >
      <div className="flex gap-4 pl-2 items-center">
        {selected ? (
          <CheckCircle2 size={24} fill="#FF7A00" stroke="#fff" />
        ) : (
          <Circle size={24} fill="#fff" stroke="#00000080" />
        )}
        <div className="flex flex-col gap-1">
          <p className="text-black font-semibold text-base">{title}</p>
          <p className="text-black text-xs leading-5">{description}</p>
        </div>
      </div>
      <input
        className="hidden"
        type="radio"
        name="role"
        value={value}
        checked={selected}
        onChange={() => onSelected(value)}
      />
    </div>
  );
};
