import React, { Component } from 'react';
import { Header, Modal, Image } from 'semantic-ui-react';
import interiorView from '../../../../assets/images/interior-view-patio-garden.jpg';

class BusinessModal extends Component {
  handleClose = () => this.props.history.goBack();

  render() {
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
          <Image size="large" src={interiorView} wrapped />
          <Modal.Description>
            <p>
              The Buffbrew Taproom will generate revenue streams from restaurant sales, tap
              sales, beer garden sales and facility tour and event sales.
            </p>
            <p>
              Guests will stampede to the taproom to taste flavors and varieties of craft
              brews that just don’t exist elsewhere, putting more beer into more hands than
              ever before. The state-of-the-art facility will offer more than 40 Buffbrew taps.
            </p>
            <p>
              Operating 7 days a week, the space will be open for lunch and dinner daily with
              extended weekend hours. By comparison, the taproom at Nolda is currently open only
              twice a week and with less product and no food.
            </p>
            <p>
              There will be three distinct tap areas woven into the brewery at each level. On the
              first floor, a dedicated bar will be positioned next to the tanks to give visitors
              an old school brewery feel with access to a patio with outdoor seating. Situated on
              the building’s second floor, the main taproom is designed to be a fully immersive
              Buffbrew facility adventure. The brewing tanks will be centrally located to provide
              a theater-in-the-round experience. Large glass windows will allow guests to at once
              enjoy brews and view the brewing process. Finally, a third floor roof deck and VIP
              event space will maximize the position of the taproom. The views from the space will
              be a tremendous draw for private events and social gatherings. Reservations will be
              a source of business for the patio space and the party room.
            </p>
            <p>
              The taproom also sits adjacent to the full-service kitchen. The chef and menu have
              yet to be finalized, but the concept will feature an elevated bar menu that will
              seek to match the creativity of the brewery. Restaurant seating will accommodate
              over 200 guests with an additional 25 seats at the bar.
            </p>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}

export default BusinessModal;
