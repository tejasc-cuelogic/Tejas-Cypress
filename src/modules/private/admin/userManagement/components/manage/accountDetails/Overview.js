import React from 'react';
// import { Link } from 'react-router-dom';
import { Header, Icon, Form, Divider, Button } from 'semantic-ui-react';

const Overview = () => (
  <Form>
    <div className="clearfix">
      <span className="pull-left">
        <Header as="h4">
          <Icon className="ns-individual-line" color="green" />Individual
        </Header>
      </span>
      <span className="pull-right">
        <Button.Group compact size="tiny">
          <Button color="blue" className="link-button"><Icon className="ns-pencil" />Edit Account</Button>
          <Button secondary><Icon className="ns-freeze" />Freeze account</Button>
        </Button.Group>
      </span>
    </div>
    <Header as="h6">Bank Account</Header>
    <Form.Group widths={3}>
      <Form.Input fluid label="Bank Name" placeholder="Bank Name" value="Bank of America" readOnly className="display-only" />
      <Form.Input fluid label="Account Number" placeholder="Account Number" value="...6415" readOnly className="display-only" />
    </Form.Group>
    <Divider />
    <Header as="h6">Beneficiaries</Header>
    <div className="bg-offwhite">
      <Form.Group widths={3}>
        <Form.Input fluid label="Name" placeholder="Name" value="Jane Smith" readOnly className="display-only" />
        <Form.Input fluid label="DOB" placeholder="DOB" value="12-02-1989" readOnly className="display-only" />
        <Form.Input fluid label="Relationship" placeholder="Relationship" value="Daughter" readOnly className="display-only" />
      </Form.Group>
      <Form.Group widths={3}>
        <Form.Input fluid label="Legal Address" placeholder="Legal Address" value="Baker Street 221B, New York, NY, 10001" readOnly className="display-only" />
        <Form.Input fluid label="Shares" placeholder="Shares" value="50%" readOnly className="display-only" />
      </Form.Group>
    </div>
    <div className="bg-offwhite mt-20">
      <Form.Group widths={3}>
        <Form.Input fluid label="Name" placeholder="Name" value="Jane Smith" readOnly className="display-only" />
        <Form.Input fluid label="DOB" placeholder="DOB" value="12-02-1989" readOnly className="display-only" />
        <Form.Input fluid label="Relationship" placeholder="Relationship" value="Daughter" readOnly className="display-only" />
      </Form.Group>
      <Form.Group widths={3}>
        <Form.Input fluid label="Legal Address" placeholder="Legal Address" value="Baker Street 221B, New York, NY, 10001" readOnly className="display-only" />
        <Form.Input fluid label="Shares" placeholder="Shares" value="50%" readOnly className="display-only" />
      </Form.Group>
    </div>
  </Form>
);

export default Overview;
