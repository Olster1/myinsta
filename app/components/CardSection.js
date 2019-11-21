import React from 'react';
import {CardElement} from 'react-stripe-elements';

import { Form } from 'react-bootstrap'

const style = {
  base: {
    color: "#32325d",
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: "antialiased",
    fontSize: "16px",
    "::placeholder": {
      color: "#aab7c4"
    }
  },
  invalid: {
    color: "#fa755a",
    iconColor: "#fa755a"
  }
};

const CardSection = () => {
  return (
    <Form.Label style={ { width: "100%" } } >
      Card details
      <CardElement className='MyCardElement' style={style} />
    </Form.Label>
  );
};

export default CardSection;