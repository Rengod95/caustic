import {
  AlignCenterVertical, AlignEndVertical, AlignStartVertical, BatteryFull, Camera, Check, ChevronLeft, ChevronRight, ClipboardCheck, Component,
  Droplet, Ellipsis, File as FileIcon, FileText, Frame, Hand, Image as ImageIcon, Mic, MessageCircle, Minus, MousePointer2, NotebookPen,
  PenTool, Plus, Redo2, Rows3, Scan, Search, Share2, Signal, Square, SquareStack, Type, Undo2, WandSparkles, Wifi,
} from 'lucide-react';
import {
  AgentCursor, AppShell, AppShellEnd, AppShellOverlay, AppShellStage, AppShellStart, AppShellTitlebar, AutoLayout,
  Avatar, Badge, Button, ButtonGroup, CanvasArtboard, CanvasGuide, CanvasHint, CanvasHintItem, CanvasRuler, CanvasSelection, CanvasComment, CanvasCommentBubble,
  CornerRadius, FloatingBar, FloatingBarItem, FloatingBarSeparator, FrameLabel, IconButton, Input, InspectorPanel, InspectorSection,
  InspectorSectionHeader, LayerTree, LayerTreeItem, ListNavigation, ListNavigationGroup, ListNavigationItem, NumberField, PositionSize, PropertyStack, SectionHeader, SegmentedControl,
  SegmentedControlItem, SidePanel, Slider, Switch, Tabs, TabsContent, TabsList, TabsTrigger, Tooltip, ZoomControl, defaultAutoLayout,
  type AutoLayoutLabels, type CornerRadiusLabels, type LayerTreeAnnouncement, type PositionSizeLabels, type PropertyStackLabels,
} from '@caustic/react';
import type { ReactNode } from 'react';

// Design frames are 390 x 844 and shown at 50% zoom. Canvas positions are px from the stage origin.
const FRAME_W = 390;
const FRAME_H = 844;
const ZOOM = 0.5;
const FW = FRAME_W * ZOOM;
const FH = FRAME_H * ZOOM;
const TOP = 116;
const X1 = 40;
const X2 = 271;
const X3 = 502;

const rulerX = [0, 1, 2, 3, 4, 5].map(k => ({ at: X1 - 20 + k * 100, label: String(k * 200) }));
const rulerY = [0, 1, 2, 3, 4].map(k => ({ at: TOP - 20 + k * 100, label: String(k * 200) }));

const psLabels: PositionSizeLabels = {
  x: 'X', y: 'Y', width: 'Width', height: 'Height', rotation: 'Rotation', xShort: 'X', yShort: 'Y', widthShort: 'W', heightShort: 'H',
  lockRatio: 'Lock aspect ratio', flipX: 'Flip horizontal', flipY: 'Flip vertical', flipXShort: 'H', flipYShort: 'V', constraints: 'Constraints',
  mode: { fixed: 'Fixed', hug: 'Hug', fill: 'Fill' },
  widthSizing: mode => `Width sizing: ${mode === 'fill' ? 'Fill' : mode === 'hug' ? 'Hug' : 'Fixed'}`,
  heightSizing: mode => `Height sizing: ${mode === 'fill' ? 'Fill' : mode === 'hug' ? 'Hug' : 'Fixed'}`,
  mixed: 'Mixed',
};

const alLabels: AutoLayoutLabels = {
  flowGroup: 'Flow',
  flow: { free: 'Free', row: 'Horizontal', column: 'Vertical', grid: 'Grid' },
  pad: 'Alignment',
  padCells: {
    'top-left': 'Top left', 'top-center': 'Top center', 'top-right': 'Top right',
    'middle-left': 'Middle left', 'middle-center': 'Middle center', 'middle-right': 'Middle right',
    'bottom-left': 'Bottom left', 'bottom-center': 'Bottom center', 'bottom-right': 'Bottom right',
  },
  gap: 'Gap',
  distribution: 'Distribution',
  distributionOptions: { packed: 'Packed', 'space-between': 'Space between' },
  wrap: 'Wrap',
  paddingTitle: 'Padding',
  paddingModeGroup: 'Padding mode',
  paddingMode: { all: 'All', axes: 'Axes', sides: 'Sides' },
  paddingAll: 'Padding',
  paddingHorizontal: 'Horizontal padding',
  paddingVertical: 'Vertical padding',
  paddingTop: 'Top padding',
  paddingRight: 'Right padding',
  paddingBottom: 'Bottom padding',
  paddingLeft: 'Left padding',
  clip: 'Clip content',
  tracksHeading: 'Grid tracks',
  addTrack: 'Add column',
  track: n => `Track ${n}`,
  trackUnit: n => `Track ${n} unit`,
  trackRemove: n => `Remove track ${n}`,
  trackAuto: 'Auto',
  mixed: 'Mixed',
};

const ccLabels: CornerRadiusLabels = {
  radius: 'Corner radius', smoothing: 'Corner smoothing', independent: 'Independent corners',
  topLeft: 'Top left', topRight: 'Top right', bottomLeft: 'Bottom left', bottomRight: 'Bottom right', mixed: 'Mixed',
};

const esLabels: PropertyStackLabels = {
  list: 'Effects', hide: n => `Hide ${n}`, show: n => `Show ${n}`, remove: n => `Remove ${n}`, moveUp: n => `Move ${n} up`, moveDown: n => `Move ${n} down`,
};

const paintLabels: PropertyStackLabels = {
  list: 'Fill layers', styles: 'Styles', add: 'Add fill', mixedPaints: 'Mixed paints', replaceAll: 'Replace all',
  hide: 'Hide', show: 'Show', remove: 'Remove', moveUp: 'Move up', moveDown: 'Move down', opacity: 'Opacity', mixed: 'Mixed',
};

const announce = (event: LayerTreeAnnouncement) => ('names' in event ? `${event.type}: ${event.names.join(', ')}` : 'Move cancelled');

function StatusBar() {
  return (
    <div className="flex h-11 flex-none items-center justify-between px-7 text-[16px] font-semibold tabular-nums">
      <span>9:41</span>
      <span className="flex items-center gap-1.5">
        <Signal className="size-4" />
        <Wifi className="size-4" />
        <BatteryFull className="size-5" />
      </span>
    </div>
  );
}

function HomeIndicator() {
  return <span aria-hidden className="absolute bottom-2 left-1/2 h-1.5 w-32 -translate-x-1/2 rounded-full bg-ink-solid" />;
}

/** One 390 x 844 mobile frame drawn at 50% on the canvas. The mock keeps design-size type and spacing. */
function Phone({ left, top, children }: { left: number; top: number; children: ReactNode }) {
  return (
    <CanvasArtboard rect={{ left, top, width: FW, height: FH }} className="overflow-hidden">
      <div className="absolute top-0 left-0 h-[844px] w-[390px] origin-top-left scale-50 font-ui text-ink-solid">{children}</div>
    </CanvasArtboard>
  );
}

function Welcome() {
  const wave = [6, 12, 18, 10, 22, 14, 8, 16, 12, 20, 9, 6];
  return (
    <div className="relative h-full">
      <div className="relative h-[380px] overflow-hidden rounded-b-[36px] [background-image:var(--cs-spectrum-linear)]">
        <div className="absolute -top-24 -right-16 size-72 rounded-full bg-chart-2/50 blur-2xl" />
        <div className="absolute -bottom-28 -left-12 size-72 rounded-full bg-chart-4/50 blur-2xl" />
        <div className="absolute top-[92px] left-[40px] w-[300px] -rotate-3 rounded-[28px] bg-canvas-artboard p-6 shadow-2">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-accent-solid" />
            <span className="text-[17px] font-semibold">Mill Rd · Site 14</span>
            <Check className="ml-auto size-4 text-accent-text" />
          </div>
          <div className="mt-5 h-2.5 w-full rounded-full bg-ink-solid/12" />
          <div className="mt-2.5 h-2.5 w-4/5 rounded-full bg-ink-solid/12" />
          <div className="mt-2.5 h-2.5 w-3/5 rounded-full bg-ink-solid/12" />
          <div className="mt-5 h-24 rounded-2xl [background-image:linear-gradient(135deg,var(--cs-color-chart-2),var(--cs-color-chart-3))]" />
        </div>
        <div className="absolute right-[28px] bottom-[64px] flex items-center gap-2.5 rounded-full bg-ink-solid px-4 py-2.5 text-ink-on shadow-2">
          <Mic className="size-4" />
          <span className="flex h-5 items-end gap-[3px]">
            {wave.map((h, i) => <span key={i} className="w-[3px] rounded-full bg-ink-on" style={{ height: h }} />)}
          </span>
          <span className="text-[14px] tabular-nums">0:42</span>
        </div>
      </div>
      <div className="flex h-[464px] flex-col px-7 pt-7 pb-9">
        <h2 className="text-[38px] leading-[1.05] font-semibold tracking-[-0.02em]">Capture every field note.</h2>
        <p className="mt-4 text-[17px] leading-[1.5] text-ink-solid/70">Photos, voice memos and checklists, synced to your crew as soon as you have signal.</p>
        <div className="mt-auto flex flex-col gap-4">
          <div className="flex justify-center gap-1.5">
            <span className="h-1.5 w-5 rounded-full bg-ink-solid" />
            <span className="size-1.5 rounded-full bg-ink-solid/20" />
            <span className="size-1.5 rounded-full bg-ink-solid/20" />
          </div>
          <Button tone="accent" size="lg" shape="pill" className="w-full justify-center">Get started</Button>
          <p className="text-center text-[16px] font-medium text-ink-solid/70">I already have an account</p>
        </div>
      </div>
      <HomeIndicator />
    </div>
  );
}

function GoalCard({ icon, title, body, on, badge }: { icon: ReactNode; title: string; body: string; on?: boolean; badge?: string }) {
  return (
    <div className={`flex items-center gap-3.5 rounded-2xl border p-4 ${on ? 'border-accent-solid bg-accent-soft' : 'border-ink-solid/15'}`}>
      <span className="flex size-11 flex-none items-center justify-center rounded-xl bg-canvas-artboard text-accent-text shadow-1 [&_svg]:size-5">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="text-[18px] font-semibold">{title}</span>
          {badge && <Badge tone="accent">{badge}</Badge>}
        </span>
        <span className="mt-0.5 block text-[14px] text-ink-solid/65">{body}</span>
      </span>
      {on
        ? <span className="flex size-6 flex-none items-center justify-center rounded-full bg-accent-solid text-accent-on"><Check className="size-3.5" /></span>
        : <span className="size-6 flex-none rounded-full border-2 border-ink-solid/25" />}
    </div>
  );
}

function Goals() {
  return (
    <div className="relative h-full">
      <div className="flex h-full flex-col px-6 pb-9">
        <StatusBar />
        <div className="mt-3 flex items-center gap-3">
          <span className="flex size-10 flex-none items-center justify-center rounded-full bg-ink-solid/8"><ChevronLeft className="size-5" /></span>
          <div className="flex flex-1 gap-1.5">
            <span className="h-1.5 flex-1 rounded-full bg-accent-solid" />
            <span className="h-1.5 flex-1 rounded-full bg-accent-solid" />
            <span className="h-1.5 flex-1 rounded-full bg-ink-solid/12" />
          </div>
        </div>
        <p className="mt-7 text-[14px] font-medium text-accent-text">Step 2 of 3</p>
        <h2 className="mt-2 text-[32px] leading-[1.1] font-semibold tracking-[-0.02em]">What do you want to track?</h2>
        <p className="mt-3 text-[17px] leading-[1.5] text-ink-solid/70">Pick a few. You can change them later.</p>
        <div className="mt-7 flex flex-col gap-3">
          <GoalCard icon={<Camera />} title="Site inspections" body="Walkthroughs with photos" on badge="Popular" />
          <GoalCard icon={<ClipboardCheck />} title="Safety checklists" body="Daily and weekly sign-offs" on />
          <GoalCard icon={<FileText />} title="Daily reports" body="Summaries for the office" />
        </div>
        <div className="mt-auto">
          <Button tone="accent" size="lg" shape="pill" className="w-full justify-center">Continue</Button>
        </div>
      </div>
      <HomeIndicator />
    </div>
  );
}

function Invite() {
  return (
    <div className="relative h-full">
      <div className="flex h-full flex-col px-6 pb-9">
        <StatusBar />
        <div className="mt-3 flex items-center justify-between">
          <span className="flex size-10 items-center justify-center rounded-full bg-ink-solid/8"><ChevronLeft className="size-5" /></span>
          <span className="text-[16px] font-medium text-accent-text">Skip</span>
        </div>
        <h2 className="mt-7 text-[32px] leading-[1.1] font-semibold tracking-[-0.02em]">Invite your crew</h2>
        <p className="mt-3 text-[17px] leading-[1.5] text-ink-solid/70">People you add can capture notes on this project.</p>
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-ink-solid/15 px-4 py-3.5">
          <Search className="size-5 text-ink-solid/60" />
          <span className="text-[17px]">mina@northfield.co</span>
          <span className="ml-auto text-[15px] font-semibold text-accent-text">Add</span>
        </div>
        <div className="mt-5 flex -space-x-2">
          <Avatar name="Mina Kim" size="md" color="coral" className="ring-2 ring-canvas-artboard" />
          <Avatar name="Jonas Berg" size="md" color="iris" className="ring-2 ring-canvas-artboard" />
          <Avatar name="Sam Ortiz" size="md" color="mint" className="ring-2 ring-canvas-artboard" />
          <Avatar name="Priya Rao" size="md" color="amber" className="ring-2 ring-canvas-artboard" />
        </div>
        <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-ink-solid/15 p-4">
          <span>
            <span className="block text-[17px] font-semibold">Share site photos</span>
            <span className="block text-[14px] text-ink-solid/65">The crew sees Mill Rd photos</span>
          </span>
          <Switch defaultChecked aria-label="Share site photos" />
        </div>
        <div className="mt-auto">
          <Button tone="accent" size="lg" shape="pill" className="w-full justify-center" iconStart={<Share2 />}>Send invites</Button>
        </div>
      </div>
      <HomeIndicator />
    </div>
  );
}

export default function Sample() {
  return (
    <div className="h-[calc(100vh-6.5rem)] min-h-[46rem] w-full min-w-0">
      <AppShell skipLabel="Skip to canvas">
        <AppShellTitlebar className="min-w-0">
          <span className="flex size-7 flex-none items-center justify-center rounded-lg bg-accent-solid text-accent-on">
            <NotebookPen className="size-4" />
          </span>
          <span className="font-ui text-title-4 text-text-primary">Fieldnote</span>
          <ChevronRight className="size-3.5 flex-none text-text-tertiary group-data-[layout=compact]/app-shell:hidden" />
          <span className="truncate text-ui text-text-secondary group-data-[layout=compact]/app-shell:hidden">Onboarding flow</span>
          <Badge tone="success" dot className="group-data-[layout=compact]/app-shell:hidden">Synced</Badge>
          <span className="mx-1 h-5 w-px flex-none bg-border-default group-data-[layout=compact]/app-shell:hidden" />
          <Tooltip content="Undo" shortcut="⌘Z" side="bottom" inline defaultOpen>
            <IconButton size="sm" label="Undo"><Undo2 /></IconButton>
          </Tooltip>
          <IconButton size="sm" label="Redo"><Redo2 /></IconButton>
          <span className="flex-1" />
          <SegmentedControl size="md" aria-label="Mode" defaultValue="design" className="group-data-[layout=compact]/app-shell:hidden">
            <SegmentedControlItem value="design">Design</SegmentedControlItem>
            <SegmentedControlItem value="prototype">Prototype</SegmentedControlItem>
            <SegmentedControlItem value="code" count="3">Code</SegmentedControlItem>
          </SegmentedControl>
          <span className="flex-1" />
          <span className="flex -space-x-1.5 group-data-[layout=compact]/app-shell:hidden">
            <Avatar name="Mina Kim" size="sm" color="coral" className="ring-2 ring-bg-app" />
            <Avatar name="Jonas Berg" size="sm" color="iris" className="ring-2 ring-bg-app" />
            <Avatar name="Sam Ortiz" size="sm" color="mint" className="ring-2 ring-bg-app" />
          </span>
          <Button tone="accent" size="sm" shape="pill" iconStart={<Share2 />}>Share</Button>
        </AppShellTitlebar>

        <AppShellStart>
          <Tabs defaultValue="layers" className="flex min-h-0">
            <SidePanel
              label="Pages and layers"
              size="inspector"
              width={240}
              collapseLabel="Hide layers panel"
              className="group-data-[layout=compact]/app-shell:hidden"
              header={(
                <TabsList aria-label="Left panel">
                  <TabsTrigger value="layers" count="14">Layers</TabsTrigger>
                  <TabsTrigger value="assets" count="9">Assets</TabsTrigger>
                </TabsList>
              )}
            >
              <TabsContent value="layers" className="flex flex-col gap-3 p-2">
                <ListNavigation aria-label="Pages" kind="pages">
                  <ListNavigationGroup heading="Pages" addLabel="Add page">
                    <ListNavigationItem icon={<FileIcon />} current count="3 frames">Onboarding</ListNavigationItem>
                    <ListNavigationItem icon={<FileIcon />} count="18 parts">Components</ListNavigationItem>
                    <ListNavigationItem icon={<FileIcon />} count="6 frames">Explorations</ListNavigationItem>
                  </ListNavigationGroup>
                </ListNavigation>
                <Input appearance="sunken" prefix={<Search aria-hidden className="size-icon-sm" />} placeholder="Filter layers" aria-label="Filter layers" />
                <LayerTree
                  aria-label="Layers"
                  announce={announce}
                  visibilityLabel={(name, hidden) => `${hidden ? 'Show' : 'Hide'} ${name}`}
                  lockLabel={(name, locked) => `${locked ? 'Unlock' : 'Lock'} ${name}`}
                  stateLabels={{ hidden: 'hidden', locked: 'locked', agent: 'edited by the agent' }}
                  defaultValue={['welcome']}
                >
                  <LayerTreeItem itemId="welcome" depth={0} icon={<Frame />} label="Onboarding / Welcome" expandable open />
                  <LayerTreeItem itemId="hero" depth={1} icon={<ImageIcon />} label="Hero image" />
                  <LayerTreeItem itemId="headline" depth={1} icon={<Type />} label="Headline" />
                  <LayerTreeItem itemId="body" depth={1} icon={<Type />} label="Body copy" />
                  <LayerTreeItem itemId="cta" depth={1} icon={<Component />} label="CTA button" tag="Instance" />
                  <LayerTreeItem itemId="grain" depth={1} icon={<Square />} label="Grain overlay" invisible />
                  <LayerTreeItem itemId="goals" depth={0} icon={<Frame />} label="Onboarding / Goals" expandable />
                  <LayerTreeItem itemId="invite" depth={0} icon={<Frame />} label="Onboarding / Invite" expandable open agent />
                  <LayerTreeItem itemId="invite-list" depth={1} icon={<Rows3 />} label="Invite list" caption="auto · 4" agent />
                  <LayerTreeItem itemId="share" depth={1} icon={<Square />} label="Share toggle" />
                </LayerTree>
              </TabsContent>
              <TabsContent value="assets" className="flex flex-col gap-2 p-2">
                <SectionHeader size="sm" divided headingLevel={3} title="Brand" description="Shared by all onboarding frames." />
                <div className="flex items-center gap-3 rounded-lg px-2 py-2 text-ui text-text-primary">
                  <span className="size-8 rounded-md [background-image:var(--cs-spectrum-linear)]" />
                  <span>Spectrum / Hero</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg px-2 py-2 text-ui text-text-primary">
                  <span className="size-8 rounded-md bg-accent-solid" />
                  <span>accent / solid</span>
                </div>
              </TabsContent>
            </SidePanel>
          </Tabs>
        </AppShellStart>

        <AppShellStage stageLabel="Onboarding canvas">
          <div className="canvas-grid absolute inset-0 [background-size:var(--cs-space-4)_var(--cs-space-4)]" />
          <CanvasRuler orientation="corner" />
          <CanvasRuler orientation="horizontal" marks={rulerX} band={{ start: X1 - 20, size: FW }} />
          <CanvasRuler orientation="vertical" marks={rulerY} band={{ start: TOP - 20, size: FH }} />

          <FrameLabel kind="artboard" selected name="Onboarding / Welcome" size="390 × 844" rect={{ left: X1, top: TOP - 24 }} />
          <FrameLabel kind="artboard" name="Onboarding / Goals" size="390 × 844" rect={{ left: X2, top: TOP - 24 }} />
          <FrameLabel kind="artboard" name="Onboarding / Invite" size="390 × 844" rect={{ left: X3, top: TOP - 24 }} />

          <Phone left={X1} top={TOP}><Welcome /></Phone>
          <Phone left={X2} top={TOP}><Goals /></Phone>
          <Phone left={X3} top={TOP}><Invite /></Phone>

          <CanvasSelection handles="all" dragging label="390 × 844" rect={{ left: X1, top: TOP, width: FW, height: FH }} />
          <CanvasGuide kind="measure" orientation="horizontal" rect={{ left: X1 + FW, top: TOP + 200, width: X2 - X1 - FW }}>72</CanvasGuide>
          <CanvasGuide kind="smart" orientation="vertical" rect={{ left: X2 + FW / 2, top: TOP, height: FH }} />

          <CanvasComment label="Comment by Mina Kim" initials="MK" rect={{ left: X2 + 168, top: TOP + 272 }} open>
            {/* The bubble sits below-left of the pin here: rect is relative to the pin (X2 + 14, TOP + 298 on the canvas). */}
            <CanvasCommentBubble authorName="Mina" rect={{ left: -154, top: 26 }}>Can Continue move lower for thumbs?</CanvasCommentBubble>
          </CanvasComment>
          <AgentCursor name="Caustic" rect={{ left: X2 + FW + 6, top: TOP + 214 }} />
          <div
            className="absolute flex w-44 flex-col gap-1.5 rounded-md bg-warning-soft p-3 text-[13px] leading-snug text-text-primary shadow-2"
            style={{ left: X2, top: TOP + FH + 52 }}
          >
            <span className="flex items-center gap-1.5 text-[12px] font-semibold text-text-secondary">
              <Avatar name="Sam Ortiz" size="xs" color="mint" />
              Sam · 2h ago
            </span>
            Check the CTA on a 360px Android.
          </div>

          <AppShellOverlay>
            <div className="absolute inset-x-0 top-9 flex justify-center">
              <FloatingBar label="Canvas tools" size="sm">
                <FloatingBarItem aria-label="Move V" icon={<MousePointer2 />} shortcut="V" active />
                <FloatingBarItem aria-label="Hand H" icon={<Hand />} shortcut="H" />
                <FloatingBarSeparator />
                <FloatingBarItem aria-label="Frame F" icon={<Frame />} shortcut="F" />
                <FloatingBarItem aria-label="Rectangle R" icon={<Square />} shortcut="R" />
                <FloatingBarItem aria-label="Text T" icon={<Type />} shortcut="T" />
                <FloatingBarItem aria-label="Pen P" icon={<PenTool />} shortcut="P" />
                <FloatingBarSeparator />
                <FloatingBarItem aria-label="Comment C" icon={<MessageCircle />} />
                <FloatingBarItem aria-label="Ask agent" icon={<WandSparkles />} agent />
              </FloatingBar>
            </div>
            <div className="absolute" style={{ left: X1, top: TOP + FH + 38 }}>
              <FloatingBar label="Selection actions" size="sm">
                <Button tone="agent" size="xs" shape="pill" iconStart={<WandSparkles />} className="mr-0.5">Ask Caustic</Button>
                <FloatingBarSeparator />
                <FloatingBarItem aria-label="Create component" icon={<Component />} />
                <FloatingBarItem aria-label="Auto layout" icon={<Rows3 />} />
                <FloatingBarItem aria-label="More" icon={<Ellipsis />} />
              </FloatingBar>
            </div>
            <div className="absolute inset-x-0 bottom-3.5 flex justify-center">
              <CanvasHint>
                <CanvasHintItem keys="⇧">constrain</CanvasHintItem>
                <CanvasHintItem keys="⌥">from center</CanvasHintItem>
                <CanvasHintItem keys="esc">cancel</CanvasHintItem>
              </CanvasHint>
            </div>
            <div className="absolute right-3 bottom-3.5">
              <ZoomControl value="50%" appearance="glass" size="sm" label="Zoom" zoomOutLabel="Zoom out" zoomInLabel="Zoom in" />
            </div>
          </AppShellOverlay>
        </AppShellStage>

        <AppShellEnd>
          <SidePanel
            label="Inspector"
            title="Onboarding / Welcome"
            side="end"
            size="inspector"
            width={288}
            collapseLabel="Hide inspector panel"
            actions={(
              <>
                <IconButton size="xs" label="Create component"><Component /></IconButton>
                <IconButton size="xs" label="More options"><Ellipsis /></IconButton>
              </>
            )}
          >
            <InspectorPanel aria-label="Welcome frame properties">
              <InspectorSection>
                <InspectorSectionHeader
                  title="Frame"
                  actions={(
                    <ButtonGroup density="tight" aria-label="Align">
                      <IconButton label="Align left"><AlignStartVertical /></IconButton>
                      <IconButton label="Align center"><AlignCenterVertical /></IconButton>
                      <IconButton label="Align right"><AlignEndVertical /></IconButton>
                    </ButtonGroup>
                  )}
                />
                <PositionSize
                  defaultValue={{ x: 0, y: 0, width: 390, height: 844, rotation: 0 }}
                  labels={psLabels}
                  widthMode="fixed"
                  heightMode="fixed"
                />
              </InspectorSection>
              <InspectorSection>
                <InspectorSectionHeader
                  title="Auto layout"
                  actions={<IconButton size="xs" label="Remove auto layout"><Minus /></IconButton>}
                />
                <AutoLayout
                  labels={alLabels}
                  defaultValue={{ ...defaultAutoLayout, flow: 'column', align: 'top-center', gap: 16, distribution: 'space-between', paddingMode: 'sides', padding: { top: 56, right: 24, bottom: 36, left: 24 } }}
                />
              </InspectorSection>
              <PropertyStack
                title="Fill"
                labels={paintLabels}
                items={[
                  { id: 'canvas', color: 'var(--cs-color-canvas-artboard)', label: 'canvas/artboard', mono: true, meta: 'token', opacity: 100 },
                  { id: 'vignette', color: 'var(--cs-color-ink-solid)', label: 'Vignette', meta: 'hidden', opacity: 8, hidden: true },
                ]}
              />
              <InspectorSection>
                <InspectorSectionHeader title="Corner radius" />
                <CornerRadius labels={ccLabels} defaultValue={{ radius: 0, smoothing: 0, corners: { tl: 0, tr: 0, bl: 0, br: 0 } }} />
              </InspectorSection>
              <InspectorSection>
                <InspectorSectionHeader
                  title="Effects"
                  actions={<IconButton size="xs" label="Add effect"><Plus /></IconButton>}
                />
                <PropertyStack
                  kind="effect"
                  labels={esLabels}
                  items={[
                    { id: 'shadow', icon: <SquareStack />, label: 'Drop shadow', meta: '24 px' },
                    { id: 'blur', icon: <Droplet />, label: 'Background blur', meta: 'hidden', hidden: true },
                  ]}
                />
              </InspectorSection>
              <InspectorSection>
                <InspectorSectionHeader title="Layer" />
                <div className="grid gap-3">
                  <Slider label="Opacity" field unit="%" defaultValue={100} />
                </div>
              </InspectorSection>
              <InspectorSection>
                <InspectorSectionHeader title="Export" />
                <div className="grid grid-cols-2 gap-1.5">
                  <NumberField label="×" unit="x" defaultValue={2} aria-label="Export scale" />
                  <Button tone="secondary" size="sm" iconStart={<Scan />}>Export</Button>
                </div>
              </InspectorSection>
            </InspectorPanel>
          </SidePanel>
        </AppShellEnd>
      </AppShell>
    </div>
  );
}
