import React, { Component } from 'react'
import { Header, Segment } from 'semantic-ui-react'

import { connect } from 'react-redux'

class CompanyProfile extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <main className="container">
        <div className="row">
          <div className="col-md-12">
            <Header as='h3' textAlign='center'>
              Company Name: {this.props.company.company_name}
            </Header>
            <Header as='h3' textAlign='center'>
              Email: {this.props.company.email}
            </Header>
            <Header as='h3' textAlign='center'>
              Address: {this.props.company.company_address}
            </Header>
          </div>
        </div>
      </main>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    company: state.user.data
  }
}

export default connect(mapStateToProps)(CompanyProfile)
