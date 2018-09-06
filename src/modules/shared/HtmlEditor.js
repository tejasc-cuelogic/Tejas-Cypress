/* eslint-disable import/no-extraneous-dependencies  */
import React from 'react';
import $ from 'jquery';
import 'froala-editor/js/froala_editor.pkgd.min';

// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

// Require Font Awesome.
import 'font-awesome/css/font-awesome.css';

import FroalaEditor from 'react-froala-wysiwyg';

window.$ = $;
window.jQuery = $;

const config = {
  placeholderText: 'Edit Your Content Here!',
  toolbarButtons: ['html', '|', 'undo', 'redo', '|', 'paragraphFormat', '|', 'bold', 'italic', 'strikeThrough', 'underline', '|', 'superscript', 'subscript', '|', 'insertLink', '|', 'insertImage', '|', 'align', 'formatUL', 'formatOL', '|', 'insertHR', '|', 'clearFormatting', 'fullscreen'],
  charCounterCount: false,
  height: '70vh',
  editorClass: 'html-editor',
  linkList: [],
  imageManager: false,
};

export default class HtmlEditor extends React.Component {
  state = {
    content: 'content',
  }
  handleModelChange = (content) => {
    this.setState({ content });
  }
  render() {
    return (
      <FroalaEditor
        tag="textarea"
        model={this.state.content}
        config={config}
        onModelChange={this.handleModelChange}
      />
    );
  }
}
