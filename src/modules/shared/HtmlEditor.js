/* eslint-disable import/no-extraneous-dependencies  */
import React from 'react';
import $ from 'jquery';
import { S3 } from 'wysiwyg-editor-node-sdk/lib/s3';
import 'froala-editor/js/froala_editor.pkgd.min';

// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

// Require Font Awesome.
import 'font-awesome/css/font-awesome.css';

import FroalaEditor from 'react-froala-wysiwyg';
import { UPLOADS_CONFIG } from '../../constants/aws';

window.$ = $;
window.jQuery = $;

const uploadsConfig = { ...UPLOADS_CONFIG, ...{ acl: 'public-read', keyStart: 'uploads' } };
const getConfig = () => {
  const config = {
    placeholderText: 'Your content goes here!',
    toolbarButtons: ['html', '|', 'undo', 'redo', '|', 'paragraphFormat', '|', 'bold', 'italic', 'strikeThrough', 'underline', '|', 'superscript', 'subscript', '|', 'insertLink', '|', 'insertImage', '|', 'align', 'formatUL', 'formatOL', '|', 'insertHR', '|', 'clearFormatting', 'fullscreen'],
    charCounterCount: false,
    imageUploadURL: false,
    height: '70vh',
    editorClass: 'html-editor',
    linkList: [],
    imageManager: false,
    imageUploadToS3: S3.getHash({ ...uploadsConfig }),
  };
  console.log(config);
  return config;
};

export default class HtmlEditor extends React.Component {
  handleModelChange = (content) => {
    this.props.changed(this.props.name, content);
  }
  render() {
    const { keyStart } = this.props;
    return (
      <FroalaEditor
        tag="textarea"
        model={this.props.content}
        config={getConfig(keyStart)}
        onModelChange={this.handleModelChange}
      />
    );
  }
}
