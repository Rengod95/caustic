import { Card, cn } from '@caustic/react';

export function Bad({ active }: { active: boolean }) {
  return (
    <Card className="bg-red-500 text-primary card-title top-bar">
      <div className={cn('p-4', active && 'text-sm', { 'leading-tight': active })}>a</div>
      <div className="md:p-4 hover:bg-surface-base">b</div>
      <div className={`flex ${active ? 'bg-surface-base' : 'bg-surfase-base'} gap-${active ? 2 : 4} rounded-xl`}>c</div>
    </Card>
  );
}
