// Copyright (c) 2022 CESNET
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react'
import _isArray from 'lodash/isArray'
import { GeneratedLayout } from './GeneratedLayout'
import { LayoutFragmentConfig, LayoutFragmentData } from './types'
import { createPluginStore, PluginStore, PluginProvider, IPlugin, RendererPlugin } from 'react-pluggable'
import { ComponentRegistryPlugin, DefaultComponentLibraryPlugin } from './plugins'


const dataMatchesItems = (data: any[], items: any[]) => _isArray(data) && data?.length === items?.length

function createGeneratedLayout (
    layout: LayoutFragmentConfig[],
    data: LayoutFragmentData = {},
    plugins: IPlugin[] = [new DefaultComponentLibraryPlugin()],
    ContainerComponent = React.Fragment,
) {
    const pluginStore: PluginStore = createPluginStore();

    pluginStore.install(new RendererPlugin())
    pluginStore.install(new ComponentRegistryPlugin())
    plugins.forEach(plugin => pluginStore.install(plugin))

    return <ContainerComponent>
        <PluginProvider pluginStore={pluginStore}>
            <GeneratedLayout layout={layout} data={data} />
        </PluginProvider>
    </ContainerComponent>
}

export { dataMatchesItems, createGeneratedLayout }
