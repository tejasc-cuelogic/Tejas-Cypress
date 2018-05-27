/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { Route, NavLink } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Grid, Header, Accordion, Responsive, Card } from 'semantic-ui-react';
import Details from '../components/knowledgeBase/Details';

@inject('educationStore')
@observer
export default class KnowledgeBase extends Component {
  componentWillMount() {
    this.props.educationStore.initRequest('KnowledgeBase');
  }
  render() {
    const { match } = this.props;
    const {
      kbs, loading, error,
    } = this.props.educationStore;
    return (
      <div>
        <Grid>
          <Grid.Column widescreen={8} largeScreen={8} computer={16} tablet={16} mobile={16}>
            <Header as="h3">Table of Content</Header>
            <Accordion className="feed-view">
              {
                kbs.map((record, index) => (
                  <Accordion.Title as={NavLink} to={`${match.url}/${record.id}`} index={record.id}>
                    {`Chapter ${(index + 1)}`}
                    <span>{record.heading}</span>
                  </Accordion.Title>
                ))
              }
            </Accordion>
          </Grid.Column>
          <Grid.Column widescreen={8} largeScreen={8} only="large screen">
            <Route exact path={match.url} component={Details} />
            <Route path={`${match.url}/:id`} render={props => <Details refLink="KnowledgeBase" {...props} />} />
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
