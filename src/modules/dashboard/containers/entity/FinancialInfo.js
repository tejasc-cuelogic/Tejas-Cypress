import React, { Component } from 'react';
import { Header, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import validationActions from '../../../../actions/validation';

// const panes = [
//   {
//     menuItem: <Menu.Item key="yes"><div className="account-tab">Yes</div></Menu.Item>,
//   },
//   {
//     menuItem: <Menu.Item key="no"><div className="account-tab">No</div></Menu.Item>,
//   },
// ];

@inject('accountStore')
@observer
export default class AccountType extends Component {
  handleIsEntityTrust = (e, { activeIndex }) => {
    this.props.accountStore.setIsEntityTrust(activeIndex);
  }
  handleDateChange = (date) => {
    validationActions.validateEntityAccountField('dateOfTrust', date);
  }
  render() {
    const { entityAccount } = this.props.accountStore;
    return (
      <div>
        <Header as="h1" textAlign="center">Is entity a trust?</Header>
        <Header as="h4" textAlign="center">Lorem psum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud</Header>
        {/* <Grid textAlign="center">
          <Tab
            className="account-type-tab"
            menu={{
              secondary: true,
              pointing: true,
              className: 'item two',
              fluid: true,
              stackable: true,
            }}
            panes={panes}
            activeIndex={entityAccount.isEntityTrust.value.activeIndex}
            onTabChange={this.handleIsEntityTrust}
          />
        </Grid> */}
        <Form error>
          <Form.Group inline className="button-radio center-align">
            <Form.Radio label="Yes" value="yes" onChange={this.handleChange} />
            <Form.Radio label="No" value="no" onChange={this.handleChange} />
          </Form.Group>
          <div className="field-wrap">
            <Form.Field>
              { /*  eslint-disable jsx-a11y/label-has-for */ }
              <label>
                {entityAccount.dateOfTrust.label}
              </label>
              <DatePicker
                showMonthDropdown
                showYearDropdown
                placeholderText={entityAccount.dateOfTrust.placeHolder}
                dateFormat="MM-DD-YYYY"
                maxDate={moment()}
                selected={entityAccount.dateOfTrust.value}
                onChange={this.handleDateChange}
              />
            </Form.Field>
          </div>
        </Form>
      </div>
    );
  }
}
