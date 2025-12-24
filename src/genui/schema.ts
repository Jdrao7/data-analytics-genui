import { z } from "zod";

export type UIComponentSchemaType = z.infer<typeof UIComponentSchema>;

export const UIComponentSchema: z.ZodType<any> = z.lazy(() =>
  z.discriminatedUnion("type", [
    z.object({
      type: z.literal("Header"),
      props: z.object({
        text: z.string(),
      }),
    }),
    z.object({
      type: z.literal("Divider"),
      props: z.object({}),
    }),
    z.object({
      type: z.literal("Grid"),
      props: z.object({
        spacing: z.number().optional(),
        xs: z.number().optional(),
      }),
      children: z.array(UIComponentSchema),
    })
    ,
    z.object({
      type: z.literal("Input"),
      props: z.object({
        label: z.string(),
        placeholder: z.string().optional(),
        type: z.enum(["text", "number", "password", "email"]).optional(),
      })
    }),
    z.object({
      type: z.literal("Button"),
      props: z.object({
        label: z.string(),
        action: z.string(),
        disabled: z.boolean().optional(),
      }),
    }),
    z.object({
      type: z.literal("List"),
      props: z.object({
        items: z.array(z.string()),
      }),
    }),
    z.object({
      type: z.literal("Image"),
      props: z.object({
        src: z.string(),
        alt: z.string().optional(),
      }),
    }),
    z.object({
      type: z.literal("Text"),
      props: z.object({
        content: z.string(),
        align: z.enum(["left", "center", "right"]),
      }),
    }),
    z.object({
      type: z.literal("LineChart"),
      props: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        // The data array (e.g., [{ month: "Jan", desktop: 186, mobile: 80 }])
        data: z.array(z.record(z.string(), z.union([z.string(), z.number()]))),
        // Which key in the data object to use for the X-Axis (e.g., "month")
        xAxisKey: z.string(),
        // Configuration for the lines you want to draw
        lines: z.array(
          z.object({
            dataKey: z.string(), // e.g., "desktop"
            stroke: z.string(),  // Hex color e.g., "#8884d8" or css var
            name: z.string().optional(), // Label for legend
          })
        ).min(1),
      }),
    }),

    z.object({
      type: z.literal("LinearProgress"),
      props: z.object({
        value: z.number().min(0).max(100),
        color: z.enum(["primary", "secondary"]),
      }),
    }),

    z.object({
      type: z.literal("Stack"),
      props: z.object({
        direction: z.enum(["row", "column"]),
        spacing: z.number(),
      }),
      children: z.array(UIComponentSchema),
    }),
    z.object({
      type: z.literal("Card"),
      props: z.object({
        title: z.string().optional(),
      }),
      children: z.array(UIComponentSchema),
    }),
    // --- Data Visualization Components ---
    z.object({
      type: z.literal("BarChart"),
      props: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        data: z.array(z.record(z.string(), z.union([z.string(), z.number()]))),
        xAxisKey: z.string(),
        bars: z.array(
          z.object({
            dataKey: z.string(),
            fill: z.string(),
            name: z.string().optional(),
            stackId: z.string().optional(),
          })
        ).min(1),
        layout: z.enum(["vertical", "horizontal"]).optional(),
      }),
    }),
    z.object({
      type: z.literal("AreaChart"),
      props: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        data: z.array(z.record(z.string(), z.union([z.string(), z.number()]))),
        xAxisKey: z.string(),
        areas: z.array(
          z.object({
            dataKey: z.string(),
            fill: z.string(),
            stroke: z.string(),
            name: z.string().optional(),
            stackId: z.string().optional(),
          })
        ).min(1),
      }),
    }),
    z.object({
      type: z.literal("PieChart"),
      props: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        data: z.array(z.object({
          name: z.string(),
          value: z.number(),
          fill: z.string().optional(),
        })),
        innerRadius: z.number().optional(), // > 0 for donut chart
        outerRadius: z.number().optional(),
        showLabels: z.boolean().optional(),
        showLegend: z.boolean().optional(),
      }),
    }),
    z.object({
      type: z.literal("StatCard"),
      props: z.object({
        title: z.string(),
        value: z.union([z.string(), z.number()]),
        change: z.number().optional(),
        changeLabel: z.string().optional(),
        trend: z.enum(["up", "down", "neutral"]).optional(),
        icon: z.string().optional(), // MUI icon name
      }),
    }),
    z.object({
      type: z.literal("Table"),
      props: z.object({
        title: z.string().optional(),
        columns: z.array(z.object({
          key: z.string(),
          header: z.string(),
          align: z.enum(["left", "center", "right"]).optional(),
        })),
        rows: z.array(z.record(z.string(), z.union([z.string(), z.number()]))),
        striped: z.boolean().optional(),
      }),
    }),
    z.object({
      type: z.literal("RadialGauge"),
      props: z.object({
        title: z.string(),
        value: z.number(),
        maxValue: z.number().optional(),
        label: z.string().optional(),
        color: z.string().optional(),
      }),
    }),
    // --- New Utility Components ---
    z.object({
      type: z.literal("Timer"),
      props: z.object({
        initialSeconds: z.number().min(0),
        autoStart: z.boolean().optional(),
        showHours: z.boolean().optional(),
        size: z.enum(["small", "medium", "large"]).optional(),
        color: z.string().optional(),
      }),
    }),
    z.object({
      type: z.literal("Countdown"),
      props: z.object({
        targetDate: z.string(), // ISO date string
        title: z.string().optional(),
        showDays: z.boolean().optional(),
        showHours: z.boolean().optional(),
        showMinutes: z.boolean().optional(),
        showSeconds: z.boolean().optional(),
      }),
    }),
    z.object({
      type: z.literal("Alert"),
      props: z.object({
        severity: z.enum(["success", "info", "warning", "error"]),
        title: z.string().optional(),
        message: z.string(),
        dismissible: z.boolean().optional(),
      }),
    }),
    z.object({
      type: z.literal("Badge"),
      props: z.object({
        content: z.union([z.string(), z.number()]),
        color: z.enum(["primary", "secondary", "error", "warning", "info", "success"]).optional(),
        variant: z.enum(["standard", "dot"]).optional(),
        max: z.number().optional(),
      }),
      children: z.array(UIComponentSchema).optional(),
    }),
    z.object({
      type: z.literal("Switch"),
      props: z.object({
        label: z.string(),
        defaultChecked: z.boolean().optional(),
        disabled: z.boolean().optional(),
        color: z.enum(["primary", "secondary", "error", "warning", "info", "success"]).optional(),
        size: z.enum(["small", "medium"]).optional(),
      }),
    }),
    z.object({
      type: z.literal("Slider"),
      props: z.object({
        label: z.string().optional(),
        min: z.number(),
        max: z.number(),
        defaultValue: z.number().optional(),
        step: z.number().optional(),
        marks: z.boolean().optional(),
        showValue: z.boolean().optional(),
        color: z.enum(["primary", "secondary"]).optional(),
      }),
    }),
    z.object({
      type: z.literal("Skeleton"),
      props: z.object({
        variant: z.enum(["text", "circular", "rectangular", "rounded"]).optional(),
        width: z.union([z.string(), z.number()]).optional(),
        height: z.union([z.string(), z.number()]).optional(),
        animation: z.enum(["pulse", "wave", "false"]).optional(),
      }),
    }),
    z.object({
      type: z.literal("Avatar"),
      props: z.object({
        src: z.string().optional(),
        alt: z.string().optional(),
        name: z.string().optional(), // For generating initials
        size: z.enum(["small", "medium", "large"]).optional(),
        variant: z.enum(["circular", "rounded", "square"]).optional(),
        bgcolor: z.string().optional(),
      }),
    }),
    z.object({
      type: z.literal("AvatarGroup"),
      props: z.object({
        max: z.number().optional(),
        avatars: z.array(z.object({
          src: z.string().optional(),
          alt: z.string().optional(),
          name: z.string().optional(),
        })),
      }),
    }),
    z.object({
      type: z.literal("Tooltip"),
      props: z.object({
        title: z.string(),
        placement: z.enum(["top", "bottom", "left", "right"]).optional(),
        arrow: z.boolean().optional(),
      }),
      children: z.array(UIComponentSchema),
    }),
    z.object({
      type: z.literal("Accordion"),
      props: z.object({
        items: z.array(z.object({
          title: z.string(),
          content: z.string(),
          defaultExpanded: z.boolean().optional(),
        })),
      }),
    }),
    z.object({
      type: z.literal("Stepper"),
      props: z.object({
        activeStep: z.number(),
        steps: z.array(z.object({
          label: z.string(),
          description: z.string().optional(),
        })),
        orientation: z.enum(["horizontal", "vertical"]).optional(),
        alternativeLabel: z.boolean().optional(),
      }),
    }),
    z.object({
      type: z.literal("Rating"),
      props: z.object({
        value: z.number(),
        max: z.number().optional(),
        precision: z.number().optional(),
        size: z.enum(["small", "medium", "large"]).optional(),
        readOnly: z.boolean().optional(),
        label: z.string().optional(),
      }),
    }),
    z.object({
      type: z.literal("CircularProgress"),
      props: z.object({
        value: z.number().optional(), // For determinate
        size: z.number().optional(),
        thickness: z.number().optional(),
        color: z.enum(["primary", "secondary", "error", "warning", "info", "success"]).optional(),
        variant: z.enum(["determinate", "indeterminate"]).optional(),
        label: z.string().optional(),
      }),
    }),
    z.object({
      type: z.literal("SparklineChart"),
      props: z.object({
        data: z.array(z.number()),
        color: z.string().optional(),
        height: z.number().optional(),
        showDots: z.boolean().optional(),
        title: z.string().optional(),
      }),
    }),
    // --- Advanced Data Visualization Components ---
    z.object({
      type: z.literal("ComboChart"),
      props: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        data: z.array(z.record(z.string(), z.union([z.string(), z.number()]))),
        xAxisKey: z.string(),
        bars: z.array(z.object({
          dataKey: z.string(),
          fill: z.string(),
          name: z.string().optional(),
        })).optional(),
        lines: z.array(z.object({
          dataKey: z.string(),
          stroke: z.string(),
          name: z.string().optional(),
        })).optional(),
      }),
    }),
    z.object({
      type: z.literal("ScatterChart"),
      props: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        data: z.array(z.object({
          x: z.number(),
          y: z.number(),
          z: z.number().optional(), // For bubble size
          name: z.string().optional(),
          fill: z.string().optional(),
        })),
        xAxisLabel: z.string().optional(),
        yAxisLabel: z.string().optional(),
        showZAxis: z.boolean().optional(), // Bubble chart mode
      }),
    }),
    z.object({
      type: z.literal("FunnelChart"),
      props: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        data: z.array(z.object({
          name: z.string(),
          value: z.number(),
          fill: z.string().optional(),
        })),
        showLabels: z.boolean().optional(),
        showValues: z.boolean().optional(),
      }),
    }),
    z.object({
      type: z.literal("TreemapChart"),
      props: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        data: z.array(z.object({
          name: z.string(),
          size: z.number(),
          fill: z.string().optional(),
          children: z.array(z.object({
            name: z.string(),
            size: z.number(),
            fill: z.string().optional(),
          })).optional(),
        })),
      }),
    }),
    z.object({
      type: z.literal("HeatmapTable"),
      props: z.object({
        title: z.string().optional(),
        xLabels: z.array(z.string()),
        yLabels: z.array(z.string()),
        data: z.array(z.array(z.number())), // 2D array of values
        minColor: z.string().optional(), // Color for min value
        maxColor: z.string().optional(), // Color for max value
        showValues: z.boolean().optional(),
      }),
    }),
    z.object({
      type: z.literal("KPICard"),
      props: z.object({
        title: z.string(),
        value: z.union([z.string(), z.number()]),
        subtitle: z.string().optional(),
        change: z.number().optional(),
        changeLabel: z.string().optional(),
        trend: z.enum(["up", "down", "neutral"]).optional(),
        sparklineData: z.array(z.number()).optional(),
        sparklineColor: z.string().optional(),
        icon: z.string().optional(),
        color: z.string().optional(),
      }),
    }),
    z.object({
      type: z.literal("DataGrid"),
      props: z.object({
        title: z.string().optional(),
        columns: z.array(z.object({
          key: z.string(),
          header: z.string(),
          width: z.number().optional(),
          align: z.enum(["left", "center", "right"]).optional(),
          sortable: z.boolean().optional(),
          type: z.enum(["text", "number", "badge", "progress", "avatar"]).optional(),
        })),
        rows: z.array(z.record(z.string(), z.any())),
        pageSize: z.number().optional(),
        showPagination: z.boolean().optional(),
        striped: z.boolean().optional(),
        hoverable: z.boolean().optional(),
      }),
    }),
    z.object({
      type: z.literal("MetricTrend"),
      props: z.object({
        title: z.string(),
        metrics: z.array(z.object({
          label: z.string(),
          value: z.union([z.string(), z.number()]),
          change: z.number().optional(),
          trend: z.enum(["up", "down", "neutral"]).optional(),
        })),
        layout: z.enum(["horizontal", "vertical"]).optional(),
      }),
    }),
    z.object({
      type: z.literal("ComparisonBar"),
      props: z.object({
        title: z.string().optional(),
        items: z.array(z.object({
          label: z.string(),
          value: z.number(),
          maxValue: z.number().optional(),
          color: z.string().optional(),
          icon: z.string().optional(),
        })),
        showValues: z.boolean().optional(),
        showPercentage: z.boolean().optional(),
      }),
    }),
    z.object({
      type: z.literal("MiniChart"),
      props: z.object({
        type: z.enum(["line", "bar", "area"]),
        data: z.array(z.number()),
        color: z.string().optional(),
        height: z.number().optional(),
        width: z.number().optional(),
        showTooltip: z.boolean().optional(),
      }),
    }),
    z.object({
      type: z.literal("ProgressRing"),
      props: z.object({
        value: z.number(),
        maxValue: z.number().optional(),
        size: z.enum(["small", "medium", "large"]).optional(),
        color: z.string().optional(),
        label: z.string().optional(),
        showValue: z.boolean().optional(),
        thickness: z.number().optional(),
      }),
    }),
    z.object({
      type: z.literal("Page"),
      props: z.object({
        title: z.string(),
      }),
      children: z.array(UIComponentSchema),
    }),
  ])
);

export const UISchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  tree: UIComponentSchema
});

export type UIGenResult = z.infer<typeof UISchema>;
