import React from 'react';
import { Grid, Form, Header, Divider } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

@inject('businessStore')
@observer
export default class FilerInformation extends React.Component {
  render() {
    const { filerInformation } = this.props.businessStore;
    return (
      <Grid
        textAlign="left"
        verticalAlign="top"
      >
        <Grid.Column>
          <Header as="h1" textAlign="left">Filer Information</Header>
          <Divider section />
          <Form.Input
            placeholder="Filer CIK"
            label="Filer CIK"
            name="filerCik"
            defaultValue={filerInformation.filerCik.value}
            onChange={this.props.handleInputChange}
            width={8}
          />
          <Form.Input
            placeholder="Filer CCC"
            label="Filer CCC"
            name="filerCcc"
            defaultValue={filerInformation.filerCcc.value}
            onChange={this.props.handleInputChange}
            width={8}
          />
          <Form.Group>
            <Form.Radio
              label="Live"
              value="LIVE"
              name="liveTestFlag"
              onChange={this.props.handleInputChange}
              width={8}
            />
            <Form.Radio
              label="Test"
              value="TEST"
              name="liveTestFlag"
              onChange={this.props.handleInputChange}
              width={8}
            />
          </Form.Group>
          <Form.Checkbox
            label="Would you like a Return Copy?"
            name="returnCopyFlag"
            onChange={this.props.handleChange}
          />
          <Form.Checkbox
            label="Would you like a Return Copy?"
            name="returnCopyFlag"
            onChange={this.props.handleChange}
          />
          <Form.Checkbox
            label="Would you like a Return Copy?"
            name="returnCopyFlag"
            onChange={this.props.handleChange}
          />
        </Grid.Column>
      </Grid>
    );
  }
}
