import React from 'react';
import { Form, Card, Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom'; // Redirect

import {
  OFFERED_SECURITIES,
  OVER_SUBSCRIPTION_ALLOCATION_TYPES,
} from '../../../../../../constants/business';
import {
  FormInput,
  FormTextarea,
  FormSelect,
  FormRadioGroup,
  MaskedInput,
} from './../../../../../../theme/form';

@inject('businessStore')
@withRouter
@observer
export default class OfferingInformation extends React.Component {
  componentWillUnmount() {
    this.props.businessStore.setXmlError();
  }
  getSubscriptionDescClass = () => (
    this.props.businessStore.formOfferingInfo.fields.overSubscriptionAllocationType.value === 'Other' &&
    this.props.businessStore.formOfferingInfo.fields.overSubscriptionAccepted.value === 'Y'
  )

  getSubscriptionTypeClass = () => this.props.businessStore.formOfferingInfo.fields.overSubscriptionAccepted.value === 'N'

  getOtherSecurityClass = () => this.props.businessStore.formOfferingInfo.fields.securityOfferedType.value !== 'Other'

  getSecurityOfferedClass = () => this.props.businessStore.formOfferingInfo.fields.securityOfferedType.value === 'Debt'

  render() {
    const { formOfferingInfo, offeringInfoChange, verifyDeadlineDate } = this.props.businessStore;
    return (
      <div>
        <Card fluid className="form-card">
          <FormTextarea
            fielddata={formOfferingInfo.fields.compensationAmount}
            name="compensationAmount"
            changed={offeringInfoChange}
          />
          <FormTextarea
            fielddata={formOfferingInfo.fields.financialInterest}
            name="financialInterest"
            changed={offeringInfoChange}
          />
          <Form.Group widths="equal">
            <FormSelect
              fielddata={formOfferingInfo.fields.securityOfferedType}
              name="securityOfferedType"
              changed={offeringInfoChange}
              options={OFFERED_SECURITIES}
            />
            <FormInput
              type="text"
              fielddata={formOfferingInfo.fields.securityOfferedOtherDesc}
              name="securityOfferedOtherDesc"
              changed={offeringInfoChange}
              disabled={this.getOtherSecurityClass()}
            />
            <FormInput
              type="text"
              fielddata={formOfferingInfo.fields.noOfSecurityOffered}
              name="noOfSecurityOffered"
              changed={offeringInfoChange}
              disabled={this.getSecurityOfferedClass()}
            />
            <FormInput
              type="text"
              fielddata={formOfferingInfo.fields.price}
              name="price"
              changed={offeringInfoChange}
              disabled={this.getSecurityOfferedClass()}
            />
          </Form.Group>
          <FormInput
            type="text"
            fielddata={formOfferingInfo.fields.priceDeterminationMethod}
            name="priceDeterminationMethod"
            changed={offeringInfoChange}
          />
          <Form.Group widths="equal" className="bottom-aligned">
            <div className="field">
              <Header as="label">Is oversubscription Accepted?</Header>
              <FormRadioGroup
                inline
                fielddata={formOfferingInfo.fields.overSubscriptionAccepted}
                name="overSubscriptionAccepted"
                changed={offeringInfoChange}
              />
              {/* <Form.Group inline>
              </Form.Group> */}
            </div>
            <FormSelect
              fielddata={formOfferingInfo.fields.overSubscriptionAllocationType}
              name="overSubscriptionAllocationType"
              changed={offeringInfoChange}
              options={OVER_SUBSCRIPTION_ALLOCATION_TYPES}
              disabled={this.getSubscriptionTypeClass()}
            />
            <FormInput
              type="text"
              fielddata={formOfferingInfo.fields.descOverSubscription}
              name="descOverSubscription"
              changed={offeringInfoChange}
              disabled={!this.getSubscriptionDescClass()}
            />
            <FormInput
              type="text"
              fielddata={formOfferingInfo.fields.maximumOfferingAmount}
              name="maximumOfferingAmount"
              changed={offeringInfoChange}
              disabled={this.getSubscriptionTypeClass()}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <FormInput
              type="text"
              fielddata={formOfferingInfo.fields.offeringAmount}
              name="offeringAmount"
              changed={offeringInfoChange}
            />
            <MaskedInput
              name="deadlineDate"
              fielddata={formOfferingInfo.fields.deadlineDate}
              format="##/##/####"
              changed={verifyDeadlineDate}
              dateOfBirth
              showerror
            />
          </Form.Group>
        </Card>
      </div>
    );
  }
}
