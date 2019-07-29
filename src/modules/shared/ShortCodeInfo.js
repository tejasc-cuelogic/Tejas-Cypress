/* eslint-disable no-template-curly-in-string */
/* eslint-disable arrow-body-style */
import React from 'react';
import { Modal, Header, Tab } from 'semantic-ui-react';

export default class ShortCodeInfo extends React.Component {
  panes = [
    { menuItem: 'Overview',
      render: () => {
        return (
      <Tab.Pane>
              <p className="primary-two-text">
    Note : In HTML editor when switching to code mode after adding short code need to switch back preview mode then save.
    </p>
    <p><b>Example:</b></p>
    <p>
    - For showing Image only for mobile :
    </p>
    <pre className="bg-offwhite">
    {`
<p>
  <img
    src="https://prod-cdn-us-east-1.nextseed.qa/image.jpg"
    style="width: 300px;"
    class="fr-fic fr-dib`}<span className="negative-text"> fr-editor-mobile</span>{`"
  >
</p>`}
    </pre>
        </Tab.Pane>
        );
      } },
    {
      menuItem: 'Expand/Collapse Content',
      render: () => {
        return (
          <Tab.Pane>
      <b>
    Short code for Expand/Collapse in HTML editor
    </b>
    <p>
    <pre className="bg-offwhite">
    {'<p class="html-toggle-content hide-content">'}<br />
    <span className="negative-text">{'  "${ExtraContent}"'}</span>
    <br />
    {'</p>'}
    {`
<p>
  <a class="toggleReadMore">
    <strong>
      <span class="toggleReadMoreText">Expand </span>
      <span calss="customTitle">`}
    <span className="negative-text">{'${Title}'}</span>
    {`</span>
    </strong>
    <span class="arrowText">&#9660</span>
  </a>
</p>
    `}
    </pre>
    </p>
    <br />
    <p className="primary-two-text">
    Note : Do not change the {'<Span>'} tag in above short code
    </p>
        </Tab.Pane>
        );
      },
    },
    {
      menuItem: 'Device Responsive Image Rendering',
      render: () => {
        return (
          <Tab.Pane>
            <b>
          For rendering image/content dynamically as per devices need to add below classes for respective tag
          </b>
          <p>
    <ul>
    <li><b>Desktop only</b> = &apos;fr-editor-desktop&apos;</li>
    <li><b>Mobile only</b> = &apos;fr-editor-mobile&apos;</li>
    <li><b>Tablet only</b> = &apos;fr-editor-tablet&apos;</li>
    <li><b>Tablet Landscape only</b> = &apos;fr-editor-tablet-landscape&apos;</li>
    <li><b>For both Mobile and Tablet</b> = &apos;fr-editor-tablet-mobile&apos;</li>
    </ul>
    <br />
    <p><b>Example:</b></p>
    <p>
    - For showing Image only for mobile :
    </p>
    <pre className="bg-offwhite">
    {`
<p>
  <img
    src="https://prod-cdn-us-east-1.nextseed.qa/image.jpg"
    style="width: 300px;"
    class="fr-fic fr-dib`}<span className="negative-text"> fr-editor-mobile</span>{`"
  >
</p>`}
    </pre>
    <p className="primary-two-text">
    Note : If the class attribute exist in tag then no need to add class attribute just add class name in same attribute.
    </p>
    </p>
          </Tab.Pane>
        );
      },
    },
  ];

  render() {
    const { showModal, toggleModal } = this.props;
    return (
<Modal closeIcon onClose={toggleModal} closeOnDimmerClick open={showModal}>
<Modal.Header className="center-align signup-header">
    <Header as="h3">Short Codes Information</Header>
    </Modal.Header>
    <Modal.Content>
    <Tab className="html-editor-info-tab" panes={this.panes} />
    </Modal.Content>
</Modal>
    );
  }
}
