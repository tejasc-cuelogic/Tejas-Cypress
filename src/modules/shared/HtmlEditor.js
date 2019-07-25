/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable no-template-curly-in-string */
/* eslint-disable camelcase */
/* eslint-disable func-names */
/* eslint-disable import/no-extraneous-dependencies  */
import React from 'react';
import $ from 'jquery';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Accordion, Icon } from 'semantic-ui-react';
import { get } from 'lodash';
// import Parser from 'html-react-parser';
import 'froala-editor/js/froala_editor.pkgd.min';

// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

// Require Font Awesome.
import 'font-awesome/css/font-awesome.css';

import FroalaEditor from 'react-froala-wysiwyg';
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';
import { fileUpload } from '../../services/actions';
import { FROALA_EDITOR_LICENSE } from '../../constants/common';
import { UPLOADS_CONFIG } from '../../constants/aws';

window.$ = $;
window.jQuery = $;

@inject('uiStore')
@observer
export default class HtmlEditor extends React.Component {
  state = {
    showModal: false,
    activeIndex: 0,
  }

  constructor(props) {
    super(props);
    $.FroalaEditor.DefineIcon('buttonIcon', { NAME: 'info', SVG_KEY: 'help' });
    $.FroalaEditor.RegisterCommand('myButton', {
      title: 'Show Short Codes Information',
      icon: 'buttonIcon',
      undo: false,
      focus: false,
      plugin: 'customPlugin',
      callback: this.toggleModal,
    });
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  }

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal, activeIndex: 0 });
  }

  getConfig = (keyStart, overrides) => {
    const config = {
      placeholderText: 'Enter here..',
      toolbarButtons: ['html', '|', 'undo', 'redo', '|', 'paragraphFormat', '|', 'bold', 'italic', 'strikeThrough', 'underline', '|', 'superscript', 'subscript', '|', 'insertLink', 'insertTable', '|', 'insertImage', '|', 'align', 'formatUL', 'formatOL', '|', 'insertHR', '|', 'clearFormatting', 'fullscreen', '|', 'myButton'],
      charCounterCount: false,
      editorClass: 'html-editor',
      key: FROALA_EDITOR_LICENSE,
      linkList: [],
      heightMin: 244,
      heightMax: '70vh',
      imageManager: false,
      pluginsEnabled: ['customPlugin', 'align', 'charCounter', 'codeBeautifier', 'codeView', 'colors', 'draggable', 'embedly', 'emoticons', 'entities', 'file', 'fontFamily', 'fontSize', 'fullscreen', 'image', 'imageManager', 'inlineStyle', 'lineBreaker', 'link', 'lists', 'paragraphFormat', 'paragraphStyle', 'quickInsert', 'quote', 'save', 'table', 'url', 'video', 'wordPaste'],
      events: {
        'froalaEditor.image.inserted': (e, editor, image) => {
          if (image.prevObject) {
            editor.edit.on();
          } else {
            editor.edit.off();
          }
        },
        'froalaEditor.image.beforeUpload': (e, editor, images) => {
          editor.edit.off();
          this.props.uiStore.setFieldvalue('htmlEditorImageLoading', true);
          if (images.length) {
            const fileName = get(images, '[0].name');
            const file = get(images, '[0]');
            const fileObj = {
              obj: file,
              type: file.type,
              name: fileName,
            };
            fileUpload.uploadToS3(fileObj, this.props.imageUploadPath || 'RichTextEditor').then((res) => {
              editor.edit.off();
              if (editor && editor.image && editor.image.get()) {
                editor.edit.off();
                const imgUrl = `https://${UPLOADS_CONFIG.bucket}/${res}`;
                editor.edit.off();
                // editor.image.get().attr('src', imgUrl);
                editor.image.insert(imgUrl, null, null, editor.image.get());
                this.props.uiStore.setFieldvalue('htmlEditorImageLoading', false);
                editor.edit.on();
              } else {
                editor.edit.off();
                console.log('else block');
                this.props.uiStore.setFieldvalue('htmlEditorImageLoading', false);
              }
              editor.edit.off();
              return false;
            }).catch((err) => {
              editor.edit.on();
              console.log('catch image', err);
              this.props.uiStore.setFieldvalue('htmlEditorImageLoading', false);
              return false;
            });
          }
          editor.edit.off();
        },
        'froalaEditor.image.error': (e, editor, error) => {
          console.log(error);
        },
      },
    };
    return { ...config, ...overrides };
  };

  handleModelChange = (content) => {
    this.props.changed(this.props.name, content, this.props.form, this.props.index);
  }

  render() {
    const { keyStart, readOnly } = this.props;
    // if (readOnly) {
    //   return <div>{Parser(this.props.content || '')}</div>;
    // }
    if (readOnly) {
      return <div className="parsed-data"><FroalaEditorView model={this.props.content} /></div>;
    }
    const { activeIndex } = this.state;
    return (
      <div>
        <FroalaEditor
          tag="textarea"
          model={this.props.content}
          config={this.getConfig(keyStart, this.props.overrides)}
          onModelChange={this.handleModelChange}
        />
        <Modal closeIcon onClose={this.toggleModal} closeOnDimmerClick open={this.state.showModal}>
        <Modal.Header className="center-align signup-header">
            <Header as="h3">Short Codes Information</Header>
          </Modal.Header>
          <Modal.Content>
          <p className="primary-two-text">
          Note : In HTML editor when switching to code mode after adding short code need to switch back preview mode then save.
          </p>
          <Accordion>
          <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
          <Icon name="dropdown" />
          <b>
          Short code for Expand/Collapse in HTML editor
          </b>
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>
          <p>
          <pre className="bg-offwhite">
          {'<div class="html-toggle-content hide-content">'}<br />
          <span className="negative-text">{'   "${ExtraContent}"'}</span>
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
          <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick}>
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
            * For showing image only for mobile:
          </p>
          <pre className="bg-offwhite">
            {`
  <p>
    <img src="https://prod-cdn-us-east-1.nextseed.qa/image.jpg"
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
      </div>
    );
  }
}
