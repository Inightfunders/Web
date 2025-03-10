import React from 'react';

import { RoleSelectorItem } from '@/components/auth/role-selector/item';
import { cn } from '@/lib/utils';

export type Role = 'startup' | 'investor' | 'partner';

interface Props {
  className?: string;
  value: Role;
  onChange: (value: Role) => void;
}

export const RoleSelector: React.FC<Props> = ({
  className = '',
  value,
  onChange
}) => {
  return (
    <div
      className={cn(
        'flex flex-col space-y-3 justify-center items-center',
        className
      )}
    >
      <RoleSelectorItem
        className={cn('m-auto')}
        title="Borrower"
        description="I am a borrower, looking for funding."
        selected={value === 'startup'}
        value="startup"
        onSelected={(value) => onChange(value)}
      />
      <RoleSelectorItem
        className={cn('m-auto')}
        title="Lender"
        description="I am a lender, looking for deals."
        selected={value === 'investor'}
        value="investor"
        onSelected={(value) => onChange(value)}
      />
      <RoleSelectorItem
        className={cn('m-auto')}
        title="Partner"
        description="I am interested in becoming a referral partner"
        selected={value === 'partner'}
        value="partner"
        onSelected={(value) => onChange(value)}
      />
    </div>
  );
};
