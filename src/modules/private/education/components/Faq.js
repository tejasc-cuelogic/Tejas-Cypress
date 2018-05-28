import React, { Component } from 'react';
import { Route, NavLink } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Grid, Header, Accordion, Icon, List } from 'semantic-ui-react';
import mapValues from 'lodash/mapValues';
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
    const { match } = this.props;
    const { faqs, loading } = this.props.educationStore;
    if (loading) {
      return 'loading...';
    }
    return (
      <div>
        <Grid>
          <Grid.Column widescreen={8} largeScreen={8} computer={16} tablet={16} mobile={16}>
            <Header as="h3">Table of Content</Header>
            <Accordion className="splitted">
              {
                faqs.map(record => (
                  <Aux key={record.id}>
                    <Accordion.Title active={this.isActive(record)} onClick={this.toggleAction} index={record.id}>
                      {record.name}
                      <Icon className="ns-chevron-down" />
                    </Accordion.Title>
                    <Accordion.Content active={this.isActive(record)}>
                      {record.faqs.length > 0 ? (
                        <List divided relaxed="very">
                          {
                            record.faqs.map(faq => (
                              <List.Item to={`${match.url}/${faq.id}`} key={faq.id} as={NavLink}>{faq.text}</List.Item>
                            ))
                          }
                        </List>
                      ) : 'No FAQ to display.'
                      }
                    </Accordion.Content>
                  </Aux>
                ))

              }
            </Accordion>
          </Grid.Column>
          <Grid.Column widescreen={8} largeScreen={8} only="large screen">
            <Route exact path={match.url} component={Details} />
            <Route path={`${match.url}/:id`} render={props => <Details refLink="Faq" {...props} />} />
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
