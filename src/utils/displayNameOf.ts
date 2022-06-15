import { ComponentType } from 'react';

export default <P>(Comp: ComponentType<P>): string =>
  Comp.displayName || Comp.name || 'UnnamedComponent';
