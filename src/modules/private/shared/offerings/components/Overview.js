/*  eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { intersection } from 'lodash';
import { observer, inject } from 'mobx-react';
import { Form, Header, Button } from 'semantic-ui-react';
import Contingency from './overview/Contingency';
import { FormInput } from '../../../../../theme/form';
import { InlineLoader } from '../../../../../theme/shared';
import AddToCollection from '../../marketing/AddToCollection';
import Helper from '../../../../../helper/utility';
import { DataFormatter } from '../../../../../helper';

@withRouter
@inject('offeringCreationStore', 'userStore', 'uiStore', 'nsUiStore', 'collectionStore', 'offeringsStore')
@observer
export default class Overview extends Component {
  constructor(props) {
    super(props);
    if (this.props.match.isExact) {
      const {
        currentOfferingId,
      } = this.props.offeringCreationStore;
      this.props.collectionStore.initRequest('ACTIVE_INVESTMENTS', currentOfferingId);
    }
  }

  handleSubmitOfferingDetails = () => {
    const {
      OFFERING_DETAILS_FRM,
      updateOffering,
      currentOfferingId,
    } = this.props.offeringCreationStore;
    updateOffering(currentOfferingId, OFFERING_DETAILS_FRM.fields).then(() => {
      this.props.history.push(`/dashboard/offering/${OFFERING_DETAILS_FRM.fields.offeringSlug.value}/overview`);
    });
  }

  showValue = props => ((props.type === 1)
    ? (Helper.CurrencyFormat(props.content))
    : ((props.type === 2) ? `date ${props.content}` : props.content));

  summary = offer => [
    {
      label: 'Date Created',
      value: offer.created ? DataFormatter.formatedDate(offer.created.date) : 'N/A',
      type: 0,
    },
    {
      label: 'Primary Contact',
      value: offer.issuerDetails && offer.issuerDetails.info ? `${offer.issuerDetails.info.firstName} ${offer.issuerDetails.info.lastName}` : 'N/A',
      type: 0,
    },
    {
      label: 'Date Updated',
      value: offer.created ? DataFormatter.formatedDate(offer.updated.date) : 'N/A',
      type: 0,
    },
    {
      label: 'Investment Banking Lead',
      value: offer.leadDetails && offer.leadDetails.info ? `${offer.leadDetails.info.firstName} ${offer.leadDetails.info.lastName}` : 'N/A',
      type: 0,
    },
  ];

  render() {
    const {
      LAUNCH_CONTITNGENCIES_FRM,
      CLOSING_CONTITNGENCIES_FRM,
      OFFERING_DETAILS_FRM,
      formChange,
      formArrayChange,
      currentOfferingId,
    } = this.props.offeringCreationStore;
    const { offer } = this.props.offeringsStore;
    const { isIssuer } = this.props.userStore;
    const { inProgress } = this.props.uiStore;
    const isLaunchContingency = !isIssuer ? true
      : LAUNCH_CONTITNGENCIES_FRM.fields.launch && LAUNCH_CONTITNGENCIES_FRM.fields.launch.length > 0;
    const isCloseContingency = !isIssuer ? true : CLOSING_CONTITNGENCIES_FRM.fields.close
      && CLOSING_CONTITNGENCIES_FRM.fields.close.length > 0;
    const offeringMetaFields = isIssuer ? ['previewPassword', 'referralCode'] : ['offeringSlug', 'previewPassword', 'referralCode'];
    const { loadingArray } = this.props.nsUiStore;
    if (intersection(loadingArray, ['getCollections', 'getCollectionMapping']).length > 0) {
      return <InlineLoader />;
    }
    return (
      <div className={isIssuer ? 'ui card fluid form-card' : 'inner-content-spacer'}>
        <Form>
          <Header as="h4">Offering Details</Header>
          <Form.Group widths={3}>
            {
              offeringMetaFields.map(field => (
                <FormInput
                  lowercase={field === 'referralCode'}
                  name={field}
                  disabled={isIssuer}
                  value={field === 'offeringSlug' ? `https://www/nextseed.com/offering/${OFFERING_DETAILS_FRM.value}` : ''}
                  fielddata={OFFERING_DETAILS_FRM.fields[field]}
                  changed={(e, result) => formChange(e, result, 'OFFERING_DETAILS_FRM')}
                />
              ))
            }
            </Form.Group>
            {isIssuer ? ''
            : (
              <div className="clearfix mb-14">
                <Button primary disabled={!OFFERING_DETAILS_FRM.meta.isValid} loading={inProgress} content="Save" className="relaxed pull-right" onClick={this.handleSubmitOfferingDetails} />
              </div>
            )
          }
            <Form.Group widths={2}>
            {!isIssuer && offer.stage === 'CREATION'
              && this.summary(offer).map(field => (
                <FormInput
                  name={field.label}
                  value=""
                  readOnly
                  containerclassname="display-only"
                  fielddata={field}
                />
              ))
            }
          </Form.Group>
          {
            ['LIVE', 'COMPLETE'].includes(offer.stage)
            && (
              <AddToCollection isOffering referenceId={currentOfferingId} />
            )
          }
          {isLaunchContingency
            && <Contingency formArrayChange={formArrayChange} isIssuer={isIssuer} form={LAUNCH_CONTITNGENCIES_FRM} formName="LAUNCH_CONTITNGENCIES_FRM" />
          }
          {isCloseContingency
            && <Contingency formArrayChange={formArrayChange} isIssuer={isIssuer} form={CLOSING_CONTITNGENCIES_FRM} formName="CLOSING_CONTITNGENCIES_FRM" />
          }
        </Form>
      </div>
    );
  }
}
