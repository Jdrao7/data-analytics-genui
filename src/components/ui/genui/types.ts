import React from 'react';
import { UIComponentSchemaType } from '@/genui/schema';

export type RenderContext = {
    renderNode: (node: UIComponentSchemaType) => React.ReactNode;
    renderChildren: () => React.ReactNode;
};

export type ComponentRenderFn = (
    props: any,
    context: RenderContext,
    node?: UIComponentSchemaType
) => React.ReactNode;

export type ComponentRegistry = Record<string, ComponentRenderFn>;
