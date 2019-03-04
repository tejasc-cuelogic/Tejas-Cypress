/* eslint-disable import/no-extraneous-dependencies  */
import React from 'react';
import $ from 'jquery';
import { inject, observer } from 'mobx-react';
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
import { FROALA_EDITOR_LICENSE } from '../../constants/common';
import { UPLOADS_CONFIG } from '../../constants/aws';

window.$ = $;
window.jQuery = $;

@inject('uiStore')
@observer
export default class HtmlEditor extends React.Component {
  state = { inProgress: false };
  getConfig = (keyStart, overrides) => {
    const config = {
      placeholderText: 'Enter here..',
      toolbarButtons: ['html', '|', 'undo', 'redo', '|', 'paragraphFormat', '|', 'bold', 'italic', 'strikeThrough', 'underline', '|', 'superscript', 'subscript', '|', 'insertLink', 'insertTable', '|', 'insertImage', '|', 'align', 'formatUL', 'formatOL', '|', 'insertHR', '|', 'clearFormatting', 'fullscreen'],
      charCounterCount: false,
      editorClass: 'html-editor',
      key: FROALA_EDITOR_LICENSE,
      linkList: [],
      heightMin: 244,
      heightMax: '70vh',
      imageManager: false,
      events: {
        'froalaEditor.image.beforeUpload': (e, editor, images) => {
          this.props.uiStore.setFieldvalue('htmlEditorImageLoading', true);
          this.setState({ inProgress: true });
          if (images.length) {
            const fileName = get(images, '[0].name');
            const file = get(images, '[0]');
            const fileObj = {
              obj: file,
              type: file.type,
              name: fileName,
            };
            fileUpload.uploadToS3(fileObj, this.props.imageUploadPath || 'RichTextEditor').then((res) => {
              if (editor && editor.image && editor.image.get()) {
                const imgUrl = `https://${UPLOADS_CONFIG.bucket}/${res}`;
                // console.log(editor.image.get(), 'heyyyy');
                editor.image.get().attr('src', imgUrl);
                editor.image.insert(imgUrl, null, null, editor.image.get());
                this.props.uiStore.setFieldvalue('htmlEditorImageLoading', false);
                this.setState({ inProgress: false });
              } else {
                console.log('else block');
                this.props.uiStore.setFieldvalue('htmlEditorImageLoading', false);
                this.setState({ inProgress: false });
              }
              return false;
            }).catch((err) => {
              console.log('catch image', err);
              this.props.uiStore.setFieldvalue('htmlEditorImageLoading', false);
              this.setState({ inProgress: false });
              return false;
            });
          }
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
    if (readOnly) {
      return <div>{Parser(this.props.content || '')}</div>;
    }
    return (
      <div className={this.state.inProgress ? 'no-pointer-events' : ''}>
        <FroalaEditor
          tag="textarea"
          model={this.props.content}
          config={this.getConfig(keyStart, this.props.overrides)}
          onModelChange={this.handleModelChange}
        />
      </div>
    );
  }
}
