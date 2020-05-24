import React from 'react'
import { View, FlatList } from 'react-native'
import { Container, ListWrapper } from './styles'
import PageItem, { BucketItem, TableItem } from './Item'

const List = ({ data, onSelect, typeData }) =>
  <Container>
    <ListWrapper>
      {(data || []).map((item, index) =>
        <>
          {
            (() => {
              switch (typeData) {
                case 'buckets':
                  return <BucketItem item={item} key={index} onSelect={onSelect} />
                case 'pages':
                  return <PageItem item={item} key={index} onSelect={onSelect} />
                case 'table':
                  return <TableItem item={item} key={index} onSelect={onSelect} />
                case 'overflows':
                  return <BucketItem item={item} key={index} onSelect={onSelect} />
                default:
                  return ''
              }
            })()
          }
        </>
      )}
    </ListWrapper>
  </Container>

const TableList = ({ data, onSelect, typeData }) =>
  <Container>

    <ListWrapper>
      {(data || []).map((item, index) =>
        <TableItem item={item} key={index} />
      )}
    </ListWrapper>
  </Container>

export { TableList }
export default List
