import React from 'react';
import {injectStripe} from 'react-stripe-elements';


///////////////************ API *************////////////////////

import {  payFor } from "../utils/api"

//////////////////////////////////////

///////////////////////*********** Components **************////////////////////

import CardSection from './CardSection';

import Loader from './Loader';

import { Form, Button } from 'react-bootstrap'

////////////////////////////////////////////////////////////////////

class CheckoutForm extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
    };
  }

  handleSubmit(ev) {
    ev.preventDefault();
    
    this.setState({ loading: true });
    payFor((result, message, data) => {
      console.log(result);
      if(result === "SUCCESS") {
        console.log(data.client_secret);
        this.props.stripe.handleCardPayment(data.client_secret).then((paymentResult) => {
            this.setState({ loading: false });
            if(paymentResult.paymentIntent) {
              console.log("they payment DID go through");
            } else if(paymentResult.error) {
              console.log("the payment didn't go through");
              throw paymentResult.error;
            }
          }).catch((err) => {
            console.log(err);
          });
      } else {
        console.log("payment didn't go through");
        this.setState({ loading: false });
      }
    });
  }

  render() {
    const spinner = (this.state.loading) ? <Loader /> : false;
    return (
      <Form style={{ width: '80%' }} onSubmit={this.handleSubmit.bind(this)}>
        <Form.Group>
        <CardSection />
        </Form.Group>
        <Button type='submit'>Confirm order</Button>
        { spinner }
      </Form>
    );
  }
}

export default injectStripe(CheckoutForm);