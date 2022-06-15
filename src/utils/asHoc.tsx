/* eslint-disable react/jsx-props-no-spreading */
import React, { ComponentType } from 'react';
import displayNameOf from './displayNameOf';

/**
 * Transforms a "provider" component into a HOC.  A component is a "provider"
 * if it wraps a single child, taking some props and providing some kind of
 * non-visual service to this part of the tree.  Think Redux <Provider>, or
 * React's Context <Provider>.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export default <T extends {}, U extends {}>(
    ProviderComp: ComponentType<Omit<T, 'children'> & { children?: React.ReactNode }>,
    providerProps: Omit<T, 'children'>
  ) =>
  (
    Comp: ComponentType<U>
  ): {
    // eslint-disable-next-line no-unused-vars
    (props: U): JSX.Element;
    displayName: string;
  } => {
    const WrappedComp = (props: U) => (
      <ProviderComp {...providerProps}>
        <Comp {...props} />
      </ProviderComp>
    );
    WrappedComp.displayName = `asHOC(${displayNameOf(ProviderComp)})(${displayNameOf(Comp)})`;
    return WrappedComp;
  };
