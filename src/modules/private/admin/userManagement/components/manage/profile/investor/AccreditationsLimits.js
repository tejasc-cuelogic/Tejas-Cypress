import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { get, startCase } from 'lodash';
import { Header, Icon, Form, Divider } from 'semantic-ui-react';
import Helper from '../../../../../../../../helper/utility';
import { DataFormatter } from '../../../../../../../../helper';
import { ACCREDITATION_METHOD_ENUMS, ACCREDITATION_NETWORTH_LABEL } from '../../../../../../../../services/constants/accreditation';
import { ACCREDITATION_STATUS_LABEL } from '../../../../../../../../services/constants/investmentLimit';
import { NEXTSEED_BOX_URL } from '../../../../../../../../constants/common';

@inject('userDetailsStore', 'investmentLimitStore', 'accreditationStore')
@observer
export default class AccreditationsLimits extends Component {
  constructor(props) {
    super(props);
    const { getDetailsOfUser } = this.props.userDetailsStore;
    this.props.accreditationStore.getUserAccreditation(get(getDetailsOfUser, 'id'), false).then(() => {
      this.props.accreditationStore.initiateAccreditation();
    });
  }

  render() {
    const { getActiveAccountList } = this.props.investmentLimitStore;
    const { getDetailsOfUser } = this.props.userDetailsStore;
    const { accreditationData } = this.props.accreditationStore;
    return (
      <Form>
        {getActiveAccountList && getActiveAccountList.accountList.length
          && getActiveAccountList.accountList.map(account => (
            <>
              <Header as="h4">
                {account.name === 'ira' && getActiveAccountList.isIndAccExist
                  ? (
                    <>
                      <Icon color="teal" className="ns-individual-line" /><Icon color="teal" className={`ns-${account.name}-line`} /> Individual & {account.name.toUpperCase()} Limits
                </>
                  )
                  : (
                    <>
                      <Icon color="teal" className={`ns-${account.name}-line`} /> {account.name === 'ira' ? account.name.toUpperCase() : startCase(account.name)} Limits
                </>
                  )
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
              {(get(accreditationData[account.name], 'status'))
                && (
                  <>
                    <Header as="h6">
                      Accreditation
                      <Header.Subheader>Verify accreditation</Header.Subheader>
                    </Header>
                    <div className="bg-offwhite">
                      <dl className="dl-horizontal">
                        <dt>Status :</dt>
                        <b><dd className={`${(get(accreditationData[account.name], 'status') === 'CONFIRMED' && get(accreditationData[account.name], 'expiration') && (DataFormatter.diffDays(DataFormatter.formatedDate(get(accreditationData[account.name], 'expiration')), false, true) < 0)) ? 'negative' : get(accreditationData[account.name], 'status') === 'REQUESTED' ? 'warning' : get(accreditationData[account.name], 'status') === 'CONFIRMED' ? 'positive' : ['INVALID', 'EXPIRED'].includes(get(accreditationData[account.name], 'status')) ? 'negative' : ''}-text`}>{get(accreditationData[account.name], 'status') === 'CONFIRMED' && get(accreditationData[account.name], 'expiration') && (DataFormatter.diffDays(DataFormatter.formatedDate(get(accreditationData[account.name], 'expiration')), false, true) < 0) ? 'Expired' : get(accreditationData[account.name], 'status') ? ACCREDITATION_STATUS_LABEL[get(accreditationData[account.name], 'status')] : 'N/A'}</dd></b>
                      </dl>
                      {accreditationData[account.name].status === 'INVALID'
                        ? (
                          <dl className="dl-horizontal">
                            <dt>Message :</dt>
                            <dd>{get(accreditationData[account.name], 'reviewed.message') || 'N/A'}</dd>
                          </dl>
                        ) : ''
                      }
                      <Form.Group widths={4}>
                        <Form.Input fluid label="Accredited with" placeholder="Accredited with" value={get(ACCREDITATION_METHOD_ENUMS, get(accreditationData[account.name], 'method')) || 'N/A'} readOnly className="display-only" />
                        {get(accreditationData[account.name], 'netWorth') && <Form.Input fluid label="Net worth" placeholder="Net worth" value={Helper.MoneyMathDisplayCurrency(get(ACCREDITATION_NETWORTH_LABEL, get(accreditationData[account.name], 'netWorth')))} readOnly className="display-only" />}
                        <Form.Input fluid label="Income evidence type" placeholder="Income evidence type" value={get(accreditationData[account.name], 'assetsUpload[0]') ? 'Uploaded document' : get(accreditationData[account.name], 'verifier') ? 'verifier' : 'N/A'} readOnly className="display-only" />
                        {get(accreditationData[account.name], 'assetsUpload[0]')
                          // eslint-disable-next-line jsx-a11y/label-has-for
                          ? <div className="field display-only"><label>Income evidence doc</label><div className="ui fluid input">{get(accreditationData[account.name], 'assetsUpload[0].fileInfo[0].fileHandle.boxFolderId') ? (<a href={`${NEXTSEED_BOX_URL}folder/${get(accreditationData[account.name], 'assetsUpload[0].fileInfo[0].fileHandle.boxFolderId')}`} className="link" rel="noopener noreferrer" target="_blank">Uploads</a>) : 'N/A'}</div></div>
                          : (
                            <>
                              <Form.Input fluid label="Role" placeholder="Role" value={get(accreditationData[account.name], 'verifier.role') || 'N/A'} title={get(accreditationData[account.name], 'verifier.role') || 'N/A'} readOnly className="display-only" />
                              <Form.Input fluid label="Email" placeholder="Email" value={get(accreditationData[account.name], 'verifier.email') || 'N/A'} title={get(accreditationData[account.name], 'verifier.email') || 'N/A'} readOnly className="display-only" />
                            </>
                          )
                        }
                      </Form.Group>
                    </div>
                    <Divider />
                  </>
                )
              }
            </>
          ))}
      </Form>
    );
  }
}
