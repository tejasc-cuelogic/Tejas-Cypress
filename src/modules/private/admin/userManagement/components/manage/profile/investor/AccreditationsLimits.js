import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { get, startCase } from 'lodash';
import { Header, Icon, Form, Divider, Button } from 'semantic-ui-react';
import Helper from '../../../../../../../../helper/utility';
import { ACCREDITATION_METHOD_ENUMS, ACCREDITATION_NETWORTH_LABEL } from '../../../../../../../../services/constants/accreditation';
import { ACCREDITATION_STATUS_LABEL } from '../../../../../../../../services/constants/investmentLimit';

@inject('userDetailsStore', 'investmentLimitStore')
@observer
export default class AccreditationsLimits extends Component {
  render() {
    const { getActiveAccountList } = this.props.investmentLimitStore;
    const { getDetailsOfUser } = this.props.userDetailsStore;
    return (
      <Form>
        {getActiveAccountList && getActiveAccountList.accountList.length &&
        getActiveAccountList.accountList.map(account => (
          <Aux>
            <Header as="h4">
              {account.name === 'ira' && getActiveAccountList.isIndAccExist ?
                <Aux>
                  <Icon color="teal" className="ns-individual-line" /><Icon color="teal" className={`ns-${account.name}-line`} /> Individual & {account.name.toUpperCase()} Limits
                </Aux> :
                <Aux>
                  <Icon color="teal" className={`ns-${account.name}-line`} /> {account.name === 'ira' ? account.name.toUpperCase() : startCase(account.name)} Limits
                </Aux>
              }
              <Link to={this.props.match.url} className="link pull-right"><small><Icon className="ns-pencil" /> Edit</small></Link>
            </Header>
            <Header as="h6">Investment limits</Header>
            <Form.Group widths={2}>
              <Form.Input fluid label="Investment limit" placeholder="Investment limit" value={account.name === 'entity' ? Helper.MoneyMathDisplayCurrency(get(account, 'details.limits.limit')) : Helper.MoneyMathDisplayCurrency(get(getDetailsOfUser, 'limits.limit'))} readOnly className="display-only" />
              <Form.Input fluid label="Annual income" placeholder="Annual income" value={account.name === 'entity' ? Helper.MoneyMathDisplayCurrency(get(account, 'details.limits.income')) : Helper.MoneyMathDisplayCurrency(get(getDetailsOfUser, 'limits.income'))} readOnly className="display-only" />
              <Form.Input fluid label="Net Worth" placeholder="Net Worth" value={account.name === 'entity' ? Helper.MoneyMathDisplayCurrency(get(account, 'details.limits.netWorth')) : Helper.MoneyMathDisplayCurrency(get(getDetailsOfUser, 'limits.netWorth'))} readOnly className="display-only" />
              <Form.Input fluid label="Other Regulation Crowdfunding investment made in prior 12mths" placeholder="Other Regulation Crowdfunding investment made in prior 12mths" value={account.name === 'entity' ? Helper.MoneyMathDisplayCurrency(get(account, 'details.limits.otherContributions')) : Helper.MoneyMathDisplayCurrency(get(getDetailsOfUser, 'limits.otherContributions'))} readOnly className="display-only" />
            </Form.Group>
            <Divider />
            {(account.name === 'entity' ? get(account, 'details.accreditation.status') : get(getDetailsOfUser, 'accreditation.status')) &&
            <Aux>
              <Header as="h6">
                Accreditation
                <Header.Subheader>Verify accreditation submission</Header.Subheader>
              </Header>
              <div className="bg-offwhite">
                <Form.Group widths={4}>
                  <Form.Input fluid label="Accredited with" placeholder="Accredited with" value={get(ACCREDITATION_METHOD_ENUMS, [account.name === 'entity' ? get(account, 'details.accreditation.method') : get(getDetailsOfUser, 'accreditation.method')]) || 'N/A'} readOnly className="display-only" />
                  <Form.Input fluid label="Net worth" placeholder="Net worth" value={Helper.MoneyMathDisplayCurrency(get(ACCREDITATION_NETWORTH_LABEL, [account.name === 'entity' ? get(account, 'details.accreditation.netWorth') : get(getDetailsOfUser, 'accreditation.netWorth')]) || '0')} readOnly className="display-only" />
                  <Form.Input fluid label="Income evidence type" placeholder="Income evidence type" value="Uploaded document" readOnly className="display-only" />
                  <Form.Input fluid label="Income evidence doc" placeholder="Income evidence doc" value="evidence.pdf" readOnly className="display-only" />
                </Form.Group>
                <dl className="dl-horizontal">
                  <dt>Status :</dt>
                  <b><dd className={`${(account.name === 'entity' ? get(account, 'details.accreditation.status') : get(getDetailsOfUser, 'accreditation.status')) === 'REQUESTED' ? 'warning' : (account.name === 'entity' ? get(account, 'details.accreditation.status') : get(getDetailsOfUser, 'accreditation.status')) === 'CONFIRMED' ? 'positive' : (account.name === 'entity' ? get(account, 'details.accreditation.status') : get(getDetailsOfUser, 'accreditation.status')) === 'INVALID' ? 'negative' : ''}-text`}>{(account.name === 'entity' ? get(account, 'details.accreditation.status') : get(getDetailsOfUser, 'accreditation.status')) ? ACCREDITATION_STATUS_LABEL[(account.name === 'entity' ? get(account, 'details.accreditation.status') : get(getDetailsOfUser, 'accreditation.status'))] : 'N/A'}</dd></b>
                </dl>
                {((account.name === 'entity' && get(account, 'details.accreditation.status') === 'REQUESTED') || (account.name !== 'entity' && get(getDetailsOfUser, 'accreditation.status') === 'REQUESTED')) &&
                <Button.Group compact size="tiny" className="mt-10">
                  <Button as={Link} primary content="Accept" to={`${this.props.match.url}/CONFIRMED/${get(getDetailsOfUser, 'id')}${(account.name === 'entity' ? `/${get(account, 'details.accountId')}/ENTITY` : '')}`} />
                  <Button as={Link} color="red" content="Deny" to={`${this.props.match.url}/INVALID/${get(getDetailsOfUser, 'id')}${(account.name === 'entity' ? `/${get(account, 'details.accountId')}/ENTITY` : '')}`} />
                </Button.Group>
                }
              </div>
              <Divider />
            </Aux>
            }
          </Aux>
        ))}
      </Form>
    );
  }
}
