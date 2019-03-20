import React, { Component } from 'react'

class SignUpForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user_type: 0,
      email: "",
      user_first_name: "",
      user_second_name: "",
      user_zipcode: "",
      company_name: "",
      company_address: ""
    }
  }

  onInputChange(event) {
    let newState={};
    newState[event.target.id] = event.target.value;
    this.setState(newState)
  }

  onRoleChange(event) {
    console.log(event.target.value);
    this.setState({
      user_type: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault()

    // if (this.state.name.length < 2)
    // {
    //   return alert('Please fill in your name.')
    // }

    this.props.onSignUpFormSubmit(
      this.state.user_type,
      this.state.email,
      this.state.user_first_name,
      this.state.user_second_name,
      this.state.user_zipcode,
      this.state.company_name,
      this.state.company_address,
    )
  }

  render() {
    return(
      <form className="pure-form pure-form-stacked" onSubmit={this.handleSubmit.bind(this)}>
        <fieldset>
          <input id="email" type="email" value={this.state.email} onChange={this.onInputChange.bind(this)} placeholder="Email" required/>
          {this.state.user_type == 0 && <input id="user_first_name" type="text" value={this.state.user_first_name} onChange={this.onInputChange.bind(this)} placeholder="First Name" required/>}
          {this.state.user_type == 0 && <input id="user_second_name" type="text" value={this.state.user_second_name} onChange={this.onInputChange.bind(this)} placeholder="Second Name" required/>}
          {this.state.user_type == 0 && <input id="user_zipcode" type="text" value={this.state.user_zipcode} onChange={this.onInputChange.bind(this)} placeholder="Zipcode" required/>}
          {this.state.user_type == 1 && <input id="company_name" type="text" value={this.state.company_name} onChange={this.onInputChange.bind(this)} placeholder="Company Name" required/>}
          {this.state.user_type == 1 && <input id="company_address" type="text" value={this.state.company_address} onChange={this.onInputChange.bind(this)} placeholder="Company Address" required/>}
          <br/>
          <label htmlFor="role">Your Role:</label>
          <label>
            <input type="radio" value="0" checked={this.state.user_type == 0} onChange={this.onRoleChange.bind(this)} />
            User
          </label>
           <label>
            <input type="radio" value="1" checked={this.state.user_type == 1} onChange={this.onRoleChange.bind(this)} />
            Company
          </label>

          <button type="submit" className="pure-button pure-button-primary">Sign Up</button>
        </fieldset>
      </form>
    )
  }
}

export default SignUpForm
