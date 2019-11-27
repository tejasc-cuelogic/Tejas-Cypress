/*  eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Form, Header, Button } from 'semantic-ui-react';
import Contingency from './overview/Contingency';
import { FormInput } from '../../../../../theme/form';

@withRouter
@inject('offeringCreationStore', 'userStore', 'uiStore')
@observer
export default class Overview extends Component {
  handleSubmitOfferingDetails = () => {
    const {
      OFFERING_DETAILS_FRM,
      updateOffering,
      currentOfferingId,
    } = this.props.offeringCreationStore;
    updateOffering(currentOfferingId, OFFERING_DETAILS_FRM.fields);
  }

  render() {
    const {
      LAUNCH_CONTITNGENCIES_FRM,
      CLOSING_CONTITNGENCIES_FRM,
      OFFERING_DETAILS_FRM,
      formChange,
      formArrayChange,
    } = this.props.offeringCreationStore;
    const { isIssuer } = this.props.userStore;
    const { inProgress } = this.props.uiStore;
    const isLaunchContingency = !isIssuer ? true
      : LAUNCH_CONTITNGENCIES_FRM.fields.launch && LAUNCH_CONTITNGENCIES_FRM.fields.launch.length > 0;
    const isCloseContingency = !isIssuer ? true : CLOSING_CONTITNGENCIES_FRM.fields.close
      && CLOSING_CONTITNGENCIES_FRM.fields.close.length > 0;
    const offeringMetaFields = isIssuer ? ['previewPassword', 'referralCode'] : ['offeringSlug', 'previewPassword', 'referralCode'];
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
                  fielddata={OFFERING_DETAILS_FRM.fields[field]}
                  changed={(e, result) => formChange(e, result, 'OFFERING_DETAILS_FRM')}
                />
              ))
            }
          </Form.Group>
          { isIssuer ? ''
            : (
          <div className="clearfix">
            <Button primary disabled={!OFFERING_DETAILS_FRM.meta.isValid} loading={inProgress} content="Save" className="relaxed pull-right" onClick={this.handleSubmitOfferingDetails} />
          </div>
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
