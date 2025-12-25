import React from "react";
import { UIComponentSchemaType } from "./schema";

// Import component registries
import { layoutComponents } from "@/components/ui/genui/layouts";
import { typographyComponents } from "@/components/ui/genui/typography";
import { formComponents } from "@/components/ui/genui/forms";
import { chartComponents } from "@/components/ui/genui/charts";
import { tableComponents } from "@/components/ui/genui/tables";
import { metricComponents } from "@/components/ui/genui/metrics";
import { progressComponents } from "@/components/ui/genui/progress";
import { utilityComponents } from "@/components/ui/genui/utility";
import { interactiveComponents } from "@/components/ui/genui/interactive";

// Stock components (external)
import { StockTicker } from "@/components/stock/StockTicker";
import { MarketSentiment } from "@/components/stock/MarketSentiment";
import { StockWatchlist } from "@/components/stock/StockWatchlist";
import { FinancialChart } from "@/components/stock/FinancialChart";

// Merge all component registries
const componentRegistry = {
  ...layoutComponents,
  ...typographyComponents,
  ...formComponents,
  ...chartComponents,
  ...tableComponents,
  ...metricComponents,
  ...progressComponents,
  ...utilityComponents,
  ...interactiveComponents,
};

// Stock components need special handling
const stockComponents: Record<string, (props: any) => React.ReactNode> = {
  StockTicker: (props) => (
    <StockTicker
      symbol={props.symbol}
      name={props.name}
      price={props.price}
      change={props.change}
      changePercent={props.changePercent}
      trendData={props.trendData}
      color={props.color}
    />
  ),
  MarketSentiment: (props) => (
    <MarketSentiment
      value={props.value}
      label={props.label}
      title={props.title}
    />
  ),
  StockWatchlist: (props) => (
    <StockWatchlist
      title={props.title}
      items={props.items ?? []}
    />
  ),
  FinancialChart: (props) => (
    <FinancialChart
      title={props.title}
      chartType={props.chartType}
      data={props.data ?? []}
      height={props.height}
      colors={props.colors}
    />
  ),
};

/**
 * Renders a UI component node from the schema
 */
export function renderNode(node: UIComponentSchemaType): React.ReactNode {
  if (!node) return null;
  const { type, props } = node;

  // Helper to render children
  const renderChildren = () =>
    'children' in node && node.children
      ? node.children.map((c: UIComponentSchemaType, i: number) => (
        <React.Fragment key={i}>{renderNode(c)}</React.Fragment>
      ))
      : null;

  // Context for component render functions
  const context = {
    renderNode,
    renderChildren,
  };

  // Check stock components first
  if (type in stockComponents) {
    return stockComponents[type](props);
  }

  // Check component registry
  if (type in componentRegistry) {
    const renderFn = componentRegistry[type as keyof typeof componentRegistry];
    return renderFn(props, context, node);
  }

  // Component not found
  console.warn(`Unknown component type: ${type}`);
  return null;
}

/**
 * Main GenUI Renderer component
 */
export function GenUIRenderer({ ui }: { ui: UIComponentSchemaType }) {
  return <>{renderNode(ui)}</>;
}