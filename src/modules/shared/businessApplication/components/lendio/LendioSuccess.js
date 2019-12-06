import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Grid, Icon, Header, Button, Divider } from 'semantic-ui-react';

@inject('businessAppLendioStore')
@observer
export default class LendioSuccess extends Component {
  proceedHandler = (lendioUrl) => {
    window.open(`${lendioUrl}`, '_blank');
    this.props.history.push('/app');
  }

  render() {
    const {
      match: {
        params,
      },
      businessAppLendioStore: {
        lendioUrl,
      },
    } = this.props;
    return (
      <Grid container>
        <Grid.Column className="issuer-signup">
          <Icon className="ns-paper-plane" size="massive" color="green" />
          <Header as="h1">Thank you</Header>
          {
            params.condition && params.condition === 'yes'
              ? (
              <>
                  <p>
                  Your information has been submitted to Lendio.
                  You are now being redirected to Lendio for next steps.
                </p>
                <Divider section hidden />
                <Button
                  color="green"
                  className="relaxed"
                  onClick={() => this.proceedHandler(lendioUrl)}
                >
                  Proceed to Lendio
                </Button>
              </>
              )
              : (
              <>
                <p>
                  You have selected not to share your information with Lendio.
                  If you have any questions, you can contact us at
                </p>
                <a href="mailto:apply@nextseed.com" className="link">
                  <b>apply@nextseed.com</b>
                </a> or check out our <Link to="/resources/education-center/business/faq" className="link"><b>Borrow page</b></Link> or
                <Link to="/resources/education-center/business/faq" className="link"><b>FAQ </b></Link> section for more information on our general business requirements.
              </>
              )
          }
        </Grid.Column>
      </Grid>
    );
  }
}
