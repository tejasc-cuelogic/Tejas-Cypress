import React from 'react';
import _ from 'lodash';
import { inject, observer } from 'mobx-react';
import { Divider, Grid, Header, Form } from 'semantic-ui-react';

@inject('businessStore')
@observer
export default class Signature extends React.Component {
  render() {
    const { signature } = this.props.businessStore;
    return (
      <Grid
        textAlign="left"
        verticalAlign="middle"
      >
        <Grid.Column>
          <Header as="h1" textAlign="left">Signature</Header>
          <Divider section />
          {_.map(signature, field => (
            <Form.Input
              label={field.label}
              name={field.key}
              defaultValue={field.value}
              onChange={this.props.handleInputChange}
              key={field.key}
            />
          ))}
        </Grid.Column>
      </Grid>
    );
  }
}
