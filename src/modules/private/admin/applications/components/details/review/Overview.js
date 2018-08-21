/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Form, Header, Button } from 'semantic-ui-react';
import { FormInput } from '../../../../../../../theme/form';

@inject('businessAppReviewStore')
@observer
export default class Overview extends Component {
  addMore = (e) => {
    e.preventDefault();
    this.props.businessAppReviewStore.addMore('OVERVIEW_FRM');
  }
  render() {
    const {
      OVERVIEW_FRM,
      overviewEleChange,
    } = this.props.businessAppReviewStore;
    return (
      <Aux>
        <Header as="h4">
          Overview
          <Link to={this.props.match.url} className="link" onClick={e => this.addMore(e, 'OVERVIEW_FRM')}><small>+ Add Critical Point</small></Link>
        </Header>
        <Form>
          {
            OVERVIEW_FRM.fields.data.length ?
            OVERVIEW_FRM.fields.data.map((overview, index) => (
              <FormInput
                type="text"
                name="criticalPoint"
                label={`Critical Point ${index + 1}`}
                fielddata={overview.criticalPoint}
                changed={(e, result) => overviewEleChange(e, result, index)}
              />
            )) : null
          }
          <Button.Group className="pull-right">
            <Button disabled={!OVERVIEW_FRM.meta.isValid} secondary className="relaxed">Save</Button>
            <Button disabled={!OVERVIEW_FRM.meta.isValid} primary type="button">Submit for Approval</Button>
          </Button.Group>
        </Form>
      </Aux>
    );
  }
}
