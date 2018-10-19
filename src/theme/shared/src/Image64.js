import React from 'react';
import { Image } from 'semantic-ui-react';
import apiService from '../../../api/restApi';
import emptyImage from '../../../assets/images/gallery-placeholder.jpg';

class Image64 extends React.Component {
  state = { data: '' };
  componentWillMount() {
    if (this.props.srcUrl) {
      apiService.getRemoteFile(this.props.srcUrl).then((res) => {
        this.setState({ data: res.text || emptyImage });
      }).catch(() => this.setState({ data: emptyImage }));
    } else {
      this.setState({ data: emptyImage });
    }
  }
  render() {
    return <Image src={this.state.data} />;
  }
}

export default Image64;
