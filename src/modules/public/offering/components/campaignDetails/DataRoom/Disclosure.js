import React, { Component } from 'react';
import { Header, Grid } from 'semantic-ui-react';
// import { Link } from 'react-router-dom';

class Disclosure extends Component {
  render() {
    const { props } = this.props;
    console.log('props==>', props);
    const documentPdf = this.props.documentToLoad;
    const pdfDocumentURL = `https://s3.amazonaws.com/dev-cdn.nextseed.qa/welcome-packet/${documentPdf}`;
    return (
      <div className="campaign-content-wrapper">
        <Grid stackable>
          <Grid.Column>
            <Header as="h3">{this.props.headerTitle}</Header>
          </Grid.Column>
        </Grid>
        <div className="pdf-viewer mt-30">
          <object width="100%" height="100%" data={pdfDocumentURL} type="application/pdf">failed to load..</object>
        </div>
      </div>
    );
  }
}

export default Disclosure;
