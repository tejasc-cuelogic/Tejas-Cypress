import React from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Item, Container } from 'semantic-ui-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import RedError from '../../components/common/RedError';

@inject('offeringsStore', 'userStore')
@withRouter
@observer
export default class Offering extends React.Component {
  componentDidMount() {
    console.log('Offering - ComponentDidMount');
    const { id } = this.props.match.params;
    if (!this.props.offeringsStore.selectedOffering) {
      this.props.offeringsStore.selectOffering(id);
    }
  }

  render() {
    const { offeringsStore } = this.props;
    const { selectedOffering, isLoadingOffering } = offeringsStore;

    if (isLoadingOffering && !selectedOffering) return <LoadingSpinner />;

    if (!selectedOffering) return <RedError message="Can't load offering" />;

    return (
      <Container text>
        <Item>
          <Item.Image size="small" src="/assets/images/wireframe/image.png" />

          <Item.Content>
            <Item.Header as="a">{selectedOffering.title}</Item.Header>
            <Item.Description>
              <p>
                {selectedOffering.details}
              </p>
            </Item.Description>
          </Item.Content>
        </Item>
      </Container>
    );
  }
}
