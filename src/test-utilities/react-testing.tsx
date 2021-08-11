import React from 'react';
import {createMount, mount, Node} from '@shopify/react-testing';

import translations from '../../locales/en.json';
import {
  PolarisTestProvider,
  WithPolarisTestProviderOptions,
} from '../components';

export {createMount, mount, Node};

export const mountWithApp = createMount<
  WithPolarisTestProviderOptions,
  WithPolarisTestProviderOptions
>({
  context(options) {
    return options;
  },
  render(element, context) {
    return (
      <PolarisTestProvider i18n={translations} {...context}>
        {element}
      </PolarisTestProvider>
    );
  },
});
