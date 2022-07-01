// Copyright (c) 2022 CESNET
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react'
import { Icon as SemanticIcon, Image as SemanticImage } from 'semantic-ui-react'

/**
 * An Icon, that renders either as a custom
 * SVG graphic or as a built-in Semantic-UI Icon.
 */
const Icon = ({ config, data }) => {
  const { component, dataField, name, iconSet, className, ...rest } = config

  const _getIcon = (name) => {
    return iconSet ? iconSet[name] : name
  }

  const iconData = _getIcon(name)

  if (iconData) {
    if (typeof iconData === 'string') {
      // @ts-ignore until Semantic-UI supports React 18
      return <SemanticIcon className={className} name={iconData} {...rest} />
    } else {
      return <SemanticImage className={className} {...iconData} {...rest} />
    }
  }
}

export default Icon
