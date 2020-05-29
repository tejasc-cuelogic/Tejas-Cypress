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
    // const { EMPLOYMENT_STATUS_FRM } = this.props.investorProfileStore;
    // if (EMPLOYMENT_STATUS_FRM.fields.status.value === 'EMPLOYED') {
    //   this.props.uiStore.addMoreInProgressArray('EMPLOYED');
    // }
  }

  componentWillUnmount() {
    this.props.uiStore.setFieldvalue('inProgressArray', []);
  }

  handleupsertInvestorProfile = () => {
    const { upsertInvestorProfile, stepToBeRendered, EMPLOYMENT_STATUS_FRM } = this.props.investorProfileStore;
    const { multiSteps } = this.props.uiStore;
    if (EMPLOYMENT_STATUS_FRM.fields.status.value === 'EMPLOYED' && isMobile) {
      this.props.uiStore.addMoreInProgressArray('EMPLOYED');
      return;
    }
    upsertInvestorProfile(multiSteps[stepToBeRendered]);
  }

  toggleInputFields = () => {
    const { EMPLOYMENT_STATUS_FRM } = this.props.investorProfileStore;
    if (EMPLOYMENT_STATUS_FRM.fields.status.value === 'EMPLOYED') {
      this.props.uiStore.addMoreInProgressArray('EMPLOYED');
    }
  }


  render() {
    const { smartElement, investorProfileStore, uiStore } = this.props;
    const { upsertInvestorProfile, stepToBeRendered, EMPLOYMENT_STATUS_FRM, formChange } = investorProfileStore;
    const { errors, inProgressArray, multiSteps } = uiStore;
    if (inProgressArray.includes('EMPLOYED')) {
      return (
        <Form onSubmit={() => upsertInvestorProfile(multiSteps && multiSteps[stepToBeRendered])} error className="mb-40">
          {
          ['employer', 'position'].map(field => (
            smartElement.Input(field)
          ))}
          <Button primary fluid={isMobile} className="mt-30 relaxed" content="Continue" disabled={!EMPLOYMENT_STATUS_FRM.meta.isValid} />
        </Form>
      );
    }
    return (
      <>
        <Header as="h3" className={isMobile ? 'mb-30' : ''}>What is your employment status?</Header>
        {/* {!isMobile && <p className="mb-40">Please indicate your current employment status</p>} */}
        <Form error className={isMobile ? 'mb-40' : ''}>
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
            action={this.handleupsertInvestorProfile}
          />
          {errors
          && (
          <Message error className="mt-30">
            <ListErrors errors={errors.message ? [errors.message] : [errors]} />
          </Message>
          )
          }
        </Form>
      </>
    );
  }
}

export default formHOC(Employment, metaInfo);
