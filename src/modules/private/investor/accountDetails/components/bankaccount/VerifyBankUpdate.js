/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { includes } from 'lodash';
import { Modal, Header, Divider, Button } from 'semantic-ui-react';

@withRouter
@observer
export default class VerifyBankUpdate extends Component {
  handleCloseModal = (e) => {
    e.stopPropagation();
    const accountType = includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity';
    const redirectUrl = `/app/account-details/${accountType}/bank-accounts`;
    this.props.history.push(redirectUrl);
  }
  render() {
    return (
      <Modal size="mini" open closeIcon onClose={this.handleCloseModal} closeOnDimmerClick={false}>
        <Modal.Content className="center-align">
          <Header as="h3" textAlign="center" className="mt-20">Confirmed</Header>
          <p className="center-align mb-30">Your update is being reviewed and processed.</p>
          <Divider hidden />
          <Button primary className="very relaxed" content="Continue" onClick={this.handleCloseModal} />
          {/* <p className="positive-text mb-20"><b>To verify authenticity, a GoldStar
          representative will greet you with the following prompt:</b></p>
          <p className="caption-note mb-40">
            Hello, my name is &lt;Name&gt; with GoldStar Trust Company… a partner
            (who works alongside) with NextSeed. We provide support and have custody
            of your account. NextSeed supplied us with bank information <br /> and we just need to
            verify with you the information we received.
          </p>
          <div className="center-align">
            <div className="goldstar-info">
              <p className="positive-text">Or, you can call GoldStar directly to complete
              the verification process.</p>
              <dl className="dl-horizontal">
                <dt>Contact:</dt>
                <dd>Cara Simmons, New Business Specialist</dd>
                <dt>Phone:</dt>
                <dd>1-800-486-6888, x2009  or 806-354-3809</dd>
                <dt>Hours:</dt>
                <dd>Monday-Friday, 8:30am - 4:30pm (Central Standard Time)</dd>
              </dl>
            </div>
          </div> */}
        </Modal.Content>
      </Modal>
    );
  }
}
