import { House } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { Breadcrumb, BreadcrumbCurrent, BreadcrumbEllipsis, BreadcrumbItem, type BreadcrumbProps } from './breadcrumb.tsx';

export default defineFixture({
  id: 'breadcrumb',
  render: props => (
    <Breadcrumb aria-label="Breadcrumb" {...(props as Partial<BreadcrumbProps>)}>
      <BreadcrumbItem href="#" icon={<House />}>Orbit</BreadcrumbItem>
      <BreadcrumbItem href="#">Pricing refresh</BreadcrumbItem>
      <BreadcrumbItem href="#">Pages</BreadcrumbItem>
      <BreadcrumbCurrent>Pricing / Desktop</BreadcrumbCurrent>
    </Breadcrumb>
  ),
  examples: {
    trail: () => (
      <>
        <Breadcrumb aria-label="Breadcrumb">
          <BreadcrumbItem href="#" icon={<House />}>Orbit</BreadcrumbItem>
          <BreadcrumbItem href="#">Pricing refresh</BreadcrumbItem>
          <BreadcrumbItem href="#">Pages</BreadcrumbItem>
          <BreadcrumbCurrent>Pricing / Desktop</BreadcrumbCurrent>
        </Breadcrumb>
        <Breadcrumb aria-label="Breadcrumb">
          <BreadcrumbItem href="#">Orbit</BreadcrumbItem>
          <BreadcrumbEllipsis label="Show 3 more" />
          <BreadcrumbCurrent>Button / Primary</BreadcrumbCurrent>
        </Breadcrumb>
      </>
    ),
  },
});
