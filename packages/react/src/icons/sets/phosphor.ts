// Phosphor icon set. One export per caustic icon name (lucide names, so call sites did not change).
// Edit the table by hand: name, glyph, and for the other set the same name in ./solar.ts.
// Gaps drawn from Solar (this set has no fitting glyph): AlignHorizontalDistributeCenter (Solar align-horizontal-spacing),
// AlignVerticalDistributeCenter (Solar align-vertical-spacing), FileWarning (Solar file-warning), ImagePlus (Solar gallery-add), SearchX
// (Solar magnifier-close), SlashSquare (Solar slash-square).
import {
  AlignBottomIcon as PhAlignBottom,
  AlignCenterHorizontalIcon as PhAlignCenterHorizontal,
  AlignCenterVerticalIcon as PhAlignCenterVertical,
  AlignLeftIcon as PhAlignLeft,
  AlignRightIcon as PhAlignRight,
  AlignTopIcon as PhAlignTop,
  ArchiveIcon as PhArchive,
  ArrowBendUpRightIcon as PhArrowBendUpRight,
  ArrowClockwiseIcon as PhArrowClockwise,
  ArrowCounterClockwiseIcon as PhArrowCounterClockwise,
  ArrowDownIcon as PhArrowDown,
  ArrowDownRightIcon as PhArrowDownRight,
  ArrowLineDownIcon as PhArrowLineDown,
  ArrowLineRightIcon as PhArrowLineRight,
  ArrowLineUpIcon as PhArrowLineUp,
  ArrowRightIcon as PhArrowRight,
  ArrowUUpLeftIcon as PhArrowUUpLeft,
  ArrowUUpRightIcon as PhArrowUUpRight,
  ArrowUpIcon as PhArrowUp,
  ArrowUpRightIcon as PhArrowUpRight,
  ArrowsHorizontalIcon as PhArrowsHorizontal,
  ArrowsInLineVerticalIcon as PhArrowsInLineVertical,
  ArrowsInSimpleIcon as PhArrowsInSimple,
  ArrowsOutCardinalIcon as PhArrowsOutCardinal,
  ArrowsOutSimpleIcon as PhArrowsOutSimple,
  ArrowsVerticalIcon as PhArrowsVertical,
  AtIcon as PhAt,
  BellIcon as PhBell,
  BezierCurveIcon as PhBezierCurve,
  BracketsCurlyIcon as PhBracketsCurly,
  CalendarIcon as PhCalendar,
  CalendarDotsIcon as PhCalendarDots,
  CardsIcon as PhCards,
  CaretDownIcon as PhCaretDown,
  CaretLeftIcon as PhCaretLeft,
  CaretRightIcon as PhCaretRight,
  CaretUpIcon as PhCaretUp,
  CaretUpDownIcon as PhCaretUpDown,
  ChatCircleIcon as PhChatCircle,
  ChatTextIcon as PhChatText,
  CheckIcon as PhCheck,
  CheckCircleIcon as PhCheckCircle,
  CircleIcon as PhCircle,
  CircleHalfIcon as PhCircleHalf,
  CircleNotchIcon as PhCircleNotch,
  ClipboardIcon as PhClipboard,
  ClockIcon as PhClock,
  ClockCounterClockwiseIcon as PhClockCounterClockwise,
  CloudArrowUpIcon as PhCloudArrowUp,
  CodeIcon as PhCode,
  CommandIcon as PhCommand,
  CompassIcon as PhCompass,
  CopyIcon as PhCopy,
  CornersOutIcon as PhCornersOut,
  CropIcon as PhCrop,
  CursorIcon as PhCursor,
  DeviceMobileIcon as PhDeviceMobile,
  DeviceTabletIcon as PhDeviceTablet,
  DiamondIcon as PhDiamond,
  DiamondsFourIcon as PhDiamondsFour,
  DotsSixVerticalIcon as PhDotsSixVertical,
  DotsThreeIcon as PhDotsThree,
  DownloadSimpleIcon as PhDownloadSimple,
  DropIcon as PhDrop,
  EnvelopeIcon as PhEnvelope,
  ExportIcon as PhExport,
  EyeIcon as PhEye,
  EyeSlashIcon as PhEyeSlash,
  EyedropperIcon as PhEyedropper,
  FileIcon as PhFile,
  FileArrowUpIcon as PhFileArrowUp,
  FileCodeIcon as PhFileCode,
  FileImageIcon as PhFileImage,
  FileTextIcon as PhFileText,
  FileXIcon as PhFileX,
  FlagIcon as PhFlag,
  FlaskIcon as PhFlask,
  FlipHorizontalIcon as PhFlipHorizontal,
  FlipVerticalIcon as PhFlipVertical,
  FolderIcon as PhFolder,
  FolderOpenIcon as PhFolderOpen,
  FunnelIcon as PhFunnel,
  GearIcon as PhGear,
  GitBranchIcon as PhGitBranch,
  GlobeIcon as PhGlobe,
  GridFourIcon as PhGridFour,
  GridNineIcon as PhGridNine,
  HandIcon as PhHand,
  HashStraightIcon as PhHashStraight,
  HouseIcon as PhHouse,
  ImageIcon as PhImage,
  InfoIcon as PhInfo,
  IntersectIcon as PhIntersect,
  KeyIcon as PhKey,
  LaptopIcon as PhLaptop,
  LayoutIcon as PhLayout,
  LightbulbIcon as PhLightbulb,
  LinkIcon as PhLink,
  LinkBreakIcon as PhLinkBreak,
  LinkSimpleHorizontalIcon as PhLinkSimpleHorizontal,
  ListIcon as PhList,
  ListChecksIcon as PhListChecks,
  LockIcon as PhLock,
  LockOpenIcon as PhLockOpen,
  MagicWandIcon as PhMagicWand,
  MagnetIcon as PhMagnet,
  MagnifyingGlassIcon as PhMagnifyingGlass,
  MagnifyingGlassMinusIcon as PhMagnifyingGlassMinus,
  MagnifyingGlassPlusIcon as PhMagnifyingGlassPlus,
  MinusIcon as PhMinus,
  MonitorIcon as PhMonitor,
  MoonIcon as PhMoon,
  NotePencilIcon as PhNotePencil,
  OctagonIcon as PhOctagon,
  PackageIcon as PhPackage,
  PaintBucketIcon as PhPaintBucket,
  PaletteIcon as PhPalette,
  PaperclipIcon as PhPaperclip,
  PauseIcon as PhPause,
  PenNibIcon as PhPenNib,
  PencilSimpleIcon as PhPencilSimple,
  PlayIcon as PhPlay,
  PlugIcon as PhPlug,
  PlusIcon as PhPlus,
  QuestionIcon as PhQuestion,
  RadioButtonIcon as PhRadioButton,
  RowsIcon as PhRows,
  RulerIcon as PhRuler,
  ScanIcon as PhScan,
  ScissorsIcon as PhScissors,
  SelectionIcon as PhSelection,
  ShapesIcon as PhShapes,
  ShieldIcon as PhShield,
  ShieldCheckIcon as PhShieldCheck,
  SidebarSimpleIcon as PhSidebarSimple,
  SlidersHorizontalIcon as PhSlidersHorizontal,
  SparkleIcon as PhSparkle,
  SquareIcon as PhSquare,
  SquareHalfBottomIcon as PhSquareHalfBottom,
  SquaresFourIcon as PhSquaresFour,
  StackIcon as PhStack,
  StopIcon as PhStop,
  SunIcon as PhSun,
  SwatchesIcon as PhSwatches,
  TargetIcon as PhTarget,
  TelevisionIcon as PhTelevision,
  TerminalWindowIcon as PhTerminalWindow,
  TextAUnderlineIcon as PhTextAUnderline,
  TextAlignCenterIcon as PhTextAlignCenter,
  TextAlignJustifyIcon as PhTextAlignJustify,
  TextAlignLeftIcon as PhTextAlignLeft,
  TextAlignRightIcon as PhTextAlignRight,
  TextBIcon as PhTextB,
  TextItalicIcon as PhTextItalic,
  TextStrikethroughIcon as PhTextStrikethrough,
  TextTIcon as PhTextT,
  TextUnderlineIcon as PhTextUnderline,
  TrashIcon as PhTrash,
  TrayIcon as PhTray,
  TreeViewIcon as PhTreeView,
  UploadSimpleIcon as PhUploadSimple,
  UserIcon as PhUser,
  UserPlusIcon as PhUserPlus,
  WarningIcon as PhWarning,
  WarningCircleIcon as PhWarningCircle,
  XIcon as PhX,
  XCircleIcon as PhXCircle,
} from '@phosphor-icons/react';
import {
  AlignHorizontalSpacingIcon as SoAlignHorizontalSpacingBold,
  AlignVerticalSpacingIcon as SoAlignVerticalSpacingBold,
  FileWarningIcon as SoFileWarningBold,
  GalleryAddIcon as SoGalleryAddBold,
  MagnifierCloseIcon as SoMagnifierCloseBold,
  SlashSquareIcon as SoSlashSquareBold,
} from '@solar-icons/react/bold';
import {
  AlignHorizontalSpacingIcon as SoAlignHorizontalSpacing,
  AlignVerticalSpacingIcon as SoAlignVerticalSpacing,
  FileWarningIcon as SoFileWarning,
  GalleryAddIcon as SoGalleryAdd,
  MagnifierCloseIcon as SoMagnifierClose,
  SlashSquareIcon as SoSlashSquare,
} from '@solar-icons/react/linear';
import { phosphorIcon } from '../lib/phosphor.tsx';
import { solarIcon } from '../lib/solar.tsx';
import type { Icon, IconSetName } from '../lib/types.ts';

export const iconSet: IconSetName = 'phosphor';
export * from '../custom.tsx';

export const AlignCenter: Icon = phosphorIcon(PhTextAlignCenter, 'AlignCenter', { selected: 'bold' });
export const AlignCenterHorizontal: Icon = phosphorIcon(PhAlignCenterHorizontal, 'AlignCenterHorizontal');
export const AlignCenterVertical: Icon = phosphorIcon(PhAlignCenterVertical, 'AlignCenterVertical');
export const AlignEndHorizontal: Icon = phosphorIcon(PhAlignBottom, 'AlignEndHorizontal');
export const AlignEndVertical: Icon = phosphorIcon(PhAlignRight, 'AlignEndVertical');
export const AlignHorizontalDistributeCenter: Icon = solarIcon(SoAlignHorizontalSpacing, SoAlignHorizontalSpacingBold, 'AlignHorizontalDistributeCenter');
export const AlignJustify: Icon = phosphorIcon(PhTextAlignJustify, 'AlignJustify', { selected: 'bold' });
export const AlignLeft: Icon = phosphorIcon(PhTextAlignLeft, 'AlignLeft', { selected: 'bold' });
export const AlignRight: Icon = phosphorIcon(PhTextAlignRight, 'AlignRight', { selected: 'bold' });
export const AlignStartHorizontal: Icon = phosphorIcon(PhAlignTop, 'AlignStartHorizontal');
export const AlignStartVertical: Icon = phosphorIcon(PhAlignLeft, 'AlignStartVertical');
export const AlignVerticalDistributeCenter: Icon = solarIcon(SoAlignVerticalSpacing, SoAlignVerticalSpacingBold, 'AlignVerticalDistributeCenter');
export const Archive: Icon = phosphorIcon(PhArchive, 'Archive');
export const ArrowDown: Icon = phosphorIcon(PhArrowDown, 'ArrowDown');
export const ArrowDownRight: Icon = phosphorIcon(PhArrowDownRight, 'ArrowDownRight');
export const ArrowDownToLine: Icon = phosphorIcon(PhArrowLineDown, 'ArrowDownToLine');
export const ArrowRight: Icon = phosphorIcon(PhArrowRight, 'ArrowRight');
export const ArrowRightToLine: Icon = phosphorIcon(PhArrowLineRight, 'ArrowRightToLine');
export const ArrowUp: Icon = phosphorIcon(PhArrowUp, 'ArrowUp');
export const ArrowUpRight: Icon = phosphorIcon(PhArrowUpRight, 'ArrowUpRight');
export const ArrowUpToLine: Icon = phosphorIcon(PhArrowLineUp, 'ArrowUpToLine');
export const AtSign: Icon = phosphorIcon(PhAt, 'AtSign', { selected: 'bold' });
export const Baseline: Icon = phosphorIcon(PhTextAUnderline, 'Baseline', { selected: 'bold' });
export const Bell: Icon = phosphorIcon(PhBell, 'Bell');
export const Blend: Icon = phosphorIcon(PhIntersect, 'Blend');
export const Bold: Icon = phosphorIcon(PhTextB, 'Bold', { selected: 'bold' });
export const Braces: Icon = phosphorIcon(PhBracketsCurly, 'Braces', { selected: 'bold' });
export const Calendar: Icon = phosphorIcon(PhCalendar, 'Calendar');
export const CalendarClock: Icon = phosphorIcon(PhCalendarDots, 'CalendarClock');
export const Check: Icon = phosphorIcon(PhCheck, 'Check', { selected: 'bold' });
export const ChevronDown: Icon = phosphorIcon(PhCaretDown, 'ChevronDown');
export const ChevronLeft: Icon = phosphorIcon(PhCaretLeft, 'ChevronLeft');
export const ChevronRight: Icon = phosphorIcon(PhCaretRight, 'ChevronRight');
export const ChevronUp: Icon = phosphorIcon(PhCaretUp, 'ChevronUp');
export const ChevronsUpDown: Icon = phosphorIcon(PhCaretUpDown, 'ChevronsUpDown');
export const Circle: Icon = phosphorIcon(PhCircle, 'Circle');
export const CircleAlert: Icon = phosphorIcon(PhWarningCircle, 'CircleAlert');
export const CircleCheck: Icon = phosphorIcon(PhCheckCircle, 'CircleCheck');
export const CircleDot: Icon = phosphorIcon(PhRadioButton, 'CircleDot');
export const CircleHelp: Icon = phosphorIcon(PhQuestion, 'CircleHelp');
export const CircleX: Icon = phosphorIcon(PhXCircle, 'CircleX');
export const Clipboard: Icon = phosphorIcon(PhClipboard, 'Clipboard');
export const Clock: Icon = phosphorIcon(PhClock, 'Clock');
export const CodeXml: Icon = phosphorIcon(PhCode, 'CodeXml', { selected: 'bold' });
export const Command: Icon = phosphorIcon(PhCommand, 'Command', { selected: 'bold' });
export const Compass: Icon = phosphorIcon(PhCompass, 'Compass');
export const Component: Icon = phosphorIcon(PhDiamondsFour, 'Component');
export const Contrast: Icon = phosphorIcon(PhCircleHalf, 'Contrast');
export const Copy: Icon = phosphorIcon(PhCopy, 'Copy');
export const CornerUpRight: Icon = phosphorIcon(PhArrowBendUpRight, 'CornerUpRight');
export const Crop: Icon = phosphorIcon(PhCrop, 'Crop');
export const Diamond: Icon = phosphorIcon(PhDiamond, 'Diamond');
export const Download: Icon = phosphorIcon(PhDownloadSimple, 'Download');
export const Droplet: Icon = phosphorIcon(PhDrop, 'Droplet');
export const Ellipsis: Icon = phosphorIcon(PhDotsThree, 'Ellipsis', { selected: 'bold' });
export const Eye: Icon = phosphorIcon(PhEye, 'Eye');
export const EyeOff: Icon = phosphorIcon(PhEyeSlash, 'EyeOff');
export const File: Icon = phosphorIcon(PhFile, 'File');
export const FileCode: Icon = phosphorIcon(PhFileCode, 'FileCode');
export const FileImage: Icon = phosphorIcon(PhFileImage, 'FileImage');
export const FileText: Icon = phosphorIcon(PhFileText, 'FileText');
export const FileUp: Icon = phosphorIcon(PhFileArrowUp, 'FileUp');
export const FileWarning: Icon = solarIcon(SoFileWarning, SoFileWarningBold, 'FileWarning');
export const FileX: Icon = phosphorIcon(PhFileX, 'FileX');
export const Filter: Icon = phosphorIcon(PhFunnel, 'Filter');
export const Flag: Icon = phosphorIcon(PhFlag, 'Flag');
export const FlaskConical: Icon = phosphorIcon(PhFlask, 'FlaskConical');
export const FlipHorizontal2: Icon = phosphorIcon(PhFlipHorizontal, 'FlipHorizontal2');
export const FlipVertical2: Icon = phosphorIcon(PhFlipVertical, 'FlipVertical2');
export const FoldVertical: Icon = phosphorIcon(PhArrowsInLineVertical, 'FoldVertical');
export const Folder: Icon = phosphorIcon(PhFolder, 'Folder');
export const FolderOpen: Icon = phosphorIcon(PhFolderOpen, 'FolderOpen');
export const FolderTree: Icon = phosphorIcon(PhTreeView, 'FolderTree');
export const Frame: Icon = phosphorIcon(PhHashStraight, 'Frame', { selected: 'bold' });
export const GitBranch: Icon = phosphorIcon(PhGitBranch, 'GitBranch');
export const Globe: Icon = phosphorIcon(PhGlobe, 'Globe');
export const Grid2x2: Icon = phosphorIcon(PhGridFour, 'Grid2x2');
export const Grid3x3: Icon = phosphorIcon(PhGridNine, 'Grid3x3');
export const GripVertical: Icon = phosphorIcon(PhDotsSixVertical, 'GripVertical', { selected: 'bold' });
export const Hand: Icon = phosphorIcon(PhHand, 'Hand');
export const History: Icon = phosphorIcon(PhClockCounterClockwise, 'History');
export const House: Icon = phosphorIcon(PhHouse, 'House');
export const Image: Icon = phosphorIcon(PhImage, 'Image');
export const ImagePlus: Icon = solarIcon(SoGalleryAdd, SoGalleryAddBold, 'ImagePlus');
export const Inbox: Icon = phosphorIcon(PhTray, 'Inbox');
export const Info: Icon = phosphorIcon(PhInfo, 'Info');
export const Italic: Icon = phosphorIcon(PhTextItalic, 'Italic', { selected: 'bold' });
export const KeyRound: Icon = phosphorIcon(PhKey, 'KeyRound');
export const Laptop: Icon = phosphorIcon(PhLaptop, 'Laptop');
export const Layers: Icon = phosphorIcon(PhStack, 'Layers');
export const LayoutGrid: Icon = phosphorIcon(PhSquaresFour, 'LayoutGrid');
export const LayoutPanelLeft: Icon = phosphorIcon(PhLayout, 'LayoutPanelLeft');
export const LayoutTemplate: Icon = phosphorIcon(PhLayout, 'LayoutTemplate');
export const Lightbulb: Icon = phosphorIcon(PhLightbulb, 'Lightbulb');
export const Link: Icon = phosphorIcon(PhLink, 'Link', { selected: 'bold' });
export const Link2: Icon = phosphorIcon(PhLinkSimpleHorizontal, 'Link2', { selected: 'bold' });
export const ListChecks: Icon = phosphorIcon(PhListChecks, 'ListChecks');
export const LoaderCircle: Icon = phosphorIcon(PhCircleNotch, 'LoaderCircle');
export const Lock: Icon = phosphorIcon(PhLock, 'Lock');
export const LockOpen: Icon = phosphorIcon(PhLockOpen, 'LockOpen');
export const Magnet: Icon = phosphorIcon(PhMagnet, 'Magnet');
export const Mail: Icon = phosphorIcon(PhEnvelope, 'Mail');
export const Maximize: Icon = phosphorIcon(PhCornersOut, 'Maximize');
export const Maximize2: Icon = phosphorIcon(PhArrowsOutSimple, 'Maximize2');
export const Menu: Icon = phosphorIcon(PhList, 'Menu', { selected: 'bold' });
export const MessageCircle: Icon = phosphorIcon(PhChatCircle, 'MessageCircle');
export const MessageCircleQuestion: Icon = phosphorIcon(PhQuestion, 'MessageCircleQuestion');
export const MessageSquare: Icon = phosphorIcon(PhChatText, 'MessageSquare');
export const Minimize2: Icon = phosphorIcon(PhArrowsInSimple, 'Minimize2');
export const Minus: Icon = phosphorIcon(PhMinus, 'Minus', { selected: 'bold' });
export const Monitor: Icon = phosphorIcon(PhMonitor, 'Monitor');
export const Moon: Icon = phosphorIcon(PhMoon, 'Moon');
export const MousePointer2: Icon = phosphorIcon(PhCursor, 'MousePointer2');
export const Move: Icon = phosphorIcon(PhArrowsOutCardinal, 'Move');
export const MoveHorizontal: Icon = phosphorIcon(PhArrowsHorizontal, 'MoveHorizontal');
export const MoveVertical: Icon = phosphorIcon(PhArrowsVertical, 'MoveVertical');
export const Octagon: Icon = phosphorIcon(PhOctagon, 'Octagon');
export const Package: Icon = phosphorIcon(PhPackage, 'Package');
export const PaintBucket: Icon = phosphorIcon(PhPaintBucket, 'PaintBucket');
export const Palette: Icon = phosphorIcon(PhPalette, 'Palette');
export const PanelBottom: Icon = phosphorIcon(PhSquareHalfBottom, 'PanelBottom');
export const PanelLeft: Icon = phosphorIcon(PhSidebarSimple, 'PanelLeft');
export const PanelRight: Icon = phosphorIcon(PhSidebarSimple, 'PanelRight', { mirrored: true });
export const Paperclip: Icon = phosphorIcon(PhPaperclip, 'Paperclip', { selected: 'bold' });
export const Pause: Icon = phosphorIcon(PhPause, 'Pause');
export const PenTool: Icon = phosphorIcon(PhPenNib, 'PenTool');
export const Pencil: Icon = phosphorIcon(PhPencilSimple, 'Pencil');
export const Pipette: Icon = phosphorIcon(PhEyedropper, 'Pipette');
export const Play: Icon = phosphorIcon(PhPlay, 'Play');
export const Plug: Icon = phosphorIcon(PhPlug, 'Plug');
export const Plus: Icon = phosphorIcon(PhPlus, 'Plus', { selected: 'bold' });
export const Redo2: Icon = phosphorIcon(PhArrowUUpRight, 'Redo2');
export const RotateCcw: Icon = phosphorIcon(PhArrowCounterClockwise, 'RotateCcw');
export const RotateCw: Icon = phosphorIcon(PhArrowClockwise, 'RotateCw');
export const Rows3: Icon = phosphorIcon(PhRows, 'Rows3');
export const Ruler: Icon = phosphorIcon(PhRuler, 'Ruler');
export const Scan: Icon = phosphorIcon(PhScan, 'Scan');
export const Scissors: Icon = phosphorIcon(PhScissors, 'Scissors');
export const Search: Icon = phosphorIcon(PhMagnifyingGlass, 'Search');
export const SearchX: Icon = solarIcon(SoMagnifierClose, SoMagnifierCloseBold, 'SearchX');
export const Settings: Icon = phosphorIcon(PhGear, 'Settings');
export const Shapes: Icon = phosphorIcon(PhShapes, 'Shapes');
export const Share: Icon = phosphorIcon(PhExport, 'Share');
export const Shield: Icon = phosphorIcon(PhShield, 'Shield');
export const ShieldCheck: Icon = phosphorIcon(PhShieldCheck, 'ShieldCheck');
export const SlashSquare: Icon = solarIcon(SoSlashSquare, SoSlashSquareBold, 'SlashSquare');
export const SlidersHorizontal: Icon = phosphorIcon(PhSlidersHorizontal, 'SlidersHorizontal');
export const Smartphone: Icon = phosphorIcon(PhDeviceMobile, 'Smartphone');
export const Sparkles: Icon = phosphorIcon(PhSparkle, 'Sparkles');
export const Spline: Icon = phosphorIcon(PhBezierCurve, 'Spline');
export const Square: Icon = phosphorIcon(PhSquare, 'Square');
export const SquareDashed: Icon = phosphorIcon(PhSelection, 'SquareDashed', { selected: 'bold' });
export const SquarePen: Icon = phosphorIcon(PhNotePencil, 'SquarePen');
export const SquareStack: Icon = phosphorIcon(PhCards, 'SquareStack');
export const Stop: Icon = phosphorIcon(PhStop, 'Stop');
export const Strikethrough: Icon = phosphorIcon(PhTextStrikethrough, 'Strikethrough', { selected: 'bold' });
export const Sun: Icon = phosphorIcon(PhSun, 'Sun');
export const SwatchBook: Icon = phosphorIcon(PhSwatches, 'SwatchBook');
export const Tablet: Icon = phosphorIcon(PhDeviceTablet, 'Tablet');
export const Target: Icon = phosphorIcon(PhTarget, 'Target');
export const Terminal: Icon = phosphorIcon(PhTerminalWindow, 'Terminal');
export const Trash2: Icon = phosphorIcon(PhTrash, 'Trash2');
export const TriangleAlert: Icon = phosphorIcon(PhWarning, 'TriangleAlert');
export const Tv: Icon = phosphorIcon(PhTelevision, 'Tv');
export const Type: Icon = phosphorIcon(PhTextT, 'Type', { selected: 'bold' });
export const Underline: Icon = phosphorIcon(PhTextUnderline, 'Underline', { selected: 'bold' });
export const Undo2: Icon = phosphorIcon(PhArrowUUpLeft, 'Undo2');
export const Unlink: Icon = phosphorIcon(PhLinkBreak, 'Unlink', { selected: 'bold' });
export const Upload: Icon = phosphorIcon(PhUploadSimple, 'Upload');
export const UploadCloud: Icon = phosphorIcon(PhCloudArrowUp, 'UploadCloud');
export const User: Icon = phosphorIcon(PhUser, 'User');
export const UserPlus: Icon = phosphorIcon(PhUserPlus, 'UserPlus');
export const WandSparkles: Icon = phosphorIcon(PhMagicWand, 'WandSparkles');
export const X: Icon = phosphorIcon(PhX, 'X', { selected: 'bold' });
export const ZoomIn: Icon = phosphorIcon(PhMagnifyingGlassPlus, 'ZoomIn');
export const ZoomOut: Icon = phosphorIcon(PhMagnifyingGlassMinus, 'ZoomOut');
