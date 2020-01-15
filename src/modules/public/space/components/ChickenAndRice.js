import React from 'react';
import { Modal, Header, Divider, Responsive } from 'semantic-ui-react';
import NSImage from '../../../shared/NSImage';


const handleCloseModal = (history) => {
    history.push('/space');
};

const ChickenAndRice = ({ history }) => (
  <Modal open closeIcon onClose={() => handleCloseModal(history)} className="nss-modal">
    <Modal.Content image className="plr-0 pt-0 pb-0">
      <NSImage wrapped path="space/chicken-and-rice-portrait.jpg" />
      <Modal.Description>
        <Header as="h2">The Chicken<Responsive as="br" minWidth={992} /> & Rice Guys</Header>
        <Header as="h3" className="mb-0">Boston{"'"}s hit food truck,<Responsive as="br" minWidth={992} /> now in Houston!</Header>
        <Divider section />
        <p className="mb-20"><b>Come visit at Greenway Plaza</b></p>
        <p className="mb-0">
        The HUB at Greenway Plaza<Responsive as="br" minWidth={992} />
        5 Greenway Plaza - Suite C-615<Responsive as="br" minWidth={992} />
        Houston, TX 77046
        </p>
        <Divider section />
        <a className="primary-two-text mt-20" href="https://www.facebook.com/cnrguys/" target="_blank" rel="noopener noreferrer">Visit The Chicken & Rice Guys on Facebook</a>
      </Modal.Description>
    </Modal.Content>
  </Modal>

  );

export default ChickenAndRice;
