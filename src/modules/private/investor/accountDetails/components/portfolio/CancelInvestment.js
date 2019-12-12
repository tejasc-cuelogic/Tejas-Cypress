import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import { find, toInteger } from 'lodash';
import { Modal, Button, Header, Form, Message, Icon, Checkbox } from 'semantic-ui-react';
import OfferingInvestDetails from './financialInfo/OfferingInvestDetails';
import { ListErrors } from '../../../../../../theme/shared';
import { FormTextarea, FormDropDown } from '../../../../../../theme/form';
import { VOID_TYPE } from '../../../../../../services/constants/investment';

@inject('uiStore', 'portfolioStore')
@withRouter
@observer
export default class CancelInvestment extends Component {
  state = {
    btnCancel: '',
  }

  constructor(props) {
    super(props);
    const { setInitialLinkValue, setInvestmentDetailsForCancelRequest } = this.props.portfolioStore;
    setInitialLinkValue(false);
    setInvestmentDetailsForCancelRequest(null);
    this.props.uiStore.clearErrors();
  }

  componentDidMount() {
    const {
      getInvestorAccounts,
      setInvestmentDetailsForCancelRequest,
    } = this.props.portfolioStore;
    const pendingList = getInvestorAccounts && getInvestorAccounts.investments
      && getInvestorAccounts.investments.pending ? getInvestorAccounts.investments.pending : [];
    const investmentDetials = find(pendingList, { agreementId: toInteger(this.props.match.params.id) });
    if (this.props.isAdmin && !investmentDetials) {
      this.props.history.push(`${this.props.refLink}/investments`);
    }
    setInvestmentDetailsForCancelRequest(investmentDetials);
  }

  submit = (e) => {
    e.preventDefault();
    const { cancelAgreement } = this.props.portfolioStore;
    const buttonValue = this.state.btnCancel;
    if (buttonValue === 'btnCancel') {
      cancelAgreement(this.props.match.params.id, this.props.isAdmin);
    } else {
      const location = `${this.props.refLink}/${this.props.isAdmin ? 'investments' : 'preview'}`;
      this.props.history.push(location);
    }
  }

  handleCloseModal = (e) => {
    e.preventDefault();
    this.props.history.goBack();
  }

  handleClick = (val) => {
    this.setState({ btnCancel: val });
  }

  render() {
    const { inProgress, errors, responsiveVars } = this.props.uiStore;
    const {
      isCancelShowLink,
      getInvestorAccounts,
      canceledInvestmentDetails,
      CANCEL_INVESTMENT_FRM,
      formChange,
    } = this.props.portfolioStore;
    const pendingList = getInvestorAccounts && getInvestorAccounts.investments
      && getInvestorAccounts.investments.pending ? getInvestorAccounts.investments.pending : [];
    const investmentDetials = find(pendingList, { agreementId: toInteger(this.props.match.params.id) });
    const investmentOfferingDetails = investmentDetials || canceledInvestmentDetails;
    return (
      <Modal size="small" open closeIcon onClose={this.handleCloseModal} closeOnRootNodeClick={false}>
        <Modal.Content className="signup-content relaxed">
          <Header as="h3" className="center-align">{!isCancelShowLink ? 'Do you want to cancel this investment?' : 'Investment has been canceled.'}</Header>
          <OfferingInvestDetails
            offering={investmentOfferingDetails || null}
            accType={this.props.accType}
            disabledClass={isCancelShowLink ? 'disabled' : ''}
          />
          {!isCancelShowLink
            ? (
              <Form error={errors && errors.length} onSubmit={this.submit} className="center-align">
                {this.props.isAdmin
                  ? (
                      <>
                        <Header className="mb-half" as="h6">Void Type</Header>
                        <FormDropDown
                          ishidelabel
                          fielddata={CANCEL_INVESTMENT_FRM.fields.voidType}
                          className="secondary"
                          name="voidType"
                          placeholder="Choose"
                          fluid
                          selection
                          options={VOID_TYPE}
                          onChange={(e, result) => formChange(e, result, 'CANCEL_INVESTMENT_FRM')}
                        />
                        <FormTextarea
                          containerclassname="secondary"
                          name="voidReason"
                          fielddata={CANCEL_INVESTMENT_FRM.fields.voidReason}
                          changed={(e, result) => formChange(e, result, 'CANCEL_INVESTMENT_FRM')}
                        />
                        <Checkbox
                          className="field"
                          label={CANCEL_INVESTMENT_FRM.fields.sendNotification.label}
                          name="sendNotification"
                          checked={CANCEL_INVESTMENT_FRM.fields.sendNotification.value}
                          onChange={(e, result) => formChange(e, result, 'CANCEL_INVESTMENT_FRM')}
                        />
                    </>
                  ) : ''
                }
                {errors
                  && (
                    <Message error className="mt-30">
                      <ListErrors errors={[errors]} />
                    </Message>
                  )
                }
                <Button.Group className="center-align mt-30" vertical={responsiveVars.isMobile}>
                  <Button color="green" id="btnNotCancel" onClick={() => { this.handleClick('btnNotCancel'); }}>No, keep investment</Button>
                  <Button loading={inProgress} color="red" id="btnCancel" onClick={() => { this.handleClick('btnCancel'); }}>Yes, cancel investment</Button>
                </Button.Group>
              </Form>
            )
            : (
              <div className="center-align mt-30">
                <Link to={this.props.isAdmin ? `${this.props.refLink}/investments` : '/app/account-details/individual/portfolio'} className="back-link"><Icon className="ns-arrow-right" />Go to My Dashboard</Link>
              </div>
            )
          }
        </Modal.Content>
      </Modal>
    );
  }
}
