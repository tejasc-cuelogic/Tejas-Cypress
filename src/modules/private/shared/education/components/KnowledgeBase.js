import React, { Component } from 'react';
import Aux from 'react-aux';
import { Route, Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Grid, Form, Input, Breadcrumb } from 'semantic-ui-react';
import AccList from '../components/knowledgeBase/AccList';
import Details from '../components/knowledgeBase/Details';
import FaqsCombined from './FaqsCombined';
import { InlineLoader } from '../../../../../theme/shared';


@inject('educationStore')
@observer
export default class KnowledgeBase extends Component {
  componentWillMount() {
    const props = { isMkt: this.props.marketing, params: this.props.match.params };
    this.props.educationStore.initRequest('KnowledgeBase', props);
  }
  search = (e) => {
    this.props.educationStore.setSrchParam('KnowledgeBase', e.target.value);
    if (this.props.location.pathname !== '/app/resources/knowledge-base') {
      this.props.history.replace('/app/resources/knowledge-base');
    }
  }
  render() {
    const { match, location, marketing } = this.props;
    const {
      kbs, loading, error, searchParam,
    } = this.props.educationStore;
    const modul = 'knowledgeBase';
    if (loading('KnowledgeBase')) {
      return <InlineLoader />;
    }
    return (
      <Aux>
        {marketing && (
          <Breadcrumb className="mb-20">
            <Breadcrumb.Divider icon={{ className: 'ns-chevron-left' }} />
            <Breadcrumb.Section as={Link} to="/resources/education-center">
              Education Center
            </Breadcrumb.Section>
          </Breadcrumb>
        )}
        <Grid>
          {!marketing && (
            <Grid.Row>
              <Grid.Column widescreen={6} largeScreen={6} computer={16} tablet={16} mobile={16}>
                <Form>
                  <Input
                    fluid
                    onChange={this.search}
                    value={searchParam.KnowledgeBase}
                    inverted
                    icon={{ className: 'ns-search' }}
                    iconPosition="left"
                    placeholder="Search by keyword or phrase"
                  />
                </Form>
              </Grid.Column>
            </Grid.Row>
          )}
          <Grid.Row>
            <Grid.Column widescreen={6} largeScreen={6} computer={16} tablet={16} mobile={16}>
              <AccList
                marketing={marketing}
                module={modul}
                location={location}
                match={match}
                error={error}
                data={kbs}
              />
            </Grid.Column>
            <Grid.Column widescreen={10} largeScreen={10} only="large screen">
              <Route
                exact
                path={match.url}
                render={props => <Details marketing={marketing} module={modul} {...props} />}
              />
              <Route
                path={`${match.url}/faq`}
                render={props =>
                  <FaqsCombined marketing={marketing} params={match.params} {...props} />}
              />
              <Route
                path={`${match.url}/:id`}
                render={props => <Details marketing={marketing} module={modul} {...props} />}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Aux>
    );
  }
}
