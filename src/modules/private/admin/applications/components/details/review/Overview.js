/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Form, Header, Button } from 'semantic-ui-react';
import { FormInput } from '../../../../../../../theme/form';

@inject('businessAppReviewStore')
@observer
export default class Overview extends Component {
  render() {
    const {
      OVERVIEW_FRM,
      addMore,
      overviewEleChange,
    } = this.props.businessAppReviewStore;
    return (
      <div className="inner-content-spacer">
        <Header as="h5">
          Overview
          <Button color="blue" className="ghost-button" onClick={() => addMore('OVERVIEW_FRM')}>+Add Critical Point</Button>
        </Header>
        <Form>
          {
              OVERVIEW_FRM.fields.data.length ?
              OVERVIEW_FRM.fields.data.map((overview, index) => (
                <Aux>
                  <label>{`Critical Point ${index + 1}`}</label>
                  <FormInput
                    type="text"
                    name="criticalPoint"
                    fielddata={overview.criticalPoint}
                    changed={(e, result) => overviewEleChange(e, result, index)}
                    ishidelabel
                  />
                </Aux>
              )) : null
          }
          <Button.Group className="pull-right">
            <Button disabled={!OVERVIEW_FRM.meta.isValid} secondary className="relaxed">Save</Button>
            <Button disabled={!OVERVIEW_FRM.meta.isValid} primary className="relaxed" type="button">Submit for Approval</Button>
          </Button.Group>
        </Form>
      </div>
    );
  }
}
