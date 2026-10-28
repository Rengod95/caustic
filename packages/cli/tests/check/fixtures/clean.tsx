// Uses real components the way the showcase samples do; `caustic check` must report nothing here.
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import {
  Badge, Button, Card, CardBody, CardDescription, CardFooter, CardHeader, CardTitle, Checkbox, Field, IconButton, Input,
  Select, SelectOption, Switch, Tabs, TabsContent, TabsList, TabsTrigger, cn,
} from '@caustic/react';

function SettingRow({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="grid gap-0.5">
        <span className="text-ui-strong text-text-primary">{title}</span>
        <span className="text-ui text-text-secondary">{detail}</span>
      </div>
      <Switch aria-label={title} defaultChecked />
    </div>
  );
}

export function Clean({ dense }: { dense?: boolean }) {
  const [role, setRole] = useState('editor');
  return (
    <div className={cn('grid gap-4 p-4', dense && 'gap-2')} style={{ '--swatch': 'var(--cs-color-accent-solid)' } as React.CSSProperties}>
      <Card variant="surface" size="md">
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
          <CardDescription>Name and address of the workspace.</CardDescription>
        </CardHeader>
        <CardBody>
          <Field label="Workspace name">
            <Input defaultValue="Fieldnote Studio" />
          </Field>
          <Input size="sm" aria-label="Search members" prefix={<Search />} placeholder="Search members" />
          <Field label="Role">
            <Select aria-label="Invite role" value={role} onValueChange={setRole}>
              <SelectOption value="admin">Admin</SelectOption>
              <SelectOption value="editor">Editor</SelectOption>
            </Select>
          </Field>
          <Checkbox aria-label="Email digest" defaultChecked />
          <SettingRow title="Weekly digest" detail="Every Monday" />
        </CardBody>
        <CardFooter footer="end">
          <Badge tone="success" variant="soft">Active</Badge>
          <IconButton label="Add member" size="xs"><Plus /></IconButton>
          <Button tone="accent" variant="solid" data-testid="save" onClick={() => {}}>Save</Button>
        </CardFooter>
      </Card>
      <Tabs defaultValue="members" aria-label="Workspace sections">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="members">
          <span className="border-[1px] border-border-subtle bg-(--swatch) p-[var(--cs-space-4)]">Members</span>
        </TabsContent>
      </Tabs>
    </div>
  );
}
