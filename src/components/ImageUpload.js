//import { withRouter } from 'react-router'
//import { connect } from 'react-redux'
import React, {Component} from 'react';
import {bindAll} from 'lodash';

// semantic-ui
//import { Container, Form, Input, Button, Grid } from 'semantic-ui-react'

// alert
import Alert from 'react-s-alert';

// API
import * as MyAPI from '../utils/MyAPI'
//import { LOCAL_STRAGE_KEY } from '../utils/Settings'

class ImageUpload extends Component {

  constructor() {
   super();
    this.state = {
      data_uri: null,
      processing: false
    }

    bindAll(this, 'handleFile', 'handleSubmit');
  }

  handleFile(e) {
    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onload = (upload) => {
      this.setState({
        data_uri: upload.target.result,
        filename: file.name,
        filetype: file.type
      });
    };

    reader.readAsDataURL(file);
  }

  handleSubmit(e)
  {
    console.log('handleSubmit enter');

    e.preventDefault();
    const _this = this;

    this.setState({
      processing: true
    });

    const params = {
      data_uri: this.state.data_uri,
      filename: this.state.filename,
      filetype: this.state.filetype
    }

    console.log('Passing params to API:')
    console.log('data uri')
    console.log(params.data_uri)
    console.log('filename')
    console.log(params.filename)
    console.log('filetype')
    console.log(params.filetype)
    // Upload picture
    MyAPI.upload_image(params)
    .then((data) =>
    {
      return new Promise((resolve, reject) =>
      {
        if (data.status !== 'success')
        {
          let error_text = 'Error';
          if (data.detail)
          {
            error_text = data.detail
          }
          reject(error_text)

        }
        else
        {
          console.log('API: upload image promise success!')
          // success
          _this.setState({
            processing: false,
            uploaded_uri: data.uri
      });
        }
      })
    })
    .then(() => {
      console.log('upload: redirect here')
      // redirect
      this.props.history.push("/dashboard")
    })
    .catch((err) => {
      console.log("err:", err)

      Alert.error(err, {
        position: 'top-right',
        effect: 'slide',
        timeout: 5000
      });
   })
  }

          //<img className='image-preview' src={this.state.uploaded_uri} />
          //<pre className='image-link-box'>{this.state.uploaded_uri}</pre>
  render() {
    let processing;
    let uploaded;

    console.log('Image Upload Rendering!');

    if (this.state.uploaded_uri) {
      uploaded = (
        <div>
          <h4>Image uploaded!</h4>
          <img className='image-preview' src={this.state.data_uri} alt="Uploaded Title" />
          <pre className='image-link-box'>{this.state.data_uri}</pre>
        </div>
      );
    }

    if (this.state.processing) {
      processing = "Processing image, hang tight";
    }

    return(
      <div className='row'>
        <div className='col-sm-12'>
          <label>Upload the image</label>
          <form onSubmit={this.handleSubmit} encType="multipart/form-data">
            <input type="file" onChange={this.handleFile} />
            <input disabled={this.state.processing} className='btn btn-primary' type="submit" value="Upload" />
            {processing}
          </form>
          {uploaded}
        </div>
      </div>
    );
  }
}

export default ImageUpload;
