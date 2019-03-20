import React, { Component } from 'react'
import { Input, Header } from 'semantic-ui-react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as CommonAction from 'components/Action/CommonAction'

class ClientSearch extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props

    this.state = {};

    this.state.searchKey = "";
  }

  onClickSearch() {
      this.props.action.searchAction(this.state.searchKey);
      this.props.router.push("/client_home");
  }

  render() {
    return(
      <main className="container">
        <div className="row">
          <div className="col-md-12" style={{textAlign: "center"}}>
            <Header size="medium">
                Please input search key...
            </Header>
            <Input size='massive' icon={{ name: 'search', circular: true, link: true, onClick:() => this.onClickSearch() }} placeholder='Search...'
                onChange={(event, value) => { this.state.searchKey = value.value }} autoFocus/>
          </div>
        </div>
      </main>
    )
  }
}

const mapStatetoProps = state => ({
    data: state.common
})

const mapDispatchToProps = dispatch => ({
    action: bindActionCreators(CommonAction, dispatch),
    // onaddProduct: (product_obj) => {
    //   dispatch(CommonAction.addProduct(product_obj))
    // }
})

export default connect(mapStatetoProps, mapDispatchToProps)(ClientSearch)