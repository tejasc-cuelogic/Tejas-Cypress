import React from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import { Button, Modal, Message, Responsive } from 'semantic-ui-react';
import Helper from '../../../helper/utility';

const SHOW_MODAL_ROUTES = [
  '/register',
  '/register-investor',
  '/confirm-email',
  '/dashboard/setup/*',
  '/business-application/*',
  '/offerings/:slug/invest-now',
  '/offerings/:slug/invest-now/*',
  '/dashboard/account-settings/investment-limits/verify-accreditation/*',
];

const showUpdateModal = path => SHOW_MODAL_ROUTES.find(i => matchPath(path, { path: i }));

const NotifyVersionUpdate = (props) => {
  const location = useLocation();
  const update = () => {
    window.location.reload();
  };
  const show = showUpdateModal(location.pathname);
  const { isMobile, isTablet } = props.responsiveVars;
  if (show) {
    setTimeout(() => { Helper.modalCssUpdate('show-top', 'show-top'); }, 50000000);
  }
  if (!show) {
    setTimeout(() => { update(); }, 50000000);
    return (
      <Message
        size="mini"
        floating
        style={{ zIndex: '9999', wordBreak: 'unset', width: isMobile ? '100%' : 'auto', textAlign: 'center', fontSize: '12px', position: 'fixed', ...(isMobile ? { bottom: 0, margin: 0 } : { left: '50%', transform: 'translate(-50%, 0)' }) }}
      >
        {`We${'\''}ve made an update to the website.`}
        {isMobile ? <br /> : ' '}
        {`We${'\''}re refreshing your page now to show you the latest version.`}
      </Message>
    );
  }
  return (
    <Modal className="show-top" dimmer open size={isTablet ? 'small' : 'tiny'}>
      <Modal.Content>
        <Modal.Description style={{ textAlign: 'center', margin: '15px 0px 0px' }}>
          <h5 style={{ fontWeight: 'normal' }}>
            There{'\''}s a new version of this website available. <Responsive as="br" minWidth={768} />
            Please reload your browser to see the latest version.
          </h5>
          <Button positive content="Refresh" onClick={update} />
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
};

export default NotifyVersionUpdate;
