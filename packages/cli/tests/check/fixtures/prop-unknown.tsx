import { Button, Card as Box, Card, CardHeader } from '@caustic/react';

export function Bad() {
  return (
    <Box colour="red" data-x="1" aria-busy id="c" onPointerEnter={() => {}}>
      <Card.Header bogus="1" />
      <CardHeader headerAlign="center" />
      <Button tone="accent" tonne="accent" type="button" disabled title="Save">Save</Button>
    </Box>
  );
}
