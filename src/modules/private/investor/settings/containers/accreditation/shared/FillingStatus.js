import React, { Component } from 'react';
import { Form, Header, Button } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

const isMobile = document.documentElement.clientWidth < 768;
@withRouter
@inject('accreditationStore', 'uiStore')
@observer
export default class FillingStatus extends Component {
  render() {
    const { FILLING_STATUS_FORM, accreditationMethodChange } = this.props.accreditationStore;
    // const { responsiveVars } = this.props.uiStore;
    return (
      <div>
        <Header as="h4">Filing Status</Header>
        <p>
        Do you have documentation to verify your income for 2019?
        </p>
        <Form error className="mt-30">
          <Button.Group>
            {FILLING_STATUS_FORM.fields.method.values.map(method => (
              <Button
                basic
                fluid={isMobile}
                onClick={(e) => { accreditationMethodChange(e, 'FILLING_STATUS_FORM', { name: 'method', value: method.value }); this.props.submitStep(); }}
                className={`primary-hover user-type ${(FILLING_STATUS_FORM.fields.method.value === method.value ? 'active' : '')} ${isMobile ? 'mb-10' : ''}`}
              >
                  {method.label}
              </Button>
            ))}
          </Button.Group>
          {/* <div>
            <Button disabled={!FILLING_STATUS_FORM.meta.isValid} onClick={() => this.props.submitStep()} primary size="large" fluid={responsiveVars.isMobile} className="mt-40 relaxed" content="Continue" />
          </div> */}
        </Form>
      </div>
    );
  }
}
