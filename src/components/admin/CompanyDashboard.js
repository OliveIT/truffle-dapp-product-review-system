import React, { Component } from 'react'
import { Header, Segment, Grid, List, Input, Form, Label, Rating, Button } from 'semantic-ui-react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as CommonAction from 'components/Action/CommonAction'


const leftListStyle = {
  maxHeight: 577,
  minHeight: 577,
  overflowY: 'scroll',
  marginTop: 20
};
const rightStyle = {
  maxHeight: 700,
  minHeight: 700,
  overflowY: 'scroll',
  marginTop: 20
};

const activeStyle = {
  background: "#ddd",
  color: "#fff"
}

class CompanyDashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {};

    console.log(this.props);

    this.state.curAddProductName = "";    //Name in product edit box

    this.state.curSelectedProduct = {};
    this.state.reviews = [];
  }

  showReviewItemEditable(index, item) {
    console.log(item);
    return (
      <List.Item key={JSON.stringify(item)}>
        <Form>
          <Form.Field inline>
            <label>Rating: </label>
            <Rating icon='star' defaultRating={item.rating} maxRating={5}  disabled/>
          </Form.Field>
          
          <Form.Field inline>
            <label>Review: </label>
            <pre>{item.review}</pre>
          </Form.Field>
                    
          <Form.Field inline>
            <label>Spammy: </label>
            <label>{item.is_spam == 1 ? "YES" : "NO"}</label>
          </Form.Field>
          
          <Form.Field inline>
            <label>Hash: </label>
            <label>{item.merkle_tree_root_hash}</label>
          </Form.Field>

          <Form.Group inline>
            <label>Status</label>
            <Form.Radio
              label='Positive'
              value='1'
              checked={item.review_sel_status === 1}
              onChange={() => {this.onClickReviewStatus(index, item, 1)}}
            />
            <Form.Radio
              label='Negative'
              value='2'
              checked={item.review_sel_status === 2}
              onChange={() => {this.onClickReviewStatus(index, item, 2)}}
            />
          </Form.Group>

          {item.review_sel_status == 2 ?
          <Form.TextArea label='Reply: ' placeholder='Write your reply...' 
                          onChange={(event, value) => { this.onChangeReviewReply(index, value.value)}}/> : ''}
          
          <Grid>
            <Grid.Column width={16} textAlign='right' verticalAlign='middle'>
              <Button primary onClick={() => {this.onClickPostBtn(index, item)}} 
                  disabled={item.review_sel_status ? false : true}>Post</Button>
            </Grid.Column>
          </Grid>
        </Form>
      </List.Item>
    )
  }

  showReviewItem(item) {
    return (
      <List.Item key={JSON.stringify(item)}>
        <Form>
          <Form.Field inline>
            <label>Rating: </label>
            <Rating icon='star' defaultRating={item.rating} maxRating={5}  disabled/>
          </Form.Field>
          
          <Form.Field inline>
            <label>Review: </label>
            <pre>{item.review}</pre>
          </Form.Field>
                    
          <Form.Field inline>
            <label>Spammy: </label>
            <label>{item.is_spam == 1 ? "YES" : "NO"}</label>
          </Form.Field>
                    
          <Form.Field inline>
            <label>Hash: </label>
            <label>{item.merkle_tree_root_hash}</label>
          </Form.Field>
                    
          <Form.Field inline>
            <label>Status: </label>
            {item.review_status == 1 ? 
              <Label color='teal' horizontal>Positive</Label> : 
              <Label color='red' horizontal>Negative</Label>}
            
          </Form.Field>
          
          {item.review_status == 2 ? 
          <Form.Field inline>
            <label>Reply: </label>
            <pre>{item.reply}</pre>
          </Form.Field> : ''}
        </Form>
      </List.Item>
    )
  }

  onClickAddProduct() {
    if (!this.state.curAddProductName) return;

    /*
      product_id: product_id.toNumber(),
      company_id: company_id.toNumber(),
      product_name: product_name
      */

    var newProductId = this.props.data.blockchainData.productData.length + 1;
    this.props.onaddProduct({
      product_id: newProductId,
      company_id: this.props.company.id,
      product_name: this.state.curAddProductName
    });
    

    console.log(this.props.data.blockchainData);
//    alert(this.state.curAddProductName);
    this.setState({curAddProductName: ""})
  }

  onSelectProduct(selectedProduct) {
    /*
    let obj = {
      review_id: review_id.toNumber(),
      user_id: user_id.toNumber(),
      product_id: product_id.toNumber(),
      company_id: company_id.toNumber(),
      rating: rating.toNumber(),
      review: review,
      is_spam: is_spam,// ? "YES" : "NO",
      review_status: review_status.toNumber(),
      reply: reply
    }
    */
    var curReviewData = [];
    
    var company_id = this.props.company.id;

    this.props.data.blockchainData.reviewData.map((value, index) => {
      if (value.company_id != company_id || value.product_id != selectedProduct.product_id) return;

      curReviewData.push(value);
    });

    //Fake review data
    /*curReviewData.push({
      review_id: 1,
      user_id: 1,
      product_id: selectedProduct.product_id,
      company_id: company_id,
      rating: 4,
      review: "This is review",
      is_spam: 1,
      review_status: 0,
      reply: "",
      merkle_tree_root_hash: "sadfsdf",
    });

    curReviewData.push({
      review_id: 2,
      user_id: 2,
      product_id: selectedProduct.product_id,
      company_id: company_id,
      rating: 4,
      review: "This is review",
      is_spam: 1,
      review_status: 2,
      reply: "This is reply",
      merkle_tree_root_hash: "sadfsdf",
    });
    
    curReviewData.push({
      review_id: 3,
      user_id:3,
      product_id: selectedProduct.product_id,
      company_id: company_id,
      rating: 5,
      review: "This is review",
      is_spam: 0,
      review_status: 1,
      reply: "This is reply",
      merkle_tree_root_hash: "sadfsdf",
    });*/

    this.setState({reviews: curReviewData});
    this.setState({curSelectedProduct: selectedProduct});
  }

  onClickReviewStatus(index, item, status) {
    this.state.reviews [index].review_sel_status = status;
    this.setState({reviews: this.state.reviews});
  }

  onChangeReviewReply(index, value) {
    this.state.reviews [index].reply = value;
  }

  onClickPostBtn(index, item) {
//    this.state.reviews [index].review_status = this.state.reviews [index].review_sel_status;
//    this.setState({reviews: this.state.reviews});
    
    var reviewStatus = this.state.reviews [index].review_sel_status;
    
    if (reviewStatus == 2 && this.state.reviews [index].reply == "") {
      alert("Input reply");
      return;
    }

    if(reviewStatus == 2)
      this.props.onReplyReview(item);
    if(reviewStatus == 1)
      this.props.onApproveReview(item);
  }

  render() {
    if (this.props.data.blockchainData.productData == undefined)
      return (<div></div>);
      
    return(
      <main className="container">
        <Grid>
            <Grid.Column width={6}>
              <Segment style={leftListStyle}>
                <List divided relaxed ordered size="big">
                  {this.props.data.blockchainData.productData.map((value, index) => {
                    if (value.company_id != this.props.company.id) return '';

                    return (<List.Item as='a' key={index} style={value == this.state.curSelectedProduct ? activeStyle : {}}>
                      <List.Content>
                        <List.Header onClick={() => {this.onSelectProduct(value)}}>{value.product_name}</List.Header>
                      </List.Content>
                    </List.Item>);
                  })}
                </List>
              </Segment>
              <Segment>
                <Form>
                    <Form.Field inline>
                        <Label>New Product Name: </Label>
                        <Input fluid focus placeholder='Product Name...'
                             icon={{ name: 'plus', circular: true, link: true, 
                             onClick:() => { this.onClickAddProduct() }}}
                             value={this.state.curAddProductName}
                             onChange={(event, value) => {this.setState({curAddProductName: value.value})}}/>
                    </Form.Field>
                </Form>
              </Segment>
            </Grid.Column>
            <Grid.Column width={10} style={rightStyle}>
              <Segment>
                <List divided relaxed ordered size="big">
                  {this.state.reviews.map((item, index) => {
                    if (item.review_status == 0)
                      return this.showReviewItemEditable(index, item);
                    else
                      return this.showReviewItem(item);
                  })}
                </List>
              </Segment>
            </Grid.Column>
        </Grid>
      </main>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    data: state.common,
    company: state.user.data
  }
}

const mapDispatchToProps = dispatch => ({
  action: bindActionCreators(CommonAction, dispatch),
  onaddProduct: (product_obj) => {
    dispatch(CommonAction.addProduct(product_obj))
  },
  onReplyReview: (review_obj) => {
    dispatch(CommonAction.replyReview(review_obj))
  },
  onApproveReview: (review_obj) => {
    dispatch(CommonAction.approveReview(review_obj))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(CompanyDashboard)