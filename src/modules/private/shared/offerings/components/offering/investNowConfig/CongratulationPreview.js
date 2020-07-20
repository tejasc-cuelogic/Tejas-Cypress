import React from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Grid, Divider, Icon, Header, Button } from 'semantic-ui-react';
import HtmlEditor from '../../../../../../shared/HtmlEditor';


@inject('manageOfferingStore')
@observer
export default class CongratulationPreview extends React.Component {
  render() {
    const { INVEST_NOW_CONFIG_FRM, campaignStatus } = this.props.manageOfferingStore;
    const { toggleConfirmation, confirmationMessage } = INVEST_NOW_CONFIG_FRM.fields;
    const confirmMessage = confirmationMessage.value;
    return (
      <Grid centered stackable className="mt-0">
        <Grid.Column width="9" className="pt-0">
          {
            (!toggleConfirmation.value.includes('HIDE_HEADER') || confirmMessage === '')
            && (
              <>
                <Header as="h2">Congratulations!</Header>
                <Header as="h3">
                  You have invested <span className="positive-text">$100</span> in {campaignStatus.legalBusinessName}.
                  </Header>
              </>
            )
          }
          <Divider hidden />
          {confirmMessage !== '' && (
            <HtmlEditor
              readOnly
              content={confirmMessage}
            />
          )}
          <Divider hidden />
          {(!toggleConfirmation.value.includes('HIDE_REFERRAL') || confirmMessage === '')
            && (
              <>
                <p>
                  Now, earn an additional $20 credit by giving $20. Invite your
                  friends to build the community together, and you both earn credits.
                  </p>
                <Divider hidden />
                <Link to="/" onClick={e => this.handleCloseModalWithRefferalLink(e)} className="text-link">
                  <Icon className="ns-arrow-right" color="green" />
                  Give $20 & Get $20
                </Link>
              </>
            )
          }
          <Divider hidden />
          <Button primary>
            View Portfolio
            </Button>
        </Grid.Column>
      </Grid>
    );
  }
}
