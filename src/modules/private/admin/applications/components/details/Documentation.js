import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Form, Icon, Label, List } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

@inject('businessAppStore', 'uiStore')
@observer
export default class Documentation extends Component {
  render() {
    const { BUSINESS_DOC_FRM } = this.props.businessAppStore;
    const { fields } = BUSINESS_DOC_FRM;
    return (
      <Form>
        <div className="inner-content-spacer">
          <Header as="h4">Financial Statements</Header>
          <Form.Group widths={2}>
            {
              ['bankStatements', 'leaseAgreementsOrLOIs'].map(field => (
                <div className="field display-only" key={field}>
                  <Label>{fields[field].label}</Label>
                  <div className="display-only">
                    <List>
                      <List.Item>
                        <Link to="/"><Icon className="ns-file" /><b>nsbakery_businessplan050518.pdf</b></Link>
                      </List.Item>
                    </List>
                  </div>
                </div>
              ))
            }
          </Form.Group>
        </div>
        <div className="inner-content-spacer">
          <Header as="h4">Financial Statements</Header>
          <Form.Group widths={2}>
            {
              ['personalTaxReturn', 'businessTaxReturn'].map(field => (
                <div className="field display-only" key={field}>
                  <Label>{fields[field].label}</Label>
                  <div className="display-only">
                    <List>
                      <List.Item>
                        <Link to="/"><Icon className="ns-file" /><b>nsbakery_businessplan050518.pdf</b></Link>
                      </List.Item>
                    </List>
                  </div>
                </div>
              ))
            }
          </Form.Group>
        </div>
        <div className="inner-content-spacer">
          <Header as="h4">Do you accept Blanket Lien on the Business if your campain is successfully funded?</Header>
          <p>Yes</p>
        </div>
        <div className="inner-content-spacer">
          <Header as="h4">Are you willing to provide a personal quarantee?</Header>
          <p>Yes</p>
          <Link to="/"><Icon className="ns-file" /><b>nsbakery_businessplan050518.pdf</b></Link>
        </div>
      </Form>
    );
  }
}
