import { routes } from 'utils'

import Overview from './overview'
import Health from './health'

const Dashboard = routes('health', {
  health: Health,
  overview: Overview
})(
  ({ children }) => children
)

export default Dashboard
