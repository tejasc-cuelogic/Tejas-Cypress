import React from 'react';
import { Link } from 'react-router-dom';
import { Header, Button, Item } from 'semantic-ui-react';
import Banklogo from '../../../../assets/images/boa-logo.jpg';

export default class CreateAccount extends React.Component {
  render() {
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
                  <Link to="" className="link"><b>Change</b></Link>
                  <Item.Description>
                    <h5>...5648</h5>
                  </Item.Description>
                </Item.Content>
              </Item>
            </Item.Group>
          </div>
        </div>
        <div className="center-align">
          <Button color="green" size="large">Create the account</Button>
        </div>
      </div>
    );
  }
}
