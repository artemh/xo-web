import React, { Component } from 'react'
import GenericInput from 'json-schema-input'
import map from 'lodash/map'

import { Toggle } from 'form'
import { subscribe } from 'xo'


/*

          .checkbox.small
            label
              | Auto-load at server start&nbsp;
              input(type = 'checkbox', ng-model = 'plugin._autoload', ng-change = 'ctrl.toggleAutoload(plugin)', ng-disabled = 'ctrl.disabled[plugin.id]')
          .form-group.pull-right.small
              button.btn.btn-default(type = 'button', ng-click = 'isExpanded = !isExpanded'): i.fa(ng-class = '{"fa-plus": !isExpanded, "fa-minus": isExpanded}')
        hr

*/


class Plugin extends Component {
  render () {
    const { props } = this

    return (
      <div className='card card-block'>
        <h3 className='form-inline clearfix'>
          <Toggle />
          <span className='text-info'>
            {props.name}
          </span>
          <span>
            (v{props.version})
          </span>
          <div className='checkbox small'>
            <label>
              Auto-load at server start
              <input type='checkbox' />
            </label>
          </div>
        </h3>
        <GenericInput
          label={`Configuration`}
          schema={props.configurationSchema}
          required
        />
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
        {map(this.state.plugins, (plugin) => <Plugin {...plugin} />)}
      </div>
    )
  }
}
