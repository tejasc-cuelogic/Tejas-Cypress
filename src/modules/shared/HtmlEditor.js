/* eslint-disable import/no-extraneous-dependencies  */
import React from 'react';
import $ from 'jquery';
import Parser from 'html-react-parser';
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

const uploadsConfig = { ...UPLOADS_CONFIG, ...{ acl: 'public-read', keyStart: 'offerings/' } };
const getConfig = (keyStart, overrides) => {
  const config = {
    placeholderText: 'Enter here..',
    toolbarButtons: ['html', '|', 'undo', 'redo', '|', 'paragraphFormat', '|', 'bold', 'italic', 'strikeThrough', 'underline', '|', 'superscript', 'subscript', '|', 'insertLink', '|', 'insertImage', '|', 'align', 'formatUL', 'formatOL', '|', 'insertHR', '|', 'clearFormatting', 'fullscreen'],
    charCounterCount: false,
    imageUploadURL: false,
    // height: '70vh',
    editorClass: 'html-editor',
    linkList: [],
    heightMin: 244,
    heightMax: '70vh',
    imageManager: false,
    imageUploadToS3: S3.getHash({ ...uploadsConfig }),
  };
  return { ...config, ...overrides };
};

export default class HtmlEditor extends React.Component {
  handleModelChange = (content) => {
    this.props.changed(this.props.name, content, this.props.form);
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
        config={getConfig(keyStart, this.props.overrides)}
        onModelChange={this.handleModelChange}
      />
    );
  }
}
