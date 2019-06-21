import React from 'react';
import { findDOMNode } from 'react-dom';
import Dropzone from 'dropzone';

Dropzone.autoDiscover = false;
Dropzone.options.singleFileDropzone = {
  maxFiles: 1,
  accept: function(file, done) {
    console.log('uploaded');
    done();
  },
  init: function() {
    this.on('maxfilesexceeded', function(file) {
      this.removeAllFiles();
      this.addFile(file);
    });
    this.on('addedfile', function(file) {
      console.log('Added file.');
    });
  }
};

export default class DropzoneInput extends React.Component {
  componentDidMount() {
    let element = $(findDOMNode(this));
    let options = this.props.options || {};
    element.dropzone(options);
  }

  render() {
    return this.props.children;
  }
}
