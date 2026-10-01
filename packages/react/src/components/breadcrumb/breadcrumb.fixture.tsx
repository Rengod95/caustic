import { House } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { Breadcrumb, BreadcrumbCurrent, BreadcrumbEllipsis, BreadcrumbItem, type BreadcrumbProps } from './breadcrumb.tsx';

export default defineFixture({
  id: 'breadcrumb',
  render: props => (
    <Breadcrumb {...(props as BreadcrumbProps)}>
      <BreadcrumbItem href="#" icon={<House />}>Orbit</BreadcrumbItem>
      <BreadcrumbItem href="#">Pricing refresh</BreadcrumbItem>
      <BreadcrumbItem href="#">Pages</BreadcrumbItem>
      <BreadcrumbCurrent>Pricing / Desktop</BreadcrumbCurrent>
    </Breadcrumb>
  ),
  examples: {
    trail: () => (
      <>
        <Breadcrumb>
          <BreadcrumbItem href="#" icon={<House />}>Orbit</BreadcrumbItem>
          <BreadcrumbItem href="#">Pricing refresh</BreadcrumbItem>
          <BreadcrumbItem href="#">Pages</BreadcrumbItem>
          <BreadcrumbCurrent>Pricing / Desktop</BreadcrumbCurrent>
        </Breadcrumb>
        <Breadcrumb>
          <BreadcrumbItem href="#">Orbit</BreadcrumbItem>
          <BreadcrumbEllipsis label="Show 3 more" />
          <BreadcrumbCurrent>Button / Primary</BreadcrumbCurrent>
        </Breadcrumb>
      </>
    ),
  },
});
