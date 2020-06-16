import React, { useState } from 'react'
import { connect } from 'react-redux'

const withConnect = Component => {
  const actions = {
  }
  return connect(
    null,
    actions
  )(Component)
}

const initialState = {
  BUCKET_SIZE: 10,
  HASH_NUMBER: 479,
  NUMBER_MAX_PAGES: 200,
  PAGE_SIZE: 50
}

export default Component => withConnect(props => {
  const [state, setState] = useState(props.settings)

  const handleSelectAlg = (value, option) => {
    // setState({
    //   ...state,
    //   [option.props.name]: value
    // })
    props.setSettings({
      ...props.settings,
      [option.props.name]: value
    })
  }

  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value

    // setState({
    //   ...state,
    //   [name]: value
    // })
    props.setSettings({
      ...state,
      [name]: value
    })
  }

  const handleClose = () => {
    handleClear()
    props.closeDrawer()
  }

  const handleClear = () => {
    setState(initialState)
  }

  const handleStartSimulation = () => {
    props.startSimulation()
    handleClose()
  }

  return (
    <Component
      state={props.settings}
      setState={setState}
      onSelectAlg={handleSelectAlg}
      onChange={handleChange}
      onClose={handleClose}
      onClear={handleClear}
      onStartSimulation={handleStartSimulation}
    />
  )
})
