import React from 'react';
import styled from 'styled-components';
import { Select } from 'antd';

const SelectOutSide = styled(Select)`
  .ant-select-selection{
    ${({ noPosition, isLeft }) => {
    if (!noPosition) {
      return (isLeft
        ? `
        border-bottom-right-radius: 0;
        border-top-right-radius: 0;
      `
        : `
        border-bottom-left-radius: 0;
        border-top-left-radius: 0;
      `)
    }
  }
  }
    /* ${({ isLeft }) => isLeft
  } */
  } 
`

const SelectSimple = ({ data, isLeft, noPosition, onSearch, placeholder, defaultValue, name, onChange, ...restProps }) => {
  const { Option } = Select;
  
  const renderOnChange = () => {
    // if(typeof data[0] === "object")
  }
  return (
    <SelectOutSide
      //noPosition={(!isLeft ) && true}
      //isLeft={isLeft}
      defaultValue={defaultValue}
      onChange={onChange}
      showSearch
      placeholder={placeholder || ""}
      optionFilterProp="children"
      style={{ width: "100%" }}
      onSearch={onSearch}
      filterOption={(input, option) =>
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }>
      <Option
        name={name}
        value="">
        Selecione uma Opção
      </Option>
      {(data || []).map((field, index) => {
        if (typeof (field) === "object") {
          return (
            <Option
              name={name}
              key={index}
              value={field.value}>
              {/* {console.log(field.name, field.value)} */}
              {field.name}
            </Option>
          )
        } else {
          return (
            <Option
              name={name}
              key={index}
              value={field}>
              {field}
            </Option>
          )
        }
      })}
    </SelectOutSide>

  )
}

export default SelectSimple;
