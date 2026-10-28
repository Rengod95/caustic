import { Card } from '@caustic/react';

export function Bad() {
  return (
    <Card className="bg-[#ff0000] w-[37px] shadow-[0_1px_2px_rgba(0,0,0,0.2)] border-[1px] h-[var(--cs-control-md)] translate-y-[-0.5px]">
      <div style={{ color: 'red', width: 12, borderWidth: 1, display: 'grid', padding: '1rem 0' }}>a</div>
      <div style={{ '--swatch': '#ff0000', '--offset': '12px' } as React.CSSProperties}>b</div>
      <div className="[--gap:12px] content-['white'] bg-[linear-gradient(to_right,white,var(--cs-color-accent-solid))]">c</div>
      <div className="text-[16px] rounded-[28px] max-w-[42rem]" style={{ fontSize: 13 }}>d</div>
    </Card>
  );
}
