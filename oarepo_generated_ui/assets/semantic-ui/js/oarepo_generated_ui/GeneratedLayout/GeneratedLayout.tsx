// Copyright (c) 2022 CESNET
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';
import { LayoutFragmentConfig, LayoutGeneratorProps } from '../types';
import { GlobalDataContextProvider } from '../context';
import { LayoutFragment } from './LayoutFragment';
import _isArray from 'lodash/isArray'

/**
 * Generated user-configured UI view
 */
export const GeneratedLayout: React.FC<React.PropsWithoutRef<LayoutGeneratorProps>> = ({ layout, data }) => {

    const LayoutFragments = (_isArray(layout) ? layout : [layout])
        .map((fragmentConfig: LayoutFragmentConfig, key: number) =>
            LayoutFragment({
                config: { ...fragmentConfig, key },
                data
            })
        )

    return (
        <GlobalDataContextProvider value={data}>
            {LayoutFragments}
        </GlobalDataContextProvider>
    )
}
