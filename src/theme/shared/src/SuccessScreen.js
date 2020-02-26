import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Header, Grid } from 'semantic-ui-react';
import { NsModal } from '..';

const isMobile = document.documentElement.clientWidth < 768;
const SuccessScreen = ({ successMsg, handleContinue, closeLink }) => {
  const history = useHistory();
  return (
    <NsModal
      open
      closeOnDimmerClick={false}
      onClose={() => {
        if (closeLink) {
          history.push(closeLink);
        } else {
          handleContinue();
        }
      }}
      headerLogo
      borderedHeader
      isProgressHeaderDisable
    >
      <Grid centered stackable className={isMobile ? 'full-width mt-0' : 'mt-0'}>
        <Grid.Column width="7" className="pt-0">
          <Header as="h3">{successMsg}</Header>
          <div className="mt-30">
            <Button primary fluid={isMobile} onClick={handleContinue} content="Continue" />
          </div>
        </Grid.Column>
      </Grid>
    </NsModal>
  );
};

export default SuccessScreen;
