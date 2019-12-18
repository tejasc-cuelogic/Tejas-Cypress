import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { get } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Grid } from 'semantic-ui-react';
import AccordionList from './AccordionList';
import DocumentDetails from './DocumentDetails';
import { InlineLoader } from '../../../../../theme/shared';

@inject('offeringsStore', 'campaignStore')
@observer
export default class KnowledgeBase extends Component {
  search = (e) => {
    this.props.educationStore.setSrchParam(e.target.value);
    if (this.props.location.pathname !== '/dashboard/resources/faq') {
      this.props.history.replace('/dashboard/resources/faq');
    }
  }

  render() {
    const { match, offeringsStore, campaignStore } = this.props;
    const { closingBinderDocs } = offeringsStore;
    const { getBoxLink, documentMeta } = campaignStore;
    if (closingBinderDocs.length === 0) {
      return <InlineLoader text="No data found." />;
    }
    return (
      <div>
        <Grid>
          <Grid.Row>
            <Grid.Column widescreen={7} largeScreen={7} computer={16} tablet={16} mobile={16}>
              <AccordionList objKey="closingBinder" documentMeta={documentMeta} title="Closing Binder" match={match} data={closingBinderDocs} />
            </Grid.Column>
            <Grid.Column className="welcome-packet" widescreen={8} largeScreen={8} floated="right" only="large screen">
              <Route
                exact
                path={match.url}
                render={props => <DocumentDetails boxFileId={get(closingBinderDocs, '[0]documentId')} getBoxLink={getBoxLink} {...props} />}
              />
              <Route
                path={`${match.url}/:docId`}
                render={props => <DocumentDetails getBoxLink={getBoxLink} {...props} />}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
