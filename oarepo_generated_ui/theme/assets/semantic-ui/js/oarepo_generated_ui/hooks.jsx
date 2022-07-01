// Copyright (c) 2022 CESNET
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import _get from 'lodash/get'
import _isString from 'lodash/isString'
import _isArray from 'lodash/isArray'
import _mapValues from 'lodash/mapValues'
import React from 'react'
import clsx from 'clsx'
import { GlobalDataContext } from './context'

/**
 * Uses data field configuration to query data
 * for respectful values. If no field is passed
 * it simply returns all data.
 *
 * @param data Current Data context object
 * @param field Data fields configuration
 * @returns `props` with values resolved from DataContext
 */
export const useDataContext = (data, field) => {
  if (_isString(field)) {
    return _get(data, field, '')
  } else if (field?.path || field?.default) {
    return _get(data, field?.path || '', field?.default || '')
  }
  return data
}

export const useGlobalDataContext = () => {
  const context = React.useContext(GlobalDataContext)
  if (context === undefined) {
    throw new Error(
      'useGlobalDataContext must be used within a context provider',
    )
  }
  return context
}

export const useItems = (items, itemConfig = { component: 'raw' }) => {
  return items?.map((item) => {
    if (_isString(item)) {
      return { ...itemConfig, children: item }
    } else if (!item.component) {
      return { ...itemConfig, ...item }
    }
    return item
  })
}

export const useSeparator = (separator, _data, _useGlobalData) => {
  if (!separator) {
    return {}
  }
  return _isString(separator) ? (
    <React.Fragment>{separator}</React.Fragment>
  ) : (
    useLayout({ layout: separator, data: _data, useGlobalData: _useGlobalData })
  )
}

export async function useComponent(
  _componentName = 'Span',
  _componentPackage = 'oarepo_ui',
) {
  const component = await import(
    /* webpackInclude: /ui_components\/.*\.jsx$/ */ `@uijs/${_componentPackage}/${_componentName}`
  )
  console.log(component)
  // const CachedComponent = React.memo(component() as React.FC<LayoutFragmentConfig>)
  // return { takesDataArray: false, Component: CachedComponent } as ComponentConfig
}

export function useLayout(renderProps) {
  const { layout, data = {}, useGlobalData = false } = renderProps

  const _renderLayout = async (_renderProps) => {
    const {
      layout: _layout,
      data: _data = {},
      useGlobalData: _useGlobalData = false,
      ...rest
    } = _renderProps
    // const { takesDataArray = false, Component } = await useComponent(_layout.component)

    const dataContext = _layout.data || useDataContext(_data, _layout.dataField)
    const layoutData = _isArray(dataContext) ? dataContext : [dataContext]
    const layoutProps = {
      ..._layout,
      ...{ data: layoutData },
      ...(_useGlobalData && { globalData: useGlobalDataContext() }),
      ...rest,
    }

    if (true) {
      return <React.Fragment {...layoutProps} />
    } else {
    }
  }

  if (_isArray(layout)) {
    return layout.map((layoutItem) =>
      _renderLayout({
        ...renderProps,
        ...{ layout: layoutItem },
        ...{ data: layoutItem.data || data },
        ...(useGlobalData && { globalData: useGlobalDataContext() }),
      }),
    )
  } else {
    return _renderLayout(renderProps)
  }
}

export const useChildrenOrValue = (value, children) => {
  if (children) {
    return children.map((child) => useLayout({ layout: child, data: value }))
  } else if (_isString(value)) {
    return <React.Fragment>{value}</React.Fragment>
  }
  return (
    <pre>
      <code>JSON.stringify(value)</code>
    </pre>
  )
}