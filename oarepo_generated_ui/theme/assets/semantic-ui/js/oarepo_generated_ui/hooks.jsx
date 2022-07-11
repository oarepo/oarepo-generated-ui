// Copyright (c) 2022 CESNET
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import _get from 'lodash/get'
import _isString from 'lodash/isString'
import _isArray from 'lodash/isArray'
import _mapValues from 'lodash/mapValues'
import React from 'react'
import { GlobalDataContext } from './context'
import { SeparatorComponent } from './ui_components'

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

export const useSeparator = (separator, data, useGlobalData) => {
  if (!separator) {
    return {}
  }
  return _isString(separator) ? (
    <React.Fragment>{separator}</React.Fragment>
  ) : (
    <SeparatorComponent separator={separator} />
  )
}

export async function useComponent(
  _componentName,
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
  const globalData = useGlobalDataContext()

  const _renderLayout = async (_renderProps) => {
    const {
      layout: _layout,
      data: _data = {},
      useGlobalData: _useGlobalData = false,
      ...rest
    } = _renderProps
    // const { takesDataArray = false, Component } = await useComponent(_layout.component)

    const scopedData = useDataContext(_data, _layout.dataField)
    const dataContext = _layout.data || scopedData
    const layoutData = _isArray(dataContext) ? dataContext : [dataContext]
    const layoutProps = {
      ..._layout,
      ...{ data: layoutData },
      ...(_useGlobalData && { globalData }),
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
        ...(useGlobalData && { globalData }),
      }),
    )
  } else {
    return _renderLayout(renderProps)
  }
}

const ChildComponent = ({ child, data, useGlobalData }) =>
  useLayout({ layout: child, data, useGlobalData })

export const useChildrenOrValue = (children, data, useGlobalData) => {
  if (children) {
    return children.map((child) => (
      <ChildComponent {...{ layout: child, data, useGlobalData }} />
    ))
  } else if (_isString(data)) {
    return <React.Fragment>{data}</React.Fragment>
  }
  return (
    <pre>
      <code>JSON.stringify(data)</code>
    </pre>
  )
}
