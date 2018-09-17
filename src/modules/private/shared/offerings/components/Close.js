import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Form, Header } from 'semantic-ui-react';
import Contingency from './overview/Contingency';
import Actions from './overview/Actions';
import { MaskedInput } from '../../../../../theme/form';

@inject('offeringCreationStore')
@observer
export default class Close extends Component {
  componentWillMount() {
    this.props.offeringCreationStore.setFormData('OFFERING_CLOSE_FRM', 'closureSummary');
  }
  render() {
    const {
      OFFERING_CLOSE_FRM,
      CLOSING_CONTITNGENCIES_FRM,
      maskChange,
      formChangeWithIndex,
    } = this.props.offeringCreationStore;
    const formName = 'OFFERING_CLOSE_FRM';
    return (
      <Form>
        <div className="inner-content-spacer">
          <Contingency
            formChangeWithIndex={formChangeWithIndex}
            form={CLOSING_CONTITNGENCIES_FRM}
            formName="CLOSING_CONTITNGENCIES_FRM"
            addon={<Actions />}
          />
          <Header as="h4">Offer Closing Details</Header>
          <Form.Group widths={3}>
            {Object.keys(OFFERING_CLOSE_FRM.fields).map(field => (
              <MaskedInput
                name={field}
                fielddata={OFFERING_CLOSE_FRM.fields[field]}
                changed={(values, name) => maskChange(values, formName, name)}
                dateOfBirth={field === 'disbursementDate'}
                number={field === 'totalInvestorCount'}
                currency={field !== 'totalInvestorCount' && field !== 'disbursementDate'}
                prefix={field !== 'totalInvestorCount' && field !== 'disbursementDate' ? '$' : false}
              />
            ))
            }
          </Form.Group>
        </div>
      </Form>
    );
  }
}
