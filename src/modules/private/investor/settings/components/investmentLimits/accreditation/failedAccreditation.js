import React, { Component } from 'react';
import { Button, Header, Grid } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { NsModal } from '../../../../../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;
@inject('accreditationStore')
@observer
export default class failedAccreditation extends Component {
  render() {
    const { accType, isAccreditationFlowInProgress } = this.props.accreditationStore;
    const redirectUrl = `verify-accreditation/${isAccreditationFlowInProgress.accountSelectedType}`;
    return (
      <NsModal
        onClose={() => { this.props.closeModal(); this.props.accreditationStore.setFieldVal('accType', ''); }}
        closeOnDimmerClick={false}
        open
        headerLogo
        percent={100}
        back={`${this.props.refLink}/${redirectUrl}`}
      >
        <Grid centered stackable className={isMobile ? 'full-width mt-0' : 'mt-0'}>
          <Grid.Column mobile={16} tablet={12} computer={8} className="pt-0">
            <Header as="h4">
            Unfortunately, we are not able to verify your accredited investor status based on your
            selection.
            </Header>
            <p className="mt-30 mb-0">
              {accType === 'trust'
                ? 'If your trust`s status changes to meet the criteria, please return to verify your status.' : accType === 'nonTrust'
                  ? 'If your entity`s status changes to meet the criteria, please return to verify your status.'
                  : 'If your income or net worth change to meet the criteria, please return to verify your status.'
            }
            </p>
            <Button className="mt-30" primary fluid={isMobile} content="OK" onClick={() => { this.props.closeModal(); this.props.accreditationStore.setFieldVal('accType', ''); this.props.accreditationStore.setFieldValue('isAccreditationFlowInProgress', null, 'accountSelectedType'); }} />
          </Grid.Column>
        </Grid>
      </NsModal>
    );
  }
}
