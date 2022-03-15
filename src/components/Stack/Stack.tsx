import React, {memo, NamedExoticComponent, useMemo} from 'react';

import {classNames, variationName} from '../../utilities/css';
import {
  elementChildren,
  wrapWithComponent,
  isElementOfType,
} from '../../utilities/components';

import {Item} from './components';
import styles from './Stack.scss';

type Spacing =
  | 'extraTight'
  | 'tight'
  | 'baseTight'
  | 'loose'
  | 'extraLoose'
  | 'none';

type Alignment = 'leading' | 'trailing' | 'center' | 'fill' | 'baseline';

type Distribution =
  | 'equalSpacing'
  | 'leading'
  | 'trailing'
  | 'center'
  | 'fill'
  | 'fillEvenly';

export interface StackProps {
  /** Elements to display inside stack */
  children?: React.ReactNode;
  /** Wrap stack elements to additional rows as needed on small screens (Defaults to true) */
  wrap?: boolean;
  /** Stack the elements vertically */
  vertical?: boolean;
  /** Adjust spacing between elements */
  spacing?: Spacing;
  /** Adjust vertical alignment of elements */
  alignment?: Alignment;
  /** Adjust horizontal alignment of elements */
  distribution?: Distribution;
  /** Flatten top level React.Fragments */
  flattenReactFragments?: boolean;
}

export const Stack = memo(function Stack({
  children,
  vertical,
  spacing,
  distribution,
  alignment,
  wrap,
  flattenReactFragments,
}: StackProps) {
  const className = classNames(
    styles.Stack,
    vertical && styles.vertical,
    spacing && styles[variationName('spacing', spacing)],
    distribution && styles[variationName('distribution', distribution)],
    alignment && styles[variationName('alignment', alignment)],
    wrap === false && styles.noWrap,
  );

  const itemMarkup = useMemo(
    () => wrapChildrenWithStackItem(children, flattenReactFragments),
    [children, flattenReactFragments],
  );

  return <div className={className}>{itemMarkup}</div>;
}) as NamedExoticComponent<StackProps> & {
  Item: typeof Item;
};

Stack.Item = Item;

function wrapChildrenWithStackItem(
  children: React.ReactNode,
  flattenReactFragments?: boolean,
  keyProps?: {key: number},
) {
  const props = keyProps ?? {key: -1};

  return elementChildren<React.ReactElement<{children: React.ReactNode}>>(
    children,
  ).reduce((acc, child) => {
    props.key++;

    if (
      flattenReactFragments &&
      isElementOfType(child, React.Fragment) &&
      child.props.children
    ) {
      acc.push(
        ...wrapChildrenWithStackItem(child.props.children, false, props),
      );
      return acc;
    }

    acc.push(wrapWithComponent(child, Item, props));

    return acc;
  }, [] as React.ReactNode[]);
}
