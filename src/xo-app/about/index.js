import _ from 'messages'
import React, {
  Component,
  PropTypes
} from 'react'
import store from '../../store'
import { click } from '../../store/actions'
import {
  connectStore
} from 'utils'

let show2 = true

// const click = () => {
//   show = !show
//   console.log('show', show)
// }

@connectStore([
  'show'
])
export default class extends Component {
  constructor () {
    super()
    this.showResults = true
  }

  toggleShowResults () {
    console.log('CLICK')
    this.showResults = !this.showResults
    this.render()
  }

  render () {
    const {
      show
    } = this.props
    return <div>
      <h1>{_('aboutPage')}</h1>
      <p>This is the about page.</p>
      <button className='btn btn-danger' onClick={() => store.dispatch(click())}>Click me</button>
      <div> { show ? 'TRUE' : 'FALSE' } </div>
      <button onClick={() => this.toggleShowResults()}>Toggle show results</button>
      <div>showResults = {this.showResults}</div>
      <div> { this.showResults ? 'TRUE' : 'FALSE' } </div>
      <div className='card' style={{width:'20%'}}>
        <img className='card-img-top' src='' alt='Card image cap'></img>
        <div className='card-block'>
          <h4 className='card-title'>Card title</h4>
          <p className='card-text'>Some quick example text to build on the card title and make up the bulk of the cards content.</p>
          <a href='#' className="btn btn-primary">Button</a>
        </div>
      </div>
    </div>
  }
}
