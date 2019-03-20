import React from 'react'
import { Button, Header, Modal, List, Rating, Form, Label } from 'semantic-ui-react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as CommonAction from 'components/Action/CommonAction'


const scrollStyle = {
    maxHeight: 300,
    overflowY: 'scroll'
};
class ReviewDisplayModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        if (this.props.info == null)
            return (<div></div>);

        var reviews = [];

        this.props.data.blockchainData.reviewData.map((value, index) => {
            if (value.product_id != this.props.info.product_id) return;
    
            reviews.push(value);
        });

        return (
            <Modal className="reviewdisplaymodal" open={this.props.isOpenDialog} centered={false} onClose={() => {this.props.onCloseDialog()}}>
                <Modal.Header>Product Reviews</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Header>Product Info</Header>
                        <p as='h5'>Product Name: {this.props.info.product_name}</p>
                        <p as='h5'>Company Name: {this.props.info.company.company_name}</p>
                        <p as='h5'>Company Address: {this.props.info.company.company_address}</p>

                        <hr></hr>

                        <Header>Ratings</Header>
                        <Form>
                            <List divided style={scrollStyle}>
                                {reviews.map((item, index) => {
                                    /*if (item.review_status == 0) {
                                        return '';
                                    }*/
                                    return (
                                    <List.Item key={index}>
                                        <Form.Field inline>
                                            <Label>Rating: </Label>
                                            <Rating icon='star' defaultRating={item.rating} maxRating={5} disabled/>
                                        </Form.Field>
                                        <Form.Field inline>
                                            <Label>Review: </Label>
                                            <pre>{item.review}</pre>
                                        </Form.Field>

                                        {item.review_status == 2 ?
                                        <Form.Field inline>
                                            <Label>Reply: </Label>
                                            <pre>{item.reply}</pre>
                                        </Form.Field> : ''}

                                        <Form.Field inline>
                                            <Label>Spammy: </Label>
                                            <label>{item.is_spam == 1 ? "YES" : "NO"}</label>
                                        </Form.Field>

                                        <Form.Field inline>
                                            <Label>Hash: </Label>
                                            <pre>{item.merkle_tree_root_hash}</pre>
                                        </Form.Field>
                                    </List.Item>
                                );
                                })}
                            </List>
                        </Form>

                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button negative content='Close' onClick={() => {this.props.onCloseDialog()}}/>
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
})

export default connect(mapStatetoProps, mapDispatchToProps)(ReviewDisplayModal)
