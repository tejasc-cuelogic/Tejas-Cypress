import React, { Component } from 'react';
import { Header, Modal, Image, Grid } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import interiorView from '../../../../assets/images/interior-view-patio-garden.jpg';

@inject('campaignStore')
@observer
class BusinessModal extends Component {
  handleClose = () => this.props.history.goBack();

  render() {
    const { campaign } = this.props.campaignStore;
    const emptyStatement = 'Detail not found';
    return (
      <Modal
        open
        onClose={this.handleClose}
        closeIcon
        size="large"
      >
        <Header as="h3">
          Business Model
        </Header>
        <Modal.Content image scrolling>
          <Grid stackable doubling>
            <Grid.Column computer={7} tablet={7} mobile={16}>
              <Image src={interiorView} wrapped />
            </Grid.Column>
            <Grid.Column computer={9} tablet={9} mobile={16}>
              {
                campaign.offering.about.businessModel !== null ?
                  <p
                    dangerouslySetInnerHTML={
                      {
                        __html: campaign && campaign.offering
                          && campaign.offering.about
                          && campaign.offering.about.businessModel,
                      }
                    }
                  /> : <p>{emptyStatement}</p>
              }
            </Grid.Column>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}

export default BusinessModal;
