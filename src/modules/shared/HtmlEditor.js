/* eslint-disable import/no-extraneous-dependencies  */
import React from 'react';
import $ from 'jquery';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import 'froala-editor/js/froala_editor.pkgd.min';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'font-awesome/css/font-awesome.css';

import { Confirm } from 'semantic-ui-react';
import FroalaEditor from 'react-froala-wysiwyg';
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';
import { fileUpload } from '../../services/actions';
import { FROALA_EDITOR_LICENSE } from '../../constants/common';
import { UPLOADS_CONFIG } from '../../constants/aws';
import ShortCodeInforModal from './ShortCodeInfo';
import Helper from '../../helper/utility';

window.$ = $;
window.jQuery = $;

@inject('uiStore')
@observer
export default class HtmlEditor extends React.Component {
  state = {
    showModal: false,
    showConfirmModal: false,
    errorMsg: '',
  }

  constructor(props) {
    super(props);
    $.FroalaEditor.DefineIcon('buttonIcon', { NAME: 'info', SVG_KEY: 'help' });
    $.FroalaEditor.RegisterCommand('popup-btn', {
      title: 'Show Short Codes Information',
      icon: 'buttonIcon',
      undo: false,
      focus: false,
      plugin: 'customPlugin',
      callback: this.toggleModal,
    });
  }

  updateState = (field, val) => {
    this.setState({ [field]: val });
  }

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  }

  getConfig = (keyStart, overrides) => {
    const config = {
      placeholderText: 'Enter here..',
      toolbarButtons: ['html', '|', 'undo', 'redo', '|', 'fontSize', 'paragraphFormat', '|', 'bold', 'italic', 'strikeThrough', 'underline', '|', 'superscript', 'subscript', '|', 'insertLink', 'insertTable', '|', 'insertImage', '|', 'align', 'formatUL', 'formatOL', '|', 'insertHR', '|', 'clearFormatting', '|', 'popup-btn'],
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
            const fileExt = (fileName && typeof fileName === 'string') ? get(fileName.split('.'), `[${fileName.split('.').length - 1}]`) : '';
            const validate = Helper.validateImageExtension(fileExt);
            if (!validate.isInvalid) {
              fileUpload.uploadToS3(fileObj, this.props.imageUploadPath || 'RichTextEditor').then((res) => {
                editor.edit.off();
                if (editor && editor.image && editor.image.get()) {
                  editor.edit.off();
                  const imgUrl = `https://${UPLOADS_CONFIG.bucket}/${res}`;
                  editor.edit.off();
                  editor.image.insert(imgUrl, null, null, editor.image.get());
                  this.props.uiStore.setFieldvalue('htmlEditorImageLoading', false);
                  editor.edit.on();
                } else {
                  editor.edit.off();
                  this.props.uiStore.setFieldvalue('htmlEditorImageLoading', false);
                }
                editor.edit.off();
                return false;
              }).catch((error) => {
                editor.edit.on();
                window.logger(error);
                this.props.uiStore.setFieldvalue('htmlEditorImageLoading', false);
                return false;
              });
            } else {
              this.updateState('errorMsg', validate.errorMsg);
              this.updateState('showConfirmModal', true);
              editor.edit.on();
            }
          }
          editor.edit.off();
        },
        'froalaEditor.image.error': (e, editor, error) => {
          window.logger(error);
        },
      },
    };
    return { ...config, ...overrides };
  };

  handleModelChange = (content) => {
    this.props.changed(this.props.name, content, this.props.form, this.props.index);
  }

  render() {
    const { keyStart, readOnly, tag, noDivWrap } = this.props;
    if (readOnly) {
    const FroalaView = <FroalaEditorView tag={tag} model={this.props.content} />;
    return noDivWrap ? FroalaView : <div className="parsed-data">{FroalaView}</div>;
    }
    return (
      <div>
        <FroalaEditor
          tag="textarea"
          model={this.props.content}
          config={this.getConfig(keyStart, this.props.overrides)}
          onModelChange={this.handleModelChange}
        />
        <ShortCodeInforModal toggleModal={this.toggleModal} showModal={this.state.showModal} />
        <Confirm
          header="Warning"
          content={this.state.errorMsg}
          open={this.state.showConfirmModal}
          onConfirm={() => this.updateState('showConfirmModal', false)}
          onCancel={() => this.updateState('showConfirmModal', false)}
          size="mini"
          className="deletion"
        />
      </div>
    );
  }
}
