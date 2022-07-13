// Copyright (c) 2022 CESNET
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react'
import PropTypes from 'prop-types'
import _isArray from 'lodash/isArray'

/**
 */
const DataArray = (Component) => ({ data, useGlobalData, ...rest }) => {
  return _isArray(data) ? (
    data.map((d) => <Component {...{ data: d, useGlobalData }} {...rest} />)
  ) : (
    <Component {...{ data, useGlobalData }} {...rest} />
  )
}

DataArray.propTypes = {
  data: PropTypes.array,
  useGlobalData: PropTypes.bool,
  children: PropTypes.node,
}

export default DataArray
