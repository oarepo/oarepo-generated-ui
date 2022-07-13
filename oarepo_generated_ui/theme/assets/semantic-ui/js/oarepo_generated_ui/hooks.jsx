// Copyright (c) 2022 CESNET
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import _get from 'lodash/get'
import _isString from 'lodash/isString'
import _isArray from 'lodash/isArray'
import _camelCase from 'lodash/camelCase'
import _upperFirst from 'lodash/upperFirst'
import * as React from 'react'
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

export const useSeparator = (separator) => {
  console.debug('useSeparator', separator)
  if (!separator) {
    return {}
  }
  return _isString(separator) ? (
    <React.Fragment>{separator}</React.Fragment>
  ) : (
    useLayout({ layout: separator })
  )
}

export function useComponent(name, componentPackage = 'oarepo_ui') {
  const componentName = _upperFirst(_camelCase(name))
  const Component = React.lazy(() =>
    import(
      /* webpackInclude: /ui_components\/.*\.jsx$/ */ `@uijs/${componentPackage}/ui_components/${componentName}`
    ),
  )
  return { Component }
}

export function useLayout(layoutProps) {
  const { layout, data = {}, useGlobalData = false, ...rest } = layoutProps

  function _renderLayout(renderProps) {
    const {
      layout: _layout,
      data: _data = {},
      useGlobalData: _useGlobalData = false,
      ...rest
    } = renderProps
    console.debug('useLayout', renderProps)
    const { Component } = useComponent(_layout.component)

    const scopedData = useDataContext(_data, _layout.dataField)
    const dataContext = _layout.data || scopedData || {}
    const renderData = _isArray(dataContext) ? dataContext : [dataContext]
    console.debug('renderData', renderData)

    const componentProps = {
      ..._layout,
      data: renderData,
      useGlobalData: _useGlobalData,
      ...rest,
    }

    console.debug('componentProps', componentProps)
    // if (takesArray) {
    return (
      <React.Suspense fallback={<React.Fragment />}>
        <Component {...componentProps} />
      </React.Suspense>
    )
    // } else {
    // return renderData.map((d) => <Component {...componentProps} data={d} />)
    // }
  }

  if (_isArray(layout)) {
    return layout.map((layoutItem) =>
      _renderLayout({
        layout: layoutItem,
        data: layoutItem.data || data,
        useGlobalData,
        ...rest,
      }),
    )
  } else {
    const res = _renderLayout(layoutProps)
    console.debug('renderLayout', res)
    return res
  }
}

const ChildComponent = ({ layout, data, useGlobalData }) =>
  useLayout({ layout, data, useGlobalData })

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
      <code>{JSON.stringify(data)}</code>
    </pre>
  )
}
