import { Card } from '@caustic/react';

export function Bad() {
  return (
    <Card>
      <button type="button">Save</button>
      <input type="checkbox" />
      <input />
      <input type="hidden" name="id" />
      <select><option>a</option></select>
      <div role="tab">Tab</div>
      <div role="presentation">fine</div>
    </Card>
  );
}
