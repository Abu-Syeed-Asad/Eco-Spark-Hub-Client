import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import React from 'react';


export interface AppSubminButtonProps extends React.ComponentProps<typeof Button> {
  isPending: boolean;
  pendingLabel?: string;
}

const AppSubminButton = ({
  isPending,
  pendingLabel,
  children,
  className,
  type = 'submit',
  ...props
}: AppSubminButtonProps) => {
  return (
    <Button
      type={type}
      className={cn('w-full', className)}
      {...props}
    >
      {isPending ? (
        <>
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
          {pendingLabel ? pendingLabel : children}
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default AppSubminButton;