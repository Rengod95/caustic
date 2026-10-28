import { Card, CardBody, CardHeader, CardTitle, TabsTrigger } from '@caustic/react';

function Header() {
  return <CardHeader><CardTitle>Inside via a local component</CardTitle></CardHeader>;
}

export function Bad() {
  return (
    <div>
      <section><CardTitle>Lost title</CardTitle></section>
      <Card>
        <Header />
        <CardBody>Fine</CardBody>
      </Card>
      <ul>{[1, 2].map(i => <li key={i}><CardBody>{i}</CardBody></li>)}</ul>
    </div>
  );
}

// Exported and returned at its root: it may be rendered inside <Tabs> in another file (advisory only).
export function Trigger() {
  return <TabsTrigger value="a">A</TabsTrigger>;
}
