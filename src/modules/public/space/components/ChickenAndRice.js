import React from 'react';
import { Modal, Header, Divider, Responsive } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import NSImage from '../../../shared/NSImage';

const ChickenAndRice = ({ history, uiStore }) => {
  const [scrollValue] = React.useState(window.scrollY);

  const handleCloseModal = () => {
      history.push('/space');
      setTimeout(() => {
        window.scrollTo(0, scrollValue);
      }, 100);
  };

  return (
    <Modal open closeIcon onClose={() => handleCloseModal()} className="nss-modal center-align">
      <Modal.Content image className="plr-0 pt-0 pb-0">
       {!uiStore.responsiveVars.isMobile
        && <NSImage wrapped path="space/chicken-and-rice-portrait.jpg" />}
        <Modal.Description>
          <Header as="h2">The Chicken<br /> & Rice Guys</Header>
          {!uiStore.responsiveVars.uptoTablet
          ? <Header as="h3" className="mb-0">Boston{'\''}s hit food truck,<br /> now in Houston!</Header>
          : <p><b>The first Houston Location</b></p>
          }
          <Divider section={!uiStore.responsiveVars.isMobile} />
          <p className={uiStore.responsiveVars.isMobile ? 'mb-half' : 'mb-20'}><b>Come visit at Greenway Plaza</b></p>
          <p className="mb-0">
          The HUB at Greenway Plaza<br />
          5 Greenway Plaza - Suite C-615<br />
          Houston, TX 77046
          </p>
          <Divider section={!uiStore.responsiveVars.isMobile} />
          <a className="primary-two-text mt-20" href="https://www.facebook.com/cnrguys/" target="_blank" rel="noopener noreferrer">Visit The Chicken & Rice Guys<Responsive as="br" maxWidth={991} /> on Facebook</a>
        </Modal.Description>
      </Modal.Content>
        {uiStore.responsiveVars.isMobile
      && <NSImage path="space/chicken-and-rice-landscape.jpg" fluid />}
    </Modal>
    );
};


export default inject('uiStore')(observer(ChickenAndRice));
