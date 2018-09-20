import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Button, Confirm } from 'semantic-ui-react';
import { Switch, Route } from 'react-router-dom';
import SecondaryMenu from '../../../../../../../theme/layout/SecondaryMenu';
import Helper from '../../../../../../../helper/utility';
import AfIssuer from './AfIssuer';

@inject('offeringCreationStore')
@observer
export default class AffiliatedIssuer extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.push(`${this.props.match.url}/1`);
      console.log(this.props.match.url.substr(this.props.match.url.lastIndexOf('/') + 1));
    }
  }
  addMore = (e, formName) => {
    e.preventDefault();
    this.props.offeringCreationStore.addMore(formName);
  }
  toggleConfirmModal = (e, index, formName) => {
    e.preventDefault();
    this.props.offeringCreationStore.toggleConfirmModal(index, formName);
  }
  removeData = (confirmModalName) => {
    this.props.offeringCreationStore.removeData(confirmModalName);
    Helper.toast('Affiliated issuer has been deleted successfully.', 'success');
    this.props.history.push(`${this.props.match.url}/1`);
  }
  render() {
    const {
      AFFILIATED_ISSUER_FRM,
      confirmModal,
      confirmModalName,
    } = this.props.offeringCreationStore;
    const navItems = [];
    AFFILIATED_ISSUER_FRM.fields.data.map((issuer, index) => {
      navItems.push({ title: `Afiiliated Issuer ${index + 1}`, to: `${index + 1}` });
      return navItems;
    });
    const { match } = this.props;
    const formName = 'AFFILIATED_ISSUER_FRM';
    return (
      <Aux>
        <div>
          <SecondaryMenu secondary match={match} navItems={navItems} />
          <Button.Group>
            <Button size="small" color="red" className="link-button mt-20" onClick={e => this.toggleConfirmModal(e, formName)}> Delete Selected Issuer</Button>
            <Button size="small" color="blue" className="link-button mt-20" onClick={e => this.addMore(e, formName)}>+ Add Affiliated Issuer</Button>
          </Button.Group>
        </div>
        <Switch>
          <Route
            exact
            path={match.url}
            render={props =>
              <AfIssuer refLink={match.url} {...props} index={0} />}
          />
          {
            navItems.map((item, index) => (
              <Route exact={false} key={item.to} path={`${match.url}/${item.to}`} render={props => <AfIssuer refLink={match.url} {...props} index={index || 0} />} />
            ))
          }
        </Switch>
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this issuer?"
          open={confirmModal}
          onCancel={this.toggleConfirmModal}
          onConfirm={() => this.removeData(confirmModalName)}
          size="mini"
          className="deletion"
        />
      </Aux>
    );
  }
}
