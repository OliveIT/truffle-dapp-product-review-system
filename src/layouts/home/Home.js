import React, { Component } from 'react'

class Home extends Component {
  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>World's First Blockchain Based Review Management System!</h1>
            <p>DApp is ready to use.</p>
            <h2>Smart Contract Authentication</h2>
            <p>This particular Dapp doens't require username / password to login.</p>
            <p>In the upper-right corner, you'll see a login button. Click it to login with with the Authentication smart contract.</p>
            <p>If there is no user information for the given address, you'll be redirected to sign up.</p>

          </div>
        </div>
      </main>
    )
  }
}

export default Home
