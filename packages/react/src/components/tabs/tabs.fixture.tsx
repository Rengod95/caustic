import { defineFixture } from '../../lib/fixture.ts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs.tsx';

export default defineFixture({
  id: 'tabs',
  render: props => (
    <Tabs defaultValue="components" {...props}>
      <TabsList aria-label="Library">
        <TabsTrigger value="tokens" count="128">Tokens</TabsTrigger>
        <TabsTrigger value="components" count="42">Components</TabsTrigger>
        <TabsTrigger value="assets">Assets</TabsTrigger>
      </TabsList>
      <TabsContent value="tokens" className="pt-3 text-ui text-text-secondary">Color, type and space tokens.</TabsContent>
      <TabsContent value="components" className="pt-3 text-ui text-text-secondary">Buttons, fields and menus.</TabsContent>
      <TabsContent value="assets" className="pt-3 text-ui text-text-secondary">Icons and images.</TabsContent>
    </Tabs>
  ),
  examples: {},
});
