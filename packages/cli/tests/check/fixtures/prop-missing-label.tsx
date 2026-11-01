import { Plus } from '@caustic/react/icons';
import { Field, IconButton, Input, Switch } from '@caustic/react';

function NameInput() {
  return <Input defaultValue="x" />;
}

export function Bad() {
  return (
    <div>
      <IconButton><Plus /></IconButton>
      <div><Switch /></div>
      <Switch aria-label="Notifications" />
      <Field label="Name"><Input /></Field>
      <Field label="Other"><NameInput /></Field>
      <label>Plain <Input /></label>
      <IconButton label="Add"><Plus /></IconButton>
    </div>
  );
}
