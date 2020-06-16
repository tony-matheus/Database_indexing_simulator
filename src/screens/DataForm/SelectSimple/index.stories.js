import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withKnobs, text, number, array, object } from '@storybook/addon-knobs'

import SelectSimple from './'

const data = Array(10).fill(1).map((_, index) => 'Option' + (index + 1))

const dataObject = Array(10).fill(1).map((_, index) => ({
  name: 'Option' + (index + 1),
  value: index
}))

storiesOf('UI|Input/SelectSimple', module)
  .addDecorator(withKnobs)
  .add('default', () => (
    <div style={{ padding: '5px', display: 'flex', flexDirection: 'column' }}>
      <SelectSimple
        placeholder={text('placeholder', 'Select an option:')}
        onToggle={action('onToggle')}
        data={array('data', data)}
        selectedIndex={number('selectedIndex', -1)}
        onOptionClick={action('onOptionClick')}
        />
        <h1>This message should be overlaid by options</h1>
    </div>
  ))
  .add('Object', () => (
    <div style={{ padding: '5px', display: 'flex', flexDirection: 'column', background: 'black' }}>
      <SelectSimple
        white
        name="my-select"
        placeholder={text('placeholder', 'Select an option:')}
        onToggle={action('onToggle')}
        data={object('data', dataObject)}
        selectedIndex={number('selectedIndex', -1)}
        onOptionClick={action('onOptionClick')}
        />
        <h1 style={{ color: 'white' }}>This message should be overlaid by options</h1>
    </div>
  ))
