// Copyright (c) 2022 CESNET
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react'
import _isArray from 'lodash/isArray'

function createGeneratedLayout(
  _layout,
  _data = {},
  ContainerComponent = React.Fragment,
) {
  return <ContainerComponent></ContainerComponent>
}

export { createGeneratedLayout }
