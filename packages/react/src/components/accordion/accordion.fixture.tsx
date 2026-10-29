import { Ruler, SwatchBook, Type } from '../../icons/index.ts';
import { defineFixture } from '../../lib/fixture.ts';
import { Badge } from '../badge/badge.tsx';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion.tsx';

export default defineFixture({
  id: 'accordion',
  render: props => (
    <div className="w-96">
      <Accordion {...props}>
        <AccordionItem value="agent">
          <AccordionTrigger icon={<SwatchBook />}>What can the agent change on its own?</AccordionTrigger>
          <AccordionContent>Layers inside the frame you are working on. Shared components, tokens and publishing always ask first.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="themes">
          <AccordionTrigger>How are themes kept accessible?</AccordionTrigger>
          <AccordionContent>Every color pairing is checked at build time in light and dark.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="export">
          <AccordionTrigger>Can I export to code?</AccordionTrigger>
          <AccordionContent>Yes. React and Tailwind exports go through a review step.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
  examples: {
    flush: () => (
      <Accordion type="single" defaultValue="agent">
        <AccordionItem value="agent">
          <AccordionTrigger>What can the agent change on its own?</AccordionTrigger>
          <AccordionContent>Layers inside the frame you are working on. Shared components, tokens and publishing always ask first.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="themes">
          <AccordionTrigger>How are themes kept accessible?</AccordionTrigger>
          <AccordionContent>Every color pairing is checked at build time in light and dark, across 24 accent hues. A failing pair stops the build.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="export">
          <AccordionTrigger>Can I export to code?</AccordionTrigger>
          <AccordionContent>Yes. React and Tailwind exports go through a review step before you download them.</AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
    separated: () => (
      <Accordion type="multiple" variant="separated" defaultValue={['typography']}>
        <AccordionItem value="color">
          <AccordionTrigger icon={<SwatchBook />} accessory={<Badge>71</Badge>}>Color</AccordionTrigger>
          <AccordionContent>Semantic colors for both themes, built on six OKLCH ramps.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="typography">
          <AccordionTrigger icon={<Type />} accessory={<Badge>15</Badge>}>Typography</AccordionTrigger>
          <AccordionContent>Fifteen roles in three families. Interface at 13/18, agent voice in Newsreader.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="space">
          <AccordionTrigger icon={<Ruler />} accessory={<Badge>26</Badge>}>Space &amp; radius</AccordionTrigger>
          <AccordionContent>A 4pt grid, concentric radii and two container insets.</AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
  },
});
