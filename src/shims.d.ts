// Minimal ambient type shims so `tsc` (host build, strict) can compile the
// client half without requiring @types/react in the checkout toolchain.
// The real client bundle is built by tsdown, where react is an external
// resolved by the DSH browser ModuleLoader at runtime.
declare module 'react' {
  export function createElement(type: any, props?: any, ...children: any[]): any
  export function useState<S>(initial: S | (() => S)): [S, (v: S | ((prev: S) => S)) => void]
  export function useEffect(fn: () => void | (() => void), deps?: any[]): void
  export const Fragment: any
  const React: {
    createElement: typeof createElement
    useState: typeof useState
    useEffect: typeof useEffect
    Fragment: any
  }
  export default React
}
