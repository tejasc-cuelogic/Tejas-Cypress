import React from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { List, Container } from 'semantic-ui-react';
// import LoadingSpinner from '../../theme/common/LoadingSpinner';
// import RedError from '../../theme/common/RedError';

@inject('offeringsStore', 'userStore')
@withRouter
@observer
export default class Offerings extends React.Component {
  componentDidMount() {
    console.log('Offerings - ComponentDidMount');
    this.props.offeringsStore.loadOfferings();
  }

  // componentDidUpdate(previousProps) {
  //   if (this.props.location !== previousProps.location) {
  //     this.props.profileStore.loadProfile(this.props.match.params.username);
  //   }
  // }

  render() {
    const { offeringsStore } = this.props;
    const { offerings } = offeringsStore;
    return (
      <Container text>
        <List>
          {offerings.map(offering => (
            <List.Item key={offering.id} >
              <List.Content>
                <List.Header as="a" href={`/offerings/${offering.id}`}>{offering.title}</List.Header>
                <List.Description as="a">{offering.details}</List.Description>
              </List.Content>
            </List.Item>
          ))
          }
        </List>
      </Container>
    );
  }
}
