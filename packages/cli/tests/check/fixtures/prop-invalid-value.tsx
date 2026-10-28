import { Button, Card } from '@caustic/react';

export function Bad({ quiet }: { quiet: boolean }) {
  return (
    <Card variant="surface" size="huge">
      <Button variant="solidd">One</Button>
      <Button variant={quiet ? 'ghost' : 'loud'}>Two</Button>
      <Button size={quiet ? 'sm' : 'md'} tone="accent">Three</Button>
    </Card>
  );
}
