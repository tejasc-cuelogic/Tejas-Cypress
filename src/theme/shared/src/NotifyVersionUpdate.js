import React from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import { Button, Modal, Message } from 'semantic-ui-react';
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

const NotifyVersionUpdate = () => {
  const location = useLocation();
  const update = () => {
    window.location.reload();
  };
  const show = showUpdateModal(location.pathname);
  if (show) {
    setTimeout(() => { Helper.modalCssUpdate('show-top', 'show-top'); }, 500);
  }
  if (!show) {
    setTimeout(() => { update(); }, 5000);
    return (
      <Message size="mini" floating style={{ zIndex: '999', position: 'absolute', textAlign: 'center', left: '31%' }}>
        {`There${"'"}s a new version of this website available, refreshing to get the latest version.`}
      </Message>
    );
  }
  return (
    <Modal className="show-top" dimmer open size="tiny">
      <Modal.Content>
        <Modal.Description style={{ textAlign: 'center', margin: '15px 0px 0px' }}>
          <h5 style={{ fontWeight: 'normal' }}>
            There{"'"}s a new version of this website available.<br />
            Please reload your browser to see the latest version.
          </h5>
          <Button positive content="Refresh" onClick={update} />
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
};

export default NotifyVersionUpdate;
