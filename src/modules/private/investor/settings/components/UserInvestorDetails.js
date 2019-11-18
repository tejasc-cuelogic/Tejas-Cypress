import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { map, get } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Card, Header, Divider, Form, Button } from 'semantic-ui-react';
import Helper from '../../../../../helper/utility';
import { INVESTMENT_EXPERIENCE_LIST, EMPLOYMENT_LIST, BROKERAGE_EMPLOYMENT_LIST, PUBLIC_COMPANY_REL_LIST, INVESTOR_PROFILE_LIST } from '../../../../../constants/account';
import formHOC from '../../../../../theme/form/formHOC';

const metaInfo = {
  store: 'investorProfileStore',
  form: 'INVESTOR_PROFILE_FULL',
};
@inject('investorProfileStore', 'userDetailsStore')
@observer
class UserInvestorDetails extends Component {
  constructor(props) {
    super(props);
    const { investorProfileData } = this.props;
    const { setInvestorDetailInfo } = this.props.investorProfileStore;
    if (this.props.isAdmin) {
      const investorProfileDataAdmin = get(this.props.userDetailsStore, 'getDetailsOfUser.investorProfileData');
      setInvestorDetailInfo(investorProfileDataAdmin);
    } else {
      setInvestorDetailInfo(investorProfileData);
    }
    this.state = { displayOnly: true };
  }

  toogleField = (e) => {
    e.preventDefault();
    const { investorProfileData } = this.props;
    const {
      setInvestorDetailInfo,
    } = this.props.investorProfileStore;
    if (this.props.isAdmin) {
      const investorProfileDataAdmin = get(this.props.userDetailsStore, 'getDetailsOfUser.investorProfileData');
      setInvestorDetailInfo(investorProfileDataAdmin);
    } else {
      setInvestorDetailInfo(investorProfileData);
    }
    this.setState({ displayOnly: !this.state.displayOnly });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { updateInvestorEditProfileData } = this.props.investorProfileStore;
    updateInvestorEditProfileData();
    this.setState({ displayOnly: !this.state.displayOnly });
  }

  render() {
    const {
      INVESTOR_PROFILE_FULL,
      isInvestmentExperienceValid,
    } = this.props.investorProfileStore;
    const yearValues = Helper.getLastThreeYearsLabel();
    const { smartElement } = this.props;

    const commonProps = {
      readOnly: get(this.state, 'displayOnly'),
      ishidelabel: true,
    };
    const dropDownProps = {
      containerclassname: get(this.state, 'displayOnly') ? '' : 'dropdown-field',
      className: get(this.state, 'displayOnly') ? 'display-only' : '',
      compact: true,
      selection: true,
      ...commonProps,
    };

    const formInputProps = {
      containerclassname: get(this.state, 'displayOnly') ? 'display-only' : '',
      className: 'compact',
      ...commonProps,
    };

    const MaskedInputProps = {
      wrapperClass: 'ui input compact',
      prefix: '$',
      hidelabel: true,
      readOnly: get(this.state, 'displayOnly'),
    };

    return (
      <Card fluid className="form-card">
        <Form>
          <Header as="h5">Investor Profile
            {!this.props.isAdmin && (get(this.state, 'displayOnly')
              ? <Link to={`${this.props.match.url}`} className="link pull-right regular-text" onClick={this.toogleField}><small>Edit information</small></Link>
              : (
                <Button.Group floated="right" size="mini" compact>
                  <Button as={Link} content="Cancel" to={`${this.props.match.url}`} onClick={this.toogleField} />
                  <Button
                    primary
                    onClick={this.handleSubmit}
                    disabled={!(INVESTOR_PROFILE_FULL.meta.isValid && isInvestmentExperienceValid)}
                  >
                    Update
                </Button>
                </Button.Group>
              ))
            }
          </Header>
          <dl className="dl-horizontal">
            <dt>Employment status</dt>
            <dd className={!get(this.state, 'displayOnly') ? 'visible-dropdown' : ''}>
              {smartElement.FormDropDown('status', { options: EMPLOYMENT_LIST, ...dropDownProps })}
            </dd>
            {INVESTOR_PROFILE_FULL.fields.status.value === 'EMPLOYED'
              && (
                <>
                  <dt className="regular-text">Employer</dt>
                  <dd>
                    {smartElement.Input('employer', { ...formInputProps })}
                  </dd>
                  <dt className="regular-text">Position</dt>
                  <dd>
                    {smartElement.Input('position', { ...formInputProps })}
                  </dd>
                </>
              )
            }
            <Divider hidden />
            <dt>Brokerage employment</dt>
            <dd className={!get(this.state, 'displayOnly') ? 'visible-dropdown' : ''}>
              {smartElement.FormDropDown('brokerageEmployment', { options: BROKERAGE_EMPLOYMENT_LIST, ...dropDownProps })}
            </dd>
            {INVESTOR_PROFILE_FULL.fields.brokerageEmployment.value === 'yes'
              && (
                <>
                  <dt className="regular-text">Member Firm Name</dt>
                  <dd>
                    {smartElement.Input('brokerageFirmName', { ...formInputProps })}
                  </dd>
                </>
              )
            }
            <Divider hidden />
            <dt>Public Company Relations</dt>
            <dd className={!get(this.state, 'displayOnly') ? 'visible-dropdown' : ''}>
              {smartElement.FormDropDown('publicCompanyRel', { options: PUBLIC_COMPANY_REL_LIST, ...dropDownProps })}
            </dd>
            {INVESTOR_PROFILE_FULL.fields.publicCompanyRel.value === 'yes'
              && (
                <>
                  <dt className="regular-text">Ticker Symbol</dt>
                  <dd>
                    {smartElement.Input('position', { ...formInputProps })}
                  </dd>
                </>
              )
            }
            <Divider hidden />
            <dt>Financial status</dt>
            <dd className={!get(this.state, 'displayOnly') ? 'visible-dropdown' : ''}>
              {smartElement.FormDropDown('taxFilingAs', { options: INVESTOR_PROFILE_LIST, ...dropDownProps })}
            </dd>
            <dt className="regular-text">Net Worth</dt>
            <dd>
              {smartElement.Masked('netWorth', { ...MaskedInputProps })}
            </dd>
            {map(yearValues.annualIncomePreviousYear, (year, key) => (
              <>
                <dt className="regular-text">Annual Income {year}</dt>
                <dd>
                  {smartElement.Masked(key, { ...MaskedInputProps })}
                </dd>
              </>
            ))
            }
            <Divider hidden />
            <dt>Investment experience</dt>
            <dd className={!get(this.state, 'displayOnly') ? 'visible-dropdown' : ''}>
              {smartElement.FormDropDown('experienceLevel', { options: INVESTMENT_EXPERIENCE_LIST, ...dropDownProps })}
            </dd>
          </dl>
          {['isComfortable', 'isRiskTaker'].map(field => (
            smartElement.FormCheckBox(field, { readOnly: get(this.state, 'displayOnly'), defaults: true, containerclassname: 'ui relaxed list' })
          ))
          }
          {!get(this.state, 'displayOnly') && !isInvestmentExperienceValid
            && (
              <p className="negative-text">
                NextSeed investments are suitable for experienced investors
                are comfortable with long-term risk.
                Please confirm that you fit this profile in order to proceed.
            </p>
            )
          }
          {!get(this.state, 'displayOnly') && !isInvestmentExperienceValid
            && (
              <p className="negative-text">
                Otherwise, please reference our <Link to="/app/resources/welcome-packet">Education Center </Link>
                to learn more about investing on NextSeed.
            </p>
            )
          }
        </Form>
      </Card>
    );
  }
}
export default formHOC(UserInvestorDetails, metaInfo);
