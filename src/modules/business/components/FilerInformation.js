import React from 'react';
import { Grid, Form, Header, Divider } from 'semantic-ui-react';

const FilerInformation = props => (
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
        defaultValue={props.filerCik}
        onChange={props.handleInputChange}
        width={8}
      />
      <Form.Input
        placeholder="Filer CCC"
        label="Filer CCC"
        name="filerCcc"
        defaultValue={props.filerCcc}
        onChange={props.handleInputChange}
        width={8}
      />
      <Form.Group>
        <Form.Radio
          label="Live"
          value="LIVE"
          name="liveTestFlag"
          onChange={props.handleInputChange}
          width={8}
        />
        <Form.Radio
          label="Test"
          value="TEST"
          name="liveTestFlag"
          onChange={props.handleInputChange}
          width={8}
        />
      </Form.Group>
      <Form.Checkbox
        label="Would you like a Return Copy?"
        name="returnCopyFlag"
        onChange={props.handleChange}
      />
      <Form.Checkbox
        label="Would you like a Return Copy?"
        name="returnCopyFlag"
        onChange={props.handleChange}
      />
      <Form.Checkbox
        label="Would you like a Return Copy?"
        name="returnCopyFlag"
        onChange={props.handleChange}
      />
    </Grid.Column>
  </Grid>
);

export default FilerInformation;
