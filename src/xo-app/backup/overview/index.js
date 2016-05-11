import React, { Component } from 'react'
import { subscribe } from 'xo'
import Icon from 'icon'

export default class Overview extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentWillMount () {
    const unsubscribeJobs = subscribe('jobs', jobs => {
      this.setState({ jobs })
    })

    const unsubscribeSchedules = subscribe('schedules', schedules => {
      this.setState({ schedules })
    })

    this.componentWillUnmount = () => {
      unsubscribeJobs()
      unsubscribeSchedules()
    }
  }

  render () {
    console.log(this.state.schedules)

    return (
      <div className='card'>
        <h5 className='card-header text-xs-center'>
          <Icon icon='schedule' /> Schedules
        </h5>
        <div className='card-block'>

        </div>
      </div>
    )
  }
}
