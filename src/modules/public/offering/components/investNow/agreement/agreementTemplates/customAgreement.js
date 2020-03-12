import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Button, Grid, Form, Message } from 'semantic-ui-react';
import { get } from 'lodash';
import { FormCheckbox } from '../../../../../../../theme/form';

function CustomAgreement(props) {
  const {
    AGREEMENT_DETAILS_FORM,
    setCheckbox,
    investmentFlowErrorMessage,
  } = props.investmentStore;
  const { inProgress, showError, docuSignHandeler, agreementPDFLoader, submit, match, agreementStatement, offeringRegulationType } = props;
  const { currentInvestmentStatus } = props.accreditationStore;
  const { getInvestorAccountById } = props.portfolioStore;
  const investmentRegulation = get(getInvestorAccountById, 'regulation');
  const regulationCheck = currentInvestmentStatus || investmentRegulation;
  const regualtionTypeStatement = regulationCheck && regulationCheck === 'BD_506C' ? 'Regulation D 506C' : regulationCheck === 'BD_506B' ? 'Rule 506(b) of Regulation D' : 'Regulation Crowdfunding';
  return (
    <Form
      error={(showError
        && !props.investmentStore.AGREEMENT_DETAILS_FORM.meta.isValid)
        || investmentFlowErrorMessage}
    >
      <Grid stackable>
        <Grid.Row>
          {['checkboxesLeft', 'checkboxesRight'].map(field => (
            <Grid.Column width={8}>
              <FormCheckbox
                defaults
                fielddata={AGREEMENT_DETAILS_FORM.fields[field]}
                name={field}
                containerclassname={`ui very relaxed list ${showError && !props.investmentStore.AGREEMENT_DETAILS_FORM.meta.isValid ? 'error' : ''}`}
                changed={setCheckbox}
                disabled={inProgress}
                customLabel={(
                  <>
                    I have reviewed and agree to the terms of the <Link onClick={e => docuSignHandeler(e, true)} to="/">{agreementStatement}</Link>.
                              </>
                )}
                conditionalCustomLabel={(
                  offeringRegulationType !== 'BD_CF'
                    ? (
                      <>
                        I have reviewed NextSeed’s <Link target="_blank" to="/resources/education-center/investor">educational materials</Link>, understand that
                        the entire amount of my investment may be lost,
                        and confirm that I am in a
                        financial condition to bear the loss.
                        I have read and agree to the terms of
                                  the <Link onClick={e => agreementPDFLoader(e, true, 'cCAgreement', 'SERVICES')} to="/">CrowdPay Custodial Account Agreement</Link>,
                                  the <Link onClick={e => agreementPDFLoader(e, true, 'irsCertification', 'SERVICES')} to="/">Substitute IRS Form W-9 Certification</Link>,
                                  and <Link onClick={e => agreementPDFLoader(e, true, 'bDIAgreemnt', 'SERVICES')} to="/">NextSeed Securities LLC Investor Agreement</Link>
                      </>
                    )
                    : (
                      <>
                        I have reviewed NextSeed’s <Link target="_blank" to="/resources/education-center/investor">educational materials</Link>, understand that
                        the entire amount of my investment may be lost,
                        and confirm that I am in a
                        financial condition to bear the loss.
                        I have read and agree to the terms of
                                    the <Link onClick={e => agreementPDFLoader(e, true, 'cCAgreement', 'SERVICES')} to="/">CrowdPay Custodial Account Agreement</Link>,
                                  the <Link onClick={e => agreementPDFLoader(e, true, 'irsCertification', 'SERVICES')} to="/">Substitute IRS Form W-9 Certification</Link>,
                                    and <Link onClick={e => agreementPDFLoader(e, true, 'fPAgreemnt', 'SERVICES')} to="/">NextSeed US LLC Membership Agreement</Link>
                      </>
                    )
                )}
                customUpdateLimitLabel={(
                  regulationCheck && ['BD_506C', 'BD_506B'].includes(regulationCheck)
                    ? (
                      <>
                        I hereby certify that I have a reasonable expectation that I will
                        continue to meet or exceed the requirements to be considered an
                          accredited investor.
                                </>
                    )
                    : (
                      <>
                        I confirm that I am complying with my <b>annual investment limit</b> {' '}
                        {regulationCheck && !['BD_506C', 'BD_506B'].includes(regulationCheck) && (<Link to={`${match.url}/change-investment-limit`}>update</Link>)}
                      </>
                    )
                )}
                customRegulationLabel={(
                  <>
                    I understand that investing in securities sold in reliance on {' '}
                    {regualtionTypeStatement} involves risks and I should not invest
                      any funds unless I can afford to lose the entire amount.
                              </>
                )}
                tooltipHardDisable={(regulationCheck && ['BD_506C', 'BD_506B'].includes(regulationCheck))}
                currentInvestmentStatus={regulationCheck}
              />
            </Grid.Column>
          ))}
        </Grid.Row>
      </Grid>
      <div className="mt-30">
        <Button primary content="Invest" disabled={inProgress} loading={inProgress} onClick={() => submit('CUSTOM')} />
        {/* <Button.Group widths="2" className="inline">
                      <Button type="button" color="gray" disabled={inProgress} content="Cancel" onClick={handleCancelAgreement} />
                    </Button.Group> */}
      </div>
      {!showError && investmentFlowErrorMessage
        && (
          <Message error className="mt-30 bottom-error">
            {investmentFlowErrorMessage}
          </Message>
        )
      }
      {showError
        && !props.investmentStore.AGREEMENT_DETAILS_FORM.meta.isValid
        && <Message error className="bottom-error">All boxes must be checked to confirm your investment.</Message>
      }
    </Form>
  );
}

export default (withRouter(observer(CustomAgreement)));
