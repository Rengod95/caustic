export default {
  "meta": {
    "name": "Caustic",
    "version": "1.0.0",
    "prefix": "cs"
  },
  "hueSteps": [
    25,
    50,
    100,
    200,
    300,
    400,
    500,
    600,
    700,
    800,
    900,
    950
  ],
  "hueProfile": {
    "L": {
      "25": 0.985,
      "50": 0.965,
      "100": 0.93,
      "200": 0.88,
      "300": 0.815,
      "400": 0.735,
      "500": 0.645,
      "600": 0.545,
      "700": 0.465,
      "800": 0.385,
      "900": 0.3,
      "950": 0.23
    },
    "C": {
      "25": 0.012,
      "50": 0.024,
      "100": 0.045,
      "200": 0.075,
      "300": 0.105,
      "400": 0.13,
      "500": 0.142,
      "600": 0.135,
      "700": 0.118,
      "800": 0.095,
      "900": 0.07,
      "950": 0.05
    }
  },
  "hues": {
    "accent": {
      "name": "Lagoon",
      "hue": 205,
      "live": true,
      "role": "Accent, selection, focus"
    },
    "mint": {
      "name": "Mint",
      "hue": 158,
      "role": "Success, diff add"
    },
    "amber": {
      "name": "Amber",
      "hue": 72,
      "role": "Warning, permission"
    },
    "coral": {
      "name": "Coral",
      "hue": 25,
      "role": "Danger, diff remove, canvas guides"
    },
    "iris": {
      "name": "Iris",
      "hue": 295,
      "role": "Info, review, components"
    }
  },
  "neutral": {
    "name": "Graphite",
    "hue": 260,
    "steps": {
      "0": [
        0.995,
        0.001
      ],
      "25": [
        0.985,
        0.002
      ],
      "50": [
        0.97,
        0.003
      ],
      "100": [
        0.945,
        0.004
      ],
      "150": [
        0.925,
        0.005
      ],
      "200": [
        0.9,
        0.006
      ],
      "300": [
        0.845,
        0.008
      ],
      "400": [
        0.65,
        0.011
      ],
      "500": [
        0.54,
        0.012
      ],
      "600": [
        0.48,
        0.012
      ],
      "700": [
        0.41,
        0.012
      ],
      "800": [
        0.32,
        0.011
      ],
      "850": [
        0.265,
        0.01
      ],
      "900": [
        0.225,
        0.009
      ],
      "950": [
        0.18,
        0.008
      ],
      "1000": [
        0.14,
        0.007
      ]
    }
  },
  "spectrum": [
    {
      "L": 0.8,
      "C": 0.13,
      "hue": "accent"
    },
    {
      "L": 0.86,
      "C": 0.15,
      "hue": 158
    },
    {
      "L": 0.87,
      "C": 0.14,
      "hue": 80
    }
  ],
  "themes": {
    "light": {
      "bg.app": "neutral.50",
      "bg.canvas": "neutral.100",
      "bg.inset": "neutral.950/0.04",
      "bg.scrim": "neutral.950/0.24",
      "surface.base": "neutral.0",
      "surface.raised": "neutral.25",
      "surface.translucent": "neutral.0/0.78",
      "material.ultrathin": "neutral.0/0.3",
      "material.thin": "neutral.0/0.48",
      "material.regular": "neutral.0/0.66",
      "material.thick": "neutral.0/0.84",
      "material.rim": "white/0.62",
      "material.edge": "neutral.950/0.11",
      "material.specular": "white/0.95",
      "material.sheen": "white/0.5",
      "text.primary": "neutral.950",
      "text.secondary": "neutral.700",
      "text.tertiary": "neutral.600",
      "text.placeholder": "neutral.600",
      "text.disabled": "neutral.400",
      "text.inverse": "neutral.0",
      "text.link": "accent.700",
      "border.subtle": "neutral.950/0.07",
      "border.default": "neutral.950/0.12",
      "border.strong": "neutral.950/0.2",
      "border.control": "neutral.400",
      "fill.hover": "neutral.950/0.045",
      "fill.pressed": "neutral.950/0.075",
      "fill.selected": "neutral.950/0.11",
      "control.off": "neutral.400",
      "control.thumb": "neutral.0",
      "control.raised": "neutral.0/0.8",
      "control.raised-hover": "neutral.0/0.94",
      "control.edge": "neutral.950/0.1",
      "ink.solid": "neutral.900/0.9",
      "ink.hover": "neutral.800/0.9",
      "ink.on": "neutral.25",
      "ink.on-muted": "neutral.25/0.75",
      "ink.kbd": "white/0.09",
      "swatch.edge": "black/0.1",
      "accent.solid": "accent.600",
      "accent.hover": "accent.700",
      "accent.on": "neutral.0",
      "accent.text": "accent.700",
      "accent.soft": "accent.400/0.14",
      "accent.border": "accent.400/0.5",
      "accent.glow": "accent.500/0.35",
      "accent.fill": "accent.700/0.9",
      "accent.fill-hover": "accent.800/0.9",
      "success.solid": "mint.600",
      "success.on": "neutral.0",
      "success.text": "mint.700",
      "success.soft": "mint.300/0.22",
      "warning.solid": "amber.500",
      "warning.on": "neutral.1000",
      "warning.text": "amber.700",
      "warning.soft": "amber.300/0.3",
      "danger.solid": "coral.600",
      "danger.on": "neutral.0",
      "danger.text": "coral.700",
      "danger.soft": "coral.300/0.2",
      "info.solid": "iris.600",
      "info.on": "neutral.0",
      "info.text": "iris.700",
      "info.soft": "iris.300/0.2",
      "diff.add": "mint.400/0.18",
      "diff.remove": "coral.400/0.16",
      "focus.ring": "accent.600",
      "canvas.dot": "neutral.950/0.13",
      "canvas.selection": "accent.600",
      "canvas.handle": "neutral.0",
      "canvas.selection-on": "neutral.0",
      "canvas.guide": "coral.600",
      "canvas.guide-on": "neutral.0",
      "canvas.hover": "accent.500/0.6",
      "canvas.marquee": "accent.400/0.12",
      "canvas.label": "neutral.600",
      "canvas.checker-a": "neutral.0",
      "canvas.checker-b": "neutral.200",
      "canvas.artboard": "neutral.0",
      "agent.glow": "accent.300/0.45",
      "identity.coral": "coral.600",
      "identity.iris": "iris.600",
      "identity.mint": "mint.700",
      "identity.amber": "amber.700",
      "identity.slate": "neutral.600",
      "identity.on": "neutral.0"
    },
    "dark": {
      "bg.app": "neutral.950",
      "bg.canvas": "neutral.1000",
      "bg.inset": "black/0.22",
      "bg.scrim": "black/0.5",
      "surface.base": "neutral.900",
      "surface.raised": "neutral.850",
      "surface.translucent": "neutral.900/0.72",
      "material.ultrathin": "neutral.850/0.28",
      "material.thin": "neutral.850/0.44",
      "material.regular": "neutral.900/0.62",
      "material.thick": "neutral.900/0.84",
      "material.rim": "white/0.09",
      "material.edge": "black/0.55",
      "material.specular": "white/0.17",
      "material.sheen": "white/0.1",
      "text.primary": "neutral.25",
      "text.secondary": "neutral.300",
      "text.tertiary": "neutral.400",
      "text.placeholder": "neutral.400",
      "text.disabled": "neutral.500",
      "text.inverse": "neutral.950",
      "text.link": "accent.300",
      "border.subtle": "white/0.06",
      "border.default": "white/0.1",
      "border.strong": "white/0.17",
      "border.control": "neutral.500",
      "fill.hover": "white/0.05",
      "fill.pressed": "white/0.08",
      "fill.selected": "white/0.12",
      "control.off": "neutral.500",
      "control.thumb": "neutral.0",
      "control.raised": "neutral.850/0.76",
      "control.raised-hover": "neutral.800/0.82",
      "control.edge": "white/0.08",
      "ink.solid": "neutral.700/0.86",
      "ink.hover": "neutral.600/0.86",
      "ink.on": "neutral.25",
      "ink.on-muted": "neutral.25/0.75",
      "ink.kbd": "white/0.09",
      "swatch.edge": "black/0.1",
      "accent.solid": "accent.400",
      "accent.hover": "accent.300",
      "accent.on": "neutral.1000",
      "accent.text": "accent.300",
      "accent.soft": "accent.400/0.17",
      "accent.border": "accent.400/0.45",
      "accent.glow": "accent.400/0.3",
      "accent.fill": "accent.400/0.9",
      "accent.fill-hover": "accent.300/0.92",
      "success.solid": "mint.400",
      "success.on": "neutral.1000",
      "success.text": "mint.300",
      "success.soft": "mint.500/0.2",
      "warning.solid": "amber.400",
      "warning.on": "neutral.1000",
      "warning.text": "amber.300",
      "warning.soft": "amber.500/0.2",
      "danger.solid": "coral.400",
      "danger.on": "neutral.1000",
      "danger.text": "coral.300",
      "danger.soft": "coral.500/0.2",
      "info.solid": "iris.400",
      "info.on": "neutral.1000",
      "info.text": "iris.300",
      "info.soft": "iris.500/0.2",
      "diff.add": "mint.500/0.18",
      "diff.remove": "coral.500/0.18",
      "focus.ring": "accent.400",
      "canvas.dot": "white/0.08",
      "canvas.selection": "accent.500",
      "canvas.handle": "neutral.0",
      "canvas.selection-on": "neutral.1000",
      "canvas.guide": "coral.500",
      "canvas.guide-on": "neutral.1000",
      "canvas.hover": "accent.500/0.6",
      "canvas.marquee": "accent.400/0.14",
      "canvas.label": "neutral.400",
      "canvas.checker-a": "neutral.800",
      "canvas.checker-b": "neutral.700",
      "canvas.artboard": "neutral.0",
      "agent.glow": "accent.400/0.35",
      "identity.coral": "coral.600",
      "identity.iris": "iris.600",
      "identity.mint": "mint.700",
      "identity.amber": "amber.700",
      "identity.slate": "neutral.600",
      "identity.on": "neutral.0"
    }
  },
  "resolved": {
    "light": {
      "bg.app": {
        "hex": "#f4f5f7",
        "alpha": 1
      },
      "bg.canvas": {
        "hex": "#ebedef",
        "alpha": 1
      },
      "bg.inset": {
        "hex": "#101215",
        "alpha": 0.04
      },
      "bg.scrim": {
        "hex": "#101215",
        "alpha": 0.24
      },
      "surface.base": {
        "hex": "#fdfdfe",
        "alpha": 1
      },
      "surface.raised": {
        "hex": "#f9fafb",
        "alpha": 1
      },
      "surface.translucent": {
        "hex": "#fdfdfe",
        "alpha": 0.78
      },
      "material.ultrathin": {
        "hex": "#fdfdfe",
        "alpha": 0.3
      },
      "material.thin": {
        "hex": "#fdfdfe",
        "alpha": 0.48
      },
      "material.regular": {
        "hex": "#fdfdfe",
        "alpha": 0.66
      },
      "material.thick": {
        "hex": "#fdfdfe",
        "alpha": 0.84
      },
      "material.rim": {
        "hex": "#ffffff",
        "alpha": 0.62
      },
      "material.edge": {
        "hex": "#101215",
        "alpha": 0.11
      },
      "material.specular": {
        "hex": "#ffffff",
        "alpha": 0.95
      },
      "material.sheen": {
        "hex": "#ffffff",
        "alpha": 0.5
      },
      "text.primary": {
        "hex": "#101215",
        "alpha": 1
      },
      "text.secondary": {
        "hex": "#474b51",
        "alpha": 1
      },
      "text.tertiary": {
        "hex": "#5a5e65",
        "alpha": 1
      },
      "text.placeholder": {
        "hex": "#5a5e65",
        "alpha": 1
      },
      "text.disabled": {
        "hex": "#8b8f96",
        "alpha": 1
      },
      "text.inverse": {
        "hex": "#fdfdfe",
        "alpha": 1
      },
      "text.link": {
        "hex": "#00666e",
        "alpha": 1
      },
      "border.subtle": {
        "hex": "#101215",
        "alpha": 0.07
      },
      "border.default": {
        "hex": "#101215",
        "alpha": 0.12
      },
      "border.strong": {
        "hex": "#101215",
        "alpha": 0.2
      },
      "border.control": {
        "hex": "#8b8f96",
        "alpha": 1
      },
      "fill.hover": {
        "hex": "#101215",
        "alpha": 0.045
      },
      "fill.pressed": {
        "hex": "#101215",
        "alpha": 0.075
      },
      "fill.selected": {
        "hex": "#101215",
        "alpha": 0.11
      },
      "control.off": {
        "hex": "#8b8f96",
        "alpha": 1
      },
      "control.thumb": {
        "hex": "#fdfdfe",
        "alpha": 1
      },
      "control.raised": {
        "hex": "#fdfdfe",
        "alpha": 0.8
      },
      "control.raised-hover": {
        "hex": "#fdfdfe",
        "alpha": 0.94
      },
      "control.edge": {
        "hex": "#101215",
        "alpha": 0.1
      },
      "ink.solid": {
        "hex": "#191c20",
        "alpha": 0.9
      },
      "ink.hover": {
        "hex": "#303339",
        "alpha": 0.9
      },
      "ink.on": {
        "hex": "#f9fafb",
        "alpha": 1
      },
      "ink.on-muted": {
        "hex": "#f9fafb",
        "alpha": 0.75
      },
      "ink.kbd": {
        "hex": "#ffffff",
        "alpha": 0.09
      },
      "swatch.edge": {
        "hex": "#000000",
        "alpha": 0.1
      },
      "accent.solid": {
        "hex": "#007f8a",
        "alpha": 1
      },
      "accent.hover": {
        "hex": "#00666e",
        "alpha": 1
      },
      "accent.on": {
        "hex": "#fdfdfe",
        "alpha": 1
      },
      "accent.text": {
        "hex": "#00666e",
        "alpha": 1
      },
      "accent.soft": {
        "hex": "#00bfcf",
        "alpha": 0.14
      },
      "accent.border": {
        "hex": "#00bfcf",
        "alpha": 0.5
      },
      "accent.glow": {
        "hex": "#00a0ad",
        "alpha": 0.35
      },
      "accent.fill": {
        "hex": "#00666e",
        "alpha": 0.9
      },
      "accent.fill-hover": {
        "hex": "#004d54",
        "alpha": 0.9
      },
      "success.solid": {
        "hex": "#008652",
        "alpha": 1
      },
      "success.on": {
        "hex": "#fdfdfe",
        "alpha": 1
      },
      "success.text": {
        "hex": "#006b41",
        "alpha": 1
      },
      "success.soft": {
        "hex": "#85d7a9",
        "alpha": 0.22
      },
      "warning.solid": {
        "hex": "#c07d00",
        "alpha": 1
      },
      "warning.on": {
        "hex": "#08090c",
        "alpha": 1
      },
      "warning.text": {
        "hex": "#7b4f00",
        "alpha": 1
      },
      "warning.soft": {
        "hex": "#edb774",
        "alpha": 0.3
      },
      "danger.solid": {
        "hex": "#b14b46",
        "alpha": 1
      },
      "danger.on": {
        "hex": "#fdfdfe",
        "alpha": 1
      },
      "danger.text": {
        "hex": "#903a36",
        "alpha": 1
      },
      "danger.soft": {
        "hex": "#ffa8a0",
        "alpha": 0.2
      },
      "info.solid": {
        "hex": "#775db5",
        "alpha": 1
      },
      "info.on": {
        "hex": "#fdfdfe",
        "alpha": 1
      },
      "info.text": {
        "hex": "#5f4994",
        "alpha": 1
      },
      "info.soft": {
        "hex": "#c7b5ff",
        "alpha": 0.2
      },
      "diff.add": {
        "hex": "#56c289",
        "alpha": 0.18
      },
      "diff.remove": {
        "hex": "#f0877f",
        "alpha": 0.16
      },
      "focus.ring": {
        "hex": "#007f8a",
        "alpha": 1
      },
      "canvas.dot": {
        "hex": "#101215",
        "alpha": 0.13
      },
      "canvas.selection": {
        "hex": "#007f8a",
        "alpha": 1
      },
      "canvas.handle": {
        "hex": "#fdfdfe",
        "alpha": 1
      },
      "canvas.selection-on": {
        "hex": "#fdfdfe",
        "alpha": 1
      },
      "canvas.guide": {
        "hex": "#b14b46",
        "alpha": 1
      },
      "canvas.guide-on": {
        "hex": "#fdfdfe",
        "alpha": 1
      },
      "canvas.hover": {
        "hex": "#00a0ad",
        "alpha": 0.6
      },
      "canvas.marquee": {
        "hex": "#00bfcf",
        "alpha": 0.12
      },
      "canvas.label": {
        "hex": "#5a5e65",
        "alpha": 1
      },
      "canvas.checker-a": {
        "hex": "#fdfdfe",
        "alpha": 1
      },
      "canvas.checker-b": {
        "hex": "#dcdee2",
        "alpha": 1
      },
      "canvas.artboard": {
        "hex": "#fdfdfe",
        "alpha": 1
      },
      "agent.glow": {
        "hex": "#63d6e3",
        "alpha": 0.45
      },
      "identity.coral": {
        "hex": "#b14b46",
        "alpha": 1
      },
      "identity.iris": {
        "hex": "#775db5",
        "alpha": 1
      },
      "identity.mint": {
        "hex": "#006b41",
        "alpha": 1
      },
      "identity.amber": {
        "hex": "#7b4f00",
        "alpha": 1
      },
      "identity.slate": {
        "hex": "#5a5e65",
        "alpha": 1
      },
      "identity.on": {
        "hex": "#fdfdfe",
        "alpha": 1
      }
    },
    "dark": {
      "bg.app": {
        "hex": "#101215",
        "alpha": 1
      },
      "bg.canvas": {
        "hex": "#08090c",
        "alpha": 1
      },
      "bg.inset": {
        "hex": "#000000",
        "alpha": 0.22
      },
      "bg.scrim": {
        "hex": "#000000",
        "alpha": 0.5
      },
      "surface.base": {
        "hex": "#191c20",
        "alpha": 1
      },
      "surface.raised": {
        "hex": "#22252a",
        "alpha": 1
      },
      "surface.translucent": {
        "hex": "#191c20",
        "alpha": 0.72
      },
      "material.ultrathin": {
        "hex": "#22252a",
        "alpha": 0.28
      },
      "material.thin": {
        "hex": "#22252a",
        "alpha": 0.44
      },
      "material.regular": {
        "hex": "#191c20",
        "alpha": 0.62
      },
      "material.thick": {
        "hex": "#191c20",
        "alpha": 0.84
      },
      "material.rim": {
        "hex": "#ffffff",
        "alpha": 0.09
      },
      "material.edge": {
        "hex": "#000000",
        "alpha": 0.55
      },
      "material.specular": {
        "hex": "#ffffff",
        "alpha": 0.17
      },
      "material.sheen": {
        "hex": "#ffffff",
        "alpha": 0.1
      },
      "text.primary": {
        "hex": "#f9fafb",
        "alpha": 1
      },
      "text.secondary": {
        "hex": "#c9ccd1",
        "alpha": 1
      },
      "text.tertiary": {
        "hex": "#8b8f96",
        "alpha": 1
      },
      "text.placeholder": {
        "hex": "#8b8f96",
        "alpha": 1
      },
      "text.disabled": {
        "hex": "#6b6f76",
        "alpha": 1
      },
      "text.inverse": {
        "hex": "#101215",
        "alpha": 1
      },
      "text.link": {
        "hex": "#63d6e3",
        "alpha": 1
      },
      "border.subtle": {
        "hex": "#ffffff",
        "alpha": 0.06
      },
      "border.default": {
        "hex": "#ffffff",
        "alpha": 0.1
      },
      "border.strong": {
        "hex": "#ffffff",
        "alpha": 0.17
      },
      "border.control": {
        "hex": "#6b6f76",
        "alpha": 1
      },
      "fill.hover": {
        "hex": "#ffffff",
        "alpha": 0.05
      },
      "fill.pressed": {
        "hex": "#ffffff",
        "alpha": 0.08
      },
      "fill.selected": {
        "hex": "#ffffff",
        "alpha": 0.12
      },
      "control.off": {
        "hex": "#6b6f76",
        "alpha": 1
      },
      "control.thumb": {
        "hex": "#fdfdfe",
        "alpha": 1
      },
      "control.raised": {
        "hex": "#22252a",
        "alpha": 0.76
      },
      "control.raised-hover": {
        "hex": "#303339",
        "alpha": 0.82
      },
      "control.edge": {
        "hex": "#ffffff",
        "alpha": 0.08
      },
      "ink.solid": {
        "hex": "#474b51",
        "alpha": 0.86
      },
      "ink.hover": {
        "hex": "#5a5e65",
        "alpha": 0.86
      },
      "ink.on": {
        "hex": "#f9fafb",
        "alpha": 1
      },
      "ink.on-muted": {
        "hex": "#f9fafb",
        "alpha": 0.75
      },
      "ink.kbd": {
        "hex": "#ffffff",
        "alpha": 0.09
      },
      "swatch.edge": {
        "hex": "#000000",
        "alpha": 0.1
      },
      "accent.solid": {
        "hex": "#00bfcf",
        "alpha": 1
      },
      "accent.hover": {
        "hex": "#63d6e3",
        "alpha": 1
      },
      "accent.on": {
        "hex": "#08090c",
        "alpha": 1
      },
      "accent.text": {
        "hex": "#63d6e3",
        "alpha": 1
      },
      "accent.soft": {
        "hex": "#00bfcf",
        "alpha": 0.17
      },
      "accent.border": {
        "hex": "#00bfcf",
        "alpha": 0.45
      },
      "accent.glow": {
        "hex": "#00bfcf",
        "alpha": 0.3
      },
      "accent.fill": {
        "hex": "#00bfcf",
        "alpha": 0.9
      },
      "accent.fill-hover": {
        "hex": "#63d6e3",
        "alpha": 0.92
      },
      "success.solid": {
        "hex": "#56c289",
        "alpha": 1
      },
      "success.on": {
        "hex": "#08090c",
        "alpha": 1
      },
      "success.text": {
        "hex": "#85d7a9",
        "alpha": 1
      },
      "success.soft": {
        "hex": "#21a76b",
        "alpha": 0.2
      },
      "warning.solid": {
        "hex": "#db9b40",
        "alpha": 1
      },
      "warning.on": {
        "hex": "#08090c",
        "alpha": 1
      },
      "warning.text": {
        "hex": "#edb774",
        "alpha": 1
      },
      "warning.soft": {
        "hex": "#c07d00",
        "alpha": 0.2
      },
      "danger.solid": {
        "hex": "#f0877f",
        "alpha": 1
      },
      "danger.on": {
        "hex": "#08090c",
        "alpha": 1
      },
      "danger.text": {
        "hex": "#ffa8a0",
        "alpha": 1
      },
      "danger.soft": {
        "hex": "#d66760",
        "alpha": 0.2
      },
      "info.solid": {
        "hex": "#af98f2",
        "alpha": 1
      },
      "info.on": {
        "hex": "#08090c",
        "alpha": 1
      },
      "info.text": {
        "hex": "#c7b5ff",
        "alpha": 1
      },
      "info.soft": {
        "hex": "#957ada",
        "alpha": 0.2
      },
      "diff.add": {
        "hex": "#21a76b",
        "alpha": 0.18
      },
      "diff.remove": {
        "hex": "#d66760",
        "alpha": 0.18
      },
      "focus.ring": {
        "hex": "#00bfcf",
        "alpha": 1
      },
      "canvas.dot": {
        "hex": "#ffffff",
        "alpha": 0.08
      },
      "canvas.selection": {
        "hex": "#00a0ad",
        "alpha": 1
      },
      "canvas.handle": {
        "hex": "#fdfdfe",
        "alpha": 1
      },
      "canvas.selection-on": {
        "hex": "#08090c",
        "alpha": 1
      },
      "canvas.guide": {
        "hex": "#d66760",
        "alpha": 1
      },
      "canvas.guide-on": {
        "hex": "#08090c",
        "alpha": 1
      },
      "canvas.hover": {
        "hex": "#00a0ad",
        "alpha": 0.6
      },
      "canvas.marquee": {
        "hex": "#00bfcf",
        "alpha": 0.14
      },
      "canvas.label": {
        "hex": "#8b8f96",
        "alpha": 1
      },
      "canvas.checker-a": {
        "hex": "#303339",
        "alpha": 1
      },
      "canvas.checker-b": {
        "hex": "#474b51",
        "alpha": 1
      },
      "canvas.artboard": {
        "hex": "#fdfdfe",
        "alpha": 1
      },
      "agent.glow": {
        "hex": "#00bfcf",
        "alpha": 0.35
      },
      "identity.coral": {
        "hex": "#b14b46",
        "alpha": 1
      },
      "identity.iris": {
        "hex": "#775db5",
        "alpha": 1
      },
      "identity.mint": {
        "hex": "#006b41",
        "alpha": 1
      },
      "identity.amber": {
        "hex": "#7b4f00",
        "alpha": 1
      },
      "identity.slate": {
        "hex": "#5a5e65",
        "alpha": 1
      },
      "identity.on": {
        "hex": "#fdfdfe",
        "alpha": 1
      }
    }
  },
  "primitiveHex": {
    "neutral": {
      "0": "#fdfdfe",
      "25": "#f9fafb",
      "50": "#f4f5f7",
      "100": "#ebedef",
      "150": "#e4e6ea",
      "200": "#dcdee2",
      "300": "#c9ccd1",
      "400": "#8b8f96",
      "500": "#6b6f76",
      "600": "#5a5e65",
      "700": "#474b51",
      "800": "#303339",
      "850": "#22252a",
      "900": "#191c20",
      "950": "#101215",
      "1000": "#08090c"
    },
    "accent": {
      "25": "#f1fdfe",
      "50": "#e2f9fb",
      "100": "#c6f1f6",
      "200": "#9be6ef",
      "300": "#63d6e3",
      "400": "#00bfcf",
      "500": "#00a0ad",
      "600": "#007f8a",
      "700": "#00666e",
      "800": "#004d54",
      "900": "#00353a",
      "950": "#002226"
    },
    "mint": {
      "25": "#f4fdf7",
      "50": "#e7f9ed",
      "100": "#d0f2dd",
      "200": "#aee7c5",
      "300": "#85d7a9",
      "400": "#56c289",
      "500": "#21a76b",
      "600": "#008652",
      "700": "#006b41",
      "800": "#005230",
      "900": "#003820",
      "950": "#032414"
    },
    "amber": {
      "25": "#fff9f2",
      "50": "#fef1e2",
      "100": "#fbe4c8",
      "200": "#f7d0a1",
      "300": "#edb774",
      "400": "#db9b40",
      "500": "#c07d00",
      "600": "#996300",
      "700": "#7b4f00",
      "800": "#5e3b00",
      "900": "#412700",
      "950": "#2b1800"
    },
    "coral": {
      "25": "#fff8f8",
      "50": "#ffefee",
      "100": "#ffdfdc",
      "200": "#ffc8c3",
      "300": "#ffa8a0",
      "400": "#f0877f",
      "500": "#d66760",
      "600": "#b14b46",
      "700": "#903a36",
      "800": "#6e2c29",
      "900": "#4b1d1b",
      "950": "#311211"
    },
    "iris": {
      "25": "#faf9ff",
      "50": "#f4f1ff",
      "100": "#e9e3ff",
      "200": "#dad0ff",
      "300": "#c7b5ff",
      "400": "#af98f2",
      "500": "#957ada",
      "600": "#775db5",
      "700": "#5f4994",
      "800": "#483770",
      "900": "#31254d",
      "950": "#1f1732"
    }
  },
  "space": {
    "0": 0,
    "1": 4,
    "2": 8,
    "3": 12,
    "4": 16,
    "5": 20,
    "6": 24,
    "8": 32,
    "10": 40,
    "12": 48,
    "16": 64,
    "18": 72,
    "0.25": 1,
    "0.5": 2,
    "0.75": 3,
    "1.25": 5,
    "1.5": 6,
    "1.75": 7,
    "2.5": 10,
    "3.5": 14,
    "4.5": 18,
    "6.5": 26
  },
  "inset": {
    "compact": [
      12,
      12
    ],
    "regular": [
      14,
      15
    ]
  },
  "radius": {
    "none": 0,
    "xs": 4,
    "sm": 6,
    "md": 8,
    "lg": 10,
    "xl": 12,
    "2xl": 16,
    "3xl": 22,
    "4xl": 28,
    "5xl": 32,
    "full": 999
  },
  "size": {
    "control": {
      "2xs": 20,
      "xs": 24,
      "sm": 28,
      "md": 32,
      "lg": 40,
      "xl": 48
    },
    "control-compact": {
      "2xs": 18,
      "xs": 22,
      "sm": 24,
      "md": 28,
      "lg": 36,
      "xl": 44
    },
    "field": {
      "sm": 36,
      "md": 40,
      "lg": 44
    },
    "field-compact": {
      "sm": 32,
      "md": 36,
      "lg": 40
    },
    "icon": {
      "xs": 12,
      "sm": 14,
      "md": 16,
      "lg": 20,
      "xl": 24
    },
    "component": {
      "check": 18,
      "radio-dot": 7,
      "kbd-h": 18,
      "progress-h": 6,
      "tool-icon": 24,
      "presence": 8,
      "switch-md-w": 46,
      "switch-md-h": 28,
      "switch-md-thumb": 24,
      "switch-md-travel": 18,
      "switch-md-press": 30,
      "switch-sm-w": 38,
      "switch-sm-h": 23,
      "switch-sm-thumb": 19,
      "switch-sm-travel": 15,
      "switch-sm-press": 24,
      "avatar-xs": 16,
      "avatar-sm": 24,
      "avatar-md": 32,
      "avatar-lg": 36,
      "dialog-sm": 320,
      "dialog-md": 480,
      "dialog-lg": 640,
      "chip-h": 26,
      "chip-icon": 13,
      "spinner-lg": 28,
      "control-inline": 26,
      "tab-h": 34,
      "textarea-min": 92,
      "otp-w": 44,
      "otp-h": 52,
      "slider-ruler-h": 30,
      "slider-label-w": 52,
      "menu-item": 30,
      "menu-min": 220,
      "listbox-max": 220,
      "popover-sm": 240,
      "popover-md": 280,
      "popover-arrow": 12,
      "calendar": 284,
      "calendar-day": 36,
      "icon-send": 15
    },
    "hit-min": 24
  },
  "font": {
    "ui": "\"Geist\", \"Pretendard Variable\", \"Pretendard\", \"Noto Sans KR\", ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", sans-serif",
    "voice": "\"Newsreader\", \"Noto Serif KR\", ui-serif, Georgia, serif",
    "mono": "\"Geist Mono\", ui-monospace, \"SF Mono\", \"Cascadia Code\", Consolas, monospace"
  },
  "type": {
    "display": [
      "ui",
      40,
      44,
      600,
      -0.035
    ],
    "title-1": [
      "ui",
      26,
      32,
      600,
      -0.022
    ],
    "title-2": [
      "ui",
      20,
      26,
      600,
      -0.016
    ],
    "title-3": [
      "ui",
      15,
      20,
      600,
      -0.01
    ],
    "body": [
      "ui",
      14,
      21,
      400,
      -0.003
    ],
    "ui": [
      "ui",
      13,
      18,
      400,
      -0.003
    ],
    "ui-strong": [
      "ui",
      13,
      18,
      500,
      -0.003
    ],
    "ui-sm": [
      "ui",
      12,
      18,
      500,
      0
    ],
    "ui-lg": [
      "ui",
      14,
      20,
      500,
      -0.003
    ],
    "footnote": [
      "ui",
      12,
      16,
      400,
      0
    ],
    "caption": [
      "ui",
      11,
      14,
      500,
      0.06,
      "uppercase"
    ],
    "label": [
      "ui",
      11.5,
      14,
      500,
      0
    ],
    "voice": [
      "voice",
      16,
      25,
      400,
      -0.003
    ],
    "voice-sm": [
      "voice",
      15,
      23,
      400,
      -0.003
    ],
    "thought": [
      "voice",
      14,
      22,
      400,
      0,
      "italic"
    ],
    "mono": [
      "mono",
      12,
      18,
      400,
      0
    ],
    "mono-sm": [
      "mono",
      11,
      16,
      500,
      0
    ],
    "mono-strong": [
      "mono",
      12,
      18,
      500,
      0
    ],
    "ui-dense": [
      "ui",
      12.5,
      18,
      400,
      -0.003
    ],
    "hint": [
      "ui",
      11.5,
      18,
      400,
      0
    ],
    "micro": [
      "ui",
      11,
      14,
      600,
      0
    ],
    "ui-xs": [
      "ui",
      11,
      18,
      400,
      0
    ],
    "ui-md": [
      "ui",
      13.5,
      18,
      500,
      -0.003
    ],
    "ui-relaxed": [
      "ui",
      13,
      19,
      400,
      -0.003
    ],
    "ui-dense-relaxed": [
      "ui",
      12.5,
      19,
      400,
      -0.003
    ],
    "figure": [
      "ui",
      20,
      18,
      600,
      -0.02
    ],
    "mono-md": [
      "mono",
      11.5,
      16,
      500,
      0
    ],
    "mono-lg": [
      "mono",
      20,
      20,
      600,
      0
    ]
  },
  "elevation": {
    "light": {
      "1": "0 1px 2px oklch(0.2 0.02 260 / 0.06)",
      "2": "0 1px 2px oklch(0.2 0.02 260 / 0.05), 0 4px 12px -2px oklch(0.2 0.02 260 / 0.08)",
      "3": "0 2px 4px oklch(0.2 0.02 260 / 0.04), 0 12px 28px -6px oklch(0.2 0.02 260 / 0.12)",
      "4": "0 4px 8px oklch(0.2 0.02 260 / 0.05), 0 24px 48px -12px oklch(0.2 0.02 260 / 0.18)",
      "5": "0 8px 16px oklch(0.2 0.02 260 / 0.06), 0 40px 80px -16px oklch(0.2 0.02 260 / 0.28)",
      "thumb": "0 0 0 0.5px oklch(0 0 0 / 0.12), 0 1px 2px oklch(0 0 0 / 0.16), 0 3px 8px oklch(0 0 0 / 0.12)",
      "thumb-sm": "0 0 0 0.5px oklch(0 0 0 / 0.12), 0 2px 6px oklch(0 0 0 / 0.2)",
      "thumb-swatch": "0 0 0 3px var(--cs-color-control-thumb), 0 0 0 3.5px oklch(0 0 0 / 0.14), 0 2px 8px oklch(0 0 0 / 0.25)"
    },
    "dark": {
      "1": "0 1px 2px oklch(0 0 0 / 0.3)",
      "2": "0 1px 2px oklch(0 0 0 / 0.3), 0 4px 12px -2px oklch(0 0 0 / 0.35)",
      "3": "0 2px 4px oklch(0 0 0 / 0.25), 0 12px 28px -6px oklch(0 0 0 / 0.45)",
      "4": "0 4px 8px oklch(0 0 0 / 0.25), 0 24px 48px -12px oklch(0 0 0 / 0.55)",
      "5": "0 8px 16px oklch(0 0 0 / 0.3), 0 40px 80px -16px oklch(0 0 0 / 0.65)",
      "thumb": "0 0 0 0.5px oklch(0 0 0 / 0.12), 0 1px 2px oklch(0 0 0 / 0.16), 0 3px 8px oklch(0 0 0 / 0.12)",
      "thumb-sm": "0 0 0 0.5px oklch(0 0 0 / 0.12), 0 2px 6px oklch(0 0 0 / 0.2)",
      "thumb-swatch": "0 0 0 3px var(--cs-color-control-thumb), 0 0 0 3.5px oklch(0 0 0 / 0.14), 0 2px 8px oklch(0 0 0 / 0.25)"
    }
  },
  "blur": {
    "control": 12,
    "ultrathin": 14,
    "thin": 20,
    "regular": 24,
    "thick": 36,
    "overlay": 40
  },
  "motion": {
    "duration": {
      "instant": 0,
      "quick": 120,
      "base": 200,
      "gentle": 320,
      "slow": 480,
      "spin": 700,
      "shimmer": 2200,
      "agent": 4800
    },
    "easing": {
      "standard": "cubic-bezier(0.2, 0, 0, 1)",
      "out": "cubic-bezier(0.2, 0.8, 0.2, 1)",
      "in": "cubic-bezier(0.4, 0, 1, 1)",
      "spring": "linear(0, 0.009, 0.035 2.1%, 0.141, 0.281 6.7%, 0.723 12.9%, 0.938 16.7%, 1.017, 1.077, 1.121, 1.149 24.3%, 1.159, 1.163, 1.161, 1.154 29.9%, 1.129 32.8%, 1.051 39.6%, 1.017 43.1%, 0.991, 0.977 51%, 0.974 53.8%, 0.975 57.1%, 0.997 69.8%, 1.003 76.9%, 1)",
      "linear": "linear"
    }
  },
  "opacity": {
    "disabled": 0.42,
    "muted": 0.64
  },
  "z": {
    "canvas": 0,
    "canvas-overlay": 10,
    "chrome": 20,
    "sticky": 30,
    "popover": 40,
    "dialog": 60,
    "toast": 80,
    "tooltip": 90,
    "palette": 100
  },
  "breakpoint": {
    "compact": 720,
    "medium": 1100,
    "wide": 1440
  },
  "studio": {
    "window-radius": 32,
    "window-inset": 10,
    "panel-radius": 22,
    "titlebar-h": 44,
    "rail-w": 48,
    "pane-w": 352,
    "pane-min": 320,
    "pane-max": 480,
    "inspector-w": 272,
    "inspector-min": 240,
    "inspector-max": 360,
    "toolbar-h": 42,
    "toolbar-radius": 14,
    "toolbar-item-radius": 10,
    "toast-radius": 22
  },
  "contrastRules": [
    [
      "text.primary",
      "surface.base",
      7,
      "AAA body"
    ],
    [
      "text.primary",
      "surface.raised",
      7,
      "AAA body"
    ],
    [
      "text.primary",
      "bg.app",
      7,
      "AAA body"
    ],
    [
      "text.secondary",
      "surface.base",
      4.5,
      "AA body"
    ],
    [
      "text.secondary",
      "surface.raised",
      4.5,
      "AA body"
    ],
    [
      "text.secondary",
      "bg.app",
      4.5,
      "AA body"
    ],
    [
      "text.tertiary",
      "surface.base",
      4.5,
      "AA meta text"
    ],
    [
      "text.tertiary",
      "surface.raised",
      4.5,
      "AA meta text"
    ],
    [
      "text.tertiary",
      "bg.app",
      4.5,
      "AA meta text"
    ],
    [
      "text.placeholder",
      "surface.base",
      4.5,
      "placeholder carries meaning"
    ],
    [
      "text.tertiary",
      "fill.hover@bg.app",
      4.5,
      "meta text on a hover/sunken fill (inspector fields, kbd)"
    ],
    [
      "text.tertiary",
      "fill.pressed@bg.app",
      4.5,
      "meta text on a pressed fill"
    ],
    [
      "text.placeholder",
      "fill.hover@bg.app",
      4.5,
      "placeholder in a sunken field"
    ],
    [
      "text.disabled",
      "surface.base",
      3,
      "disabled, non-essential"
    ],
    [
      "text.link",
      "surface.base",
      4.5,
      "AA link"
    ],
    [
      "text.secondary",
      "material.regular@bg.canvas",
      4.5,
      "panel text over canvas"
    ],
    [
      "text.tertiary",
      "material.thick@bg.canvas",
      4.5,
      "menu meta over canvas"
    ],
    [
      "text.primary",
      "material.regular@accent.400",
      4.5,
      "panel over saturated content"
    ],
    [
      "text.primary",
      "fill.selected@surface.base",
      7,
      "selected row"
    ],
    [
      "ink.on",
      "ink.solid",
      7,
      "primary button"
    ],
    [
      "ink.on",
      "ink.hover",
      4.5,
      "primary button hover"
    ],
    [
      "ink.on-muted",
      "ink.kbd@ink.solid",
      4.5,
      "tooltip shortcut"
    ],
    [
      "text.primary",
      "control.raised",
      7,
      "secondary button, segmented thumb"
    ],
    [
      "text.primary",
      "control.raised-hover",
      7,
      "secondary button hover"
    ],
    [
      "text.primary",
      "surface.translucent",
      7,
      "translucent list, field, card"
    ],
    [
      "text.tertiary",
      "surface.translucent",
      4.5,
      "meta text on translucent surface"
    ],
    [
      "text.primary",
      "surface.translucent@accent.400",
      4.5,
      "translucent surface over saturated content"
    ],
    [
      "accent.on",
      "accent.solid",
      4.5,
      "accent button"
    ],
    [
      "accent.on",
      "accent.fill",
      4.5,
      "accent button (frosted fill)"
    ],
    [
      "accent.on",
      "accent.fill-hover",
      4.5,
      "accent button hover"
    ],
    [
      "accent.text",
      "surface.base",
      4.5,
      "accent text"
    ],
    [
      "accent.text",
      "accent.soft@surface.base",
      4.5,
      "selected/bound chip"
    ],
    [
      "success.text",
      "success.soft@surface.base",
      4.5,
      "status badge"
    ],
    [
      "warning.text",
      "warning.soft@surface.base",
      4.5,
      "status badge"
    ],
    [
      "danger.text",
      "danger.soft@surface.base",
      4.5,
      "status badge"
    ],
    [
      "info.text",
      "info.soft@surface.base",
      4.5,
      "status badge"
    ],
    [
      "success.on",
      "success.solid",
      3,
      "status icon"
    ],
    [
      "warning.on",
      "warning.solid",
      3,
      "status icon"
    ],
    [
      "danger.on",
      "danger.solid",
      4.5,
      "destructive button"
    ],
    [
      "info.on",
      "info.solid",
      3,
      "status icon"
    ],
    [
      "text.primary",
      "diff.add@surface.base",
      7,
      "diff line"
    ],
    [
      "text.primary",
      "diff.remove@surface.base",
      7,
      "diff line"
    ],
    [
      "border.control",
      "surface.base",
      3,
      "checkbox/radio boundary (1.4.11)"
    ],
    [
      "control.off",
      "surface.base",
      3,
      "switch off track (1.4.11)"
    ],
    [
      "focus.ring",
      "surface.base",
      3,
      "focus indicator (2.4.11)"
    ],
    [
      "focus.ring",
      "bg.canvas",
      3,
      "focus indicator on canvas"
    ],
    [
      "canvas.selection",
      "bg.canvas",
      3,
      "selection outline"
    ],
    [
      "canvas.selection",
      "canvas.artboard",
      3,
      "selection on white artboard"
    ],
    [
      "canvas.guide",
      "canvas.artboard",
      3,
      "smart guide on artboard"
    ],
    [
      "canvas.guide",
      "bg.canvas",
      3,
      "smart guide on canvas"
    ],
    [
      "canvas.handle",
      "canvas.selection",
      3,
      "handle fill vs outline"
    ],
    [
      "canvas.guide-on",
      "canvas.guide",
      4.5,
      "measurement label"
    ],
    [
      "canvas.selection-on",
      "canvas.selection",
      4.5,
      "selection size label"
    ],
    [
      "canvas.label",
      "bg.canvas",
      4.5,
      "frame label"
    ],
    [
      "identity.on",
      "identity.coral",
      4.5,
      "avatar initials"
    ],
    [
      "identity.on",
      "identity.iris",
      4.5,
      "avatar initials"
    ],
    [
      "identity.on",
      "identity.mint",
      4.5,
      "avatar initials"
    ],
    [
      "identity.on",
      "identity.amber",
      4.5,
      "avatar initials"
    ],
    [
      "identity.on",
      "identity.slate",
      4.5,
      "avatar initials"
    ]
  ]
};
