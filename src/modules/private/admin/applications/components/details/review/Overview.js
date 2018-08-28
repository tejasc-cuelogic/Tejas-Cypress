import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Form, Header, Button } from 'semantic-ui-react';
import { FormInput } from '../../../../../../../theme/form';
import { EmptyDataSet } from '../../../../../../../theme/shared';

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
          {/* <Link onClick={addMoreCriticalPoint}>+ Add Critical Point</Link> */}
          <Button color="violet" className="ghost-button pull-right" onClick={addMoreCriticalPoint}>+ Add Critical Point</Button>
        </Header>
        {
            OVERVIEW_FRM.fields.overview.length ?
            OVERVIEW_FRM.fields.overview.map((overview, index) => (
              <Form>
                <FormInput
                  type="text"
                  name="criticalPoint"
                  fielddata={overview.criticalPoint}
                  changed={(e, result) => overviewEleChange(e, result, index)}
                />
              </Form>
            )) :
            <EmptyDataSet />
        }
      </div>
    );
  }
}
