// Copyright (c) 2022 CESNET
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { DataField, LayoutFragmentConfig, LayoutFragmentData, LayoutFragmentProps, PluginStoreWithPlugins } from './types';

import _get from 'lodash/get';
import _isString from 'lodash/isString';
import _mapValues from 'lodash/mapValues'
import React from 'react';
import { ErrorMessage } from './components';
import clsx from 'clsx';
import { GlobalDataContext } from './context';
import { dataMatchesItems } from './util';
import { usePluginStore } from 'react-pluggable'


/**
 * Uses data field configuration to query data
 * for respectful values. If no field is passed
 * it simply returns all data.
 *
 * @param data Current Data context object
 * @param field Data fields configuration
 * @returns `props` with values resolved from DataContext
 */
export const useDataContext = (
  data?: LayoutFragmentData,
  field?: DataField,
) => {
  if (_isString(field)) {
    return _get(data, field, '');
  } else if (field?.path || field?.default) {
    return _get(data, field?.path || '', field?.default || '');
  }
  return data
};


export const useArrayDataContext = (
  data: any,
  array: any[],
  index: number
) => {
  return dataMatchesItems(data, array) ? data[index] : data
}

export const useGlobalDataContext = () => {
  const context = React.useContext(GlobalDataContext)
  if (context === undefined) {
    throw new Error('useGlobalDataContext must be used within a context provider')
  }
  return context
}


export const useItems = (
  items?: LayoutFragmentConfig[],
  itemConfig: LayoutFragmentConfig = { component: 'raw' }
) => {
  return items?.map(item => {
    if (_isString(item)) {
      return { ...itemConfig, children: item }
    } else if (!item.component) {
      return { ...itemConfig, ...item }
    }
    return item
  })
}


export const useSeparator = (separator: string | LayoutFragmentConfig) => {
  if (!separator) { return {} }
  return _isString(separator)
    ? {
      component: 'span',
      children: separator,
      className: 'oarepo-separator',
    } : {
      ...separator,
      className: clsx(separator.className, 'oarepo-separator'),
    }
}


export const useLayoutFragment = (
  componentName: string,
  props: LayoutFragmentProps
) => {
  const { config } = props

  const pluginStore: PluginStoreWithPlugins = usePluginStore();
  const componentConfig = pluginStore.executeFunction(
    'ComponentRegistry.getComponent',
    componentName
  );
  if (componentConfig) {
    const { component } = componentConfig

    const CachedLayoutFragment = React.memo(component)
    return <CachedLayoutFragment {...props} />
  } else {
    return <ErrorMessage {...config}>
      Component {componentName} not found
    </ErrorMessage>
  }
}
