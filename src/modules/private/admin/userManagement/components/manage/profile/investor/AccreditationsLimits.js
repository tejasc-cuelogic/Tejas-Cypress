import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Icon, Form, Divider, Button } from 'semantic-ui-react';

@inject('userDetailsStore')
@observer
export default class AccreditationsLimits extends Component {
  render() {
    return (
      <Form>
        <Header as="h4">
          <Icon className="ns-individual-line" color="green" /><Icon className="ns-ira-line" color="green" /> Individual & IRA Limits
          <Link to={this.props.match.url} className="link pull-right"><small><Icon className="ns-pencil" /> Edit</small></Link>
        </Header>
        <Header as="h6">Investment limits</Header>
        <Form.Group widths={2}>
          <Form.Input fluid label="Investment limit" placeholder="Investment limit" value="$80,000" readOnly className="display-only" />
          <Form.Input fluid label="Annual income" placeholder="Annual income" value="$80,000" readOnly className="display-only" />
          <Form.Input fluid label="Net Worth" placeholder="Net Worth" value="$50,000" readOnly className="display-only" />
          <Form.Input fluid label="Other Regulation Crowdfunding investment made in prior 12mths" placeholder="Other Regulation Crowdfunding investment made in prior 12mths" value="$50,000" readOnly className="display-only" />
        </Form.Group>
        <Divider />
        <Header as="h6">
          Accreditation
          <Header.Subheader>Verify accreditation submission</Header.Subheader>
        </Header>
        <div className="bg-offwhite">
          <Form.Group widths={4}>
            <Form.Input fluid label="Accredited with" placeholder="Accredited with" value="Assets" readOnly className="display-only" />
            <Form.Input fluid label="Net worth" placeholder="Net worth" value="$1,000,000" readOnly className="display-only" />
            <Form.Input fluid label="Income evidence type" placeholder="Income evidence type" value="Uploaded document" readOnly className="display-only" />
            <Form.Input fluid label="Income evidence doc" placeholder="Income evidence doc" value="evidence.pdf" readOnly className="display-only" />
          </Form.Group>
          <Button.Group compact size="tiny" className="mt-10">
            <Button primary content="Accept" />
            <Button color="red" content="Deny" />
          </Button.Group>
        </div>
        <Divider />
        <Header as="h4">
          <Icon className="ns-entity-line" color="green" /> Entity Limits
          <Link to={this.props.match.url} className="link pull-right"><small><Icon className="ns-pencil" /> Edit</small></Link>
        </Header>
        <Header as="h6">Investment limits</Header>
        <Form.Group widths={2}>
          <Form.Input fluid label="Investment limit" placeholder="Investment limit" value="$80,000" readOnly className="display-only" />
          <Form.Input fluid label="Annual income" placeholder="Annual income" value="$80,000" readOnly className="display-only" />
          <Form.Input fluid label="Net Worth" placeholder="Net Worth" value="$50,000" readOnly className="display-only" />
          <Form.Input fluid label="Other Regulation Crowdfunding investment made in prior 12mths" placeholder="Other Regulation Crowdfunding investment made in prior 12mths" value="$50,000" readOnly className="display-only" />
        </Form.Group>
        <Divider />
        <Header as="h6">
          Accreditation
          <Header.Subheader>Verify accreditation submission</Header.Subheader>
        </Header>
        <div className="bg-offwhite">
          <Form.Group widths={4}>
            <Form.Input fluid label="Accredited with" placeholder="Accredited with" value="Assets" readOnly className="display-only" />
            <Form.Input fluid label="Net worth" placeholder="Net worth" value="$1,000,000" readOnly className="display-only" />
            <Form.Input fluid label="Income evidence type" placeholder="Income evidence type" value="Uploaded document" readOnly className="display-only" />
            <Form.Input fluid label="Income evidence doc" placeholder="Income evidence doc" value="evidence.pdf" readOnly className="display-only" />
          </Form.Group>
          <Button.Group compact size="tiny" className="mt-10">
            <Button primary content="Accept" />
            <Button color="red" content="Deny" />
          </Button.Group>
        </div>
      </Form>
    );
  }
}
