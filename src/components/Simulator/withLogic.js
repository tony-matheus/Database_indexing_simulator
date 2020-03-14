import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import { useSelector, connect } from 'react-redux'
import { generateTuples } from '../../redux/actions/table'
import Disk from '../../struct/Disk'
import Hash from '../../struct/Hash'
import Bucket from '../../struct/Bucket'
const withConnect = Component => {
  const actions = {
    generateTuples
  }

  return connect(
    null,
    actions
  )(Component)
}

export default Component => withConnect(props => {
  const [disk, setDisk] = useState({})
  const [buckets, setBuckets] = useState([])
  const tuples = useSelector(state => state.table.tuples)
  const [ bucketNumber, setBucketNumber] = useState([])
  const hash = React.useMemo( () => new Hash(), [tuples])

  useEffect(() => {
    props.generateTuples()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    console.log(tuples)
    setDisk(new Disk({...tuples}))
    console.log(tuples)
    generateBucketNumber()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tuples])

  useEffect(() => {
    generateBuckets()
  },[bucketNumber])

  const generateBucketNumber = () => {
    const bucketsNum = tuples.map((tuple, index) => {
      return hash.function(tuple.key)
    })
    setBucketNumber(_.uniq(bucketsNum).sort())
  }

  const generateBuckets = () => {
    console.log(bucketNumber)
    const b = bucketNumber.map((id) => new Bucket({id}))
    console.log(b)
  }

  return (
    <Component
      table={tuples}
      disk={disk}
    />
  )
})
