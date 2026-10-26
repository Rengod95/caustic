export default {
  "meta": {
    "name": "Caustic",
    "version": "1.0.0",
    "prefix": "cs"
  },
  "hueSteps": [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11
  ],
  "rampSteps": [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11
  ],
  "rampRule": {
    "fixedL": {
      "light": [
        0.985,
        0.965,
        0.935,
        0.905,
        0.87,
        0.8
      ],
      "dark": [
        0.225,
        0.255,
        0.29,
        0.32,
        0.355,
        0.42
      ]
    },
    "chromaShare": {
      "light": [
        0.14,
        0.28,
        0.46,
        0.58,
        0.7,
        0.8,
        0.9,
        1
      ],
      "dark": [
        0.22,
        0.32,
        0.46,
        0.56,
        0.66,
        0.76,
        0.88,
        1
      ]
    },
    "graphicMin": 3,
    "textMin": 4.5
  },
  "solids": {
    "accent": {
      "name": "Deep Black",
      "role": "Accent: primary emphasis, links, selection on canvas, focus (separate from ink, decision 1)",
      "light": [
        0.11,
        0,
        0
      ],
      "dark": [
        0.97,
        0,
        0
      ]
    },
    "success": {
      "name": "Pad Green",
      "role": "Success, diff add",
      "light": [
        0.77,
        0.298,
        155
      ],
      "dark": [
        0.725,
        0.124,
        146
      ]
    },
    "warning": {
      "name": "Tape Yellow",
      "role": "Warning, permission",
      "light": [
        0.66,
        0.1,
        95
      ],
      "dark": [
        0.84,
        0.143,
        118
      ]
    },
    "danger": {
      "name": "Signal Orange",
      "role": "Danger, diff remove",
      "light": [
        0.82,
        0.37,
        30
      ],
      "dark": [
        0.64,
        0.178,
        42
      ]
    },
    "info": {
      "name": "Panel Blue",
      "role": "Info, review, user guides",
      "light": [
        0.78,
        0.362,
        235
      ],
      "dark": [
        0.625,
        0.169,
        266
      ]
    },
    "agent-1": {
      "name": "Signal",
      "role": "Agent gradient stop 1; the agent tone",
      "light": [
        0.78,
        0.09,
        55
      ],
      "dark": [
        0.74,
        0.09,
        55
      ]
    },
    "agent-2": {
      "name": "Panel",
      "role": "Agent gradient stop 2",
      "light": [
        0.78,
        0.06,
        235
      ],
      "dark": [
        0.75,
        0.06,
        235
      ]
    },
    "agent-3": {
      "name": "Pad",
      "role": "Agent gradient stop 3",
      "light": [
        0.8,
        0.08,
        150
      ],
      "dark": [
        0.86,
        0.37,
        150
      ]
    },
    "extra-1": {
      "name": "Knob Orange",
      "role": "Chart series 5, illustration, syntax property",
      "light": [
        0.64,
        0.12,
        50
      ],
      "dark": [
        0.72,
        0.11,
        50
      ]
    },
    "extra-2": {
      "name": "Dust Blue",
      "role": "Chart series 6, illustration",
      "light": [
        0.6,
        0.07,
        240
      ],
      "dark": [
        0.72,
        0.065,
        240
      ]
    },
    "canvas-guide": {
      "name": "Guide Magenta",
      "role": "Canvas smart guides only (decision 4)",
      "light": [
        0.6,
        0.2,
        345
      ],
      "dark": [
        0.72,
        0.17,
        345
      ]
    }
  },
  "hues": {
    "accent": {
      "name": "Deep Black",
      "hue": 0,
      "live": false,
      "role": "Accent: primary emphasis, links, selection on canvas, focus (separate from ink, decision 1)"
    },
    "success": {
      "name": "Pad Green",
      "hue": 155,
      "live": false,
      "role": "Success, diff add"
    },
    "warning": {
      "name": "Tape Yellow",
      "hue": 95,
      "live": false,
      "role": "Warning, permission"
    },
    "danger": {
      "name": "Signal Orange",
      "hue": 30,
      "live": false,
      "role": "Danger, diff remove"
    },
    "info": {
      "name": "Panel Blue",
      "hue": 235,
      "live": false,
      "role": "Info, review, user guides"
    },
    "agent-1": {
      "name": "Signal",
      "hue": 55,
      "live": false,
      "role": "Agent gradient stop 1; the agent tone"
    },
    "agent-2": {
      "name": "Panel",
      "hue": 235,
      "live": false,
      "role": "Agent gradient stop 2"
    },
    "agent-3": {
      "name": "Pad",
      "hue": 150,
      "live": false,
      "role": "Agent gradient stop 3"
    },
    "extra-1": {
      "name": "Knob Orange",
      "hue": 50,
      "live": false,
      "role": "Chart series 5, illustration, syntax property"
    },
    "extra-2": {
      "name": "Dust Blue",
      "hue": 240,
      "live": false,
      "role": "Chart series 6, illustration"
    },
    "canvas-guide": {
      "name": "Guide Magenta",
      "hue": 345,
      "live": false,
      "role": "Canvas smart guides only (decision 4)"
    }
  },
  "neutral": {
    "name": "Deep Black",
    "hue": 0,
    "chroma": 0,
    "light": [
      0.995,
      0.975,
      0.93,
      0.875,
      0.79,
      0.6,
      0.55,
      0.5,
      0.44,
      0.29,
      0.12
    ],
    "dark": [
      0.09,
      0.135,
      0.18,
      0.225,
      0.345,
      0.535,
      0.595,
      0.645,
      0.7,
      0.795,
      0.96
    ]
  },
  "ramps": {
    "neutral": {
      "name": "Deep Black",
      "light": [
        [
          0.995,
          0,
          0
        ],
        [
          0.975,
          0,
          0
        ],
        [
          0.93,
          0,
          0
        ],
        [
          0.875,
          0,
          0
        ],
        [
          0.79,
          0,
          0
        ],
        [
          0.6,
          0,
          0
        ],
        [
          0.55,
          0,
          0
        ],
        [
          0.5,
          0,
          0
        ],
        [
          0.44,
          0,
          0
        ],
        [
          0.29,
          0,
          0
        ],
        [
          0.12,
          0,
          0
        ]
      ],
      "dark": [
        [
          0.09,
          0,
          0
        ],
        [
          0.135,
          0,
          0
        ],
        [
          0.18,
          0,
          0
        ],
        [
          0.225,
          0,
          0
        ],
        [
          0.345,
          0,
          0
        ],
        [
          0.535,
          0,
          0
        ],
        [
          0.595,
          0,
          0
        ],
        [
          0.645,
          0,
          0
        ],
        [
          0.7,
          0,
          0
        ],
        [
          0.795,
          0,
          0
        ],
        [
          0.96,
          0,
          0
        ]
      ],
      "hex": {
        "light": [
          "#fdfdfd",
          "#f7f7f7",
          "#e8e8e8",
          "#d6d6d6",
          "#bababa",
          "#808080",
          "#717171",
          "#636363",
          "#525252",
          "#2b2b2b",
          "#060606"
        ],
        "dark": [
          "#020202",
          "#080808",
          "#121212",
          "#1c1c1c",
          "#393939",
          "#6d6d6d",
          "#7f7f7f",
          "#8d8d8d",
          "#9e9e9e",
          "#bcbcbc",
          "#f2f2f2"
        ]
      },
      "on": {
        "light": "neutral-light.1",
        "dark": "neutral-light.11"
      }
    },
    "accent": {
      "name": "Deep Black",
      "light": [
        [
          0.985,
          0,
          0
        ],
        [
          0.965,
          0,
          0
        ],
        [
          0.935,
          0,
          0
        ],
        [
          0.905,
          0,
          0
        ],
        [
          0.87,
          0,
          0
        ],
        [
          0.8,
          0,
          0
        ],
        [
          0.524,
          0,
          0
        ],
        [
          0.317,
          0,
          0
        ],
        [
          0.11,
          0,
          0
        ],
        [
          0.23,
          0,
          0
        ],
        [
          0.07,
          0,
          0
        ]
      ],
      "dark": [
        [
          0.225,
          0,
          0
        ],
        [
          0.255,
          0,
          0
        ],
        [
          0.29,
          0,
          0
        ],
        [
          0.32,
          0,
          0
        ],
        [
          0.355,
          0,
          0
        ],
        [
          0.42,
          0,
          0
        ],
        [
          0.64,
          0,
          0
        ],
        [
          0.805,
          0,
          0
        ],
        [
          0.97,
          0,
          0
        ],
        [
          0.89,
          0,
          0
        ],
        [
          0.97,
          0,
          0
        ]
      ],
      "hex": {
        "light": [
          "#fafafa",
          "#f3f3f3",
          "#e9e9e9",
          "#dfdfdf",
          "#d4d4d4",
          "#bebebe",
          "#6a6a6a",
          "#323232",
          "#040404",
          "#1d1d1d",
          "#010101"
        ],
        "dark": [
          "#1c1c1c",
          "#232323",
          "#2b2b2b",
          "#333333",
          "#3c3c3c",
          "#4d4d4d",
          "#8c8c8c",
          "#bfbfbf",
          "#f5f5f5",
          "#dbdbdb",
          "#f5f5f5"
        ]
      },
      "on": {
        "light": "neutral-light.1",
        "dark": "neutral-light.11"
      }
    },
    "success": {
      "name": "Pad Green",
      "light": [
        [
          0.985,
          0.0228,
          155
        ],
        [
          0.965,
          0.0533,
          155
        ],
        [
          0.935,
          0.0876,
          155
        ],
        [
          0.905,
          0.1105,
          155
        ],
        [
          0.87,
          0.1334,
          155
        ],
        [
          0.844,
          0.1524,
          155
        ],
        [
          0.8144,
          0.1715,
          155
        ],
        [
          0.7922,
          0.1905,
          155
        ],
        [
          0.77,
          0.1905,
          155
        ],
        [
          0.72,
          0.1782,
          155
        ],
        [
          0.465,
          0.1155,
          155
        ]
      ],
      "dark": [
        [
          0.225,
          0.0272,
          146
        ],
        [
          0.255,
          0.0396,
          146
        ],
        [
          0.29,
          0.057,
          146
        ],
        [
          0.32,
          0.0694,
          146
        ],
        [
          0.355,
          0.0818,
          146
        ],
        [
          0.42,
          0.0942,
          146
        ],
        [
          0.542,
          0.1091,
          146
        ],
        [
          0.6335,
          0.124,
          146
        ],
        [
          0.725,
          0.124,
          146
        ],
        [
          0.775,
          0.124,
          146
        ],
        [
          0.815,
          0.124,
          146
        ]
      ],
      "hex": {
        "light": [
          "#effff4",
          "#d8ffe4",
          "#bbfcd0",
          "#a3f6c0",
          "#87eead",
          "#6ee99f",
          "#4ee290",
          "#1ede83",
          "#00d67c",
          "#00c471",
          "#006b3b"
        ],
        "dark": [
          "#131f14",
          "#162817",
          "#173319",
          "#183c1c",
          "#1a4720",
          "#255a2c",
          "#408047",
          "#539e5b",
          "#70bb76",
          "#7fcb85",
          "#8cd891"
        ]
      },
      "on": {
        "light": "neutral-light.11",
        "dark": "neutral-light.11"
      }
    },
    "warning": {
      "name": "Tape Yellow",
      "light": [
        [
          0.985,
          0.014,
          95
        ],
        [
          0.965,
          0.028,
          95
        ],
        [
          0.935,
          0.046,
          95
        ],
        [
          0.905,
          0.058,
          95
        ],
        [
          0.87,
          0.0699,
          95
        ],
        [
          0.8,
          0.08,
          95
        ],
        [
          0.744,
          0.09,
          95
        ],
        [
          0.702,
          0.1,
          95
        ],
        [
          0.66,
          0.1,
          95
        ],
        [
          0.61,
          0.1,
          95
        ],
        [
          0.47,
          0.0971,
          95
        ]
      ],
      "dark": [
        [
          0.225,
          0.0314,
          118
        ],
        [
          0.255,
          0.0457,
          118
        ],
        [
          0.29,
          0.0657,
          118
        ],
        [
          0.32,
          0.076,
          118
        ],
        [
          0.355,
          0.0839,
          118
        ],
        [
          0.42,
          0.0986,
          118
        ],
        [
          0.588,
          0.1258,
          118
        ],
        [
          0.714,
          0.1429,
          118
        ],
        [
          0.84,
          0.1429,
          118
        ],
        [
          0.89,
          0.1429,
          118
        ],
        [
          0.93,
          0.1429,
          118
        ]
      ],
      "hex": {
        "light": [
          "#fdfaf0",
          "#f9f4df",
          "#f3eac8",
          "#ebe0b5",
          "#e2d4a0",
          "#cebe82",
          "#beac68",
          "#b29e52",
          "#a59145",
          "#968234",
          "#6c5900"
        ],
        "dark": [
          "#1a1e0c",
          "#21260a",
          "#292f02",
          "#303700",
          "#384100",
          "#495400",
          "#76861d",
          "#9bae37",
          "#c2d764",
          "#d2e874",
          "#dff582"
        ]
      },
      "on": {
        "light": "neutral-light.11",
        "dark": "neutral-light.11"
      }
    },
    "danger": {
      "name": "Signal Orange",
      "light": [
        [
          0.985,
          0.0073,
          30
        ],
        [
          0.965,
          0.0173,
          30
        ],
        [
          0.935,
          0.033,
          30
        ],
        [
          0.905,
          0.0495,
          30
        ],
        [
          0.87,
          0.0699,
          30
        ],
        [
          0.857,
          0.0778,
          30
        ],
        [
          0.8422,
          0.0871,
          30
        ],
        [
          0.8311,
          0.0942,
          30
        ],
        [
          0.82,
          0.1015,
          30
        ],
        [
          0.77,
          0.1015,
          30
        ],
        [
          0.475,
          0.1015,
          30
        ]
      ],
      "dark": [
        [
          0.225,
          0.0391,
          42
        ],
        [
          0.255,
          0.0569,
          42
        ],
        [
          0.29,
          0.0818,
          42
        ],
        [
          0.32,
          0.0987,
          42
        ],
        [
          0.355,
          0.1089,
          42
        ],
        [
          0.42,
          0.128,
          42
        ],
        [
          0.508,
          0.1541,
          42
        ],
        [
          0.574,
          0.1738,
          42
        ],
        [
          0.64,
          0.178,
          42
        ],
        [
          0.69,
          0.178,
          42
        ],
        [
          0.735,
          0.1696,
          42
        ]
      ],
      "hex": {
        "light": [
          "#fff8f7",
          "#ffefed",
          "#ffe2dd",
          "#ffd4cd",
          "#ffc4b9",
          "#ffbeb2",
          "#ffb6aa",
          "#ffb1a3",
          "#ffab9d",
          "#ee9c8e",
          "#8c4339"
        ],
        "dark": [
          "#2b150d",
          "#39180b",
          "#4b1a04",
          "#591c00",
          "#672200",
          "#832e00",
          "#aa3e00",
          "#c84a00",
          "#e15e20",
          "#f36e34",
          "#ff7f4b"
        ]
      },
      "on": {
        "light": "neutral-light.11",
        "dark": "neutral-light.11"
      }
    },
    "info": {
      "name": "Panel Blue",
      "light": [
        [
          0.985,
          0.0083,
          235
        ],
        [
          0.965,
          0.0196,
          235
        ],
        [
          0.935,
          0.0367,
          235
        ],
        [
          0.905,
          0.0542,
          235
        ],
        [
          0.87,
          0.0751,
          235
        ],
        [
          0.8466,
          0.0894,
          235
        ],
        [
          0.82,
          0.106,
          235
        ],
        [
          0.8,
          0.1186,
          235
        ],
        [
          0.78,
          0.1315,
          235
        ],
        [
          0.73,
          0.1315,
          235
        ],
        [
          0.465,
          0.0992,
          235
        ]
      ],
      "dark": [
        [
          0.225,
          0.0371,
          266
        ],
        [
          0.255,
          0.054,
          266
        ],
        [
          0.29,
          0.0777,
          266
        ],
        [
          0.32,
          0.0946,
          266
        ],
        [
          0.355,
          0.1115,
          266
        ],
        [
          0.42,
          0.1284,
          266
        ],
        [
          0.502,
          0.1487,
          266
        ],
        [
          0.5635,
          0.169,
          266
        ],
        [
          0.625,
          0.169,
          266
        ],
        [
          0.675,
          0.169,
          266
        ],
        [
          0.73,
          0.139,
          266
        ]
      ],
      "hex": {
        "light": [
          "#f5fbff",
          "#e8f6ff",
          "#d3eeff",
          "#bee6ff",
          "#a4ddff",
          "#92d7ff",
          "#7bcfff",
          "#69caff",
          "#54c4ff",
          "#41b4ee",
          "#006188"
        ],
        "dark": [
          "#141b2d",
          "#16213d",
          "#192952",
          "#1c2f62",
          "#203675",
          "#2c4792",
          "#3b5db8",
          "#466dd7",
          "#5780ed",
          "#6590fe",
          "#7ea4ff"
        ]
      },
      "on": {
        "light": "neutral-light.11",
        "dark": "neutral-light.11"
      }
    },
    "agent-1": {
      "name": "Signal",
      "light": [
        [
          0.985,
          0.0086,
          55
        ],
        [
          0.965,
          0.0204,
          55
        ],
        [
          0.935,
          0.0387,
          55
        ],
        [
          0.905,
          0.0522,
          55
        ],
        [
          0.87,
          0.063,
          55
        ],
        [
          0.8466,
          0.072,
          55
        ],
        [
          0.82,
          0.081,
          55
        ],
        [
          0.8,
          0.09,
          55
        ],
        [
          0.78,
          0.09,
          55
        ],
        [
          0.73,
          0.09,
          55
        ],
        [
          0.47,
          0.09,
          55
        ]
      ],
      "dark": [
        [
          0.225,
          0.0197,
          55
        ],
        [
          0.255,
          0.0288,
          55
        ],
        [
          0.29,
          0.0414,
          55
        ],
        [
          0.32,
          0.0504,
          55
        ],
        [
          0.355,
          0.0594,
          55
        ],
        [
          0.42,
          0.0684,
          55
        ],
        [
          0.548,
          0.0791,
          55
        ],
        [
          0.644,
          0.09,
          55
        ],
        [
          0.74,
          0.09,
          55
        ],
        [
          0.79,
          0.09,
          55
        ],
        [
          0.83,
          0.09,
          55
        ]
      ],
      "hex": {
        "light": [
          "#fff9f5",
          "#fff0e7",
          "#ffe3d2",
          "#fcd7bf",
          "#f6caad",
          "#f2c1a0",
          "#eeb792",
          "#ebaf86",
          "#e5a880",
          "#d49970",
          "#814c24"
        ],
        "dark": [
          "#231913",
          "#2e1f15",
          "#3b2617",
          "#472c19",
          "#54331c",
          "#6a4227",
          "#956443",
          "#b87e57",
          "#d79c73",
          "#e8ab83",
          "#f6b88f"
        ]
      },
      "on": {
        "light": "neutral-light.11",
        "dark": "neutral-light.11"
      }
    },
    "agent-2": {
      "name": "Panel",
      "light": [
        [
          0.985,
          0.0083,
          235
        ],
        [
          0.965,
          0.0168,
          235
        ],
        [
          0.935,
          0.0276,
          235
        ],
        [
          0.905,
          0.0348,
          235
        ],
        [
          0.87,
          0.0419,
          235
        ],
        [
          0.8466,
          0.048,
          235
        ],
        [
          0.82,
          0.054,
          235
        ],
        [
          0.8,
          0.06,
          235
        ],
        [
          0.78,
          0.06,
          235
        ],
        [
          0.73,
          0.06,
          235
        ],
        [
          0.465,
          0.06,
          235
        ]
      ],
      "dark": [
        [
          0.225,
          0.0132,
          235
        ],
        [
          0.255,
          0.0191,
          235
        ],
        [
          0.29,
          0.0276,
          235
        ],
        [
          0.32,
          0.0336,
          235
        ],
        [
          0.355,
          0.0396,
          235
        ],
        [
          0.42,
          0.0456,
          235
        ],
        [
          0.552,
          0.0528,
          235
        ],
        [
          0.651,
          0.06,
          235
        ],
        [
          0.75,
          0.06,
          235
        ],
        [
          0.8,
          0.06,
          235
        ],
        [
          0.84,
          0.06,
          235
        ]
      ],
      "hex": {
        "light": [
          "#f5fbff",
          "#e9f6fd",
          "#d9edfa",
          "#cae4f4",
          "#bbd9ec",
          "#afd2e8",
          "#a3cae3",
          "#99c5df",
          "#92bed9",
          "#83aec8",
          "#365f76"
        ],
        "dark": [
          "#161d21",
          "#1a242b",
          "#1e2e37",
          "#213642",
          "#273f4e",
          "#345163",
          "#53778d",
          "#6b96af",
          "#89b5cf",
          "#99c5df",
          "#a5d2ed"
        ]
      },
      "on": {
        "light": "neutral-light.11",
        "dark": "neutral-light.11"
      }
    },
    "agent-3": {
      "name": "Pad",
      "light": [
        [
          0.985,
          0.0112,
          150
        ],
        [
          0.965,
          0.0224,
          150
        ],
        [
          0.935,
          0.0368,
          150
        ],
        [
          0.905,
          0.0463,
          150
        ],
        [
          0.87,
          0.0559,
          150
        ],
        [
          0.8518,
          0.064,
          150
        ],
        [
          0.8311,
          0.072,
          150
        ],
        [
          0.8155,
          0.08,
          150
        ],
        [
          0.8,
          0.08,
          150
        ],
        [
          0.75,
          0.08,
          150
        ],
        [
          0.465,
          0.08,
          150
        ]
      ],
      "dark": [
        [
          0.225,
          0.0521,
          150
        ],
        [
          0.255,
          0.0724,
          150
        ],
        [
          0.29,
          0.0816,
          150
        ],
        [
          0.32,
          0.0895,
          150
        ],
        [
          0.355,
          0.0989,
          150
        ],
        [
          0.42,
          0.1164,
          150
        ],
        [
          0.596,
          0.1645,
          150
        ],
        [
          0.728,
          0.2007,
          150
        ],
        [
          0.86,
          0.237,
          150
        ],
        [
          0.91,
          0.1607,
          150
        ],
        [
          0.95,
          0.0835,
          150
        ]
      ],
      "hex": {
        "light": [
          "#f5fcf6",
          "#e9f8ec",
          "#d9f1dd",
          "#cbe9d0",
          "#bbdfc1",
          "#b1dbb9",
          "#a7d5af",
          "#9ed2a8",
          "#99cda3",
          "#8abd93",
          "#366641"
        ],
        "dark": [
          "#06220e",
          "#002c0f",
          "#003614",
          "#003f18",
          "#00491d",
          "#005e28",
          "#009945",
          "#00c85d",
          "#00fa76",
          "#8bffa7",
          "#c7ffd1"
        ]
      },
      "on": {
        "light": "neutral-light.11",
        "dark": "neutral-light.11"
      }
    },
    "extra-1": {
      "name": "Knob Orange",
      "light": [
        [
          0.985,
          0.0082,
          50
        ],
        [
          0.965,
          0.0194,
          50
        ],
        [
          0.935,
          0.0368,
          50
        ],
        [
          0.905,
          0.0551,
          50
        ],
        [
          0.87,
          0.0776,
          50
        ],
        [
          0.8,
          0.096,
          50
        ],
        [
          0.736,
          0.108,
          50
        ],
        [
          0.688,
          0.12,
          50
        ],
        [
          0.64,
          0.12,
          50
        ],
        [
          0.59,
          0.12,
          50
        ],
        [
          0.475,
          0.12,
          50
        ]
      ],
      "dark": [
        [
          0.225,
          0.0242,
          50
        ],
        [
          0.255,
          0.0352,
          50
        ],
        [
          0.29,
          0.0506,
          50
        ],
        [
          0.32,
          0.0616,
          50
        ],
        [
          0.355,
          0.0726,
          50
        ],
        [
          0.42,
          0.0836,
          50
        ],
        [
          0.54,
          0.0968,
          50
        ],
        [
          0.63,
          0.11,
          50
        ],
        [
          0.72,
          0.11,
          50
        ],
        [
          0.77,
          0.11,
          50
        ],
        [
          0.81,
          0.11,
          50
        ]
      ],
      "hex": {
        "light": [
          "#fff9f5",
          "#fff0e8",
          "#ffe3d4",
          "#ffd6c0",
          "#ffc6a7",
          "#f0ac86",
          "#e0956a",
          "#d68353",
          "#c67544",
          "#b56535",
          "#90440b"
        ],
        "dark": [
          "#251811",
          "#311e13",
          "#3f2313",
          "#4b2914",
          "#592f15",
          "#713e1f",
          "#9b5d38",
          "#be7449",
          "#dc9064",
          "#ed9f73",
          "#fbac7f"
        ]
      },
      "on": {
        "light": "neutral-light.11",
        "dark": "neutral-light.11"
      }
    },
    "extra-2": {
      "name": "Dust Blue",
      "light": [
        [
          0.985,
          0.0079,
          240
        ],
        [
          0.965,
          0.0186,
          240
        ],
        [
          0.935,
          0.0322,
          240
        ],
        [
          0.905,
          0.0406,
          240
        ],
        [
          0.87,
          0.049,
          240
        ],
        [
          0.8,
          0.056,
          240
        ],
        [
          0.72,
          0.063,
          240
        ],
        [
          0.66,
          0.07,
          240
        ],
        [
          0.6,
          0.07,
          240
        ],
        [
          0.55,
          0.07,
          240
        ],
        [
          0.465,
          0.07,
          240
        ]
      ],
      "dark": [
        [
          0.225,
          0.0143,
          240
        ],
        [
          0.255,
          0.0208,
          240
        ],
        [
          0.29,
          0.0299,
          240
        ],
        [
          0.32,
          0.0364,
          240
        ],
        [
          0.355,
          0.0429,
          240
        ],
        [
          0.42,
          0.0494,
          240
        ],
        [
          0.54,
          0.0572,
          240
        ],
        [
          0.63,
          0.065,
          240
        ],
        [
          0.72,
          0.065,
          240
        ],
        [
          0.77,
          0.065,
          240
        ],
        [
          0.81,
          0.065,
          240
        ]
      ],
      "hex": {
        "light": [
          "#f6fbff",
          "#e9f6ff",
          "#d7edfd",
          "#c8e4f8",
          "#b8d9f2",
          "#9ec3df",
          "#81aac9",
          "#6a98b9",
          "#5886a6",
          "#4a7797",
          "#315e7d"
        ],
        "dark": [
          "#161d22",
          "#1a242c",
          "#1d2d39",
          "#213544",
          "#263f50",
          "#335165",
          "#4f738d",
          "#648fad",
          "#7fabca",
          "#8fbada",
          "#9bc7e7"
        ]
      },
      "on": {
        "light": "neutral-light.11",
        "dark": "neutral-light.11"
      }
    },
    "canvas-guide": {
      "name": "Guide Magenta",
      "light": [
        [
          0.985,
          0.0091,
          345
        ],
        [
          0.965,
          0.0216,
          345
        ],
        [
          0.935,
          0.0412,
          345
        ],
        [
          0.905,
          0.0619,
          345
        ],
        [
          0.87,
          0.0877,
          345
        ],
        [
          0.8,
          0.1452,
          345
        ],
        [
          0.72,
          0.18,
          345
        ],
        [
          0.66,
          0.2,
          345
        ],
        [
          0.6,
          0.2,
          345
        ],
        [
          0.55,
          0.2,
          345
        ],
        [
          0.485,
          0.2,
          345
        ]
      ],
      "dark": [
        [
          0.225,
          0.0374,
          345
        ],
        [
          0.255,
          0.0544,
          345
        ],
        [
          0.29,
          0.0782,
          345
        ],
        [
          0.32,
          0.0952,
          345
        ],
        [
          0.355,
          0.1122,
          345
        ],
        [
          0.42,
          0.1292,
          345
        ],
        [
          0.54,
          0.1496,
          345
        ],
        [
          0.63,
          0.17,
          345
        ],
        [
          0.72,
          0.17,
          345
        ],
        [
          0.77,
          0.17,
          345
        ],
        [
          0.81,
          0.1364,
          345
        ]
      ],
      "hex": {
        "light": [
          "#fff8fb",
          "#ffeef7",
          "#ffdff0",
          "#ffd0e9",
          "#ffbee1",
          "#ff96d3",
          "#f070be",
          "#e253ae",
          "#cd3f9b",
          "#bb2d8c",
          "#a50c78"
        ],
        "dark": [
          "#281420",
          "#351729",
          "#451834",
          "#531a3e",
          "#621d49",
          "#7b295d",
          "#a84482",
          "#cd57a0",
          "#ed74bd",
          "#fe83cd",
          "#ff9cd5"
        ]
      },
      "on": {
        "light": "neutral-light.11",
        "dark": "neutral-light.11"
      }
    }
  },
  "slotSteps": {
    "tint": 2,
    "soft": 3,
    "soft-hover": 4,
    "soft-pressed": 5,
    "border": 6,
    "border-strong": 7,
    "graphic": 8,
    "solid": 9,
    "solid-hover": 10,
    "text": 11,
    "on": "on"
  },
  "tones": {
    "accent": "accent",
    "neutral": "neutral",
    "success": "success",
    "warning": "warning",
    "danger": "danger",
    "info": "info",
    "agent": "agent-1"
  },
  "aliases": {
    "accent.hover": "accent.solid-hover",
    "ink.hover": "ink.solid-hover",
    "accent.fill": "accent.solid",
    "accent.fill-hover": "accent.solid-hover",
    "accent.glow": "agent.glow",
    "text.link": "accent.text",
    "text.disabled": "disabled.text",
    "fill.hover": "neutral.hover",
    "fill.pressed": "neutral.pressed",
    "fill.selected": "neutral.selected",
    "diff.add": "diff.add-bg",
    "diff.remove": "diff.remove-bg"
  },
  "themes": {
    "light": {
      "bg.app": "neutral.2",
      "bg.canvas": "neutral.3",
      "bg.inset": "neutral.11/0.04",
      "bg.scrim": "neutral.11/0.24",
      "surface.base": "neutral.1",
      "surface.raised": "neutral.1",
      "surface.raised-translucent": "neutral.1",
      "surface.translucent": "neutral.1",
      "material.ultrathin": "neutral.1",
      "material.thin": "neutral.1",
      "material.regular": "neutral.1",
      "material.thick": "neutral.1",
      "material.rim": "white/0",
      "material.edge": "neutral.11/0",
      "material.specular": "white/0",
      "material.sheen": "white/0",
      "text.primary": "neutral.11",
      "text.secondary": "neutral.10",
      "text.tertiary": "neutral.9",
      "text.placeholder": "neutral.8",
      "text.inverse": "neutral.1",
      "border.subtle": "neutral.11/0.05",
      "border.default": "neutral.11/0.08",
      "divider.line": "neutral.11/0.08",
      "border.strong": "neutral.11/0.13",
      "border.control": "neutral.6",
      "control.off": "neutral.6",
      "control.thumb": "neutral-light.1",
      "control.raised": "neutral.1",
      "control.raised-hover": "neutral.2",
      "control.edge": "neutral.11/0.07",
      "ink.solid": "neutral.11",
      "ink.solid-hover": "neutral.10",
      "ink.on": "neutral-light.1",
      "ink.on-muted": "neutral-light.1/0.75",
      "ink.kbd": "white/0.09",
      "swatch.edge": "black/0.1",
      "media.on": "white/1",
      "media.on-muted": "white/0.82",
      "media.scrim": "black/0.55",
      "media.chip": "white/0.2",
      "media.scrim-strong": "black/0.78",
      "media.shade": "black/1",
      "shadow.ambient": "neutral-light.11",
      "shadow.contact": "black/1",
      "accent.tint": "accent.2",
      "accent.soft": "accent.3",
      "accent.soft-hover": "accent.4",
      "accent.soft-pressed": "accent.5",
      "accent.border": "accent.6",
      "accent.border-strong": "accent.7",
      "accent.graphic": "accent.8",
      "accent.solid": "accent.9",
      "accent.solid-hover": "accent.10",
      "accent.text": "accent.11",
      "accent.on": "accent.on",
      "neutral.tint": "neutral.2",
      "neutral.soft": "neutral.3",
      "neutral.soft-hover": "neutral.4",
      "neutral.soft-pressed": "neutral.5",
      "neutral.border": "neutral.6",
      "neutral.border-strong": "neutral.7",
      "neutral.graphic": "neutral.8",
      "neutral.solid": "neutral.9",
      "neutral.solid-hover": "neutral.10",
      "neutral.text": "neutral.11",
      "neutral.on": "neutral.on",
      "success.tint": "success.2",
      "success.soft": "success.3",
      "success.soft-hover": "success.4",
      "success.soft-pressed": "success.5",
      "success.border": "success.6",
      "success.border-strong": "success.7",
      "success.graphic": "success.8",
      "success.solid": "success.9",
      "success.solid-hover": "success.10",
      "success.text": "success.11",
      "success.on": "success.on",
      "warning.tint": "warning.2",
      "warning.soft": "warning.3",
      "warning.soft-hover": "warning.4",
      "warning.soft-pressed": "warning.5",
      "warning.border": "warning.6",
      "warning.border-strong": "warning.7",
      "warning.graphic": "warning.8",
      "warning.solid": "warning.9",
      "warning.solid-hover": "warning.10",
      "warning.text": "warning.11",
      "warning.on": "warning.on",
      "danger.tint": "danger.2",
      "danger.soft": "danger.3",
      "danger.soft-hover": "danger.4",
      "danger.soft-pressed": "danger.5",
      "danger.border": "danger.6",
      "danger.border-strong": "danger.7",
      "danger.graphic": "danger.8",
      "danger.solid": "danger.9",
      "danger.solid-hover": "danger.10",
      "danger.text": "danger.11",
      "danger.on": "danger.on",
      "info.tint": "info.2",
      "info.soft": "info.3",
      "info.soft-hover": "info.4",
      "info.soft-pressed": "info.5",
      "info.border": "info.6",
      "info.border-strong": "info.7",
      "info.graphic": "info.8",
      "info.solid": "info.9",
      "info.solid-hover": "info.10",
      "info.text": "info.11",
      "info.on": "info.on",
      "agent.tint": "agent-1.2",
      "agent.soft": "agent-1.3",
      "agent.soft-hover": "agent-1.4",
      "agent.soft-pressed": "agent-1.5",
      "agent.border": "agent-1.6",
      "agent.border-strong": "agent-1.7",
      "agent.graphic": "agent-1.8",
      "agent.solid": "agent-1.9",
      "agent.solid-hover": "agent-1.10",
      "agent.text": "agent-1.11",
      "agent.on": "agent-1.on",
      "neutral.hover": "neutral.11/0.045",
      "neutral.pressed": "neutral.11/0.075",
      "neutral.selected": "neutral.11/0.11",
      "neutral.selected-hover": "neutral.11/0.145",
      "neutral.track": "neutral.11/0.075",
      "neutral.well": "neutral.11/0.035",
      "focus.ring": "accent.9",
      "focus.offset": "=surface.base",
      "selection.edge": "neutral.7",
      "selection.fill": "=ink.solid",
      "selection.fill-hover": "=ink.solid-hover",
      "selection.on": "=ink.on",
      "selection.on-secondary": "neutral-light.4",
      "selection.on-tertiary": "neutral-light.5",
      "disabled.fill": "neutral.3",
      "disabled.text": "neutral.6",
      "disabled.border": "neutral.4",
      "required.mark": "=text.tertiary",
      "chart.1": "accent.8",
      "chart.2": "info.8",
      "chart.3": "success.8",
      "chart.4": "warning.8",
      "chart.5": "extra-1.8",
      "chart.6": "extra-2.8",
      "agent.stop-1": "agent-1.9",
      "agent.stop-2": "agent-2.9",
      "agent.stop-3": "agent-3.9",
      "agent.glow": "agent-1.9/0.45",
      "diff.add-bg": "success.3",
      "diff.remove-bg": "danger.3",
      "diff.add-text": "success.11",
      "diff.remove-text": "danger.11",
      "syntax.keyword": "info.11",
      "syntax.string": "success.11",
      "syntax.property": "extra-1.11",
      "syntax.comment": "=text.secondary",
      "canvas.dot": "neutral.11/0.13",
      "canvas.selection": "accent.9",
      "canvas.handle": "neutral-light.1",
      "canvas.selection-on": "accent.on",
      "canvas.guide": "canvas-guide.9",
      "canvas.guide-on": "canvas-guide.on",
      "canvas.guide-user": "info.9",
      "canvas.hover": "accent.9/0.6",
      "canvas.marquee": "accent.9/0.14",
      "canvas.label": "neutral.9",
      "canvas.checker-a": "neutral.1",
      "canvas.checker-b": "neutral.3",
      "canvas.artboard": "neutral-light.1",
      "category.component": "info.11",
      "category.component-soft": "info.3",
      "identity.coral": "danger.9",
      "identity.iris": "info.9",
      "identity.mint": "success.9",
      "identity.amber": "warning.9",
      "identity.slate": "neutral.9",
      "identity.on-coral": "danger.on",
      "identity.on-iris": "info.on",
      "identity.on-mint": "success.on",
      "identity.on-amber": "warning.on",
      "identity.on-slate": "neutral.on",
      "identity.on": "=identity.on-slate",
      "accent.hover": "=accent.solid-hover",
      "ink.hover": "=ink.solid-hover",
      "accent.fill": "=accent.solid",
      "accent.fill-hover": "=accent.solid-hover",
      "accent.glow": "=agent.glow",
      "text.link": "=accent.text",
      "text.disabled": "=disabled.text",
      "fill.hover": "=neutral.hover",
      "fill.pressed": "=neutral.pressed",
      "fill.selected": "=neutral.selected",
      "diff.add": "=diff.add-bg",
      "diff.remove": "=diff.remove-bg"
    },
    "dark": {
      "bg.app": "neutral.2",
      "bg.canvas": "neutral.1",
      "bg.inset": "black/0.3",
      "bg.scrim": "black/0.5",
      "surface.base": "neutral.3",
      "surface.raised": "neutral.4",
      "surface.raised-translucent": "neutral.4",
      "surface.translucent": "neutral.3",
      "material.ultrathin": "neutral.4",
      "material.thin": "neutral.4",
      "material.regular": "neutral.4",
      "material.thick": "neutral.4",
      "material.rim": "white/0",
      "material.edge": "black/0",
      "material.specular": "white/0",
      "material.sheen": "white/0",
      "text.primary": "neutral.11",
      "text.secondary": "neutral.10",
      "text.tertiary": "neutral.9",
      "text.placeholder": "neutral.8",
      "text.inverse": "neutral.2",
      "border.subtle": "white/0.05",
      "border.default": "white/0.07",
      "divider.line": "white/0.07",
      "border.strong": "white/0.12",
      "border.control": "neutral.6",
      "control.off": "neutral.6",
      "control.thumb": "neutral-light.1",
      "control.raised": "neutral.4",
      "control.raised-hover": "neutral.5",
      "control.edge": "white/0.06",
      "ink.solid": "neutral.5",
      "ink.solid-hover": "neutral.6",
      "ink.on": "neutral-light.1",
      "ink.on-muted": "neutral-light.1/0.75",
      "ink.kbd": "white/0.09",
      "swatch.edge": "black/0.1",
      "media.on": "white/1",
      "media.on-muted": "white/0.82",
      "media.scrim": "black/0.55",
      "media.chip": "white/0.2",
      "media.scrim-strong": "black/0.78",
      "media.shade": "black/1",
      "shadow.ambient": "black/1",
      "shadow.contact": "black/1",
      "accent.tint": "accent.2",
      "accent.soft": "accent.3",
      "accent.soft-hover": "accent.4",
      "accent.soft-pressed": "accent.5",
      "accent.border": "accent.6",
      "accent.border-strong": "accent.7",
      "accent.graphic": "accent.8",
      "accent.solid": "accent.9",
      "accent.solid-hover": "accent.10",
      "accent.text": "accent.11",
      "accent.on": "accent.on",
      "neutral.tint": "neutral.2",
      "neutral.soft": "neutral.3",
      "neutral.soft-hover": "neutral.4",
      "neutral.soft-pressed": "neutral.5",
      "neutral.border": "neutral.6",
      "neutral.border-strong": "neutral.7",
      "neutral.graphic": "neutral.8",
      "neutral.solid": "neutral.9",
      "neutral.solid-hover": "neutral.10",
      "neutral.text": "neutral.11",
      "neutral.on": "neutral.on",
      "success.tint": "success.2",
      "success.soft": "success.3",
      "success.soft-hover": "success.4",
      "success.soft-pressed": "success.5",
      "success.border": "success.6",
      "success.border-strong": "success.7",
      "success.graphic": "success.8",
      "success.solid": "success.9",
      "success.solid-hover": "success.10",
      "success.text": "success.11",
      "success.on": "success.on",
      "warning.tint": "warning.2",
      "warning.soft": "warning.3",
      "warning.soft-hover": "warning.4",
      "warning.soft-pressed": "warning.5",
      "warning.border": "warning.6",
      "warning.border-strong": "warning.7",
      "warning.graphic": "warning.8",
      "warning.solid": "warning.9",
      "warning.solid-hover": "warning.10",
      "warning.text": "warning.11",
      "warning.on": "warning.on",
      "danger.tint": "danger.2",
      "danger.soft": "danger.3",
      "danger.soft-hover": "danger.4",
      "danger.soft-pressed": "danger.5",
      "danger.border": "danger.6",
      "danger.border-strong": "danger.7",
      "danger.graphic": "danger.8",
      "danger.solid": "danger.9",
      "danger.solid-hover": "danger.10",
      "danger.text": "danger.11",
      "danger.on": "danger.on",
      "info.tint": "info.2",
      "info.soft": "info.3",
      "info.soft-hover": "info.4",
      "info.soft-pressed": "info.5",
      "info.border": "info.6",
      "info.border-strong": "info.7",
      "info.graphic": "info.8",
      "info.solid": "info.9",
      "info.solid-hover": "info.10",
      "info.text": "info.11",
      "info.on": "info.on",
      "agent.tint": "agent-1.2",
      "agent.soft": "agent-1.3",
      "agent.soft-hover": "agent-1.4",
      "agent.soft-pressed": "agent-1.5",
      "agent.border": "agent-1.6",
      "agent.border-strong": "agent-1.7",
      "agent.graphic": "agent-1.8",
      "agent.solid": "agent-1.9",
      "agent.solid-hover": "agent-1.10",
      "agent.text": "agent-1.11",
      "agent.on": "agent-1.on",
      "neutral.hover": "white/0.05",
      "neutral.pressed": "white/0.08",
      "neutral.selected": "white/0.12",
      "neutral.selected-hover": "white/0.16",
      "neutral.track": "white/0.08",
      "neutral.well": "white/0.04",
      "focus.ring": "accent.9",
      "focus.offset": "=surface.base",
      "selection.edge": "neutral.7",
      "selection.fill": "=ink.solid",
      "selection.fill-hover": "=ink.solid-hover",
      "selection.on": "=ink.on",
      "selection.on-secondary": "neutral-dark.11",
      "selection.on-tertiary": "neutral-dark.10",
      "disabled.fill": "neutral.4",
      "disabled.text": "neutral.6",
      "disabled.border": "neutral.5",
      "required.mark": "=text.tertiary",
      "chart.1": "accent.8",
      "chart.2": "info.8",
      "chart.3": "success.8",
      "chart.4": "warning.8",
      "chart.5": "extra-1.8",
      "chart.6": "extra-2.8",
      "agent.stop-1": "agent-1.9",
      "agent.stop-2": "agent-2.9",
      "agent.stop-3": "agent-3.9",
      "agent.glow": "agent-1.9/0.35",
      "diff.add-bg": "success.3",
      "diff.remove-bg": "danger.3",
      "diff.add-text": "success.11",
      "diff.remove-text": "danger.11",
      "syntax.keyword": "info.11",
      "syntax.string": "success.11",
      "syntax.property": "extra-1.11",
      "syntax.comment": "=text.secondary",
      "canvas.dot": "white/0.08",
      "canvas.selection": "accent.9",
      "canvas.handle": "neutral-dark.1",
      "canvas.selection-on": "accent.on",
      "canvas.guide": "canvas-guide.9",
      "canvas.guide-on": "canvas-guide.on",
      "canvas.guide-user": "info.9",
      "canvas.hover": "accent.9/0.6",
      "canvas.marquee": "accent.9/0.14",
      "canvas.label": "neutral.9",
      "canvas.checker-a": "neutral.4",
      "canvas.checker-b": "neutral.5",
      "canvas.artboard": "neutral-light.1",
      "category.component": "info.11",
      "category.component-soft": "info.3",
      "identity.coral": "danger.9",
      "identity.iris": "info.9",
      "identity.mint": "success.9",
      "identity.amber": "warning.9",
      "identity.slate": "neutral.9",
      "identity.on-coral": "danger.on",
      "identity.on-iris": "info.on",
      "identity.on-mint": "success.on",
      "identity.on-amber": "warning.on",
      "identity.on-slate": "neutral.on",
      "identity.on": "=identity.on-slate",
      "accent.hover": "=accent.solid-hover",
      "ink.hover": "=ink.solid-hover",
      "accent.fill": "=accent.solid",
      "accent.fill-hover": "=accent.solid-hover",
      "accent.glow": "=agent.glow",
      "text.link": "=accent.text",
      "text.disabled": "=disabled.text",
      "fill.hover": "=neutral.hover",
      "fill.pressed": "=neutral.pressed",
      "fill.selected": "=neutral.selected",
      "diff.add": "=diff.add-bg",
      "diff.remove": "=diff.remove-bg"
    }
  },
  "resolved": {
    "light": {
      "bg.app": {
        "hex": "#f7f7f7",
        "alpha": 1
      },
      "bg.canvas": {
        "hex": "#e8e8e8",
        "alpha": 1
      },
      "bg.inset": {
        "hex": "#060606",
        "alpha": 0.04
      },
      "bg.scrim": {
        "hex": "#060606",
        "alpha": 0.24
      },
      "surface.base": {
        "hex": "#fdfdfd",
        "alpha": 1
      },
      "surface.raised": {
        "hex": "#fdfdfd",
        "alpha": 1
      },
      "surface.raised-translucent": {
        "hex": "#fdfdfd",
        "alpha": 1
      },
      "surface.translucent": {
        "hex": "#fdfdfd",
        "alpha": 1
      },
      "material.ultrathin": {
        "hex": "#fdfdfd",
        "alpha": 1
      },
      "material.thin": {
        "hex": "#fdfdfd",
        "alpha": 1
      },
      "material.regular": {
        "hex": "#fdfdfd",
        "alpha": 1
      },
      "material.thick": {
        "hex": "#fdfdfd",
        "alpha": 1
      },
      "material.rim": {
        "hex": "#ffffff",
        "alpha": 0
      },
      "material.edge": {
        "hex": "#060606",
        "alpha": 0
      },
      "material.specular": {
        "hex": "#ffffff",
        "alpha": 0
      },
      "material.sheen": {
        "hex": "#ffffff",
        "alpha": 0
      },
      "text.primary": {
        "hex": "#060606",
        "alpha": 1
      },
      "text.secondary": {
        "hex": "#2b2b2b",
        "alpha": 1
      },
      "text.tertiary": {
        "hex": "#525252",
        "alpha": 1
      },
      "text.placeholder": {
        "hex": "#636363",
        "alpha": 1
      },
      "text.inverse": {
        "hex": "#fdfdfd",
        "alpha": 1
      },
      "border.subtle": {
        "hex": "#060606",
        "alpha": 0.05
      },
      "border.default": {
        "hex": "#060606",
        "alpha": 0.08
      },
      "divider.line": {
        "hex": "#060606",
        "alpha": 0.08
      },
      "border.strong": {
        "hex": "#060606",
        "alpha": 0.13
      },
      "border.control": {
        "hex": "#808080",
        "alpha": 1
      },
      "control.off": {
        "hex": "#808080",
        "alpha": 1
      },
      "control.thumb": {
        "hex": "#fdfdfd",
        "alpha": 1
      },
      "control.raised": {
        "hex": "#fdfdfd",
        "alpha": 1
      },
      "control.raised-hover": {
        "hex": "#f7f7f7",
        "alpha": 1
      },
      "control.edge": {
        "hex": "#060606",
        "alpha": 0.07
      },
      "ink.solid": {
        "hex": "#060606",
        "alpha": 1
      },
      "ink.solid-hover": {
        "hex": "#2b2b2b",
        "alpha": 1
      },
      "ink.on": {
        "hex": "#fdfdfd",
        "alpha": 1
      },
      "ink.on-muted": {
        "hex": "#fdfdfd",
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
      "media.on": {
        "hex": "#ffffff",
        "alpha": 1
      },
      "media.on-muted": {
        "hex": "#ffffff",
        "alpha": 0.82
      },
      "media.scrim": {
        "hex": "#000000",
        "alpha": 0.55
      },
      "media.chip": {
        "hex": "#ffffff",
        "alpha": 0.2
      },
      "media.scrim-strong": {
        "hex": "#000000",
        "alpha": 0.78
      },
      "media.shade": {
        "hex": "#000000",
        "alpha": 1
      },
      "shadow.ambient": {
        "hex": "#060606",
        "alpha": 1
      },
      "shadow.contact": {
        "hex": "#000000",
        "alpha": 1
      },
      "accent.tint": {
        "hex": "#f3f3f3",
        "alpha": 1
      },
      "accent.soft": {
        "hex": "#e9e9e9",
        "alpha": 1
      },
      "accent.soft-hover": {
        "hex": "#dfdfdf",
        "alpha": 1
      },
      "accent.soft-pressed": {
        "hex": "#d4d4d4",
        "alpha": 1
      },
      "accent.border": {
        "hex": "#bebebe",
        "alpha": 1
      },
      "accent.border-strong": {
        "hex": "#6a6a6a",
        "alpha": 1
      },
      "accent.graphic": {
        "hex": "#323232",
        "alpha": 1
      },
      "accent.solid": {
        "hex": "#040404",
        "alpha": 1
      },
      "accent.solid-hover": {
        "hex": "#1d1d1d",
        "alpha": 1
      },
      "accent.text": {
        "hex": "#010101",
        "alpha": 1
      },
      "accent.on": {
        "hex": "#fdfdfd",
        "alpha": 1
      },
      "neutral.tint": {
        "hex": "#f7f7f7",
        "alpha": 1
      },
      "neutral.soft": {
        "hex": "#e8e8e8",
        "alpha": 1
      },
      "neutral.soft-hover": {
        "hex": "#d6d6d6",
        "alpha": 1
      },
      "neutral.soft-pressed": {
        "hex": "#bababa",
        "alpha": 1
      },
      "neutral.border": {
        "hex": "#808080",
        "alpha": 1
      },
      "neutral.border-strong": {
        "hex": "#717171",
        "alpha": 1
      },
      "neutral.graphic": {
        "hex": "#636363",
        "alpha": 1
      },
      "neutral.solid": {
        "hex": "#525252",
        "alpha": 1
      },
      "neutral.solid-hover": {
        "hex": "#2b2b2b",
        "alpha": 1
      },
      "neutral.text": {
        "hex": "#060606",
        "alpha": 1
      },
      "neutral.on": {
        "hex": "#fdfdfd",
        "alpha": 1
      },
      "success.tint": {
        "hex": "#d8ffe4",
        "alpha": 1
      },
      "success.soft": {
        "hex": "#bbfcd0",
        "alpha": 1
      },
      "success.soft-hover": {
        "hex": "#a3f6c0",
        "alpha": 1
      },
      "success.soft-pressed": {
        "hex": "#87eead",
        "alpha": 1
      },
      "success.border": {
        "hex": "#6ee99f",
        "alpha": 1
      },
      "success.border-strong": {
        "hex": "#4ee290",
        "alpha": 1
      },
      "success.graphic": {
        "hex": "#1ede83",
        "alpha": 1
      },
      "success.solid": {
        "hex": "#00d67c",
        "alpha": 1
      },
      "success.solid-hover": {
        "hex": "#00c471",
        "alpha": 1
      },
      "success.text": {
        "hex": "#006b3b",
        "alpha": 1
      },
      "success.on": {
        "hex": "#060606",
        "alpha": 1
      },
      "warning.tint": {
        "hex": "#f9f4df",
        "alpha": 1
      },
      "warning.soft": {
        "hex": "#f3eac8",
        "alpha": 1
      },
      "warning.soft-hover": {
        "hex": "#ebe0b5",
        "alpha": 1
      },
      "warning.soft-pressed": {
        "hex": "#e2d4a0",
        "alpha": 1
      },
      "warning.border": {
        "hex": "#cebe82",
        "alpha": 1
      },
      "warning.border-strong": {
        "hex": "#beac68",
        "alpha": 1
      },
      "warning.graphic": {
        "hex": "#b29e52",
        "alpha": 1
      },
      "warning.solid": {
        "hex": "#a59145",
        "alpha": 1
      },
      "warning.solid-hover": {
        "hex": "#968234",
        "alpha": 1
      },
      "warning.text": {
        "hex": "#6c5900",
        "alpha": 1
      },
      "warning.on": {
        "hex": "#060606",
        "alpha": 1
      },
      "danger.tint": {
        "hex": "#ffefed",
        "alpha": 1
      },
      "danger.soft": {
        "hex": "#ffe2dd",
        "alpha": 1
      },
      "danger.soft-hover": {
        "hex": "#ffd4cd",
        "alpha": 1
      },
      "danger.soft-pressed": {
        "hex": "#ffc4b9",
        "alpha": 1
      },
      "danger.border": {
        "hex": "#ffbeb2",
        "alpha": 1
      },
      "danger.border-strong": {
        "hex": "#ffb6aa",
        "alpha": 1
      },
      "danger.graphic": {
        "hex": "#ffb1a3",
        "alpha": 1
      },
      "danger.solid": {
        "hex": "#ffab9d",
        "alpha": 1
      },
      "danger.solid-hover": {
        "hex": "#ee9c8e",
        "alpha": 1
      },
      "danger.text": {
        "hex": "#8c4339",
        "alpha": 1
      },
      "danger.on": {
        "hex": "#060606",
        "alpha": 1
      },
      "info.tint": {
        "hex": "#e8f6ff",
        "alpha": 1
      },
      "info.soft": {
        "hex": "#d3eeff",
        "alpha": 1
      },
      "info.soft-hover": {
        "hex": "#bee6ff",
        "alpha": 1
      },
      "info.soft-pressed": {
        "hex": "#a4ddff",
        "alpha": 1
      },
      "info.border": {
        "hex": "#92d7ff",
        "alpha": 1
      },
      "info.border-strong": {
        "hex": "#7bcfff",
        "alpha": 1
      },
      "info.graphic": {
        "hex": "#69caff",
        "alpha": 1
      },
      "info.solid": {
        "hex": "#54c4ff",
        "alpha": 1
      },
      "info.solid-hover": {
        "hex": "#41b4ee",
        "alpha": 1
      },
      "info.text": {
        "hex": "#006188",
        "alpha": 1
      },
      "info.on": {
        "hex": "#060606",
        "alpha": 1
      },
      "agent.tint": {
        "hex": "#fff0e7",
        "alpha": 1
      },
      "agent.soft": {
        "hex": "#ffe3d2",
        "alpha": 1
      },
      "agent.soft-hover": {
        "hex": "#fcd7bf",
        "alpha": 1
      },
      "agent.soft-pressed": {
        "hex": "#f6caad",
        "alpha": 1
      },
      "agent.border": {
        "hex": "#f2c1a0",
        "alpha": 1
      },
      "agent.border-strong": {
        "hex": "#eeb792",
        "alpha": 1
      },
      "agent.graphic": {
        "hex": "#ebaf86",
        "alpha": 1
      },
      "agent.solid": {
        "hex": "#e5a880",
        "alpha": 1
      },
      "agent.solid-hover": {
        "hex": "#d49970",
        "alpha": 1
      },
      "agent.text": {
        "hex": "#814c24",
        "alpha": 1
      },
      "agent.on": {
        "hex": "#060606",
        "alpha": 1
      },
      "neutral.hover": {
        "hex": "#060606",
        "alpha": 0.045
      },
      "neutral.pressed": {
        "hex": "#060606",
        "alpha": 0.075
      },
      "neutral.selected": {
        "hex": "#060606",
        "alpha": 0.11
      },
      "neutral.selected-hover": {
        "hex": "#060606",
        "alpha": 0.145
      },
      "neutral.track": {
        "hex": "#060606",
        "alpha": 0.075
      },
      "neutral.well": {
        "hex": "#060606",
        "alpha": 0.035
      },
      "focus.ring": {
        "hex": "#040404",
        "alpha": 1
      },
      "focus.offset": {
        "hex": "#fdfdfd",
        "alpha": 1
      },
      "selection.edge": {
        "hex": "#717171",
        "alpha": 1
      },
      "selection.fill": {
        "hex": "#060606",
        "alpha": 1
      },
      "selection.fill-hover": {
        "hex": "#2b2b2b",
        "alpha": 1
      },
      "selection.on": {
        "hex": "#fdfdfd",
        "alpha": 1
      },
      "selection.on-secondary": {
        "hex": "#d6d6d6",
        "alpha": 1
      },
      "selection.on-tertiary": {
        "hex": "#bababa",
        "alpha": 1
      },
      "disabled.fill": {
        "hex": "#e8e8e8",
        "alpha": 1
      },
      "disabled.text": {
        "hex": "#808080",
        "alpha": 1
      },
      "disabled.border": {
        "hex": "#d6d6d6",
        "alpha": 1
      },
      "required.mark": {
        "hex": "#525252",
        "alpha": 1
      },
      "chart.1": {
        "hex": "#323232",
        "alpha": 1
      },
      "chart.2": {
        "hex": "#69caff",
        "alpha": 1
      },
      "chart.3": {
        "hex": "#1ede83",
        "alpha": 1
      },
      "chart.4": {
        "hex": "#b29e52",
        "alpha": 1
      },
      "chart.5": {
        "hex": "#d68353",
        "alpha": 1
      },
      "chart.6": {
        "hex": "#6a98b9",
        "alpha": 1
      },
      "agent.stop-1": {
        "hex": "#e5a880",
        "alpha": 1
      },
      "agent.stop-2": {
        "hex": "#92bed9",
        "alpha": 1
      },
      "agent.stop-3": {
        "hex": "#99cda3",
        "alpha": 1
      },
      "agent.glow": {
        "hex": "#e5a880",
        "alpha": 0.45
      },
      "diff.add-bg": {
        "hex": "#bbfcd0",
        "alpha": 1
      },
      "diff.remove-bg": {
        "hex": "#ffe2dd",
        "alpha": 1
      },
      "diff.add-text": {
        "hex": "#006b3b",
        "alpha": 1
      },
      "diff.remove-text": {
        "hex": "#8c4339",
        "alpha": 1
      },
      "syntax.keyword": {
        "hex": "#006188",
        "alpha": 1
      },
      "syntax.string": {
        "hex": "#006b3b",
        "alpha": 1
      },
      "syntax.property": {
        "hex": "#90440b",
        "alpha": 1
      },
      "syntax.comment": {
        "hex": "#2b2b2b",
        "alpha": 1
      },
      "canvas.dot": {
        "hex": "#060606",
        "alpha": 0.13
      },
      "canvas.selection": {
        "hex": "#040404",
        "alpha": 1
      },
      "canvas.handle": {
        "hex": "#fdfdfd",
        "alpha": 1
      },
      "canvas.selection-on": {
        "hex": "#fdfdfd",
        "alpha": 1
      },
      "canvas.guide": {
        "hex": "#cd3f9b",
        "alpha": 1
      },
      "canvas.guide-on": {
        "hex": "#060606",
        "alpha": 1
      },
      "canvas.guide-user": {
        "hex": "#54c4ff",
        "alpha": 1
      },
      "canvas.hover": {
        "hex": "#040404",
        "alpha": 0.6
      },
      "canvas.marquee": {
        "hex": "#040404",
        "alpha": 0.14
      },
      "canvas.label": {
        "hex": "#525252",
        "alpha": 1
      },
      "canvas.checker-a": {
        "hex": "#fdfdfd",
        "alpha": 1
      },
      "canvas.checker-b": {
        "hex": "#e8e8e8",
        "alpha": 1
      },
      "canvas.artboard": {
        "hex": "#fdfdfd",
        "alpha": 1
      },
      "category.component": {
        "hex": "#006188",
        "alpha": 1
      },
      "category.component-soft": {
        "hex": "#d3eeff",
        "alpha": 1
      },
      "identity.coral": {
        "hex": "#ffab9d",
        "alpha": 1
      },
      "identity.iris": {
        "hex": "#54c4ff",
        "alpha": 1
      },
      "identity.mint": {
        "hex": "#00d67c",
        "alpha": 1
      },
      "identity.amber": {
        "hex": "#a59145",
        "alpha": 1
      },
      "identity.slate": {
        "hex": "#525252",
        "alpha": 1
      },
      "identity.on-coral": {
        "hex": "#060606",
        "alpha": 1
      },
      "identity.on-iris": {
        "hex": "#060606",
        "alpha": 1
      },
      "identity.on-mint": {
        "hex": "#060606",
        "alpha": 1
      },
      "identity.on-amber": {
        "hex": "#060606",
        "alpha": 1
      },
      "identity.on-slate": {
        "hex": "#fdfdfd",
        "alpha": 1
      },
      "identity.on": {
        "hex": "#fdfdfd",
        "alpha": 1
      },
      "accent.hover": {
        "hex": "#1d1d1d",
        "alpha": 1
      },
      "ink.hover": {
        "hex": "#2b2b2b",
        "alpha": 1
      },
      "accent.fill": {
        "hex": "#040404",
        "alpha": 1
      },
      "accent.fill-hover": {
        "hex": "#1d1d1d",
        "alpha": 1
      },
      "accent.glow": {
        "hex": "#e5a880",
        "alpha": 0.45
      },
      "text.link": {
        "hex": "#010101",
        "alpha": 1
      },
      "text.disabled": {
        "hex": "#808080",
        "alpha": 1
      },
      "fill.hover": {
        "hex": "#060606",
        "alpha": 0.045
      },
      "fill.pressed": {
        "hex": "#060606",
        "alpha": 0.075
      },
      "fill.selected": {
        "hex": "#060606",
        "alpha": 0.11
      },
      "diff.add": {
        "hex": "#bbfcd0",
        "alpha": 1
      },
      "diff.remove": {
        "hex": "#ffe2dd",
        "alpha": 1
      }
    },
    "dark": {
      "bg.app": {
        "hex": "#080808",
        "alpha": 1
      },
      "bg.canvas": {
        "hex": "#020202",
        "alpha": 1
      },
      "bg.inset": {
        "hex": "#000000",
        "alpha": 0.3
      },
      "bg.scrim": {
        "hex": "#000000",
        "alpha": 0.5
      },
      "surface.base": {
        "hex": "#121212",
        "alpha": 1
      },
      "surface.raised": {
        "hex": "#1c1c1c",
        "alpha": 1
      },
      "surface.raised-translucent": {
        "hex": "#1c1c1c",
        "alpha": 1
      },
      "surface.translucent": {
        "hex": "#121212",
        "alpha": 1
      },
      "material.ultrathin": {
        "hex": "#1c1c1c",
        "alpha": 1
      },
      "material.thin": {
        "hex": "#1c1c1c",
        "alpha": 1
      },
      "material.regular": {
        "hex": "#1c1c1c",
        "alpha": 1
      },
      "material.thick": {
        "hex": "#1c1c1c",
        "alpha": 1
      },
      "material.rim": {
        "hex": "#ffffff",
        "alpha": 0
      },
      "material.edge": {
        "hex": "#000000",
        "alpha": 0
      },
      "material.specular": {
        "hex": "#ffffff",
        "alpha": 0
      },
      "material.sheen": {
        "hex": "#ffffff",
        "alpha": 0
      },
      "text.primary": {
        "hex": "#f2f2f2",
        "alpha": 1
      },
      "text.secondary": {
        "hex": "#bcbcbc",
        "alpha": 1
      },
      "text.tertiary": {
        "hex": "#9e9e9e",
        "alpha": 1
      },
      "text.placeholder": {
        "hex": "#8d8d8d",
        "alpha": 1
      },
      "text.inverse": {
        "hex": "#080808",
        "alpha": 1
      },
      "border.subtle": {
        "hex": "#ffffff",
        "alpha": 0.05
      },
      "border.default": {
        "hex": "#ffffff",
        "alpha": 0.07
      },
      "divider.line": {
        "hex": "#ffffff",
        "alpha": 0.07
      },
      "border.strong": {
        "hex": "#ffffff",
        "alpha": 0.12
      },
      "border.control": {
        "hex": "#6d6d6d",
        "alpha": 1
      },
      "control.off": {
        "hex": "#6d6d6d",
        "alpha": 1
      },
      "control.thumb": {
        "hex": "#fdfdfd",
        "alpha": 1
      },
      "control.raised": {
        "hex": "#1c1c1c",
        "alpha": 1
      },
      "control.raised-hover": {
        "hex": "#393939",
        "alpha": 1
      },
      "control.edge": {
        "hex": "#ffffff",
        "alpha": 0.06
      },
      "ink.solid": {
        "hex": "#393939",
        "alpha": 1
      },
      "ink.solid-hover": {
        "hex": "#6d6d6d",
        "alpha": 1
      },
      "ink.on": {
        "hex": "#fdfdfd",
        "alpha": 1
      },
      "ink.on-muted": {
        "hex": "#fdfdfd",
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
      "media.on": {
        "hex": "#ffffff",
        "alpha": 1
      },
      "media.on-muted": {
        "hex": "#ffffff",
        "alpha": 0.82
      },
      "media.scrim": {
        "hex": "#000000",
        "alpha": 0.55
      },
      "media.chip": {
        "hex": "#ffffff",
        "alpha": 0.2
      },
      "media.scrim-strong": {
        "hex": "#000000",
        "alpha": 0.78
      },
      "media.shade": {
        "hex": "#000000",
        "alpha": 1
      },
      "shadow.ambient": {
        "hex": "#000000",
        "alpha": 1
      },
      "shadow.contact": {
        "hex": "#000000",
        "alpha": 1
      },
      "accent.tint": {
        "hex": "#232323",
        "alpha": 1
      },
      "accent.soft": {
        "hex": "#2b2b2b",
        "alpha": 1
      },
      "accent.soft-hover": {
        "hex": "#333333",
        "alpha": 1
      },
      "accent.soft-pressed": {
        "hex": "#3c3c3c",
        "alpha": 1
      },
      "accent.border": {
        "hex": "#4d4d4d",
        "alpha": 1
      },
      "accent.border-strong": {
        "hex": "#8c8c8c",
        "alpha": 1
      },
      "accent.graphic": {
        "hex": "#bfbfbf",
        "alpha": 1
      },
      "accent.solid": {
        "hex": "#f5f5f5",
        "alpha": 1
      },
      "accent.solid-hover": {
        "hex": "#dbdbdb",
        "alpha": 1
      },
      "accent.text": {
        "hex": "#f5f5f5",
        "alpha": 1
      },
      "accent.on": {
        "hex": "#060606",
        "alpha": 1
      },
      "neutral.tint": {
        "hex": "#080808",
        "alpha": 1
      },
      "neutral.soft": {
        "hex": "#121212",
        "alpha": 1
      },
      "neutral.soft-hover": {
        "hex": "#1c1c1c",
        "alpha": 1
      },
      "neutral.soft-pressed": {
        "hex": "#393939",
        "alpha": 1
      },
      "neutral.border": {
        "hex": "#6d6d6d",
        "alpha": 1
      },
      "neutral.border-strong": {
        "hex": "#7f7f7f",
        "alpha": 1
      },
      "neutral.graphic": {
        "hex": "#8d8d8d",
        "alpha": 1
      },
      "neutral.solid": {
        "hex": "#9e9e9e",
        "alpha": 1
      },
      "neutral.solid-hover": {
        "hex": "#bcbcbc",
        "alpha": 1
      },
      "neutral.text": {
        "hex": "#f2f2f2",
        "alpha": 1
      },
      "neutral.on": {
        "hex": "#060606",
        "alpha": 1
      },
      "success.tint": {
        "hex": "#162817",
        "alpha": 1
      },
      "success.soft": {
        "hex": "#173319",
        "alpha": 1
      },
      "success.soft-hover": {
        "hex": "#183c1c",
        "alpha": 1
      },
      "success.soft-pressed": {
        "hex": "#1a4720",
        "alpha": 1
      },
      "success.border": {
        "hex": "#255a2c",
        "alpha": 1
      },
      "success.border-strong": {
        "hex": "#408047",
        "alpha": 1
      },
      "success.graphic": {
        "hex": "#539e5b",
        "alpha": 1
      },
      "success.solid": {
        "hex": "#70bb76",
        "alpha": 1
      },
      "success.solid-hover": {
        "hex": "#7fcb85",
        "alpha": 1
      },
      "success.text": {
        "hex": "#8cd891",
        "alpha": 1
      },
      "success.on": {
        "hex": "#060606",
        "alpha": 1
      },
      "warning.tint": {
        "hex": "#21260a",
        "alpha": 1
      },
      "warning.soft": {
        "hex": "#292f02",
        "alpha": 1
      },
      "warning.soft-hover": {
        "hex": "#303700",
        "alpha": 1
      },
      "warning.soft-pressed": {
        "hex": "#384100",
        "alpha": 1
      },
      "warning.border": {
        "hex": "#495400",
        "alpha": 1
      },
      "warning.border-strong": {
        "hex": "#76861d",
        "alpha": 1
      },
      "warning.graphic": {
        "hex": "#9bae37",
        "alpha": 1
      },
      "warning.solid": {
        "hex": "#c2d764",
        "alpha": 1
      },
      "warning.solid-hover": {
        "hex": "#d2e874",
        "alpha": 1
      },
      "warning.text": {
        "hex": "#dff582",
        "alpha": 1
      },
      "warning.on": {
        "hex": "#060606",
        "alpha": 1
      },
      "danger.tint": {
        "hex": "#39180b",
        "alpha": 1
      },
      "danger.soft": {
        "hex": "#4b1a04",
        "alpha": 1
      },
      "danger.soft-hover": {
        "hex": "#591c00",
        "alpha": 1
      },
      "danger.soft-pressed": {
        "hex": "#672200",
        "alpha": 1
      },
      "danger.border": {
        "hex": "#832e00",
        "alpha": 1
      },
      "danger.border-strong": {
        "hex": "#aa3e00",
        "alpha": 1
      },
      "danger.graphic": {
        "hex": "#c84a00",
        "alpha": 1
      },
      "danger.solid": {
        "hex": "#e15e20",
        "alpha": 1
      },
      "danger.solid-hover": {
        "hex": "#f36e34",
        "alpha": 1
      },
      "danger.text": {
        "hex": "#ff7f4b",
        "alpha": 1
      },
      "danger.on": {
        "hex": "#060606",
        "alpha": 1
      },
      "info.tint": {
        "hex": "#16213d",
        "alpha": 1
      },
      "info.soft": {
        "hex": "#192952",
        "alpha": 1
      },
      "info.soft-hover": {
        "hex": "#1c2f62",
        "alpha": 1
      },
      "info.soft-pressed": {
        "hex": "#203675",
        "alpha": 1
      },
      "info.border": {
        "hex": "#2c4792",
        "alpha": 1
      },
      "info.border-strong": {
        "hex": "#3b5db8",
        "alpha": 1
      },
      "info.graphic": {
        "hex": "#466dd7",
        "alpha": 1
      },
      "info.solid": {
        "hex": "#5780ed",
        "alpha": 1
      },
      "info.solid-hover": {
        "hex": "#6590fe",
        "alpha": 1
      },
      "info.text": {
        "hex": "#7ea4ff",
        "alpha": 1
      },
      "info.on": {
        "hex": "#060606",
        "alpha": 1
      },
      "agent.tint": {
        "hex": "#2e1f15",
        "alpha": 1
      },
      "agent.soft": {
        "hex": "#3b2617",
        "alpha": 1
      },
      "agent.soft-hover": {
        "hex": "#472c19",
        "alpha": 1
      },
      "agent.soft-pressed": {
        "hex": "#54331c",
        "alpha": 1
      },
      "agent.border": {
        "hex": "#6a4227",
        "alpha": 1
      },
      "agent.border-strong": {
        "hex": "#956443",
        "alpha": 1
      },
      "agent.graphic": {
        "hex": "#b87e57",
        "alpha": 1
      },
      "agent.solid": {
        "hex": "#d79c73",
        "alpha": 1
      },
      "agent.solid-hover": {
        "hex": "#e8ab83",
        "alpha": 1
      },
      "agent.text": {
        "hex": "#f6b88f",
        "alpha": 1
      },
      "agent.on": {
        "hex": "#060606",
        "alpha": 1
      },
      "neutral.hover": {
        "hex": "#ffffff",
        "alpha": 0.05
      },
      "neutral.pressed": {
        "hex": "#ffffff",
        "alpha": 0.08
      },
      "neutral.selected": {
        "hex": "#ffffff",
        "alpha": 0.12
      },
      "neutral.selected-hover": {
        "hex": "#ffffff",
        "alpha": 0.16
      },
      "neutral.track": {
        "hex": "#ffffff",
        "alpha": 0.08
      },
      "neutral.well": {
        "hex": "#ffffff",
        "alpha": 0.04
      },
      "focus.ring": {
        "hex": "#f5f5f5",
        "alpha": 1
      },
      "focus.offset": {
        "hex": "#121212",
        "alpha": 1
      },
      "selection.edge": {
        "hex": "#7f7f7f",
        "alpha": 1
      },
      "selection.fill": {
        "hex": "#393939",
        "alpha": 1
      },
      "selection.fill-hover": {
        "hex": "#6d6d6d",
        "alpha": 1
      },
      "selection.on": {
        "hex": "#fdfdfd",
        "alpha": 1
      },
      "selection.on-secondary": {
        "hex": "#f2f2f2",
        "alpha": 1
      },
      "selection.on-tertiary": {
        "hex": "#bcbcbc",
        "alpha": 1
      },
      "disabled.fill": {
        "hex": "#1c1c1c",
        "alpha": 1
      },
      "disabled.text": {
        "hex": "#6d6d6d",
        "alpha": 1
      },
      "disabled.border": {
        "hex": "#393939",
        "alpha": 1
      },
      "required.mark": {
        "hex": "#9e9e9e",
        "alpha": 1
      },
      "chart.1": {
        "hex": "#bfbfbf",
        "alpha": 1
      },
      "chart.2": {
        "hex": "#466dd7",
        "alpha": 1
      },
      "chart.3": {
        "hex": "#539e5b",
        "alpha": 1
      },
      "chart.4": {
        "hex": "#9bae37",
        "alpha": 1
      },
      "chart.5": {
        "hex": "#be7449",
        "alpha": 1
      },
      "chart.6": {
        "hex": "#648fad",
        "alpha": 1
      },
      "agent.stop-1": {
        "hex": "#d79c73",
        "alpha": 1
      },
      "agent.stop-2": {
        "hex": "#89b5cf",
        "alpha": 1
      },
      "agent.stop-3": {
        "hex": "#00fa76",
        "alpha": 1
      },
      "agent.glow": {
        "hex": "#d79c73",
        "alpha": 0.35
      },
      "diff.add-bg": {
        "hex": "#173319",
        "alpha": 1
      },
      "diff.remove-bg": {
        "hex": "#4b1a04",
        "alpha": 1
      },
      "diff.add-text": {
        "hex": "#8cd891",
        "alpha": 1
      },
      "diff.remove-text": {
        "hex": "#ff7f4b",
        "alpha": 1
      },
      "syntax.keyword": {
        "hex": "#7ea4ff",
        "alpha": 1
      },
      "syntax.string": {
        "hex": "#8cd891",
        "alpha": 1
      },
      "syntax.property": {
        "hex": "#fbac7f",
        "alpha": 1
      },
      "syntax.comment": {
        "hex": "#bcbcbc",
        "alpha": 1
      },
      "canvas.dot": {
        "hex": "#ffffff",
        "alpha": 0.08
      },
      "canvas.selection": {
        "hex": "#f5f5f5",
        "alpha": 1
      },
      "canvas.handle": {
        "hex": "#020202",
        "alpha": 1
      },
      "canvas.selection-on": {
        "hex": "#060606",
        "alpha": 1
      },
      "canvas.guide": {
        "hex": "#ed74bd",
        "alpha": 1
      },
      "canvas.guide-on": {
        "hex": "#060606",
        "alpha": 1
      },
      "canvas.guide-user": {
        "hex": "#5780ed",
        "alpha": 1
      },
      "canvas.hover": {
        "hex": "#f5f5f5",
        "alpha": 0.6
      },
      "canvas.marquee": {
        "hex": "#f5f5f5",
        "alpha": 0.14
      },
      "canvas.label": {
        "hex": "#9e9e9e",
        "alpha": 1
      },
      "canvas.checker-a": {
        "hex": "#1c1c1c",
        "alpha": 1
      },
      "canvas.checker-b": {
        "hex": "#393939",
        "alpha": 1
      },
      "canvas.artboard": {
        "hex": "#fdfdfd",
        "alpha": 1
      },
      "category.component": {
        "hex": "#7ea4ff",
        "alpha": 1
      },
      "category.component-soft": {
        "hex": "#192952",
        "alpha": 1
      },
      "identity.coral": {
        "hex": "#e15e20",
        "alpha": 1
      },
      "identity.iris": {
        "hex": "#5780ed",
        "alpha": 1
      },
      "identity.mint": {
        "hex": "#70bb76",
        "alpha": 1
      },
      "identity.amber": {
        "hex": "#c2d764",
        "alpha": 1
      },
      "identity.slate": {
        "hex": "#9e9e9e",
        "alpha": 1
      },
      "identity.on-coral": {
        "hex": "#060606",
        "alpha": 1
      },
      "identity.on-iris": {
        "hex": "#060606",
        "alpha": 1
      },
      "identity.on-mint": {
        "hex": "#060606",
        "alpha": 1
      },
      "identity.on-amber": {
        "hex": "#060606",
        "alpha": 1
      },
      "identity.on-slate": {
        "hex": "#060606",
        "alpha": 1
      },
      "identity.on": {
        "hex": "#060606",
        "alpha": 1
      },
      "accent.hover": {
        "hex": "#dbdbdb",
        "alpha": 1
      },
      "ink.hover": {
        "hex": "#6d6d6d",
        "alpha": 1
      },
      "accent.fill": {
        "hex": "#f5f5f5",
        "alpha": 1
      },
      "accent.fill-hover": {
        "hex": "#dbdbdb",
        "alpha": 1
      },
      "accent.glow": {
        "hex": "#d79c73",
        "alpha": 0.35
      },
      "text.link": {
        "hex": "#f5f5f5",
        "alpha": 1
      },
      "text.disabled": {
        "hex": "#6d6d6d",
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
      "diff.add": {
        "hex": "#173319",
        "alpha": 1
      },
      "diff.remove": {
        "hex": "#4b1a04",
        "alpha": 1
      }
    }
  },
  "primitiveHex": {
    "neutral": {
      "1": "#fdfdfd",
      "2": "#f7f7f7",
      "3": "#e8e8e8",
      "4": "#d6d6d6",
      "5": "#bababa",
      "6": "#808080",
      "7": "#717171",
      "8": "#636363",
      "9": "#525252",
      "10": "#2b2b2b",
      "11": "#060606"
    },
    "accent": {
      "1": "#fafafa",
      "2": "#f3f3f3",
      "3": "#e9e9e9",
      "4": "#dfdfdf",
      "5": "#d4d4d4",
      "6": "#bebebe",
      "7": "#6a6a6a",
      "8": "#323232",
      "9": "#040404",
      "10": "#1d1d1d",
      "11": "#010101"
    },
    "success": {
      "1": "#effff4",
      "2": "#d8ffe4",
      "3": "#bbfcd0",
      "4": "#a3f6c0",
      "5": "#87eead",
      "6": "#6ee99f",
      "7": "#4ee290",
      "8": "#1ede83",
      "9": "#00d67c",
      "10": "#00c471",
      "11": "#006b3b"
    },
    "warning": {
      "1": "#fdfaf0",
      "2": "#f9f4df",
      "3": "#f3eac8",
      "4": "#ebe0b5",
      "5": "#e2d4a0",
      "6": "#cebe82",
      "7": "#beac68",
      "8": "#b29e52",
      "9": "#a59145",
      "10": "#968234",
      "11": "#6c5900"
    },
    "danger": {
      "1": "#fff8f7",
      "2": "#ffefed",
      "3": "#ffe2dd",
      "4": "#ffd4cd",
      "5": "#ffc4b9",
      "6": "#ffbeb2",
      "7": "#ffb6aa",
      "8": "#ffb1a3",
      "9": "#ffab9d",
      "10": "#ee9c8e",
      "11": "#8c4339"
    },
    "info": {
      "1": "#f5fbff",
      "2": "#e8f6ff",
      "3": "#d3eeff",
      "4": "#bee6ff",
      "5": "#a4ddff",
      "6": "#92d7ff",
      "7": "#7bcfff",
      "8": "#69caff",
      "9": "#54c4ff",
      "10": "#41b4ee",
      "11": "#006188"
    },
    "agent-1": {
      "1": "#fff9f5",
      "2": "#fff0e7",
      "3": "#ffe3d2",
      "4": "#fcd7bf",
      "5": "#f6caad",
      "6": "#f2c1a0",
      "7": "#eeb792",
      "8": "#ebaf86",
      "9": "#e5a880",
      "10": "#d49970",
      "11": "#814c24"
    },
    "agent-2": {
      "1": "#f5fbff",
      "2": "#e9f6fd",
      "3": "#d9edfa",
      "4": "#cae4f4",
      "5": "#bbd9ec",
      "6": "#afd2e8",
      "7": "#a3cae3",
      "8": "#99c5df",
      "9": "#92bed9",
      "10": "#83aec8",
      "11": "#365f76"
    },
    "agent-3": {
      "1": "#f5fcf6",
      "2": "#e9f8ec",
      "3": "#d9f1dd",
      "4": "#cbe9d0",
      "5": "#bbdfc1",
      "6": "#b1dbb9",
      "7": "#a7d5af",
      "8": "#9ed2a8",
      "9": "#99cda3",
      "10": "#8abd93",
      "11": "#366641"
    },
    "extra-1": {
      "1": "#fff9f5",
      "2": "#fff0e8",
      "3": "#ffe3d4",
      "4": "#ffd6c0",
      "5": "#ffc6a7",
      "6": "#f0ac86",
      "7": "#e0956a",
      "8": "#d68353",
      "9": "#c67544",
      "10": "#b56535",
      "11": "#90440b"
    },
    "extra-2": {
      "1": "#f6fbff",
      "2": "#e9f6ff",
      "3": "#d7edfd",
      "4": "#c8e4f8",
      "5": "#b8d9f2",
      "6": "#9ec3df",
      "7": "#81aac9",
      "8": "#6a98b9",
      "9": "#5886a6",
      "10": "#4a7797",
      "11": "#315e7d"
    },
    "canvas-guide": {
      "1": "#fff8fb",
      "2": "#ffeef7",
      "3": "#ffdff0",
      "4": "#ffd0e9",
      "5": "#ffbee1",
      "6": "#ff96d3",
      "7": "#f070be",
      "8": "#e253ae",
      "9": "#cd3f9b",
      "10": "#bb2d8c",
      "11": "#a50c78"
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
    "7": 28,
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
    "2.25": 9,
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
    "well-inner": 18,
    "2xs": 2,
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
      "modal-sm": 380,
      "sheet-md": 380,
      "empty-glyph": 22,
      "card-tile": 36,
      "card-glyph": 18,
      "card-add": 76,
      "card-spark": 64,
      "spotlight-glow": 320,
      "spotlight-rim": 200,
      "list-row": 52,
      "list-tile": 30,
      "list-term": 140,
      "nav-indent": 36,
      "form-heading-w": 220,
      "form-body-min": 400,
      "section-text-min": 160,
      "stepper-max": 420,
      "tag-input-min": 90,
      "toast-min": 60,
      "toast-w": 360,
      "usage-ring": 22,
      "orb-md": 22,
      "orb-md-hole": 7,
      "stop-glyph": 9,
      "toolbar-item": 34,
      "toolbar-item-md": 30,
      "cursor": 18,
      "orb-xs": 10,
      "comment-max": 160,
      "feature-visual-min": 80,
      "rounds-h": 80,
      "model-menu-w": 300,
      "thumb-md": 56,
      "thumb-h": 44,
      "suggestion-min": 150,
      "index-badge": 22,
      "tree-indent": 14,
      "graph-h": 330,
      "graph-node-w": 150,
      "tile-swatch-h": 74,
      "theme-card-min": 170,
      "theme-preview-h": 120,
      "contrast-sample-w": 92,
      "contrast-sample-h": 64,
      "compare-h": 210,
      "option-tile-h": 54,
      "option-tile-icon-h": 62,
      "target-w": 150,
      "pad-box": 96,
      "layout-preview": 96,
      "add-row": 38,
      "radius-preview-w": 120,
      "radius-preview-h": 84,
      "field-alpha-w": 58,
      "color-plane-h": 150,
      "color-picker-w": 268,
      "color-preview": 30,
      "picker-format-w": 78,
      "picker-alpha-w": 52,
      "gradient-preview-h": 188,
      "gradient-angle-w": 66,
      "image-preview-h": 110,
      "effect-stage-h": 120,
      "axis-field-w": 56,
      "motion-stage-h": 56,
      "curve-w": 280,
      "duration-field-w": 84,
      "timeline-label-w": 110,
      "chevron-xs": 10,
      "grabber-w": 36,
      "table-head-h": 38,
      "table-select-w": 36,
      "table-min-w": 560,
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
    "ui": "\"Geist\", \"SUIT\", \"Pretendard Variable\", \"Pretendard\", \"Noto Sans KR\", ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", sans-serif",
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
    "title-4": [
      "ui",
      13.5,
      20,
      600,
      -0.01
    ],
    "title-feature": [
      "ui",
      19,
      24,
      600,
      -0.02
    ],
    "title-overlay": [
      "ui",
      18,
      22,
      600,
      -0.015
    ],
    "stat": [
      "ui",
      30,
      34,
      600,
      -0.035
    ],
    "stat-lg": [
      "ui",
      34,
      34,
      600,
      -0.03
    ],
    "sample": [
      "ui",
      22,
      26,
      600,
      -0.02
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
      18,
      500,
      0
    ],
    "mono-relaxed": [
      "mono",
      12,
      20,
      400,
      0
    ],
    "ui-md-relaxed": [
      "ui",
      13.5,
      20,
      400,
      -0.003
    ],
    "mono-lg": [
      "mono",
      20,
      20,
      600,
      0
    ],
    "mono-ruler": [
      "mono",
      9.5,
      12,
      500,
      0
    ],
    "mono-micro": [
      "mono",
      8,
      10,
      600,
      0
    ],
    "voice-lg": [
      "voice",
      19,
      26,
      400,
      0
    ]
  },
  "elevation": {
    "light": {
      "1": "0 1px 2px oklch(from var(--cs-color-shadow-ambient) l c h / 0.06)",
      "2": "0 1px 2px oklch(from var(--cs-color-shadow-ambient) l c h / 0.05), 0 4px 12px -2px oklch(from var(--cs-color-shadow-ambient) l c h / 0.08)",
      "3": "0 2px 4px oklch(from var(--cs-color-shadow-ambient) l c h / 0.04), 0 12px 28px -6px oklch(from var(--cs-color-shadow-ambient) l c h / 0.12)",
      "4": "0 4px 8px oklch(from var(--cs-color-shadow-ambient) l c h / 0.05), 0 24px 48px -12px oklch(from var(--cs-color-shadow-ambient) l c h / 0.18)",
      "5": "0 8px 16px oklch(from var(--cs-color-shadow-ambient) l c h / 0.06), 0 40px 80px -16px oklch(from var(--cs-color-shadow-ambient) l c h / 0.28)",
      "thumb": "0 1px 2px oklch(from var(--cs-color-shadow-contact) l c h / 0.16), 0 3px 8px oklch(from var(--cs-color-shadow-contact) l c h / 0.12)",
      "thumb-sm": "0 2px 6px oklch(from var(--cs-color-shadow-contact) l c h / 0.2)",
      "thumb-swatch": "0 0 0 3px var(--cs-color-control-thumb), 0 2px 8px oklch(from var(--cs-color-shadow-contact) l c h / 0.25)",
      "card": "0 1px 2px oklch(from var(--cs-color-shadow-contact) l c h / 0.05), 0 12px 32px -16px oklch(from var(--cs-color-shadow-ambient) l c h / 0.18)",
      "lift": "0 14px 30px -14px oklch(from var(--cs-color-shadow-ambient) l c h / 0.3)",
      "well": "0 1px 2px oklch(from var(--cs-color-shadow-contact) l c h / 0.05), 0 6px 18px -10px oklch(from var(--cs-color-shadow-ambient) l c h / 0.25)",
      "agent": "0 8px 30px -12px var(--cs-color-agent-glow)",
      "artboard": "0 6px 20px -8px oklch(from var(--cs-color-shadow-contact) l c h / 0.2)"
    },
    "dark": {
      "1": "0 1px 2px oklch(from var(--cs-color-shadow-contact) l c h / 0.3)",
      "2": "0 1px 2px oklch(from var(--cs-color-shadow-contact) l c h / 0.3), 0 4px 12px -2px oklch(from var(--cs-color-shadow-contact) l c h / 0.35)",
      "3": "0 2px 4px oklch(from var(--cs-color-shadow-contact) l c h / 0.25), 0 12px 28px -6px oklch(from var(--cs-color-shadow-contact) l c h / 0.45)",
      "4": "0 4px 8px oklch(from var(--cs-color-shadow-contact) l c h / 0.25), 0 24px 48px -12px oklch(from var(--cs-color-shadow-contact) l c h / 0.55)",
      "5": "0 8px 16px oklch(from var(--cs-color-shadow-contact) l c h / 0.3), 0 40px 80px -16px oklch(from var(--cs-color-shadow-contact) l c h / 0.65)",
      "thumb": "0 1px 2px oklch(from var(--cs-color-shadow-contact) l c h / 0.16), 0 3px 8px oklch(from var(--cs-color-shadow-contact) l c h / 0.12)",
      "thumb-sm": "0 2px 6px oklch(from var(--cs-color-shadow-contact) l c h / 0.2)",
      "thumb-swatch": "0 0 0 3px var(--cs-color-control-thumb), 0 2px 8px oklch(from var(--cs-color-shadow-contact) l c h / 0.25)",
      "card": "0 1px 2px oklch(from var(--cs-color-shadow-contact) l c h / 0.4), 0 12px 32px -16px oklch(from var(--cs-color-shadow-contact) l c h / 0.6)",
      "lift": "0 14px 30px -14px oklch(from var(--cs-color-shadow-contact) l c h / 0.7)",
      "well": "0 1px 2px oklch(from var(--cs-color-shadow-contact) l c h / 0.4), 0 6px 18px -10px oklch(from var(--cs-color-shadow-contact) l c h / 0.55)",
      "agent": "0 8px 30px -12px var(--cs-color-agent-glow)",
      "artboard": "0 6px 20px -8px oklch(from var(--cs-color-shadow-contact) l c h / 0.5)"
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
      "indeterminate": 1400,
      "orb": 1600,
      "shimmer": 2200,
      "slide": 2400,
      "scan": 2600,
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
      "neutral: text primary"
    ],
    [
      "text.primary",
      "surface.raised",
      7,
      "neutral: text primary"
    ],
    [
      "text.primary",
      "bg.app",
      7,
      "neutral: text primary"
    ],
    [
      "text.primary",
      "bg.canvas",
      7,
      "neutral: text primary"
    ],
    [
      "text.secondary",
      "surface.base",
      4.5,
      "neutral: text secondary"
    ],
    [
      "text.secondary",
      "surface.raised",
      4.5,
      "neutral: text secondary"
    ],
    [
      "text.secondary",
      "bg.app",
      4.5,
      "neutral: text secondary"
    ],
    [
      "text.secondary",
      "bg.canvas",
      4.5,
      "neutral: text secondary"
    ],
    [
      "text.tertiary",
      "surface.base",
      4.5,
      "neutral: text tertiary"
    ],
    [
      "text.tertiary",
      "surface.raised",
      4.5,
      "neutral: text tertiary"
    ],
    [
      "text.tertiary",
      "bg.app",
      4.5,
      "neutral: text tertiary"
    ],
    [
      "text.tertiary",
      "bg.canvas",
      4.5,
      "neutral: text tertiary"
    ],
    [
      "text.placeholder",
      "surface.base",
      4.5,
      "neutral: placeholder"
    ],
    [
      "text.placeholder",
      "surface.raised",
      4.5,
      "neutral: placeholder"
    ],
    [
      "text.placeholder",
      "bg.app",
      4.5,
      "neutral: placeholder"
    ],
    [
      "text.placeholder",
      "bg.canvas",
      4.5,
      "neutral: placeholder"
    ],
    [
      "border.control",
      "surface.base",
      3,
      "neutral: border control (1.4.11)"
    ],
    [
      "border.control",
      "surface.raised",
      3,
      "neutral: border control (1.4.11)"
    ],
    [
      "border.control",
      "bg.app",
      3,
      "neutral: border control (1.4.11)"
    ],
    [
      "border.control",
      "bg.canvas",
      3,
      "neutral: border control (1.4.11)"
    ],
    [
      "text.tertiary",
      "neutral.hover@bg.app",
      4.5,
      "meta text on a hover fill"
    ],
    [
      "text.tertiary",
      "neutral.pressed@bg.app",
      4.5,
      "meta text on a pressed fill"
    ],
    [
      "text.placeholder",
      "neutral.well@bg.app",
      4.5,
      "placeholder in a sunken field"
    ],
    [
      "text.primary",
      "neutral.selected@surface.base",
      7,
      "selected row"
    ],
    [
      "text.primary",
      "neutral.selected-hover@surface.base",
      7,
      "selected row hover"
    ],
    [
      "text.disabled",
      "surface.base",
      3,
      "disabled, non-essential"
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
      "material.regular@extra-1.9",
      4.5,
      "panel over saturated content"
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
      "control.off",
      "surface.base",
      3,
      "switch off track (1.4.11)"
    ],
    [
      "selection.edge",
      "surface.base",
      1.5,
      "selected edge is visible on surface (paired with a check mark)"
    ],
    [
      "selection.on",
      "selection.fill",
      4.5,
      "selected item: label on the inverted fill"
    ],
    [
      "selection.on",
      "selection.fill-hover",
      4.5,
      "selected item hovered"
    ],
    [
      "selection.on-secondary",
      "selection.fill",
      4.5,
      "selected item: secondary text"
    ],
    [
      "selection.on-secondary",
      "selection.fill-hover",
      4.5,
      "selected item hovered: secondary text"
    ],
    [
      "selection.on-tertiary",
      "selection.fill",
      3,
      "selected item: meta, shortcut, icon"
    ],
    [
      "ink.on",
      "ink.solid",
      7,
      "primary button"
    ],
    [
      "ink.on",
      "ink.solid-hover",
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
      "media.on",
      "media.scrim@surface.base",
      4.5,
      "badge over media"
    ],
    [
      "accent.text",
      "surface.base",
      4.5,
      "slot: text 11 on surface"
    ],
    [
      "accent.text",
      "accent.soft",
      4.5,
      "slot: text 11 on soft 3"
    ],
    [
      "accent.text",
      "accent.soft-hover",
      4.5,
      "slot: text 11 on soft-hover 4"
    ],
    [
      "accent.text",
      "accent.soft-pressed",
      4.5,
      "slot: text 11 on soft-pressed 5"
    ],
    [
      "accent.on",
      "accent.solid",
      4.5,
      "slot: on vs solid 9"
    ],
    [
      "accent.on",
      "accent.solid-hover",
      4.5,
      "slot: on vs solid-hover 10"
    ],
    [
      "accent.graphic",
      "surface.base",
      3,
      "slot: graphic 8 on surface",
      "warn"
    ],
    [
      "success.text",
      "surface.base",
      4.5,
      "slot: text 11 on surface"
    ],
    [
      "success.text",
      "success.soft",
      4.5,
      "slot: text 11 on soft 3"
    ],
    [
      "success.text",
      "success.soft-hover",
      4.5,
      "slot: text 11 on soft-hover 4"
    ],
    [
      "success.text",
      "success.soft-pressed",
      4.5,
      "slot: text 11 on soft-pressed 5"
    ],
    [
      "success.on",
      "success.solid",
      3,
      "slot: on vs solid 9"
    ],
    [
      "success.on",
      "success.solid-hover",
      3,
      "slot: on vs solid-hover 10"
    ],
    [
      "success.graphic",
      "surface.base",
      3,
      "slot: graphic 8 on surface",
      "warn"
    ],
    [
      "warning.text",
      "surface.base",
      4.5,
      "slot: text 11 on surface"
    ],
    [
      "warning.text",
      "warning.soft",
      4.5,
      "slot: text 11 on soft 3"
    ],
    [
      "warning.text",
      "warning.soft-hover",
      4.5,
      "slot: text 11 on soft-hover 4"
    ],
    [
      "warning.text",
      "warning.soft-pressed",
      4.5,
      "slot: text 11 on soft-pressed 5"
    ],
    [
      "warning.on",
      "warning.solid",
      3,
      "slot: on vs solid 9"
    ],
    [
      "warning.on",
      "warning.solid-hover",
      3,
      "slot: on vs solid-hover 10"
    ],
    [
      "warning.graphic",
      "surface.base",
      3,
      "slot: graphic 8 on surface",
      "warn"
    ],
    [
      "danger.text",
      "surface.base",
      4.5,
      "slot: text 11 on surface"
    ],
    [
      "danger.text",
      "danger.soft",
      4.5,
      "slot: text 11 on soft 3"
    ],
    [
      "danger.text",
      "danger.soft-hover",
      4.5,
      "slot: text 11 on soft-hover 4"
    ],
    [
      "danger.text",
      "danger.soft-pressed",
      4.5,
      "slot: text 11 on soft-pressed 5"
    ],
    [
      "danger.on",
      "danger.solid",
      4.5,
      "slot: on vs solid 9"
    ],
    [
      "danger.on",
      "danger.solid-hover",
      4.5,
      "slot: on vs solid-hover 10"
    ],
    [
      "danger.graphic",
      "surface.base",
      3,
      "slot: graphic 8 on surface",
      "warn"
    ],
    [
      "info.text",
      "surface.base",
      4.5,
      "slot: text 11 on surface"
    ],
    [
      "info.text",
      "info.soft",
      4.5,
      "slot: text 11 on soft 3"
    ],
    [
      "info.text",
      "info.soft-hover",
      4.5,
      "slot: text 11 on soft-hover 4"
    ],
    [
      "info.text",
      "info.soft-pressed",
      4.5,
      "slot: text 11 on soft-pressed 5"
    ],
    [
      "info.on",
      "info.solid",
      3,
      "slot: on vs solid 9"
    ],
    [
      "info.on",
      "info.solid-hover",
      3,
      "slot: on vs solid-hover 10"
    ],
    [
      "info.graphic",
      "surface.base",
      3,
      "slot: graphic 8 on surface",
      "warn"
    ],
    [
      "agent.text",
      "surface.base",
      4.5,
      "slot: text 11 on surface"
    ],
    [
      "agent.text",
      "agent.soft",
      4.5,
      "slot: text 11 on soft 3"
    ],
    [
      "agent.text",
      "agent.soft-hover",
      4.5,
      "slot: text 11 on soft-hover 4"
    ],
    [
      "agent.text",
      "agent.soft-pressed",
      4.5,
      "slot: text 11 on soft-pressed 5"
    ],
    [
      "agent.on",
      "agent.solid",
      3,
      "slot: on vs solid 9"
    ],
    [
      "agent.on",
      "agent.solid-hover",
      3,
      "slot: on vs solid-hover 10"
    ],
    [
      "agent.graphic",
      "surface.base",
      3,
      "slot: graphic 8 on surface",
      "warn"
    ],
    [
      "neutral.text",
      "surface.base",
      4.5,
      "slot: text 11 on surface"
    ],
    [
      "neutral.on",
      "neutral.solid",
      3,
      "slot: on vs solid 9"
    ],
    [
      "neutral.graphic",
      "surface.base",
      3,
      "slot: graphic 8 on surface"
    ],
    [
      "text.link",
      "surface.base",
      4.5,
      "AA link"
    ],
    [
      "text.secondary",
      "accent.soft",
      4.5,
      "selected choice card text"
    ],
    [
      "text.secondary",
      "accent.tint",
      4.5,
      "selected action card"
    ],
    [
      "focus.ring",
      "surface.base",
      3,
      "focus indicator (2.4.11)"
    ],
    [
      "focus.ring",
      "surface.raised",
      3,
      "focus indicator on raised"
    ],
    [
      "focus.ring",
      "bg.canvas",
      3,
      "focus indicator on canvas"
    ],
    [
      "required.mark",
      "surface.base",
      4.5,
      "required mark"
    ],
    [
      "text.primary",
      "diff.add-bg",
      7,
      "diff line"
    ],
    [
      "text.primary",
      "diff.remove-bg",
      7,
      "diff line"
    ],
    [
      "diff.add-text",
      "diff.add-bg",
      4.5,
      "diff sign"
    ],
    [
      "diff.remove-text",
      "diff.remove-bg",
      4.5,
      "diff sign"
    ],
    [
      "syntax.keyword",
      "surface.base",
      4.5,
      "syntax on code surface"
    ],
    [
      "syntax.keyword",
      "diff.add-bg",
      4.5,
      "syntax on an added line"
    ],
    [
      "syntax.keyword",
      "diff.remove-bg",
      4.5,
      "syntax on a removed line"
    ],
    [
      "syntax.string",
      "surface.base",
      4.5,
      "syntax on code surface"
    ],
    [
      "syntax.string",
      "diff.add-bg",
      4.5,
      "syntax on an added line"
    ],
    [
      "syntax.string",
      "diff.remove-bg",
      4.5,
      "syntax on a removed line"
    ],
    [
      "syntax.property",
      "surface.base",
      4.5,
      "syntax on code surface"
    ],
    [
      "syntax.property",
      "diff.add-bg",
      4.5,
      "syntax on an added line"
    ],
    [
      "syntax.property",
      "diff.remove-bg",
      4.5,
      "syntax on a removed line"
    ],
    [
      "syntax.comment",
      "surface.base",
      4.5,
      "syntax on code surface"
    ],
    [
      "syntax.comment",
      "diff.add-bg",
      4.5,
      "syntax on an added line"
    ],
    [
      "syntax.comment",
      "diff.remove-bg",
      4.5,
      "syntax on a removed line"
    ],
    [
      "chart.1",
      "surface.base",
      3,
      "chart series",
      "warn"
    ],
    [
      "chart.2",
      "surface.base",
      3,
      "chart series",
      "warn"
    ],
    [
      "chart.3",
      "surface.base",
      3,
      "chart series",
      "warn"
    ],
    [
      "chart.4",
      "surface.base",
      3,
      "chart series",
      "warn"
    ],
    [
      "chart.5",
      "surface.base",
      3,
      "chart series",
      "warn"
    ],
    [
      "chart.6",
      "surface.base",
      3,
      "chart series",
      "warn"
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
      "identity.on-coral",
      "identity.coral",
      4.5,
      "avatar initials"
    ],
    [
      "identity.on-iris",
      "identity.iris",
      4.5,
      "avatar initials"
    ],
    [
      "identity.on-mint",
      "identity.mint",
      4.5,
      "avatar initials"
    ],
    [
      "identity.on-amber",
      "identity.amber",
      4.5,
      "avatar initials"
    ],
    [
      "identity.on-slate",
      "identity.slate",
      4.5,
      "avatar initials"
    ],
    [
      "category.component",
      "surface.base",
      4.5,
      "main component label"
    ],
    [
      "category.component",
      "category.component-soft",
      4.5,
      "main component tag"
    ]
  ]
};
