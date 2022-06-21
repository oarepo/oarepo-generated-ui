import { Meta, Story } from '@storybook/react';
import { GeneratedLayout } from '.';
import { ComponentMap, LayoutFragmentProps, LayoutGeneratorProps } from '../types';
import 'semantic-ui-css/semantic.min.css'
import { createGeneratedLayout } from '../util';
import { DefaultComponentLibraryPlugin } from '../plugins';
import { IPlugin } from 'react-pluggable'
import React from 'react';

const meta: Meta = {
  title: 'Views/Generated Layout',
  component: GeneratedLayout,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<LayoutGeneratorProps & { plugins: IPlugin[] }> = (args) => createGeneratedLayout(args.layout, args.data);

export const Simple = Template.bind({});
Simple.args = {
  layout: [
    { component: 'label', content: 'This label was generated from config!' }
  ]
}

export const SimpleDataContent = Template.bind({})
SimpleDataContent.args = {
  data: {
    labelValue: 'This value was fetched from data object!',
    nested: { labelValue: 'And this value was fetched from nested data path!' }
  },
  layout: [
    { component: 'label', dataField: 'labelValue' },
    { component: 'label', dataField: 'nested.labelValue' }
  ]
}

export const ComplexDataContent = Template.bind({})
ComplexDataContent.args = {
  data: {
    labels: {
      labelValue1: 'This value was fetched from data object!',
      coolColor: 'blue'
    }
  },
  layout: [
    { component: 'label', dataField: { path: 'labels.labelValue1' } },
    {
      component: 'label', dataField: {
        path: 'labels.labelValue2',
        default: 'This is a default value, because "labels.labelValue2" path is not found!'
      }
    }
  ]
}

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const ResultListItem = Template.bind({});
const data = require('./assets/ui-data-list-item.json')
const layout = require('./assets/ui-config-list-item.json')

ResultListItem.args = { data, layout };


export const UserProvidedComponent = Template.bind({});

const MyCoolComponent: React.FC<React.PropsWithChildren<LayoutFragmentProps>> = ({ config }) => {
  const { children } = config
  return (
    <>
      <h1>
        {children}
      </h1>
      <p>This component was provided externally</p>
    </>
  )
}

class MyCoolComponentPlugin extends DefaultComponentLibraryPlugin {
  components: ComponentMap = { cool: MyCoolComponent }

  getPluginName (): string {
    return 'MyCoolComponent@1.0.0'
  }
}

UserProvidedComponent.args = {
  plugins: [new MyCoolComponentPlugin()],
  layout: [{
    component: 'cool',
    children: 'My cool component'
  }]
}
