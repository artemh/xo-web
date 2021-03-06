import _ from 'messages'
import { Button } from 'react-bootstrap-4/lib'
import Link from 'react-router/lib/Link'
import map from 'lodash/map'
import React, { Component } from 'react'
import Tooltip from 'tooltip'

import Icon from 'icon'

import {
  connectStore
} from 'utils'

@connectStore([
  'user'
],
  { withRef: true }
)
export default class Menu extends Component {
  componentWillMount () {
    this.setState({collapsed: false})
  }
  get height () {
    return this.refs.content.offsetHeight
  }
  render () {
    const {
      user
    } = this.props
    const items = [
      { to: '/home', icon: 'home', label: 'homePage' },
      { to: '/dashboard/overview', icon: 'dashboard', label: 'dashboardPage', subMenu: [
        { to: '/dashboard/overview', icon: 'dashboard-overview', label: 'overviewDashboardPage' },
        { to: '/dashboard/visualization', icon: 'dashboard-visualization', label: 'overviewVisualizationDashboardPage' },
        { to: '/dashboard/stats', icon: 'dashboard-stats', label: 'overviewStatsDashboardPage' },
        { to: '/dashboard/health', icon: 'dashboard-health', label: 'overviewHealthDashboardPage' }
      ]},
      { to: '/self/dashboard', icon: 'self-service', label: 'selfServicePage', subMenu: [
        { to: '/self/dashboard', icon: 'self-service-dashboard', label: 'selfServiceDashboardPage' },
        { to: '/self/admin', icon: 'self-service-admin', label: 'selfServiceAdminPage' }
      ]},
      { to: '/backup/overview', icon: 'backup', label: 'backupPage', subMenu: [
        { to: '/backup/overview', icon: 'backup-overview', label: 'backupOverviewPage' },
        { to: '/backup/new', icon: 'backup-new', label: 'backupNewPage' },
        { to: '/backup/restore', icon: 'backup-restore', label: 'backupRestorePage' }
      ]},
      { to: '/update', icon: 'update', label: 'updatePage' },
      { to: '/settings/servers', icon: 'settings', label: 'settingsPage', subMenu: [
        { to: '/settings/servers', icon: 'settings-servers', label: 'settingsServersPage' },
        { to: '/settings/users', icon: 'settings-users', label: 'settingsUsersPage' },
        { to: '/settings/groups', icon: 'settings-groups', label: 'settingsGroupsPage' },
        { to: '/settings/acls', icon: 'settings-acls', label: 'settingsAclsPage' },
        { to: '/settings/remotes', icon: 'backup-remotes', label: 'backupRemotesPage' },
        { to: '/settings/plugins', icon: 'settings-plugins', label: 'settingsPluginsPage' }
      ]},
      { to: '/about', icon: 'about', label: 'aboutPage' },
      { to: '/new/vm', icon: 'new', label: 'newMenu', subMenu: [
        { to: '/new/vm', icon: 'new-vm', label: 'newVmPage' },
        { to: '/new/sr', icon: 'new-sr', label: 'newSrPage' },
        { to: '/settings/servers', icon: 'settings-servers', label: 'newServerPage' },
        { to: '/import', icon: 'new-import', label: 'newImport' }
      ]}
    ]
    return <div className='xo-menu'>
      <ul className='nav nav-sidebar nav-pills nav-stacked' ref='content'>
        <li>
          <span>
            {this.state.collapsed
              ? <a style={{padding: '0.6em', fontSize: '1.5em'}} href='#'>XO</a>
              : <a style={{padding: '0.6em', fontSize: '1.4em'}} href='#'>Xen Orchestra</a>
            }
          </span>
        </li>
        <li>
          <Button onClick={() => this.setState({collapsed: !this.state.collapsed})}>
            <Icon icon='menu-collapse' size='lg' fixedWidth />
          </Button>
        </li>
        {map(items, (item, index) =>
          <MenuLinkItem key={index} item={item} collapsed={this.state.collapsed} />
        )}
        <li>&nbsp;</li>
        <li>&nbsp;</li>
        <li className='nav-item'>
          <Button className='nav-link' style={{width: '100%'}}>
            <Icon icon='sign-out' size='lg' fixedWidth />
            {!this.state.collapsed && <span>&nbsp;&nbsp;&nbsp;</span>}
            {!this.state.collapsed && _('signOut')}
          </Button>
        </li>
        <li className='nav-item'>
          <Link className='nav-link' style={{display: 'flex'}} to={'/user'}>
            <div style={{margin: 'auto'}}>
              <Tooltip content={user ? user.email : ''}>
                <Icon icon='user' size='lg' />
              </Tooltip>
            </div>
          </Link>
        </li>
      </ul>
    </div>
  }
}

const MenuLinkItem = props => {
  const { item, collapsed } = props
  const { to, icon, label, subMenu } = item

  return <li className='nav-item xo-menu-item'>
    <Link activeClassName='active' className='nav-link' to={to}>
      <Icon icon={`menu-${icon}`} size='lg' fixedWidth />
      {!collapsed && <span>&nbsp;&nbsp;&nbsp;</span>}
      {!collapsed && _(label)}
    </Link>
    {subMenu && <SubMenu items={subMenu} />}
  </li>
}

const SubMenu = props => {
  return <ul className='nav nav-pills nav-stacked xo-sub-menu'>
    {map(props.items, (item, index) => (
      <li key={index} className='nav-item xo-menu-item'>
        <Link activeClassName='active' className='nav-link' to={item.to}>
          <Icon icon={`menu-${item.icon}`} size='lg' fixedWidth />&nbsp;&nbsp;&nbsp;
          {_(item.label)}
        </Link>
      </li>
    ))}
  </ul>
}
