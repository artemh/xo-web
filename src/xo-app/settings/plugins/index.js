import _ from 'messages'
import React, { Component } from 'react'
import GenericInput from 'json-schema-input'
import map from 'lodash/map'
import Icon from 'icon'
import { Toggle } from 'form'
import { subscribe } from 'xo'

class Plugin extends Component {
  render () {
    const { props } = this

    return (
      <div className='card-block'>
        <h4 className='form-inline clearfix'>
          <Toggle />
          <span className='text-info'>
            {`${props.name} `}
          </span>
          <span>
            {`(v${props.version}) `}
          </span>
          <div className='checkbox small'>
            <label>
              {_('autoloadPlugin')} <input type='checkbox' />
            </label>
          </div>
          <div className='form-group pull-right small'>
            <button type='button' className='btn btn-primary'>
              <Icon icon='plus' />
            </button>
          </div>
        </h4>
        <GenericInput
          label='Configuration'
          schema={props.configurationSchema}
          required
           />
        <hr />
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
        <div className='card card-block'>
          {map(this.state.plugins, (plugin) => <Plugin {...plugin} />)}
        </div>
      </div>
    )
  }
}
