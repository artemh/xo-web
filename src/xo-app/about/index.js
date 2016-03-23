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

@connectStore([
  'show'
])
export default class extends Component {
  constructor () {
    super()
    this.state = {myVar: 0, showPanel: true}
    this.mavariable = 3
  }

  myFunction () {
    console.log('CLICK')
    this.mavariable++
    this.setState((state, props) => ({myVar: state.myVar + 1}))
  }

  toggle() {
    this.setState({...this.state, showPanel: !this.state.showPanel})
  }

  render () {
    console.log('RENDERING with state = ', this.state)
    const {
      show
    } = this.props
    // const {
    //   myVar
    // } = this.state
    return <div>
      <h1>{_('aboutPage')}</h1>

      <p>This is the about page.</p>
      <button className='btn btn-danger' onClick={() => store.dispatch(click())}>Click me</button>
      <div> {show ? 'TRUE' : 'FALSE'} </div>

      <button onClick={() => this.myFunction()}>CLICK ME</button>
      <div>myVar = {this.state.myVar}</div>
      <div>Ma variable = {this.mavariable}</div>

      <button onClick={() => this.toggle()}>TOGGLE</button>
      <div> {
        <MyCard toto='!' position={this.state.showPanel ? 'left' : 'right'}>
          <span>Hello</span>
        </ MyCard>
      } </div>


    </div>
  }
}

const MyCard = (props) => (
  <div className={`card pull-${props.position}`} style={{width: '20%'}}>
    <img className='card-img-top' src='http://img.linuxfr.org/img/68747470733a2f2f78656e2d6f72636865737472612e636f6d2f6173736574732f6c6f676f5f6269672e706e67/logo_big.png' alt='Card image cap'></img>
    <div className='card-block'>
      <h4 className='card-title'>Card title {props.toto}</h4>
      <p className='card-text'>Some quick example text to build on the card title and make up the bulk of the cards content.</p>
      <a className='btn btn-primary'>Button {props.children}</a>
    </div>
  </div>
)
MyCard.propTypes = {
  children: PropTypes.node.isRequired
}
