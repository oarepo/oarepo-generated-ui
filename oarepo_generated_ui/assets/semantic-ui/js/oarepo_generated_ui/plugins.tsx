// Copyright (c) 2022 CESNET
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { IPlugin, PluginStore } from 'react-pluggable'


import {
    Authority,
    AuthorityIdentifier,
    Column,
    Raw,
    Row,
    TruncatedText,
    List,
    Label,
    Placeholder,
    Grid,
    Item,
    Span,
    Icon,
    DefenseStatus,
    Separator,
    ResultHeader,
    DividedRow,
    Header,
    Container,
    Segment,
    Button,
    Link,
} from './components';
import { ComponentMap, IComponentLibraryPlugin } from './types';


class ComponentRegistryPlugin implements IPlugin {
    pluginStore!: PluginStore;
    namespace = "ComponentRegistry";

    getPluginName (): string {
        return `${this.namespace}@1.0.0`;
    }

    getDependencies (): string[] {
        return ['Renderer@1.0.0'];
    }

    getComponent (name: string) {
        const [component] = this.pluginStore.executeFunction(
            'Renderer.getComponentsInPosition', name)
        return component
    }

    init (pluginStore: PluginStore): void {
        this.pluginStore = pluginStore;
    }

    activate (): void {
        this.pluginStore.addFunction(
            `${this.namespace}.getComponent`,
            this.getComponent.bind(this)
        )
    }

    deactivate (): void {
        this.pluginStore.removeFunction(`${this.namespace}.getComponent`)
    }
}


class BaseComponentLibrary implements IComponentLibraryPlugin {
    components: ComponentMap;
    registerComponents (): void {
        throw new Error('Method not implemented.');
    }
    pluginStore: PluginStore;
    getPluginName (): string {
        throw new Error('Method not implemented.');
    }
    getDependencies (): string[] {
        throw new Error('Method not implemented.');
    }
    init (pluginStore: PluginStore): void {
        throw new Error('Method not implemented.');
    }
    activate (): void {
        throw new Error('Method not implemented.');
    }
    deactivate (): void {
        throw new Error('Method not implemented.');
    }

}

class DefaultComponentLibraryPlugin {
    pluginStore!: PluginStore;
    namespace = "DefaultComponentLibrary";
    components: ComponentMap = {
        container: Container,
        button: Button,
        authority: Authority,
        'authority-identifier': AuthorityIdentifier,
        'defense-status': DefenseStatus,
        'result-header': ResultHeader,
        column: Column,
        row: Row,
        'divided-row': DividedRow,
        list: List,
        label: Label,
        link: Link,
        header: Header,
        raw: Raw,
        grid: Grid,
        span: Span,
        separator: Separator,
        'icon': Icon,
        placeholder: Placeholder,
        item: Item,
        'truncated-text': TruncatedText,
        'segment': Segment
    }

    init (pluginStore: PluginStore): void {
        this.pluginStore = pluginStore;
    }

    getPluginName (): string {
        return `${this.namespace}@1.0.0`;
    }

    registerComponents (): void {
        Object.keys(this.components).forEach(compName =>
            this.pluginStore.executeFunction(
                'Renderer.add',
                compName, this.components[compName]
            ))
    }

    unregisterComponents (): void {
        Object.keys(this.components).forEach(compName =>
            this.pluginStore.executeFunction(
                'Renderer.remove',
                compName, this.components[compName]))
    }

    getDependencies (): string[] {
        return ['Renderer@1.0.0'];
    }
    activate (): void {
        console.debug(`Activating component library ${this.getPluginName()}`)
        this.registerComponents()
    }
    deactivate (): void {
        console.debug(`Dea§ctivating component library ${this.getPluginName()}`)
        this.unregisterComponents()
    }
}


export { ComponentRegistryPlugin, DefaultComponentLibraryPlugin };
