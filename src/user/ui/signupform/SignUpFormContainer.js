import { connect } from 'react-redux'
import SignUpForm from './SignUpForm'
import { signUpUser } from './SignUpFormActions'

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSignUpFormSubmit: (user_type, email, user_first_name, user_second_name, user_zipcode, company_name, company_address) => {
      dispatch(signUpUser(user_type, email, user_first_name, user_second_name, user_zipcode, company_name, company_address))
    }
  }
}

const SignUpFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpForm)

export default SignUpFormContainer
