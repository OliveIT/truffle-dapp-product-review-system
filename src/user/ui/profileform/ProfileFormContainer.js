import { connect } from 'react-redux'
import ProfileForm from './ProfileForm'
import { updateUser } from './ProfileFormActions'

const mapStateToProps = (state, ownProps) => {
  return {
    user_type: state.user.data.user_type,
    email: state.user.data.email,
    user_first_name: state.user.data.user_first_name,
    user_second_name: state.user.data.user_second_name,
    user_zipcode: state.user.data.user_zipcode,
    company_name: state.user.data.company_name,
    company_address: state.user.data.company_address,

    balance: state.common.blockchainData.balance
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onProfileFormSubmit: (name) => {
      event.preventDefault();

      dispatch(updateUser(name))
    }
  }
}

const ProfileFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileForm)

export default ProfileFormContainer
