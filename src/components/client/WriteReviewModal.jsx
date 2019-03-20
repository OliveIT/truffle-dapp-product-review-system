import React from 'react'
import { Button, Header, Modal, List, Rating, Form, Label } from 'semantic-ui-react'
import ReCAPTCHA from "react-google-recaptcha";

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as CommonAction from 'components/Action/CommonAction'

class WriteReviewModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.state.rateInfo = {
            rating: 1,
            review: "",
            recaptcha: "",
        };
    }

    onPostReview() {
        var reviewObj = {
            review_id: this.props.data.blockchainData.reviewData.length + 1,
            user_id: this.props.user.id,
            product_id: this.props.info.product_id,
            company_id: this.props.info.company.id,
            rating: this.state.rateInfo.rating,
            review: this.state.rateInfo.review,
            is_spam: this.state.rateInfo.recaptcha == "" ? 1 : 0,
            review_status: 0,
            reply: ""
        }
        this.props.onAddReview(reviewObj);
        this.props.onCloseDialog();
    }

    render() {
        if (this.props.info == null)
            return (<div></div>);

        return (
            <Modal className="writereviewmodal" open={this.props.isOpenDialog} centered={false} onClose={() => {this.props.onCloseDialog()}}>
                <Modal.Header>Write Review</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Header>Product Info</Header>
                        <p as='h5'>Product Name: {this.props.info.product_name}</p>
                        <p as='h5'>Company Name: {this.props.info.company.company_name}</p>
                        <p as='h5'>Company Address: {this.props.info.company.company_address}</p>

                        <hr></hr>

                        <Form>
                            <Form.Field inline>
                                <label>Your Rating: </label>
                                <Rating icon='star' defaultRating={1} maxRating={5} onRate={(e, data) => {this.state.rateInfo.rating = data.rating;}}/>
                            </Form.Field>
                            <Form.TextArea label='Your Review' placeholder='Tell us more about you...'
                                onChange={(e, data) => {this.state.rateInfo.review = data.value}}/>
                            <ReCAPTCHA async
                                sitekey="6LeSql0UAAAAAIpM4Z9GBPUtV_AOQcK9Vvrz838O"
                                onChange={(value) => {this.state.rateInfo.recaptcha = value}}/>
                        </Form>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button negative content='Close' onClick={() => {this.props.onCloseDialog()}}/>
                    <Button positive icon='checkmark' labelPosition='right' content='Post Review' onClick={() => this.onPostReview()}/>
                </Modal.Actions>
            </Modal>
        );
    }
}

const mapStatetoProps = state => ({
  data: state.common,
  user: state.user.data
})

const mapDispatchToProps = dispatch => ({
  action: bindActionCreators(CommonAction, dispatch),
  onAddReview: (review_obj) => {
    dispatch(CommonAction.addReview(review_obj))
  }
})

export default connect(mapStatetoProps, mapDispatchToProps)(WriteReviewModal)
