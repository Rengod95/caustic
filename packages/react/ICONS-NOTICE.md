# Icon notices

`@caustic/react/icons` draws its glyphs from two third-party sets. Which set ships depends on the build (see `src/icons/index.ts`). Both sets borrow a few glyphs from each other for gaps, so a build of either set contains glyphs from both.

## Phosphor Icons

- Package: `@phosphor-icons/react` 2.1.10
- Copyright (c) 2020 Phosphor Icons
- License: MIT (glyphs and React package). Keep the copyright and permission notice with redistributed copies.

## Solar Icons

- Glyphs: "Solar Icons Set" by 480 Design, https://www.figma.com/community/file/1166831539721848736
- License of the glyphs: Creative Commons Attribution 4.0 International (CC BY 4.0), https://creativecommons.org/licenses/by/4.0/
- React package: `@solar-icons/react` 2.3.2 by Saoudi Hakim, MIT
- CC BY 4.0 requires visible credit. A product that ships Solar glyphs must show this line in its notices or about screen:

  > Icons: Solar Icons Set by 480 Design, licensed under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Some icons are used as-is in two styles (Linear, Bold); some are mirrored.

## Caustic-drawn glyphs

`Space` (`src/icons/custom.tsx`) is drawn by caustic. `CallArrow` is adapted from Lucide's `corner-down-right` (ISC License, Copyright (c) Lucide Contributors) with a tighter elbow.
