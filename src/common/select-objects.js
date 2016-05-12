import Icon from 'icon'
import React, { Component } from 'react'
import Select from 'react-select'
import _ from 'messages'
import forEach from 'lodash/forEach'
import groupBy from 'lodash/groupBy'
import filter from 'lodash/filter'
import map from 'lodash/map'
import { parse } from 'xo-remote-parser'

import {
  create as createSelector,
  createCollectionWrapper,
  pools
} from 'selectors'
import {
  autobind,
  connectStore,
  propTypes
} from 'utils'

// ===================================================================

@propTypes({
  multi: propTypes.bool,
  onChange: propTypes.func,
  options: propTypes.array.isRequired,
  placeholder: propTypes.string,
  required: propTypes.bool,
  value: propTypes.any
})
class GenericSelect extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: props.value || (props.multi ? [] : '')
    }
  }

  get value () {
    const { value } = this.state

    if (this.props.multi) {
      return map(value, value => value.value)
    }

    return value.value
  }

  set value (value) {
    this.setState({
      value
    })
  }

  @autobind
  _handleChange (value) {
    const { onChange } = this.props

    this.setState({
      value
    }, onChange && (() => { onChange(this.value) }))
  }
}

const SelectWrapper = ({ container, placeholder }) => {
  const { props } = container

  return (
    <Select
      multi={props.multi}
      onChange={container._handleChange}
      optionRenderer={container._renderOption}
      options={container.options}
      placeholder={props.placeholder || placeholder}
      required={props.required}
      value={container.state.value}
    />
  )
}

const injectUpdateFunction = ({ container, update }) => {
  container.componentWillReceiveProps = (nextProps) => {
    container.options = update(nextProps.options)
  }
  container.options = update(container.props.options)
}

// ===================================================================

@connectStore(() => {
  const getPools = createCollectionWrapper(createSelector(
    (state, props) => props.options,
    pools,
    (hosts, pools) => {
      const results = {}

      forEach(hosts, host => {
        const id = host.$poolId
        results[host.$poolId] = filter(pools, pool => pool.id === host.$poolId)[0]
      })

      return results
    }
  ))

  return (state, props) => {
    return {
      pools: getPools(state, props)
    }
  }
}, { withRef: true })
export class SelectHost extends GenericSelect {
  componentWillMount () {
    const update = options => {
      const { props } = this
      const hostsByPool = groupBy(props.options, '$poolId')
      let newOptions = []

      forEach(props.pools, pool => {
        const poolId = pool.id

        newOptions.push({
          value: poolId,
          label: pool.name_label || poolId,
          disabled: true,
          type: 'pool'
        })

        newOptions = newOptions.concat(
          map(hostsByPool[poolId], host => {
            const hostId = host.id
            return {
              value: hostId,
              label: host.name_label || hostId,
              type: 'host'
            }
          })
        )
      })

      return newOptions
    }

    injectUpdateFunction({ container: this, update })
  }

  @autobind
  _renderOption (option) {
    return (
      <div>
        <Icon icon={option.type} /> {option.label}
      </div>
    )
  }

  render () {
    return (
      SelectWrapper({ container: this, placeholder: _('selectHosts') })
    )
  }
}

// ===================================================================

export class SelectPool extends GenericSelect {
  componentWillMount () {
    const update = options => {
      return map(options, pool => ({
        value: pool.id,
        label: pool.name_label || pool.id
      }))
    }

    injectUpdateFunction({ container: this, update })
  }

  @autobind
  _renderOption (option) {
    return (
      <div>
        <Icon icon='pool' /> {option.label}
      </div>
    )
  }

  render () {
    return (
      SelectWrapper({ container: this, placeholder: _('selectPools') })
    )
  }
}

// ===================================================================

export class SelectRemote extends GenericSelect {
  componentWillMount () {
    const update = options => {
      const remotesByGroup = groupBy(map(options, parse), 'type')
      let newOptions = []

      forEach(remotesByGroup, (remotes, type) => {
        newOptions.push({
          label: type,
          disabled: true
        })

        newOptions = newOptions.concat(
          map(remotes, remote => ({
            value: remote.id,
            label: remote.name
          }))
        )
      })

      return newOptions
    }

    injectUpdateFunction({ container: this, update })
  }

  render () {
    return (
      SelectWrapper({ container: this, placeholder: _('selectRemotes') })
    )
  }
}
