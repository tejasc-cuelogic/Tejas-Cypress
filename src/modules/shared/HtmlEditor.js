/* eslint-disable import/no-extraneous-dependencies  */
import React from 'react';
import $ from 'jquery';
import { get } from 'lodash';
import Parser from 'html-react-parser';
import 'froala-editor/js/froala_editor.pkgd.min';

// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

// Require Font Awesome.
import 'font-awesome/css/font-awesome.css';

import FroalaEditor from 'react-froala-wysiwyg';
import { fileUpload } from '../../services/actions';

window.$ = $;
window.jQuery = $;

export default class HtmlEditor extends React.Component {
  getConfig = (keyStart, overrides) => {
    const config = {
      placeholderText: 'Enter here..',
      toolbarButtons: ['html', '|', 'undo', 'redo', '|', 'paragraphFormat', '|', 'bold', 'italic', 'strikeThrough', 'underline', '|', 'superscript', 'subscript', '|', 'insertLink', 'insertTable', '|', 'insertImage', '|', 'align', 'formatUL', 'formatOL', '|', 'insertHR', '|', 'clearFormatting', 'fullscreen'],
      charCounterCount: false,
      editorClass: 'html-editor',
      linkList: [],
      heightMin: 244,
      heightMax: '70vh',
      imageManager: false,
      events: {
        'froalaEditor.image.beforeUpload': (e, editor, images) => {
          const fileObj = {
            obj: this.getBase64(get(images, '[0]')),
            name: get(images, '[0].name'),
          };
          fileUpload.uploadToS3(fileObj, 'offering').then((res) => {
            editor.image.insert(res);
          });
        },
        // 'froalaEditor.image.error': (e, editor, error) => {
        //   console.log(error);
        // },
      },
    };
    return { ...config, ...overrides };
  };
  getBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
  handleModelChange = (content) => {
    this.props.changed(this.props.name, content, this.props.form, this.props.index);
  }
  handelUpload = () => {
    console.log('d');
  }
  render() {
    const { keyStart, readOnly } = this.props;
    if (readOnly) {
      return <div>{Parser(this.props.content || '')}</div>;
    }
    return (
      <FroalaEditor
        tag="textarea"
        model={this.props.content}
        config={this.getConfig(keyStart, this.props.overrides)}
        onModelChange={this.handleModelChange}
      />
    );
  }
}
