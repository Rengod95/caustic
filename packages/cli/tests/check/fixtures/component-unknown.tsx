import { Button, Buton, FancyCard, cn, type ButtonProps } from '@caustic/react';

export function Bad(props: ButtonProps) {
  return <Button {...props} className={cn('p-4')}><Buton /><FancyCard /></Button>;
}
