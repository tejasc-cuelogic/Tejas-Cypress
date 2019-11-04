import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, withRouter } from 'react-router-dom';
import { Container, Header, Card } from 'semantic-ui-react';
import { InlineLoader } from '../../../../../../theme/shared';
import EmailContent from '../../../../shared/EmailContent';
import EmailsListing from '../../../../shared/EmailsListing';

@inject('userDetailsStore')
@withRouter
@observer
export default class UserEmailList extends Component {
  constructor(props) {
    super(props);
    this.props.userDetailsStore.getEmailList();
  }

  handleModel = (e, dataObj) => {
    e.preventDefault();
    this.props.history.push(`${this.props.match.url}/${dataObj.recipientId}/${dataObj.requestDate}`);
  };

  render() {
    const { userDetailsStore, match } = this.props;
    const { userEmails, emailListOutputLoading } = userDetailsStore;
    return (
      <>
        <Route
          path={`${match.url}/:id/:requestDate`}
          render={props => <EmailContent overrideTop refLink={match.url} {...props} />
          }
        />
        {emailListOutputLoading ? <InlineLoader />
          : (
            <>
              <Header as="h4">Email List</Header>
              <Container as={!this.props.admin ? Card : false} fluid>
              <EmailsListing emailList={userEmails} displyNoEmails handleModel={this.handleModel} />
              </Container>
            </>
          )}
      </>
    );
  }
}
