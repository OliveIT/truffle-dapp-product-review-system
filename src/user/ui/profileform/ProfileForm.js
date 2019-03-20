import React, { Component } from 'react'

class ProfileForm extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <form className="pure-form pure-form-stacked">
        <fieldset>
          <label>Email: <b>{this.props.email}</b></label>
          {this.props.user_type === 0 && <label>Name: <b>{this.props.user_first_name} {this.props.user_second_name} </b></label>}
          {this.props.user_type === 0 && <label>Zip Code: <b>{this.props.user_zipcode}</b></label>}
          {this.props.user_type === 0 && <label>Token Balance: <b>{this.props.balance} RMST</b></label>}
          {this.props.user_type === 1 && <label>Company Name: <b>{this.props.company_name}</b></label>}
          {this.props.user_type === 1 && <label>Company Address: <b>{this.props.company_address}</b></label>}
        </fieldset>
      </form>
    )
  }
}

export default ProfileForm
