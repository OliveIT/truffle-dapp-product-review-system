import React, { Component } from 'react'
import { Link } from 'react-router'
import { HiddenOnlyAuth, VisibleOnlyAuthForUser, VisibleOnlyAuthForCompany } from './util/wrappers.js'

// UI Components
import LoginButtonContainer from './user/ui/loginbutton/LoginButtonContainer'
import LogoutButtonContainer from './user/ui/logoutbutton/LogoutButtonContainer'

// Styles
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  render() {
    const OnlyAuthLinksForUser = VisibleOnlyAuthForUser(() =>
      <span>
        <li className="pure-menu-item">
          <Link to="/client_search" className="pure-menu-link">Search</Link>
        </li>
        
        <li className="pure-menu-item">
            <Link to="/client_home" className="pure-menu-link">Home</Link>
        </li>
        
        <li className="pure-menu-item">
            <Link to="/client_profile" className="pure-menu-link">Profile</Link>
        </li>

        <LogoutButtonContainer />
      </span>
    )

    /*<li className="pure-menu-item">
          <Link to="/dashboard" className="pure-menu-link">Dashboard</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/profile" className="pure-menu-link">Profile</Link>
        </li>

        */
    const OnlyAuthLinksForCompany = VisibleOnlyAuthForCompany(() =>
      <span>        
        <li className="pure-menu-item">
            <Link to="/company_dashboard" className="pure-menu-link">Dashboard</Link>
        </li>
        
        <li className="pure-menu-item">
            <Link to="/company_profile" className="pure-menu-link">Profile</Link>
        </li>
        
        <LogoutButtonContainer />
      </span>
    )

    const OnlyGuestLinks = HiddenOnlyAuth(() =>
      <span>
        
        <li className="pure-menu-item">
          <Link to="/signup" className="pure-menu-link">Sign Up</Link>
        </li>
        <LoginButtonContainer />
      </span>
    )

    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <ul className="pure-menu-list navbar-right">
          
            <OnlyGuestLinks />
            <OnlyAuthLinksForUser />
            <OnlyAuthLinksForCompany />
          </ul>
          <Link to="/" className="pure-menu-heading pure-menu-link">Review Management System</Link>

          
        </nav>
        <div style={{paddingTop: 30}}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default App
