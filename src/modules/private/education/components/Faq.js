import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Grid, Form, Input } from 'semantic-ui-react';
import mapValues from 'lodash/mapValues';
import AccList from '../components/knowledgeBase/AccList';
import Details from '../components/knowledgeBase/Details';

@inject('educationStore')
@observer
export default class Faq extends Component {
  state = { activeIndex: 0 };
  componentWillMount() {
    this.props.educationStore.initRequest('Faq');
  }
  toggleAction = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    this.setState({ activeIndex: (activeIndex === index ? -1 : index) });
  }
  isActive = (record) => {
    const id = this.props.location.pathname.split('/')[4];
    const ids = mapValues(record.faqs, f => f.id);
    return this.state.activeIndex === record.id || Object.values(ids).includes(id);
  }
  render() {
    const { match, location } = this.props;
    const { faqs, loading } = this.props.educationStore;
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
              <AccList location={location} match={match} data={faqs} />
            </Grid.Column>
            <Grid.Column widescreen={8} largeScreen={8} floated="right" only="large screen">
              <Route exact path={match.url} component={Details} />
              <Route path={`${match.url}/:id`} render={props => <Details refLink="Faq" {...props} />} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
