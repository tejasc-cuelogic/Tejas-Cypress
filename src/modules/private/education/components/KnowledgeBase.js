/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { Route, NavLink } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Grid, Accordion, Responsive, Card, Form, Input } from 'semantic-ui-react';
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

    if (loading) {
      return 'loading...';
    }
    return (
      <div>
        <Grid>
          <Grid.Row>
            <Grid.Column widescreen={7} largeScreen={7} computer={16} tablet={16} mobile={16}>
              <Form>
                <Input fluid inverted icon={{ className: 'ns-search' }} iconPosition="left" placeholder="Search by keyword or phrase" />
              </Form>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column widescreen={7} largeScreen={7} computer={16} tablet={16} mobile={16}>
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
            <Grid.Column widescreen={8} largeScreen={8} floated="right" only="large screen">
              <Route exact path={match.url} component={Details} />
              <Route path={`${match.url}/:id`} render={props => <Details refLink="KnowledgeBase" {...props} />} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
