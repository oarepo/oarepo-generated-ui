// Copyright (c) 2022 CESNET
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from "react"
import { LayoutFragmentProps } from "../types"
import { useLayoutFragment } from "../hooks";
import _mapKeys from 'lodash/mapKeys'
import clsx from 'clsx'


const propertyMap: { [key: string]: string } = {
    class: 'className'
}

/**
 * UI fragment component redered from the given configuration
 * 
 * @param config layout configuration of a fragment
 * @param data data object to be rendered by fragment
 * @returns UI fragment component
 */
export const LayoutFragment: React.FC<React.PropsWithoutRef<LayoutFragmentProps>> = ({ config, data }) => {
    const { component, className, key, ...rest } = config

    const transformedProps = _mapKeys(
        rest,
        (_value: string, _key: string) => {
            return propertyMap[_key] || _key
        })

    const fragmentClasses = clsx(
        className,
        transformedProps.className,
        'oarepo',
        `oarepo-${component}`
    )

    const props = {
        config: {
            ...config,
            ...transformedProps,
            className: fragmentClasses
        },
        data,
    } as LayoutFragmentProps

    return useLayoutFragment(component, props)
}
