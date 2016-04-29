import GenericInput from 'json-schema-input'
import Icon from 'icon'
import React, { Component } from 'react'
import _ from 'messages'
import map from 'lodash/map'
import { Toggle } from 'form'
import { autobind } from 'utils'
import { subscribe } from 'xo'

class Plugin extends Component {
  constructor (props) {
    super(props)
    this.state = {
      expanded: false
    }
  }

  @autobind
  updateExpanded () {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  render () {
    const {
      props,
      state: {
        expanded
      }
    } = this

    return (
      <div className='card-block'>
        <h4 className='form-inline clearfix'>
          <Toggle />
          <span className='text-primary'>
            {`${props.name} `}
          </span>
          <span>
            {`(v${props.version}) `}
          </span>
          <div className='checkbox small'>
            <label className='text-muted'>
              {_('autoloadPlugin')} <input type='checkbox' />
            </label>
          </div>
          <div className='form-group pull-right small'>
            <button type='button' className='btn btn-primary' onClick={this.updateExpanded}>
              <Icon icon={expanded ? 'minus' : 'plus'} />
            </button>
          </div>
        </h4>
        {expanded &&
          <GenericInput
            label='Configuration'
            schema={props.configurationSchema}
            required
          />
        }
      </div>
    )
  }
}

export default class Plugins extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentWillMount () {
    this.componentWillUnmount = subscribe('plugins', (plugins) => {
      this.setState({ plugins })
    })
  }

  render () {
    return (
      <div>
        <h2>
          <Icon icon='menu-settings-plugins' />
          <span>Plugins</span>
        </h2>
        <ul style={{'paddingLeft': 0}} >
          {map(this.state.plugins, (plugin) =>
            <li className='list-group-item clearfix'>
              <Plugin {...plugin} />
            </li>
          )}
        </ul>
      </div>
    )
  }
}
