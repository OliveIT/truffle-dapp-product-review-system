import React, { Component } from 'react'
import { Header, Segment } from 'semantic-ui-react'

import { connect } from 'react-redux'
class ClientProfile extends Component {
  constructor(props) {
    super(props)
    console.log(this.props.user);
  }

  render() {
    return(
      <main className="container">
        <div className="row">
          <div className="col-md-12">
            <Header as='h3' textAlign='center'>
              Full Name: {this.props.user.user_first_name} {this.props.user.user_second_name}
            </Header>
            <Header as='h3' textAlign='center'>
              Email: {this.props.user.email}
            </Header>
            <Header as='h3' textAlign='center'>
              ZipCode: {this.props.user.user_zipcode}
            </Header>
            <Header as='h3' textAlign='center'>
            Token Balance: {this.props.balance} RMST
            </Header>
          </div>
        </div>
      </main>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user.data,
    balance: state.common.blockchainData.balance
  }
}

export default connect(mapStateToProps)(ClientProfile)