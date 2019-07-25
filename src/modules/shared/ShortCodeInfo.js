/* eslint-disable no-template-curly-in-string */
import React from 'react';
import { Modal, Header, Accordion, Icon } from 'semantic-ui-react';

export default class ShortCodeInfo extends React.Component {
  render() {
    const { showModal, activeIndex, handleAccClick, toggleModal } = this.props;
    return (
<Modal closeIcon onClose={toggleModal} closeOnDimmerClick open={showModal}>
<Modal.Header className="center-align signup-header">
    <Header as="h3">Short Codes Information</Header>
    </Modal.Header>
    <Modal.Content>
    <p className="primary-two-text">
    Note : In HTML editor when switching to code mode after adding short code need to switch back preview mode then save.
    </p>
    <Accordion>
    <Accordion.Title active={activeIndex === 0} index={0} onClick={handleAccClick}>
    <Icon name="dropdown" />
    <b>
    Short code for Expand/Collapse in HTML editor
    </b>
    </Accordion.Title>
    <Accordion.Content active={activeIndex === 0}>
    <p>
    <pre className="bg-offwhite">
    {'<div class="html-toggle-content hide-content">'}<br />
    <span className="negative-text">{'  "${ExtraContent}"'}</span>
    <br />
    {'</div>'}
    {`
<p>
  <a class="toggleReadMore">
    <span class="toggleReadMoreText">Expand&nbsp;</span>`}
    <span className="negative-text">{'"${Title}"'}</span>
    {`
  </a>
</p>
    `}
    </pre>
    </p>
    <br />
    <p className="primary-two-text">
    Note : Do not change the {'<Span>'} tag in above short code
    </p>
    <br />
    </Accordion.Content>
    <Accordion.Title active={activeIndex === 1} index={1} onClick={handleAccClick}>
    <Icon name="dropdown" />
    <b>
    For rendering image/content dynamically as per devices need to add below classes for respective tag
    </b>
    </Accordion.Title>
    <Accordion.Content active={activeIndex === 1}>
    <p>
    <ul>
    <li><b>Desktop only</b> = &apos;fr-editor-desktop&apos;</li>
    <li><b>Mobile only</b> = &apos;fr-editor-mobile&apos;</li>
    <li><b>Tablet only</b> = &apos;fr-editor-tablet&apos;</li>
    <li><b>For both Mobile and Tablet</b> = &apos;fr-editor-mobile fr-editor-tablet&apos;</li>
    </ul>
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
    <br />
    <p className="primary-two-text">
    Note : If the class attribute exist in tag then no need to add class attribute just add class name in same attribute.
    </p>
    </p>
    </Accordion.Content>
    </Accordion>
    </Modal.Content>
</Modal>
    );
  }
}
