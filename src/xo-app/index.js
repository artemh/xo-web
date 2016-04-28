import React, {
  Component
} from 'react'
// import {
//   keyHandler
// } from 'react-key-handler'
import {
  connectStore,
  propTypes,
  routes
} from 'utils'

import About from './about'
import Home from './home'
import Host from './host'
import SignIn from './sign-in'
import Vm from './vm'

import Dashboard from './dashboard'
import Menu from './menu'
import Navbar from './navbar'
import Settings from './settings'
import XoaUpdates from './xoa-updates'

@routes('home', {
  about: About,
  dashboard: Dashboard,
  home: Home,
  'hosts/:id': Host,
  settings: Settings,
  'vms/:id': Vm,
  'xoa-update': XoaUpdates
})
@connectStore([
  'user'
])
@propTypes({
  children: propTypes.node.isRequired
})
export default class XoApp extends Component {
  render () {
    const {
      children,
      user,
      signIn,
      selectLang
    } = this.props

    return <div className='xo-main'>
      <Navbar selectLang={(lang) => selectLang(lang)} />
      <div className='xo-navbar-substitute'>&nbsp;</div>
      <div className='xo-body'>
        <Menu />
        <div className='xo-content'>
          {
            user == null
              ? <SignIn onSubmit={signIn} />
              : children
          }
        </div>
      </div>
    </div>
  }
}
