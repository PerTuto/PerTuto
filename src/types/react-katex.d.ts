declare module 'react-katex' {
    import * as React from 'react';
    export interface KatexProps {
        math?: string;
        children?: string;
        block?: boolean;
        errorColor?: string;
        renderError?: (error: any) => React.ReactNode;
        settings?: any;
    }
    export class InlineMath extends React.Component<KatexProps> {}
    export class BlockMath extends React.Component<KatexProps> {}
}
