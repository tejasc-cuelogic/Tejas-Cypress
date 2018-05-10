import React from 'react';
import { inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Header, Button, Item } from 'semantic-ui-react';
import Banklogo from '../../../../assets/images/boa-logo.jpg';
import Helper from '../../../../helper/utility';

@inject('individualAccountStore')
export default class CreateAccount extends React.Component {
  finalizeAccount = (e) => {
    e.preventDefault();
    this.props.individualAccountStore.finalizeAccount().then(() => {
      Helper.toast('Individual account has been finalized.', 'success');
    });
  }
  render() {
    const { nsAccId } = this.props.individualAccountStore;
    const { formAddFunds } = this.props.individualAccountStore;
    return (
      <div>
        <Header as="h1" textAlign="center">Link Bank Account</Header>
        <Header as="h4" textAlign="center">Lorem psum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Header>
        <div className="summary-wrap">
          <div className="field-wrap">
            <Header as="h3" textAlign="center">Linked Bank Account</Header>
            <Item.Group>
              <Item>
                <Item.Image size="small" src={Banklogo} />
                <Item.Content verticalAlign="middle" className="right-align">
                  <Link to="/app/dashboard" className="link"><b>Change</b></Link>
                  <Item.Description>
                    <h5>{nsAccId}</h5>
                  </Item.Description>
                </Item.Content>
              </Item>
            </Item.Group>
            <Header as="h3" textAlign="center">Funds that will be added</Header>
            <p className="center-align">${formAddFunds.fields.value.value}</p>
          </div>
        </div>
        <div className="center-align">
          <Button primary size="large" onClick={this.finalizeAccount}>Create the account</Button>
        </div>
      </div>
    );
  }
}
