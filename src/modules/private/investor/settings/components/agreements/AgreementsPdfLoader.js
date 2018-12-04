import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { InlineLoader } from '../../../../../../theme/shared';

@inject('agreementsStore')
@observer
export default class AgreementsPdfLoader extends Component {
  componentWillMount() {
    const { getNavItems, getBoxEmbedLink } = this.props.agreementsStore;
    const { agreementKey } = this.props.match.params;
    const doc = agreementKey ? getNavItems.find(ele => ele.to === agreementKey) :
      getNavItems[0];
    getBoxEmbedLink(doc.to, doc.url);
  }
  getPdfUrl = param => this.props.agreementsStore.getNavItems.find(ele => ele.to === param);
  render() {
    const { embedUrl, docLoading } = this.props.agreementsStore;
    return (
      <div>
        <Grid>
          <Grid.Row>
            <Grid.Column className="welcome-packet">
              <div className="pdf-viewer">
                {(docLoading || !embedUrl) ? <InlineLoader /> :
                <iframe width="100%" height="100%" title="agreement" src={embedUrl} />}
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
