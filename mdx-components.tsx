import type { MDXComponents } from 'mdx/types';
import { Aurora } from '@/components/public/aurora';
import { LeadCaptureForm } from '@/components/public/lead-capture-form';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows using these React components directly inside .mdx files without importing them
    Aurora,
    LeadCaptureForm,
    ...components,
  };
}
