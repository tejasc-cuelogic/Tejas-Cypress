import React from 'react';
import { Image } from 'semantic-ui-react';
import apiService from '../../../api/restApi';
import emptyImage1 from '../../../assets/images/gallery-placeholder-3-2.jpg';
import emptyImage2 from '../../../assets/images/gallery-placeholder-16-9.jpg';

class Image64 extends React.Component {
  state = { data: '' };
  componentWillMount() {
    const emptyImage = this.props.imgType && this.props.imgType === 'heroImage' ? emptyImage2 : emptyImage1;
    if (this.props.srcUrl) {
      apiService.getRemoteFile(this.props.srcUrl).then((res) => {
        if (res.text.includes('data:')) {
          this.setState({ data: res.text || emptyImage });
        } else {
          this.setState({ data: this.props.srcUrl || emptyImage });
        }
      }).catch((err) => {
        console.log(err);
        this.setState({ data: emptyImage });
      });
    } else {
      this.setState({ data: emptyImage });
    }
  }
  render() {
    return this.props.bg ? (
      <div {...this.props} style={{ backgroundImage: `url(${this.state.data})` }} />
    ) :
      <Image {...this.props} src={this.state.data} />;
  }
}

export default Image64;
