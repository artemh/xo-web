import _ from 'messages'
import assign from 'lodash/assign'
import Icon from 'icon'
import Link from 'react-router/lib/Link'
import React, { cloneElement, Component } from 'react'
import xo from 'xo'
import pick from 'lodash/pick'
import { Row, Col } from 'grid'
import { Text } from 'editable'

import {
  autobind,
  connectStore,
  routes
} from 'utils'

import {
  create as createSelector,
  createFilter,
  createFinder,
  createGetObject,
  objects,
  messages
} from 'selectors'

import TabAdvanced from './tab-advanced'
import TabConsole from './tab-console'
import TabGeneral from './tab-general'
import TabLogs from './tab-logs'
import TabNetwork from './tab-network'
import TabPatches from './tab-patches'
import TabStats from './tab-stats'
import TabStorage from './tab-storage'

const isRunning = (host) => host && host.power_state === 'Running'

// ===================================================================

const NavLink = ({ children, to }) => (
  <li className='nav-item' role='tab'>
    <Link className='nav-link' activeClassName='active' to={to}>
      {children}
    </Link>
  </li>
)

const NavTabs = ({ children }) => (
  <ul className='nav nav-tabs' role='tablist'>
    {children}
  </ul>
)

// ===================================================================

@routes('general', {
  advanced: TabAdvanced,
  console: TabConsole,
  general: TabGeneral,
  logs: TabLogs,
  network: TabNetwork,
  patches: TabPatches,
  stats: TabStats,
  storage: TabStorage
})
@connectStore(() => {
  const getHost = createGetObject()

  const getPool = createGetObject(
    (...args) => getHost(...args).$pool
  )

  const getVmController = createFinder(
    objects,
    createSelector(
      getHost,
      ({ id }) => (obj) => obj.type === 'VM-controller' && obj.$container === id
    ),
    true
  )

  const getLogs = createFilter(
    messages,
    createSelector(
      getHost,
      getVmController,
      (host, controller) => ({ $object }) => $object === host.id || $object === controller.id
    ),
    true
  )

  return (state, props) => {
    const host = getHost(state, props)
    if (!host) {
      return {}
    }

    return {
      vmController: getVmController(state, props),
      logs: getLogs(state, props),
      host,
      pool: getPool(state, props)
    }
  }
})
export default class Host extends Component {
  @autobind
  loop (host = this.props.host) {
    if (this.cancel) {
      this.cancel()
    }

    if (!isRunning(host)) {
      return
    }

    let cancelled = false
    this.cancel = () => { cancelled = true }

    xo.call('host.stats', { host: host.id }).then((stats) => {
      if (cancelled) {
        return
      }
      this.cancel = null

      clearTimeout(this.timeout)
      this.setState({
        statsOverview: stats
      }, () => {
        this.timeout = setTimeout(this.loop, stats.interval * 1000)
      })
    })
  }

  componentWillMount () {
    this.loop()
  }

  componentWillUnmount () {
    clearTimeout(this.timeout)
  }

  componentWillReceiveProps (props) {
    const hostCur = this.props.host
    const hostNext = props.host

    if (!isRunning(hostCur) && isRunning(hostNext)) {
      this.loop(hostNext)
    } else if (isRunning(hostCur) && !isRunning(hostNext)) {
      this.setState({
        statsOverview: undefined
      })
    }
  }
  render () {
    const { host, pool } = this.props
    if (!host) {
      return <h1>Loading…</h1>
    }
    const childProps = assign(pick(this.props, [
      'addTag',
      'vmController',
      'host',
      'logs'
    ]), pick(this.state, [
      'statsOverview'
    ])
   )

    return <div>
      <Row>
        <Col smallSize={6}>
          <h1>
            <Icon icon={`host-${host.power_state.toLowerCase()}`} />&nbsp;
            <Text
              onChange={(value) => xo.call('host.set', { id: host.id, name_label: value })}
            >{host.name_label}</Text>
            <small className='text-muted'> - {pool.name_label}</small>
          </h1>
          <p className='lead'>
            <Text
              onChange={(value) => xo.call('host.set', { id: host.id, name_description: value })}
            >{host.name_description}</Text>
          </p>
        </Col>
        <Col smallSize={6}>
          <div className='pull-xs-right'>
            {/* <HostActionBar host={host} handlers={this.props}/> */}
          </div>
        </Col>
      </Row>
      <Row>
        <Col size={12}>
          <NavTabs>
            <NavLink to={`/hosts/${host.id}/general`}>{_('generalTabName')}</NavLink>
            <NavLink to={`/hosts/${host.id}/stats`}>{_('statsTabName')}</NavLink>
            <NavLink to={`/hosts/${host.id}/console`}>{_('consoleTabName')}</NavLink>
            <NavLink to={`/hosts/${host.id}/network`}>{_('networkTabName')}</NavLink>
            <NavLink to={`/hosts/${host.id}/storage`}>{_('storageTabName')}</NavLink>
            <NavLink to={`/hosts/${host.id}/patches`}>{_('patchesTabName')}</NavLink> {/* TODO: missing patches in warning label */}
            <NavLink to={`/hosts/${host.id}/logs`}>{_('logsTabName')}</NavLink>
            <NavLink to={`/hosts/${host.id}/advanced`}>{_('advancedTabName')}</NavLink>
          </NavTabs>
        </Col>
      </Row>
      {cloneElement(this.props.children, childProps)}
    </div>
  }
}