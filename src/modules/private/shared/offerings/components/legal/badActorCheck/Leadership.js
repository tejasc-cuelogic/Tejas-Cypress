import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Button, Confirm } from 'semantic-ui-react';
import { Switch, Route } from 'react-router-dom';
import SecondaryMenu from '../../../../../../../theme/layout/SecondaryMenu';
import Helper from '../../../../../../../helper/utility';
import Leader from './Leader';

@inject('offeringCreationStore')
@observer
export default class Leadership extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.push(`${this.props.match.url}/leader/1`);
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
    Helper.toast('Leader has been deleted successfully.', 'success');
    this.props.history.push(`${this.props.match.url}/leader/1`);
  }
  render() {
    const { LEADER_FRM, confirmModal, confirmModalName } = this.props.offeringCreationStore;
    const navItems = [];
    LEADER_FRM.fields.data.map((leader, index) => {
      navItems.push({ title: `Leader ${index + 1}`, to: `leader/${index + 1}` });
      return navItems;
    });
    const { match } = this.props;
    const formName = 'LEADER_FRM';
    return (
      <Aux>
        <div>
          <SecondaryMenu secondary match={match} navItems={navItems} />
          <Button.Group>
            <Button size="small" color="red" className="link-button mt-20" onClick={e => this.toggleConfirmModal(e, formName)}> Delete selected leader</Button>
            <Button size="small" color="blue" className="link-button mt-20" onClick={e => this.addMore(e, formName)}>+ Add another leader</Button>
          </Button.Group>
        </div>
        <Switch>
          <Route
            exact
            path={match.url}
            render={props =>
              <Leader refLink={match.url} {...props} index={0} />}
          />
          {
            navItems.map((item, index) => (
              <Route exact={false} key={item.to} path={`${match.url}/${item.to}`} render={props => <Leader refLink={match.url} {...props} index={index || 0} />} />
            ))
          }
        </Switch>
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this leader?"
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
