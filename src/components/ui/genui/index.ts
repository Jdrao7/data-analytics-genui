// Component Registry - Maps type strings to render functions
// Each component receives (props, renderChildren, renderNode) and returns ReactNode

export { layoutComponents } from './layouts';
export { typographyComponents } from './typography';
export { formComponents } from './forms';
export { chartComponents } from './charts';
export { tableComponents } from './tables';
export { metricComponents } from './metrics';
export { progressComponents } from './progress';
export { utilityComponents } from './utility';
export { interactiveComponents } from './interactive';

// Re-export types
export type { ComponentRegistry, RenderContext } from './types';
