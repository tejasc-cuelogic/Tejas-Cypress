import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import { Grid } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

@inject('agreementsStore')
@observer
export default class AgreementsPdfLoader extends Component {
  componentDidMount() {
    const iframe = this.iframeComponent;
    // iframe.onload = () => {
    //   // iframe.contentWindow.postMessage('message', '*');
    //   const docuele = iframe.contentWindow.document;
    //   const headerCls = docuele.body.querySelector('#root');
    //   headerCls.addEventListener('click', this.handleFrameTasks);
    // };
    console.log('ref iframe==>', iframe);
  }
  // componentWillUnmount() {
  //   const iframe = this.iframeComponent;
  //   iframe.removeEventListener('message', this.handleFrameTasks);
  // }
  onLoad = () => { console.log('Iframe loaded'); }
  getPdfUrl = param => this.props.agreementsStore.getNavItems.find(ele => ele.to === param).url;
  // handleFrameTasks = (e) => {
  //   // console.log('Frame content==>', e.data.from.iframe);
  //   if (e.target.innerText === 'EXPLORE CAMPAIGNS') {
  //     console.log('Frame content Click occurs==>', e.target.innerText);
  //   }
  // }
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
                <iframe
                  width="100%"
                  height="100%"
                  title="agreement"
                  src={`https://nextseed.box.com/s/${pdfURL}`}
                  // src="http://localhost:3000/"
                  ref={(c) => { this.iframeComponent = c; }}
                />
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
