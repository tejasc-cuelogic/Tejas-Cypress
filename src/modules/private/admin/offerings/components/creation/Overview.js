/*  eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, Header, Checkbox, Button, Icon } from 'semantic-ui-react';
import { FormTextarea } from '../../../../../../theme/form';

const formTextarea = {
  values: [
    {
      label: 'Any operational growth will place additional demands on our administrative, management and financial resources. It is imperative that we manage our growth; if we do not effectively manage growth, our operations and financial condition may be negatively impacted. The timing and extent of future growth depends, in part, on our ability to manage its organizational structure and financial resources.',
    },
  ],
  error: undefined,
  rule: 'array',
};
export default class Overview extends Component {
  render() {
    return (
      <Form>
        <div className="inner-content-spacer">
          <Header as="h4">
            Launch Contingencies
            <Link to="/" className="link"><small>+ Add Launch Contingency</small></Link>
          </Header>
          <div className="featured-section collapsed-checkbox">
            <Checkbox
              label={
                <label>
                  <Header as="h4">
                    Executed LOI
                    <Header.Subheader>NextSeed to Verify LOI</Header.Subheader>
                  </Header>
                </label>
              }
            />
            <div className="checkbox-description">
              <p>
                Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque
                dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies.
                Curabitur et ligula.
              </p>
              <FormTextarea
                fielddata={formTextarea.values}
                name="compensationAmount"
                containerclassname="secondary"
              />
              <Button.Group compact size="small">
                <Button inverted color="blue" content="Edit" />
                <Button color="red" content="Delete" />
                <Button as="span" className="time-stamp"><Icon className="ns-check-circle" color="green" /> Submited 2/16/18 by Aaron Adams</Button>
              </Button.Group>
            </div>
          </div>
          <div className="featured-section collapsed-checkbox">
            <Checkbox
              label={
                <label>
                  <Header as="h4">
                    Secured Equity Financing
                    <Header.Subheader>NextSeed to verify Equity Agreement</Header.Subheader>
                  </Header>
                </label>
              }
            />
            <div className="checkbox-description">
              <p>
                Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque
                dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies.
                Curabitur et ligula.
              </p>
              <FormTextarea
                fielddata={formTextarea.values}
                name="compensationAmount"
                containerclassname="secondary"
              />
              <Button.Group compact size="small">
                <Button inverted color="blue" content="Edit" />
                <Button color="red" content="Delete" />
                <Button as="span" className="time-stamp"><Icon className="ns-check-circle" color="green" /> Submited 2/16/18 by Aaron Adams</Button>
              </Button.Group>
            </div>
          </div>
        </div>
      </Form>
    );
  }
}
