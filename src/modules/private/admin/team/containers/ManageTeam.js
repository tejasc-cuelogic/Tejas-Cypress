import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Grid, Button } from 'semantic-ui-react';
import PrivateLayout from '../../../shared/PrivateLayout';
import AllTeam from '../components/AllTeam';
import { ByKeyword as Search } from '../../../../../theme/form/Filters';

@inject('teamStore')
@observer
export default class ManageTeam extends Component {
  executeSearch = (e) => {
    this.props.teamStore.setInitiateSrch('keyword', e.target.value);
  }

  handleAddNewMember = () => {
    const { match } = this.props;
    const redirectURL = `${match.url}/new`;
    this.props.teamStore.reset();
    this.props.history.push(redirectURL);
  }

  render() {
    const { match } = this.props;
    const { requestState } = this.props.teamStore;
    return (
      <PrivateLayout
        refMatch={this.props.refMatch}
        {...this.props}
        P1={(
          <Search
            change={this.executeSearch}
            w={[11]}
            placeholder="Search by keyword or phrase"
            requestState={requestState}
            more="no"
            addon={(
              <Grid.Column width={5} textAlign="right">
                <Button color="green" onClick={this.handleAddNewMember} floated="right"> + Add new team member</Button>
              </Grid.Column>
)}
          />
)}
      >
        <AllTeam match={match} />
      </PrivateLayout>
    );
  }
}
