import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

@inject('agreementsStore')
@observer
export default class AgreementsPdfLoader extends Component {
  getPdfUrl = param => this.props.agreementsStore.getNavItems.find(ele => ele.to === param).url;
  render() {
    const { agreementKey } = this.props.match.params;
    const pdfURL = agreementKey ? this.getPdfUrl(agreementKey) :
      this.props.agreementsStore.getNavItems[0].url;
    return (
      <div>
        <Grid>
          <Grid.Row>
            <Grid.Column className="welcome-packet">
              <div className="pdf-viewer">
                <iframe width="100%" height="100%" title="agreement" src={`https://nextseed.box.com/s/${pdfURL}`} />
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
