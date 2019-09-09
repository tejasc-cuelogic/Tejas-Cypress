import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Switch } from 'react-router-dom';
import ManageKnowledgeBase from './containers/ManageKnowledgeBase';
// import KnowledgeBaseDetails from './containers/KnowledgeBaseDetails';
import EditKnowledgeBaseItem from './components/EditKnowledgeBaseItem';

@inject('knowledgeBaseStore')
@observer
export default class KnowledgeBase extends Component {
  constructor(props) {
    super(props);
    if (!this.props.knowledgeBaseStore.categoriesLoaded) {
      this.props.knowledgeBaseStore.getCategoryList(false);
      this.props.knowledgeBaseStore.toggleSearch();
    }
  }

  render() {
    const { match, refMatch } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}`} render={props => <ManageKnowledgeBase refMatch={refMatch} {...props} />} />
        <Route exact path={`${match.url}/:id/:status/:userType?/:categoryId?`} render={props => <EditKnowledgeBaseItem refLink={match.url} {...props} />} />
      </Switch>
    );
  }
}
