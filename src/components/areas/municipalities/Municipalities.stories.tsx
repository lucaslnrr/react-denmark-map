import { ComponentStory, ComponentMeta } from '@storybook/react'
import Municipalities from './Municipalities'
import { mockMunicipalityData } from '../../../data/mockMunicipalityData'

export default {
  title: 'ReactDenmarkMap/Municipalities',
  component: Municipalities,
  argTypes: {
    customizeMunicipalities: {
      description:
        'A function that is invoked for every municipality and return a custom object or className.'
    }
  }
} as ComponentMeta<typeof Municipalities>

const Template: ComponentStory<typeof Municipalities> = (args) => <Municipalities {...args} />

export const Default = Template.bind({})
Default.args = {
  width: '700px',
  onClick: undefined // for whatever reason, Storybook automatically applies the onClick prop
}

export const WithCustomStyle = Template.bind({})
WithCustomStyle.args = {
  width: '650px',
  style: { backgroundColor: 'black', paddingTop: '20px', paddingBottom: '20px' },
  color: 'white'
}

export const WithCustomizeMunicipalities = Template.bind({})
WithCustomizeMunicipalities.args = {
  width: '700px',
  customizeAreas: (municipality) => {
    const result = mockMunicipalityData.find((item) => item.id === municipality.name)

    if (!result) return

    if (result.average > 6) {
      return {
        style: { fill: 'green' }
      }
    } else {
      return {
        style: { fill: 'red' }
      }
    }
  },
  onClick: undefined
}

export const WithCustomTooltip = Template.bind({})
WithCustomTooltip.args = {
  width: '700px',
  customizeAreas: (municipality) => {
    const result = mockMunicipalityData.find((item) => item.id === municipality.name)

    if (!result) return

    return {
      style: {
        fill: '#17407a'
      }
    }
  },
  customTooltip: (municipality) => {
    const result = mockMunicipalityData.find((item) => item.id === municipality.name)

    return (
      <div
        style={{
          color: 'white',
          backgroundColor: '#101e2b',
          borderRadius: '4px',
          boxShadow: '0 0 8px rgba(0, 0, 0, 0.2)',
          padding: '6px 12px'
        }}
      >
        <p style={{ fontWeight: 'bold', margin: '0px' }}>{municipality.display_name}</p>
        <p style={{ margin: '2px 0 0' }}>Average: {result?.average ? result.average : 'N/A'}</p>
      </div>
    )
  },
  onClick: undefined
}

export const WithoutTooltip = Template.bind({})
WithoutTooltip.args = {
  width: '700px',
  showTooltip: false,
  onClick: undefined
}

export const NonHoverable = Template.bind({})
NonHoverable.args = {
  width: '700px',
  hoverable: false,
  showTooltip: false,
  onClick: undefined
}

export const Clickable = Template.bind({})
Clickable.args = {
  width: '700px',
  hoverable: false,
  clickable: true,
  showTooltip: false,
  onClick: () => null
}
