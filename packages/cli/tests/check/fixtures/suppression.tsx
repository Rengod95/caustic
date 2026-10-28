import { Card } from '@caustic/react';

export function Bad() {
  return (
    <Card>
      {/* caustic-disable-next-line token-literal: device frame of the phone mockup */}
      <div className="w-[390px]">a</div>
      {/* caustic-disable-next-line token-literal */}
      <div className="w-[391px]">b</div>
      {/* caustic-disable-next-line token-dark-variant: wrong rule listed */}
      <div className="w-[392px]">c</div>
    </Card>
  );
}
