import React from 'react'
import { SelectPool } from 'select-objects'

import {
  create as createSelector,
  pools
} from 'selectors'
import { connectStore } from 'utils'

import XoAbstractInput from './xo-abstract-input'
import { PrimitiveInputWrapper } from './helpers'

// ===================================================================

@connectStore(() => {
  const getPools = createSelector(
    pools,
    pools => pools
  )

  return (state, props) => {
    return {
      pools: getPools(state, props)
    }
  }
}, { withRef: true })
export default class PoolInput extends XoAbstractInput {
  render () {
    const { props } = this

    return (
      <PrimitiveInputWrapper {...props}>
        <SelectPool
          multi={props.schema.type === 'array'}
          onChange={props.onChange}
          options={props.pools}
          ref='input'
          required={props.required}
        />
      </PrimitiveInputWrapper>
    )
  }
}
