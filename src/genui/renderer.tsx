import React, { useState, useEffect, useCallback } from "react";

import {
  Box,
  Typography,
  Button as MuiButton,
  TextField,
  Card as MuiCard,
  CardContent,
  List as MuiList,
  ListItem,
  Stack,
  Grid,
  Divider,
  Chip,
  LinearProgress,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert as MuiAlert,
  AlertTitle,
  Badge as MuiBadge,
  Switch as MuiSwitch,
  Slider as MuiSlider,
  Skeleton as MuiSkeleton,
  Avatar as MuiAvatar,
  AvatarGroup as MuiAvatarGroup,
  Tooltip as MuiTooltip,
  Accordion as MuiAccordion,
  AccordionSummary,
  AccordionDetails,
  Stepper as MuiStepper,
  Step,
  StepLabel,
  Rating as MuiRating,
  CircularProgress as MuiCircularProgress,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { UIComponentSchemaType } from "./schema";
import {
  LineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  AreaChart as RechartsAreaChart,
  Area,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart as RechartsScatterChart,
  Scatter,
  Treemap,
  Funnel,
  FunnelChart as RechartsFunnelChart,
  ComposedChart,
  LabelList,
} from "recharts";

// --- Stateful Components (must be separate to use hooks) ---

interface TimerComponentProps {
  initialSeconds: number;
  autoStart?: boolean;
  showHours?: boolean;
  size?: "small" | "medium" | "large";
  color?: string;
}

function TimerComponent({ initialSeconds, autoStart, showHours, size, color }: TimerComponentProps) {
  const [seconds, setSeconds] = useState(initialSeconds ?? 0);
  const [isRunning, setIsRunning] = useState(autoStart ?? false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev: number) => Math.max(0, prev - 1));
      }, 1000);
    } else if (seconds === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, seconds]);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (showHours || hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const sizeMap = { small: "h5", medium: "h4", large: "h3" } as const;
  const variant = sizeMap[size as keyof typeof sizeMap] ?? "h4";

  return (
    <MuiCard elevation={3} sx={{ p: 2, textAlign: "center" }}>
      <Typography variant={variant} fontWeight="bold" sx={{ color: color ?? "text.primary", fontFamily: "monospace" }}>
        {formatTime(seconds)}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2 }}>
        <IconButton onClick={() => setIsRunning(!isRunning)} color="primary">
          {isRunning ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
        <IconButton onClick={() => { setSeconds(initialSeconds ?? 0); setIsRunning(false); }} color="secondary">
          <RestartAltIcon />
        </IconButton>
      </Box>
    </MuiCard>
  );
}

interface CountdownComponentProps {
  targetDate: string;
  title?: string;
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
}

function CountdownComponent({ targetDate, title, showDays, showHours, showMinutes, showSeconds }: CountdownComponentProps) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const target = new Date(targetDate).getTime();
    const now = Date.now();
    return Math.max(0, Math.floor((target - now) / 1000));
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const target = new Date(targetDate).getTime();
      const now = Date.now();
      setTimeLeft(Math.max(0, Math.floor((target - now) / 1000)));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const days = Math.floor(timeLeft / 86400);
  const hours = Math.floor((timeLeft % 86400) / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const secs = timeLeft % 60;

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <Box sx={{ textAlign: "center", mx: 1 }}>
      <Typography variant="h3" fontWeight="bold" sx={{ fontFamily: "monospace", bgcolor: "grey.100", px: 2, py: 1, borderRadius: 2 }}>
        {value.toString().padStart(2, '0')}
      </Typography>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
    </Box>
  );

  return (
    <MuiCard elevation={3} sx={{ p: 3, textAlign: "center" }}>
      {title && <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>}
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        {(showDays !== false) && <TimeUnit value={days} label="Days" />}
        {(showHours !== false) && <TimeUnit value={hours} label="Hours" />}
        {(showMinutes !== false) && <TimeUnit value={minutes} label="Minutes" />}
        {(showSeconds !== false) && <TimeUnit value={secs} label="Seconds" />}
      </Box>
    </MuiCard>
  );
}

interface AlertComponentProps {
  severity: "success" | "info" | "warning" | "error";
  title?: string;
  message: string;
  dismissible?: boolean;
}

function AlertComponent({ severity, title, message, dismissible }: AlertComponentProps) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <MuiAlert
      severity={severity}
      onClose={dismissible ? () => setVisible(false) : undefined}
      sx={{ mb: 2 }}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {message}
    </MuiAlert>
  );
}

interface SliderComponentProps {
  label?: string;
  min: number;
  max: number;
  defaultValue?: number;
  step?: number;
  marks?: boolean;
  showValue?: boolean;
  color?: "primary" | "secondary";
}

function SliderComponent({ label, min, max, defaultValue, step, marks, showValue, color }: SliderComponentProps) {
  const [value, setValue] = useState(defaultValue ?? ((min + max) / 2));

  return (
    <Box sx={{ width: "100%", px: 2 }}>
      {label && (
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2" color="text.secondary">{label}</Typography>
          {showValue && <Typography variant="body2" fontWeight="bold">{value}</Typography>}
        </Box>
      )}
      <MuiSlider
        value={value}
        onChange={(_, newValue) => setValue(newValue as number)}
        min={min}
        max={max}
        step={step ?? 1}
        marks={marks}
        color={color ?? "primary"}
        valueLabelDisplay="auto"
      />
    </Box>
  );
}

interface RatingComponentProps {
  value: number;
  max?: number;
  precision?: number;
  size?: "small" | "medium" | "large";
  readOnly?: boolean;
  label?: string;
}

function RatingComponent({ value: initialValue, max, precision, size, readOnly, label }: RatingComponentProps) {
  const [value, setValue] = useState(initialValue);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {label && <Typography variant="body2" color="text.secondary">{label}</Typography>}
      <MuiRating
        value={value}
        onChange={(_, newValue) => !readOnly && setValue(newValue ?? 0)}
        max={max ?? 5}
        precision={precision ?? 1}
        size={size ?? "medium"}
        readOnly={readOnly}
      />
    </Box>
  );
}

// DataGrid Component (needs state for pagination)
interface DataGridComponentProps {
  title?: string;
  columns: Array<{
    key: string;
    header: string;
    width?: number;
    align?: "left" | "center" | "right";
    sortable?: boolean;
    type?: "text" | "number" | "badge" | "progress" | "avatar";
  }>;
  rows: Array<Record<string, any>>;
  pageSize?: number;
  showPagination?: boolean;
  striped?: boolean;
  hoverable?: boolean;
}

function DataGridComponent({ title, columns, rows, pageSize = 10, showPagination, striped, hoverable }: DataGridComponentProps) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil((rows?.length ?? 0) / pageSize);
  const displayRows = rows?.slice(page * pageSize, (page + 1) * pageSize) ?? [];

  const renderCellContent = (col: any, value: any) => {
    switch (col.type) {
      case "badge":
        return <Chip label={value} size="small" color="primary" />;
      case "progress":
        return <LinearProgress variant="determinate" value={Number(value)} sx={{ width: 80, height: 8, borderRadius: 4 }} />;
      case "avatar":
        return <MuiAvatar sx={{ width: 32, height: 32 }} src={value}>{String(value).charAt(0)}</MuiAvatar>;
      default:
        return value;
    }
  };

  return (
    <MuiCard elevation={3} sx={{ p: 2, height: '100%' }}>
      {title && <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>{title}</Typography>}
      <TableContainer>
        <MuiTable size="small">
          <TableHead>
            <TableRow>
              {columns?.map((col, i) => (
                <TableCell key={i} align={col.align ?? "left"} sx={{ fontWeight: "bold", bgcolor: "grey.100", width: col.width }}>
                  {col.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayRows.map((row, rowIdx) => (
              <TableRow
                key={rowIdx}
                sx={{
                  ...(striped && rowIdx % 2 === 1 ? { bgcolor: "grey.50" } : {}),
                  ...(hoverable ? { "&:hover": { bgcolor: "action.hover" } } : {}),
                }}
              >
                {columns?.map((col, colIdx) => (
                  <TableCell key={colIdx} align={col.align ?? "left"}>
                    {renderCellContent(col, row[col.key])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </MuiTable>
      </TableContainer>
      {showPagination && totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2 }}>
          <MuiButton size="small" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</MuiButton>
          <Typography variant="body2" sx={{ display: "flex", alignItems: "center" }}>Page {page + 1} of {totalPages}</Typography>
          <MuiButton size="small" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Next</MuiButton>
        </Box>
      )}
    </MuiCard>
  );
}

// --- End of Stateful Components ---



export function renderNode(node: UIComponentSchemaType): React.ReactNode {
  if (!node) return null;
  const { type, props } = node;

  const renderChildren = () =>
    'children' in node && node.children
      ? node.children.map((c: UIComponentSchemaType, i: number) => <React.Fragment key={i}>{renderNode(c)}</React.Fragment>)
      : null;

  switch (type) {

    case "Page":
      return (
        <Box sx={{ p: 4, bgcolor: "#f9fafb", minHeight: "100vh" }}>
          {renderChildren()}
        </Box>
      );

    case "Stack":
      return (
        <Stack spacing={props.spacing ?? 2} direction={props.direction ?? "column"}>
          {renderChildren()}
        </Stack>
      );

    case "Grid":
      return (
        <Grid container spacing={props.spacing ?? 2}>

          {node.children.map((c: UIComponentSchemaType, i: number) => (
            <Grid size={props.xs ?? 12} key={i}>
              {renderNode(c)}
            </Grid>
          ))}
        </Grid>
      );

    case "Card":
      return (
        <MuiCard elevation={3}>
          <CardContent>{renderChildren()}</CardContent>
        </MuiCard>
      );

    // --- Basic UI ---
    case "Header":
      return (
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {props.text}
        </Typography>
      );

    case "Text":
      return (
        <Typography variant="body1" color="text.secondary">
          {props.content}
        </Typography>
      );

    case "Divider":
      return <Divider sx={{ my: 2 }} />;

    case "Chip":
      return <Chip label={props.label} color={props.color ?? "primary"} />;

    case "Button":
      return (
        <MuiButton
          variant={props.variant ?? "contained"}
          color={props.color ?? "primary"}
        >
          {props.label}
        </MuiButton>
      );

    case "Input":
      return (
        <TextField
          fullWidth
          label={props.label}
          placeholder={props.placeholder}
          type={props.type ?? "text"}
        />
      );

    case "List":
      return (
        <MuiList>
          {React.Children.map(props.items, (item, idx) => (
            <ListItem key={idx}>{item}</ListItem>
          ))}
        </MuiList>
      );

    case "Image":
      return (
        <Box
          component="img"
          src={props.src}
          alt={props.alt ?? ""}
          sx={{ width: "100%", borderRadius: 2 }}
        />
      );
    case "LineChart":
      return (
        <MuiCard elevation={3} sx={{ p: 2, height: '100%' }}>
          {/* Optional Header Section */}
          {(props.title || props.description) && (
            <Box mb={2}>
              {props.title && (
                <Typography variant="h6" fontWeight="bold">
                  {props.title}
                </Typography>
              )}
              {props.description && (
                <Typography variant="body2" color="text.secondary">
                  {props.description}
                </Typography>
              )}
            </Box>
          )}

          {/* Recharts Container */}
          <Box sx={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={props.data}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}

              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey={props.xAxisKey}
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb" }}
                />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />

                {/* Dynamically render lines based on the 'lines' prop array */}
                {props.lines?.map((line: any, i: number) => (
                  <Line
                    key={i}
                    type="monotone"
                    dataKey={line.dataKey}
                    stroke={line.stroke}

                    name={line.name || line.dataKey}
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </MuiCard>
      );
    case "LinearProgress":
      return <LinearProgress variant="determinate" value={props.value ?? 0} color={props.color ?? "primary"} />;

    // --- Data Visualization Components ---
    case "BarChart":
      return (
        <MuiCard elevation={3} sx={{ p: 2, height: '100%' }}>
          {(props.title || props.description) && (
            <Box mb={2}>
              {props.title && (
                <Typography variant="h6" fontWeight="bold">
                  {props.title}
                </Typography>
              )}
              {props.description && (
                <Typography variant="body2" color="text.secondary">
                  {props.description}
                </Typography>
              )}
            </Box>
          )}
          <Box sx={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={props.data}
                layout={props.layout ?? "horizontal"}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey={props.xAxisKey}
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb" }}
                />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                {props.bars?.map((bar: any, i: number) => (
                  <Bar
                    key={i}
                    dataKey={bar.dataKey}
                    fill={bar.fill}
                    name={bar.name || bar.dataKey}
                    stackId={bar.stackId}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </RechartsBarChart>
            </ResponsiveContainer>
          </Box>
        </MuiCard>
      );

    case "AreaChart":
      return (
        <MuiCard elevation={3} sx={{ p: 2, height: '100%' }}>
          {(props.title || props.description) && (
            <Box mb={2}>
              {props.title && (
                <Typography variant="h6" fontWeight="bold">
                  {props.title}
                </Typography>
              )}
              {props.description && (
                <Typography variant="body2" color="text.secondary">
                  {props.description}
                </Typography>
              )}
            </Box>
          )}
          <Box sx={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsAreaChart
                data={props.data}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey={props.xAxisKey}
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb" }}
                />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                {props.areas?.map((area: any, i: number) => (
                  <Area
                    key={i}
                    type="monotone"
                    dataKey={area.dataKey}
                    fill={area.fill}
                    stroke={area.stroke}
                    fillOpacity={0.4}
                    name={area.name || area.dataKey}
                    stackId={area.stackId}
                  />
                ))}
              </RechartsAreaChart>
            </ResponsiveContainer>
          </Box>
        </MuiCard>
      );

    case "PieChart": {
      const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
      return (
        <MuiCard elevation={3} sx={{ p: 2, height: '100%' }}>
          {(props.title || props.description) && (
            <Box mb={2}>
              {props.title && (
                <Typography variant="h6" fontWeight="bold">
                  {props.title}
                </Typography>
              )}
              {props.description && (
                <Typography variant="body2" color="text.secondary">
                  {props.description}
                </Typography>
              )}
            </Box>
          )}
          <Box sx={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={props.data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={props.innerRadius ?? 0}
                  outerRadius={props.outerRadius ?? 100}
                  label={props.showLabels !== false}
                  labelLine={props.showLabels !== false}
                >
                  {props.data?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb" }}
                />
                {props.showLegend !== false && <Legend />}
              </RechartsPieChart>
            </ResponsiveContainer>
          </Box>
        </MuiCard>
      );
    }

    case "StatCard": {
      const TrendIcon = props.trend === "up" ? TrendingUpIcon
        : props.trend === "down" ? TrendingDownIcon
          : TrendingFlatIcon;
      const trendColor = props.trend === "up" ? "success.main"
        : props.trend === "down" ? "error.main"
          : "text.secondary";
      return (
        <MuiCard elevation={3} sx={{ p: 2, height: '100%' }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
            <Typography variant="body2" color="text.secondary" fontWeight="medium">
              {props.title}
            </Typography>
          </Box>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
            {props.value}
          </Typography>
          {props.change !== undefined && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <TrendIcon sx={{ fontSize: 18, color: trendColor }} />
              <Typography variant="body2" sx={{ color: trendColor, fontWeight: "medium" }}>
                {Math.abs(props.change)}%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                {props.changeLabel || "vs last period"}
              </Typography>
            </Box>
          )}
        </MuiCard>
      );
    }

    case "Table":
      return (
        <MuiCard elevation={3} sx={{ p: 2, height: '100%' }}>
          {props.title && (
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              {props.title}
            </Typography>
          )}
          <TableContainer component={Paper} elevation={0}>
            <MuiTable size="small">
              <TableHead>
                <TableRow>
                  {props.columns?.map((col: any, i: number) => (
                    <TableCell
                      key={i}
                      align={col.align ?? "left"}
                      sx={{ fontWeight: "bold", bgcolor: "grey.100" }}
                    >
                      {col.header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {props.rows?.map((row: any, rowIdx: number) => (
                  <TableRow
                    key={rowIdx}
                    sx={props.striped && rowIdx % 2 === 1 ? { bgcolor: "grey.50" } : {}}
                  >
                    {props.columns?.map((col: any, colIdx: number) => (
                      <TableCell key={colIdx} align={col.align ?? "left"}>
                        {row[col.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </MuiTable>
          </TableContainer>
        </MuiCard>
      );

    case "RadialGauge": {
      const maxValue = props.maxValue ?? 100;
      const percentage = (props.value / maxValue) * 100;
      const chartData = [{ name: props.title, value: percentage, fill: props.color ?? "#8884d8" }];
      return (
        <MuiCard elevation={3} sx={{ p: 2, height: '100%' }}>
          <Typography variant="body2" color="text.secondary" fontWeight="medium" sx={{ mb: 1 }}>
            {props.title}
          </Typography>
          <Box sx={{ width: "100%", height: 200, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                data={chartData}
                startAngle={90}
                endAngle={90 - (percentage * 360) / 100}
                innerRadius={60}
                outerRadius={90}
                cx="50%"
                cy="50%"
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar
                  background={{ fill: "#e5e7eb" }}
                  dataKey="value"
                  cornerRadius={10}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <Box sx={{ textAlign: "center", mt: -8 }}>
              <Typography variant="h4" fontWeight="bold">
                {props.value}
              </Typography>
              {props.label && (
                <Typography variant="body2" color="text.secondary">
                  {props.label}
                </Typography>
              )}
            </Box>
          </Box>
        </MuiCard>
      );
    }

    // --- New Utility Components ---
    case "Timer":
      return (
        <TimerComponent
          initialSeconds={props.initialSeconds}
          autoStart={props.autoStart}
          showHours={props.showHours}
          size={props.size}
          color={props.color}
        />
      );

    case "Countdown":
      return (
        <CountdownComponent
          targetDate={props.targetDate}
          title={props.title}
          showDays={props.showDays}
          showHours={props.showHours}
          showMinutes={props.showMinutes}
          showSeconds={props.showSeconds}
        />
      );

    case "Alert":
      return (
        <AlertComponent
          severity={props.severity}
          title={props.title}
          message={props.message}
          dismissible={props.dismissible}
        />
      );

    case "Badge":
      return (
        <MuiBadge
          badgeContent={props.content}
          color={props.color ?? "primary"}
          variant={props.variant ?? "standard"}
          max={props.max ?? 99}
        >
          {renderChildren()}
        </MuiBadge>
      );

    case "Switch":
      return (
        <FormControlLabel
          control={
            <MuiSwitch
              defaultChecked={props.defaultChecked}
              disabled={props.disabled}
              color={props.color ?? "primary"}
              size={props.size ?? "medium"}
            />
          }
          label={props.label}
        />
      );

    case "Slider":
      return (
        <SliderComponent
          label={props.label}
          min={props.min}
          max={props.max}
          defaultValue={props.defaultValue}
          step={props.step}
          marks={props.marks}
          showValue={props.showValue}
          color={props.color}
        />
      );

    case "Skeleton":
      return (
        <MuiSkeleton
          variant={props.variant ?? "rectangular"}
          width={props.width}
          height={props.height}
          animation={props.animation === "false" ? false : props.animation ?? "pulse"}
        />
      );

    case "Avatar": {
      const getInitials = (name?: string) => {
        if (!name) return "";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
      };

      const sizeMap = { small: 32, medium: 40, large: 56 };
      const size = sizeMap[props.size as keyof typeof sizeMap] ?? 40;

      return (
        <MuiAvatar
          src={props.src}
          alt={props.alt ?? props.name}
          variant={props.variant ?? "circular"}
          sx={{ width: size, height: size, bgcolor: props.bgcolor }}
        >
          {!props.src && getInitials(props.name)}
        </MuiAvatar>
      );
    }

    case "AvatarGroup":
      return (
        <MuiAvatarGroup max={props.max ?? 4}>
          {props.avatars?.map((avatar: any, i: number) => {
            const getInitials = (name?: string) => {
              if (!name) return "";
              return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
            };
            return (
              <MuiAvatar key={i} src={avatar.src} alt={avatar.alt ?? avatar.name}>
                {!avatar.src && getInitials(avatar.name)}
              </MuiAvatar>
            );
          })}
        </MuiAvatarGroup>
      );

    case "Tooltip":
      return (
        <MuiTooltip
          title={props.title}
          placement={props.placement ?? "top"}
          arrow={props.arrow ?? false}
        >
          <span>{renderChildren()}</span>
        </MuiTooltip>
      );

    case "Accordion":
      return (
        <Box>
          {props.items?.map((item: any, i: number) => (
            <MuiAccordion key={i} defaultExpanded={item.defaultExpanded}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="medium">{item.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">{item.content}</Typography>
              </AccordionDetails>
            </MuiAccordion>
          ))}
        </Box>
      );

    case "Stepper":
      return (
        <MuiStepper
          activeStep={props.activeStep}
          orientation={props.orientation ?? "horizontal"}
          alternativeLabel={props.alternativeLabel}
        >
          {props.steps?.map((step: any, i: number) => (
            <Step key={i}>
              <StepLabel optional={step.description ? <Typography variant="caption">{step.description}</Typography> : undefined}>
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </MuiStepper>
      );

    case "Rating":
      return (
        <RatingComponent
          value={props.value}
          max={props.max}
          precision={props.precision}
          size={props.size}
          readOnly={props.readOnly}
          label={props.label}
        />
      );

    case "CircularProgress": {
      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ position: "relative", display: "inline-flex" }}>
            <MuiCircularProgress
              variant={props.variant ?? "indeterminate"}
              value={props.value}
              size={props.size ?? 40}
              thickness={props.thickness ?? 3.6}
              color={props.color ?? "primary"}
            />
            {props.variant === "determinate" && props.value !== undefined && (
              <Box sx={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography variant="caption" fontWeight="bold">{`${Math.round(props.value)}%`}</Typography>
              </Box>
            )}
          </Box>
          {props.label && <Typography variant="body2" color="text.secondary">{props.label}</Typography>}
        </Box>
      );
    }

    case "SparklineChart": {
      const data = props.data?.map((value: number, index: number) => ({ value, index })) ?? [];

      return (
        <MuiCard elevation={3} sx={{ p: 2 }}>
          {props.title && <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{props.title}</Typography>}
          <Box sx={{ width: "100%", height: props.height ?? 60 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsAreaChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={props.color ?? "#8884d8"}
                  fill={props.color ?? "#8884d8"}
                  fillOpacity={0.3}
                  dot={props.showDots ? { r: 2 } : false}
                />
              </RechartsAreaChart>
            </ResponsiveContainer>
          </Box>
        </MuiCard>
      );
    }

    // --- Advanced Data Visualization Components ---
    case "ComboChart":
      return (
        <MuiCard elevation={3} sx={{ p: 2, height: '100%' }}>
          {(props.title || props.description) && (
            <Box mb={2}>
              {props.title && <Typography variant="h6" fontWeight="bold">{props.title}</Typography>}
              {props.description && <Typography variant="body2" color="text.secondary">{props.description}</Typography>}
            </Box>
          )}
          <Box sx={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={props.data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey={props.xAxisKey} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb" }} />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                {props.bars?.map((bar: any, i: number) => (
                  <Bar key={i} dataKey={bar.dataKey} fill={bar.fill} name={bar.name || bar.dataKey} radius={[4, 4, 0, 0]} />
                ))}
                {props.lines?.map((line: any, i: number) => (
                  <Line key={i} type="monotone" dataKey={line.dataKey} stroke={line.stroke} name={line.name || line.dataKey} strokeWidth={2} dot={{ r: 4 }} />
                ))}
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        </MuiCard>
      );

    case "ScatterChart": {
      const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088FE"];
      return (
        <MuiCard elevation={3} sx={{ p: 2, height: '100%' }}>
          {(props.title || props.description) && (
            <Box mb={2}>
              {props.title && <Typography variant="h6" fontWeight="bold">{props.title}</Typography>}
              {props.description && <Typography variant="body2" color="text.secondary">{props.description}</Typography>}
            </Box>
          )}
          <Box sx={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" dataKey="x" name={props.xAxisLabel ?? "X"} stroke="#888888" fontSize={12} />
                <YAxis type="number" dataKey="y" name={props.yAxisLabel ?? "Y"} stroke="#888888" fontSize={12} />
                {props.showZAxis && <ZAxis type="number" dataKey="z" range={[60, 400]} />}
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb" }} />
                <Legend />
                <Scatter name="Data" data={props.data} fill="#8884d8">
                  {props.data?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                  ))}
                </Scatter>
              </RechartsScatterChart>
            </ResponsiveContainer>
          </Box>
        </MuiCard>
      );
    }

    case "FunnelChart": {
      const COLORS = ["#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d", "#a4de6c", "#d0ed57", "#ffc658"];
      return (
        <MuiCard elevation={3} sx={{ p: 2, height: '100%' }}>
          {(props.title || props.description) && (
            <Box mb={2}>
              {props.title && <Typography variant="h6" fontWeight="bold">{props.title}</Typography>}
              {props.description && <Typography variant="body2" color="text.secondary">{props.description}</Typography>}
            </Box>
          )}
          <Box sx={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsFunnelChart>
                <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb" }} />
                <Funnel dataKey="value" data={props.data} isAnimationActive>
                  {props.data?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                  ))}
                  {props.showLabels && <LabelList position="center" fill="#fff" fontSize={12} dataKey="name" />}
                  {props.showValues && <LabelList position="right" fill="#666" fontSize={12} dataKey="value" />}
                </Funnel>
              </RechartsFunnelChart>
            </ResponsiveContainer>
          </Box>
        </MuiCard>
      );
    }

    case "TreemapChart": {
      const COLORS = ["#8889DD", "#9597E4", "#8DC77B", "#A5D297", "#E2CF45", "#F8C12D"];
      const flattenData = (data: any[]) => {
        return data.flatMap((item: any) => {
          if (item.children && item.children.length > 0) {
            return item.children.map((child: any) => ({ ...child, parent: item.name }));
          }
          return [item];
        });
      };

      return (
        <MuiCard elevation={3} sx={{ p: 2, height: '100%' }}>
          {(props.title || props.description) && (
            <Box mb={2}>
              {props.title && <Typography variant="h6" fontWeight="bold">{props.title}</Typography>}
              {props.description && <Typography variant="body2" color="text.secondary">{props.description}</Typography>}
            </Box>
          )}
          <Box sx={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={flattenData(props.data)}
                dataKey="size"
                aspectRatio={4 / 3}
                stroke="#fff"
                fill="#8884d8"
              >
                {flattenData(props.data)?.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                ))}
                <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb" }} />
              </Treemap>
            </ResponsiveContainer>
          </Box>
        </MuiCard>
      );
    }

    case "HeatmapTable": {
      const getColor = (value: number, min: number, max: number, minColor: string, maxColor: string) => {
        const ratio = (value - min) / (max - min || 1);
        return `color-mix(in srgb, ${maxColor} ${ratio * 100}%, ${minColor})`;
      };

      const allValues = props.data.flat();
      const minVal = Math.min(...allValues);
      const maxVal = Math.max(...allValues);
      const minColor = props.minColor ?? "#f0f9ff";
      const maxColor = props.maxColor ?? "#1e40af";

      return (
        <MuiCard elevation={3} sx={{ p: 2, height: '100%' }}>
          {props.title && <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>{props.title}</Typography>}
          <TableContainer>
            <MuiTable size="small">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  {props.xLabels.map((label: string, i: number) => (
                    <TableCell key={i} align="center" sx={{ fontWeight: "bold" }}>{label}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {props.yLabels.map((yLabel: string, rowIdx: number) => (
                  <TableRow key={rowIdx}>
                    <TableCell sx={{ fontWeight: "bold" }}>{yLabel}</TableCell>
                    {props.data[rowIdx]?.map((value: number, colIdx: number) => (
                      <TableCell
                        key={colIdx}
                        align="center"
                        sx={{
                          backgroundColor: getColor(value, minVal, maxVal, minColor, maxColor),
                          color: value > (maxVal + minVal) / 2 ? "#fff" : "#000",
                        }}
                      >
                        {props.showValues !== false && value}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </MuiTable>
          </TableContainer>
        </MuiCard>
      );
    }

    case "KPICard": {
      const TrendIcon = props.trend === "up" ? TrendingUpIcon : props.trend === "down" ? TrendingDownIcon : TrendingFlatIcon;
      const trendColor = props.trend === "up" ? "success.main" : props.trend === "down" ? "error.main" : "text.secondary";
      const sparkData = props.sparklineData?.map((value: number, index: number) => ({ value, index })) ?? [];

      return (
        <MuiCard elevation={3} sx={{ p: 2, height: '100%', borderLeft: props.color ? `4px solid ${props.color}` : undefined }}>
          <Typography variant="body2" color="text.secondary" fontWeight="medium">{props.title}</Typography>
          <Typography variant="h3" fontWeight="bold" sx={{ my: 1 }}>{props.value}</Typography>
          {props.subtitle && <Typography variant="body2" color="text.secondary">{props.subtitle}</Typography>}
          {props.change !== undefined && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1 }}>
              <TrendIcon sx={{ fontSize: 18, color: trendColor }} />
              <Typography variant="body2" sx={{ color: trendColor, fontWeight: "medium" }}>{Math.abs(props.change)}%</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>{props.changeLabel || "vs last period"}</Typography>
            </Box>
          )}
          {sparkData.length > 0 && (
            <Box sx={{ width: "100%", height: 40, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsAreaChart data={sparkData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <Area type="monotone" dataKey="value" stroke={props.sparklineColor ?? "#8884d8"} fill={props.sparklineColor ?? "#8884d8"} fillOpacity={0.3} />
                </RechartsAreaChart>
              </ResponsiveContainer>
            </Box>
          )}
        </MuiCard>
      );
    }

    case "DataGrid": {
      const [page, setPage] = useState(0);
      const pageSize = props.pageSize ?? 10;
      const totalPages = Math.ceil((props.rows?.length ?? 0) / pageSize);
      const displayRows = props.rows?.slice(page * pageSize, (page + 1) * pageSize) ?? [];

      const renderCellContent = (col: any, value: any) => {
        switch (col.type) {
          case "badge":
            return <Chip label={value} size="small" color="primary" />;
          case "progress":
            return <LinearProgress variant="determinate" value={Number(value)} sx={{ width: 80, height: 8, borderRadius: 4 }} />;
          case "avatar":
            return <MuiAvatar sx={{ width: 32, height: 32 }} src={value}>{String(value).charAt(0)}</MuiAvatar>;
          default:
            return value;
        }
      };

      return (
        <MuiCard elevation={3} sx={{ p: 2, height: '100%' }}>
          {props.title && <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>{props.title}</Typography>}
          <TableContainer>
            <MuiTable size="small">
              <TableHead>
                <TableRow>
                  {props.columns?.map((col: any, i: number) => (
                    <TableCell key={i} align={col.align ?? "left"} sx={{ fontWeight: "bold", bgcolor: "grey.100", width: col.width }}>
                      {col.header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {displayRows.map((row: any, rowIdx: number) => (
                  <TableRow
                    key={rowIdx}
                    sx={{
                      ...(props.striped && rowIdx % 2 === 1 ? { bgcolor: "grey.50" } : {}),
                      ...(props.hoverable ? { "&:hover": { bgcolor: "action.hover" } } : {}),
                    }}
                  >
                    {props.columns?.map((col: any, colIdx: number) => (
                      <TableCell key={colIdx} align={col.align ?? "left"}>
                        {renderCellContent(col, row[col.key])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </MuiTable>
          </TableContainer>
          {props.showPagination && totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2 }}>
              <MuiButton size="small" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</MuiButton>
              <Typography variant="body2" sx={{ display: "flex", alignItems: "center" }}>Page {page + 1} of {totalPages}</Typography>
              <MuiButton size="small" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Next</MuiButton>
            </Box>
          )}
        </MuiCard>
      );
    }

    case "MetricTrend": {
      const TrendIconComponent = ({ trend }: { trend?: string }) => {
        const Icon = trend === "up" ? TrendingUpIcon : trend === "down" ? TrendingDownIcon : TrendingFlatIcon;
        const color = trend === "up" ? "success.main" : trend === "down" ? "error.main" : "text.secondary";
        return <Icon sx={{ fontSize: 18, color }} />;
      };

      return (
        <MuiCard elevation={3} sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>{props.title}</Typography>
          <Box sx={{ display: "flex", flexDirection: props.layout === "vertical" ? "column" : "row", gap: 3, flexWrap: "wrap" }}>
            {props.metrics?.map((metric: any, i: number) => (
              <Box key={i} sx={{ flex: 1, minWidth: 120 }}>
                <Typography variant="body2" color="text.secondary">{metric.label}</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="h5" fontWeight="bold">{metric.value}</Typography>
                  {metric.change !== undefined && (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <TrendIconComponent trend={metric.trend} />
                      <Typography variant="body2" sx={{ color: metric.trend === "up" ? "success.main" : metric.trend === "down" ? "error.main" : "text.secondary" }}>
                        {Math.abs(metric.change)}%
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </MuiCard>
      );
    }

    case "ComparisonBar": {
      return (
        <MuiCard elevation={3} sx={{ p: 2, height: '100%' }}>
          {props.title && <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>{props.title}</Typography>}
          <Stack spacing={2}>
            {props.items?.map((item: any, i: number) => {
              const maxVal = item.maxValue ?? Math.max(...props.items.map((it: any) => it.value));
              const percentage = (item.value / maxVal) * 100;
              return (
                <Box key={i}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography variant="body2">{item.label}</Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {props.showValues && <Typography variant="body2" fontWeight="bold">{item.value}</Typography>}
                      {props.showPercentage && <Typography variant="body2" color="text.secondary">({percentage.toFixed(0)}%)</Typography>}
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={percentage}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: "grey.200",
                      "& .MuiLinearProgress-bar": { bgcolor: item.color ?? "#8884d8", borderRadius: 5 }
                    }}
                  />
                </Box>
              );
            })}
          </Stack>
        </MuiCard>
      );
    }

    case "MiniChart": {
      const data = props.data?.map((value: number, index: number) => ({ value, index })) ?? [];
      const chartHeight = props.height ?? 40;
      const chartWidth = props.width ?? "100%";

      return (
        <Box sx={{ width: chartWidth, height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            {props.type === "bar" ? (
              <RechartsBarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                {props.showTooltip && <Tooltip />}
                <Bar dataKey="value" fill={props.color ?? "#8884d8"} />
              </RechartsBarChart>
            ) : props.type === "line" ? (
              <LineChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                {props.showTooltip && <Tooltip />}
                <Line type="monotone" dataKey="value" stroke={props.color ?? "#8884d8"} strokeWidth={2} dot={false} />
              </LineChart>
            ) : (
              <RechartsAreaChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                {props.showTooltip && <Tooltip />}
                <Area type="monotone" dataKey="value" stroke={props.color ?? "#8884d8"} fill={props.color ?? "#8884d8"} fillOpacity={0.3} />
              </RechartsAreaChart>
            )}
          </ResponsiveContainer>
        </Box>
      );
    }

    case "ProgressRing": {
      const maxValue = props.maxValue ?? 100;
      const percentage = (props.value / maxValue) * 100;
      const sizeMap = { small: 80, medium: 120, large: 160 };
      const size = sizeMap[props.size as keyof typeof sizeMap] ?? 120;
      const thickness = props.thickness ?? 8;

      return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Box sx={{ position: "relative", display: "inline-flex" }}>
            <MuiCircularProgress
              variant="determinate"
              value={100}
              size={size}
              thickness={thickness}
              sx={{ color: "grey.200" }}
            />
            <MuiCircularProgress
              variant="determinate"
              value={percentage}
              size={size}
              thickness={thickness}
              sx={{ color: props.color ?? "primary.main", position: "absolute", left: 0 }}
            />
            {props.showValue !== false && (
              <Box sx={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography variant={size > 100 ? "h4" : "h6"} fontWeight="bold">{`${Math.round(percentage)}%`}</Typography>
              </Box>
            )}
          </Box>
          {props.label && <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{props.label}</Typography>}
        </Box>
      );
    }

    default:
      // TypeScript will scream here if you forget a case
      return null;
  }
}

// --- 3. MAIN EXPORT ---
// Assuming UIComponentSchemaType structure is { tree: UIComponentSchemaType }
export function GenUIRenderer({ ui }: { ui: UIComponentSchemaType }) {
  return <>{renderNode(ui)}</>;
}