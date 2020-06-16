import React from 'react'
import Form from 'antd/lib/form/Form'

import {
  Container,
  ButtonsContainer,
  ButtonsWrapper,
  Label
} from './styles'
import SelectSimple from './SelectSimple'
import { Input, Button } from 'antd'
import withLogic from './withLogic'

const DataForm = ({ onChange, onSelectAlg, state, onClose, onClear, onStartSimulation }) => {
  const fields = React.useMemo(() => [
    {
      label: 'Tamanho do bucket',
      name: 'BUCKET_SIZE',
      type: 'text'
    },
    {
      label: 'Numero Hash ',
      name: 'HASH_NUMBER',
      type: 'text'
    },
    {
      label: 'Número máximo de Paginas',
      name: 'NUMBER_MAX_PAGES',
      type: 'text'
    },
    {
      label: 'Tamanho da página',
      name: 'PAGE_SIZE',
      type: 'text'
    }
  ])

  return (
    <Form>
      {fields.map((field, index) => (
        <Container key={index}>
          <Label>{field.label}</Label>
          {field.isSelect
            ? (
              <SelectSimple
                onChange={onSelectAlg}
                name={field.name}
                placeholder='Selecione uma opção'
                data={field.selectFields}
                noPosition
                isLeft={false}
              />
            )
            : (
              <Input
                name={field.name}
                placeholder={field.placeholder}
                onChange={onChange}
                value={state[field.name]}
              />
            )}
        </Container>
      ))}
      <ButtonsContainer>
        <Button
          onClick={onClose}
          style={{ marginRight: 8 }}
        >
          Fechar
        </Button>
        <ButtonsWrapper>
          <Button onClick={onStartSimulation} type='primary'>
            Iniciar Simulação
          </Button>
        </ButtonsWrapper>
      </ButtonsContainer>
    </Form>
  )
}

export default withLogic(DataForm)
