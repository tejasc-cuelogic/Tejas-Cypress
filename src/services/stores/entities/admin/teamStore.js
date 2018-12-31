import { observable, action, computed, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { sortBy } from 'lodash';
import { GqlClient as client } from '../../../../api/publicApi';
import { allTeamMembers } from '../../queries/Team';

export class TeamStore {
    @observable data = [];
    @action
    initRequest = () => {
      const query = allTeamMembers;
      this.data = graphql({
        client,
        query,
      });
    }

    @computed get teamMembers() {
      return (this.data.data && sortBy(toJS(this.data.data.teamMembers), ['order'])) || [];
    }

    @computed get loading() {
      return this.data.loading;
    }
}


export default new TeamStore();
