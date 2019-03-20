import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import { UserIsAuthenticated, UserIsNotAuthenticated } from './util/wrappers.js'
import getWeb3 from './util/web3/getWeb3'

// Layouts
import App from './App'
import Home from './layouts/home/Home'
import Dashboard from './layouts/dashboard/Dashboard'
import SignUp from './user/layouts/signup/SignUp'
import Profile from './user/layouts/profile/Profile'

import ClientSearch from 'components/client/ClientSearch'
import ClientHome from 'components/client/ClientHome'
import ClientProfile from 'components/client/ClientProfile'

import CompanyDashboard from 'components/admin/CompanyDashboard'
import CompanyProfile from 'components/admin/CompanyProfile'

// Redux Store
import store from './store'
import 'semantic-ui-css/semantic.min.css';


// Initialize react-router-redux.
const history = syncHistoryWithStore(browserHistory, store)

// Initialize web3 and set in Redux.
getWeb3
.then(results => {
  console.log('Web3 initialized!')
})
.catch(() => {
  console.log('Error in web3 initialization.')
})

ReactDOM.render((
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={Home} />
          
          <Route path="client_search" component={UserIsAuthenticated(ClientSearch)} />
          <Route path="client_home" component={UserIsAuthenticated(ClientHome)} />
          <Route path="client_profile" component={UserIsAuthenticated(ClientProfile)} />
          
          <Route path="company_dashboard" component={UserIsAuthenticated(CompanyDashboard)} />
          <Route path="company_profile" component={UserIsAuthenticated(CompanyProfile)} />


          <Route path="dashboard" component={UserIsAuthenticated(Dashboard)} />
          <Route path="signup" component={UserIsNotAuthenticated(SignUp)} />
          <Route path="profile" component={UserIsAuthenticated(Profile)} />

          

        </Route>
      </Router>
    </Provider>
  ),
  document.getElementById('root')
)
