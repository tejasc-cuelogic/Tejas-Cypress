import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Switch } from 'react-router-dom';
import ManageKnowledgeBase from './containers/ManageKnowledgeBase';
// import KnowledgeBaseDetails from './containers/KnowledgeBaseDetails';
import EditKnowledgeBaseItem from './components/EditKnowledgeBaseItem';

@inject('knowledgeBaseStore')
@observer
export default class KnowledgeBase extends Component {
  componentWillMount() {
    if (!this.props.knowledgeBaseStore.categoriesLoaded) {
      this.props.knowledgeBaseStore.getCategoryList(false);
    }
  }
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}`} component={ManageKnowledgeBase} />
        <Route exact path={`${match.url}/:id/:status`} render={() => <EditKnowledgeBaseItem refLink={match.url} {...this.props} />} />
      </Switch>
    );
  }
}
