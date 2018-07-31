import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

@inject('agreementsStore')
@observer
export default class AgreementsPdfLoader extends Component {
  getPdfUrl = param => this.props.agreementsStore.getNavItems.find(ele => ele.to === param).url;
  render() {
    const { agreementId } = this.props.match.params;
    const pdfURL = agreementId ? this.getPdfUrl(agreementId) : '';
    return (
      <div>
        <Grid>
          <Grid.Row>
            <Grid.Column className="welcome-packet">
              <div className="pdf-viewer">
                <object width="100%" height="100%" data={pdfURL} type="application/pdf">failed to load..</object>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
