import React, { Component } from 'react';
import HtmlEditor from '../../../../shared/HtmlEditor';

export default class ProccessingAccountsScreen extends Component {
  render() {
    const processingMsg = `We are currently processing your account creation request. Please contact
    <a href="mailto:support@nextseed.com">support@nextseed.com</a> if you have any questions.`;
    return (
      <section className="center-align">
        <h4 style={{ color: '#31333d7d' }}><HtmlEditor readOnly content={(processingMsg)} /></h4>
      </section>);
  }
}
