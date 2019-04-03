import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import { map, get } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Card, Header, Divider, Form, Button } from 'semantic-ui-react';
import Helper from '../../../../../helper/utility';
import { INVESTMENT_EXPERIENCE_LIST, EMPLOYMENT_LIST, BROKERAGE_EMPLOYMENT_LIST, PUBLIC_COMPANY_REL_LIST, INVESTOR_PROFILE_LIST } from '../../../../../constants/account';
import { FormInput, MaskedInput, FormDropDown, FormCheckbox } from '../../../../../theme/form';

@inject('investorProfileStore', 'userDetailsStore')
@observer
export default class UserInvestorDetails extends Component {
  state = {
    displayOnly: true,
  }
  componentWillMount() {
    const { investorProfileData } = this.props;
    const { setInvestorDetailInfo } = this.props.investorProfileStore;
    if (this.props.isAdmin) {
      const investorProfileDataAdmin = get(this.props.userDetailsStore, 'getDetailsOfUser.investorProfileData');
      setInvestorDetailInfo(investorProfileDataAdmin);
    } else {
      setInvestorDetailInfo(investorProfileData);
    }
  }
  toogleField = (e) => {
    e.preventDefault();
    const { investorProfileData } = this.props;
    const {
      setInvestorDetailInfo,
      setIsInvestmentExperienceValidStatus,
    } = this.props.investorProfileStore;
    if (this.props.isAdmin) {
      const investorProfileDataAdmin = get(this.props.userDetailsStore, 'getDetailsOfUser.investorProfileData');
      setInvestorDetailInfo(investorProfileDataAdmin);
    } else {
      setInvestorDetailInfo(investorProfileData);
    }
    setIsInvestmentExperienceValidStatus(true);
    this.setState({ displayOnly: !this.state.displayOnly });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const { updateInvestorEditProfileData } = this.props.investorProfileStore;
    updateInvestorEditProfileData();
    this.setState({ displayOnly: !this.state.displayOnly });
  }
  render() {
    const formName = 'INVESTOR_PROFILE_FULL';
    const {
      INVESTOR_PROFILE_FULL,
      formChange, maskChange,
      experiencesEditChange,
      isInvestmentExperienceValid,
    } = this.props.investorProfileStore;
    const yearValues = Helper.getLastThreeYearsLabel();
    return (
      <Card fluid className="form-card">
        <Form>
          <Header as="h5">Investor Profile
            {!this.props.isAdmin && (this.state.displayOnly ?
              <Link to={`${this.props.match.url}`} className="link pull-right regular-text" onClick={this.toogleField}><small>Edit information</small></Link>
              :
              <Button.Group floated="right" size="mini" compact>
                <Button as={Link} content="Cancel" to={`${this.props.match.url}`} onClick={this.toogleField} />
                <Button
                  primary
                  onClick={this.handleSubmit}
                  disabled={!(INVESTOR_PROFILE_FULL.meta.isValid && isInvestmentExperienceValid)}
                >
                  Update
                </Button>
              </Button.Group>)
            }
          </Header>
          <dl className="dl-horizontal">
            <dt>Employment status</dt>
            <dd className={!this.state.displayOnly ? 'visible-dropdown' : ''}>
              <FormDropDown
                readOnly={this.state.displayOnly}
                fielddata={INVESTOR_PROFILE_FULL.fields.status}
                compact
                selection
                ishidelabel
                containerclassname={this.state.displayOnly ? '' : 'dropdown-field'}
                className={this.state.displayOnly ? 'display-only' : ''}
                value={INVESTOR_PROFILE_FULL.fields.status.value}
                name="status"
                options={EMPLOYMENT_LIST}
                onChange={(e, result) => formChange(e, result, formName)}
              />
            </dd>
            {INVESTOR_PROFILE_FULL.fields.status.value === 'EMPLOYED' &&
              <Aux>
                <dt className="regular-text">Employer</dt>
                <dd>
                  <FormInput
                    containerclassname={this.state.displayOnly ? 'display-only' : ''}
                    className="compact"
                    readOnly={this.state.displayOnly}
                    name="employer"
                    fielddata={INVESTOR_PROFILE_FULL.fields.employer}
                    value={INVESTOR_PROFILE_FULL.fields.employer.value}
                    changed={(e, result) => formChange(e, result, formName)}
                    ishidelabel
                  />
                </dd>
                <dt className="regular-text">Position</dt>
                <dd>
                  <FormInput
                    containerclassname={this.state.displayOnly ? 'display-only' : ''}
                    className="compact"
                    readOnly={this.state.displayOnly}
                    name="position"
                    fielddata={INVESTOR_PROFILE_FULL.fields.position}
                    value={INVESTOR_PROFILE_FULL.fields.position.value}
                    changed={(e, result) => formChange(e, result, formName)}
                    ishidelabel
                  />
                </dd>
              </Aux>
            }
            <Divider hidden />
            <dt>Brokerage employment</dt>
            <dd className={!this.state.displayOnly ? 'visible-dropdown' : ''}>
              <FormDropDown
                readOnly={this.state.displayOnly}
                fielddata={INVESTOR_PROFILE_FULL.fields.brokerageEmployment}
                compact
                selection
                ishidelabel
                containerclassname={this.state.displayOnly ? '' : 'dropdown-field'}
                className={this.state.displayOnly ? 'display-only' : ''}
                value={INVESTOR_PROFILE_FULL.fields.brokerageEmployment.value}
                name="brokerageEmployment"
                options={BROKERAGE_EMPLOYMENT_LIST}
                onChange={(e, result) => formChange(e, result, formName)}
              />
            </dd>
            {INVESTOR_PROFILE_FULL.fields.brokerageEmployment.value === 'yes' &&
              <Aux>
                <dt className="regular-text">Member Firm Name</dt>
                <dd>
                  <FormInput
                    containerclassname={this.state.displayOnly ? 'display-only' : ''}
                    className="compact"
                    readOnly={this.state.displayOnly}
                    name="brokerageFirmName"
                    fielddata={INVESTOR_PROFILE_FULL.fields.brokerageFirmName}
                    value={INVESTOR_PROFILE_FULL.fields.brokerageFirmName.value}
                    changed={(e, result) => formChange(e, result, formName)}
                    ishidelabel
                  />
                </dd>
              </Aux>
            }
            <Divider hidden />
            <dt>Public Company Relations</dt>
            <dd className={!this.state.displayOnly ? 'visible-dropdown' : ''}>
              <FormDropDown
                readOnly={this.state.displayOnly}
                fielddata={INVESTOR_PROFILE_FULL.fields.publicCompanyRel}
                compact
                selection
                ishidelabel
                containerclassname={this.state.displayOnly ? '' : 'dropdown-field'}
                className={this.state.displayOnly ? 'display-only' : ''}
                value={INVESTOR_PROFILE_FULL.fields.publicCompanyRel.value}
                name="publicCompanyRel"
                options={PUBLIC_COMPANY_REL_LIST}
                onChange={(e, result) => formChange(e, result, formName)}
              />
            </dd>
            {INVESTOR_PROFILE_FULL.fields.publicCompanyRel.value === 'yes' &&
              <Aux>
                <dt className="regular-text">Ticker Symbol</dt>
                <dd>
                  <FormInput
                    containerclassname={this.state.displayOnly ? 'display-only' : ''}
                    className="compact"
                    readOnly={this.state.displayOnly}
                    name="publicCompanyTicker"
                    fielddata={INVESTOR_PROFILE_FULL.fields.publicCompanyTicker}
                    value={INVESTOR_PROFILE_FULL.fields.publicCompanyTicker.value}
                    changed={(e, result) => formChange(e, result, formName)}
                    ishidelabel
                  />
                </dd>
              </Aux>
            }
            <Divider hidden />
            <dt>Financial status</dt>
            <dd className={!this.state.displayOnly ? 'visible-dropdown' : ''}>
              <FormDropDown
                readOnly={this.state.displayOnly}
                fielddata={INVESTOR_PROFILE_FULL.fields.taxFilingAs}
                selection
                compact
                ishidelabel
                containerclassname={this.state.displayOnly ? '' : 'dropdown-field'}
                className={this.state.displayOnly ? 'display-only' : ''}
                value={INVESTOR_PROFILE_FULL.fields.taxFilingAs.value}
                name="taxFilingAs"
                options={INVESTOR_PROFILE_LIST}
                onChange={(e, result) => formChange(e, result, formName)}
              />
            </dd>
            <dt className="regular-text">Net Worth</dt>
            <dd>
              <MaskedInput
                displayMode={this.state.displayOnly}
                name="netWorth"
                wrapperClass="ui input compact"
                fielddata={INVESTOR_PROFILE_FULL.fields.netWorth}
                changed={(values, name) => maskChange(values, formName, name)}
                currency
                prefix="$"
                hidelabel
              />
            </dd>
            {map(yearValues.annualIncomePreviousYear, (year, key) => (
              <Aux>
                <dt className="regular-text">Annual Income {year}</dt>
                <dd>
                  <MaskedInput
                    displayMode={this.state.displayOnly}
                    name={key}
                    wrapperClass="ui input compact"
                    fielddata={INVESTOR_PROFILE_FULL.fields[key]}
                    changed={(values, name) => maskChange(values, formName, name)}
                    currency
                    prefix="$"
                    hidelabel
                  />
                </dd>
              </Aux>
            ))
            }
            <Divider hidden />
            <dt>Investment experience</dt>
            <dd className={!this.state.displayOnly ? 'visible-dropdown' : ''}>
              <FormDropDown
                readOnly={this.state.displayOnly}
                fielddata={INVESTOR_PROFILE_FULL.fields.experienceLevel}
                compact
                selection
                ishidelabel
                containerclassname={this.state.displayOnly ? '' : 'dropdown-field'}
                className={this.state.displayOnly ? 'display-only' : ''}
                value={INVESTOR_PROFILE_FULL.fields.experienceLevel.value}
                name="experienceLevel"
                options={INVESTMENT_EXPERIENCE_LIST}
                onChange={(e, result) => formChange(e, result, formName)}
              />
            </dd>
          </dl>
          {['isComfortable', 'isRiskTaker'].map(field => (
            <FormCheckbox
              readOnly={this.state.displayOnly}
              fielddata={INVESTOR_PROFILE_FULL.fields[field]}
              name={field}
              changed={experiencesEditChange}
              defaults
              containerclassname="ui relaxed list"
            />
          ))
          }
          {!this.state.displayOnly && !isInvestmentExperienceValid &&
            <p className="negative-text">
              NextSeed investments are suitable for experienced investors
              are comfortable with long-term risk.
              Please confirm that you fit this profile in order to proceed.
            </p>
          }
          {!this.state.displayOnly && !isInvestmentExperienceValid &&
            <p className="negative-text">
              Otherwise, please reference our <Link to="/app/resources/welcome-packet">Education Center </Link>
              to learn more about investing on NextSeed.
            </p>
          }
        </Form>
      </Card>
    );
  }
}
