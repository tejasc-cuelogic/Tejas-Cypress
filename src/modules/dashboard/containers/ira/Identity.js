import React, { Component } from 'react';
import { Grid, Header, Form, Input } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

@inject('accountStore')
@observer
export default class Identity extends Component {
  handleAccountType = (e, data) => {
    this.props.accountStore.setIraAccountType(data.activeIndex);
  }
  render() {
    return (
      <div>
        <Header as="h2">Confirm your identity and upload your drivers license</Header>
        <Grid textAlign="center">
          <Form error>
            <Form.Field>
              { /*  eslint-disable jsx-a11y/label-has-for */ }
              <label>
                Upload a Photo ID
                Driving Liscence or passport
              </label>
              <Input
                fluid
                type="file"
                placeholder="test"
                name="test"
                value="test"
              />
            </Form.Field>
          </Form>
        </Grid>
      </div>
    );
  }
}
