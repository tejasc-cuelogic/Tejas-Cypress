import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Grid, Form, Input } from 'semantic-ui-react';
import AccList from '../components/knowledgeBase/AccList';
import Details from '../components/knowledgeBase/Details';

@inject('educationStore')
@observer
export default class KnowledgeBase extends Component {
  componentWillMount() {
    this.props.educationStore.initRequest('Faq');
  }
  search = (e) => {
    this.props.educationStore.setSrchParam(e.target.value);
    if (this.props.location.pathname !== '/app/resources/faq') {
      this.props.history.replace('/app/resources/faq');
    }
  }
  render() {
    const { match, location } = this.props;
    const {
      faqs, loading, error, searchParam,
    } = this.props.educationStore;
    const modul = 'faq';
    if (loading) {
      return 'loading...';
    }
    return (
      <div>
        <Grid>
          <Grid.Row>
            <Grid.Column widescreen={7} largeScreen={7} computer={16} tablet={16} mobile={16}>
              <Form>
                <Input
                  fluid
                  onChange={this.search}
                  value={searchParam}
                  inverted
                  icon={{ className: 'ns-search' }}
                  iconPosition="left"
                  placeholder="Search by keyword or phrase"
                />
              </Form>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column widescreen={7} largeScreen={7} computer={16} tablet={16} mobile={16}>
              <AccList module={modul} location={location} match={match} error={error} data={faqs} />
            </Grid.Column>
            <Grid.Column widescreen={8} largeScreen={8} floated="right" only="large screen">
              <Route
                exact
                path={match.url}
                render={props => <Details module={modul} {...props} />}
              />
              <Route
                path={`${match.url}/:id`}
                render={props => <Details module={modul} {...props} />}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
