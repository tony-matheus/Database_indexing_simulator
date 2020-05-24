import React from 'react'
import { Container, Text } from './styles'

export const PageItem = ({ item, onSelect }) =>
  <Container onClick={() => onSelect(item.value.key)}>
    <Text>{'Página\n' + item.value.key}</Text>
  </Container>

export const BucketItem = ({ item, onSelect }) =>
  <Container onClick={() => onSelect(item.key)}>
    <Text>
      {'Bucket\n' + item.key}
    </Text>
  </Container>

export const TableItem = ({ item }) =>
  <Container>
    <Text>
      {`${item.key} - ${item.value}`}
    </Text>
  </Container>
