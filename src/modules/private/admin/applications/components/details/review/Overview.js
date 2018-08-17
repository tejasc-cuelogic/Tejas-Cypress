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
      addMoreCriticalPoint,
      overviewEleChange,
    } = this.props.businessAppReviewStore;
    return (
      <div className="inner-content-spacer">
        <Header as="h5">
          Overview
          <Button className="ghost-button" onClick={addMoreCriticalPoint}>+Add Critical Point</Button>
        </Header>
        <Form>
          {
              OVERVIEW_FRM.fields.overview.length ?
              OVERVIEW_FRM.fields.overview.map((overview, index) => (
                <Aux>
                  <label>{`Critical Point ${index}`}</label>
                  <FormInput
                    type="text"
                    name="criticalPoint"
                    fielddata={overview.criticalPoint}
                    changed={(e, result) => overviewEleChange(e, result, index)}
                    ishidelabel
                  />
                </Aux>
              )) : <p>...Loading</p>
          }
          <Button.Group className="pull-right">
            <Button disabled={!OVERVIEW_FRM.meta.isValid} primary size="large" className="very relaxed" >Save</Button>
            <Button disabled={!OVERVIEW_FRM.meta.isValid} type="button">Submit for Approval</Button>
          </Button.Group>
        </Form>
      </div>
    );
  }
}
