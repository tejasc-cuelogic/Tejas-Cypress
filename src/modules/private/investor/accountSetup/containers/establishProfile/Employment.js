import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Header, Message, Button } from 'semantic-ui-react';
import { FormArrowButton } from '../../../../../../theme/form';
import { ListErrors } from '../../../../../../theme/shared';
import formHOC from '../../../../../../theme/form/formHOC';

const metaInfo = {
  store: 'investorProfileStore',
  form: 'EMPLOYMENT_STATUS_FRM',
};

const isMobile = document.documentElement.clientWidth < 768;

@inject('investorProfileStore', 'uiStore')
@observer
class Employment extends Component {
  componentWillMount() {
    // const { EMPLOYMENT_FORM } = this.props.investorProfileStore;
    // if (EMPLOYMENT_FORM.fields.status.value === 'EMPLOYED') {
    //   this.props.uiStore.addMoreInProgressArray('EMPLOYED');
    // }
  }

  componentWillUnmount() {
    this.props.uiStore.setFieldvalue('inProgressArray', []);
  }

  handleUpdateInvestorProfileData = () => {
    const { upsertInvestorProfile, stepToBeRendered, EMPLOYMENT_FORM } = this.props.investorProfileStore;
    const { multiSteps } = this.props.uiStore;
    if (EMPLOYMENT_FORM.fields.status.value === 'EMPLOYED' && isMobile) {
      this.props.uiStore.addMoreInProgressArray('EMPLOYED');
      return;
    }
    upsertInvestorProfile(multiSteps[stepToBeRendered]);
  }

  toggleInputFields = () => {
    const { EMPLOYMENT_FORM } = this.props.investorProfileStore;
    if (EMPLOYMENT_FORM.fields.status.value === 'EMPLOYED' && isMobile) {
      this.props.uiStore.addMoreInProgressArray('EMPLOYED');
    }
  }


  render() {
    const { smartElement, investorProfileStore, uiStore } = this.props;
    const { EMPLOYMENT_STATUS_FRM, formChange, upsertInvestorProfile, stepToBeRendered } = investorProfileStore;
    const { errors, inProgressArray, multiSteps } = uiStore;
    if (inProgressArray.includes('EMPLOYED')) {
      return (
        <Form onSubmit={() => upsertInvestorProfile(multiSteps && multiSteps[stepToBeRendered])} error className="mb-40">
          <Form.Group widths="equal">
            {
            ['employer', 'position'].map(field => (
              smartElement.Input(field)
            ))}
            <Button primary size="large" fluid className="relaxed" content="Continue" disabled={!EMPLOYMENT_STATUS_FRM.meta.isValid} />
          </Form.Group>
        </Form>
      );
    }
    return (
      <div className={isMobile ? '' : 'center-align'}>
        <Header as="h3" className={isMobile ? 'mb-30' : ''}>What is your employment status?</Header>
        {!isMobile && <p className="mb-40">Please indicate your current employment status</p>}
        <Form error className={isMobile ? 'mb-40' : ''}>
          {isMobile
            ? (
            <FormArrowButton
              fielddata={EMPLOYMENT_STATUS_FRM.fields.status}
              name="status"
              changed={
                (e, result) => {
                  formChange(e, result, 'EMPLOYMENT_STATUS_FRM');
                  this.toggleInputFields();
                  // this.props.uiStore.scrollIntoActiveInputFields();
                }
              }
              action={this.handleUpdateInvestorProfileData}
            />
            ) : (
              smartElement.RadioGroup('status', {
                containerclassname: 'three wide button-radio center-align',
              })
            )
          }
          {
            !isMobile && EMPLOYMENT_STATUS_FRM.fields.status.value === 'EMPLOYED'
          && (
          <div className={`${isMobile ? 'mt-30' : 'field-wrap'} left-align`}>
            <Form.Group widths="equal">
              {
              ['employer', 'position'].map(field => (
                smartElement.Input(field)
              ))}
            </Form.Group>
          </div>
          )
          }
          {errors
            && (
              <Message error className="mt-30">
                <ListErrors errors={errors.message ? [errors.message] : [errors]} />
              </Message>
            )
          }
        </Form>
      </div>
    );
  }
}

export default formHOC(Employment, metaInfo);
