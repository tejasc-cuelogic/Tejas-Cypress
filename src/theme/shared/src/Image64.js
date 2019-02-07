import React from 'react';
import { Image } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import emptyImage1 from '../../../assets/images/gallery-placeholder-3-2.jpg';
import emptyImage2 from '../../../assets/images/gallery-placeholder-16-9.jpg';

@inject('imageStore')
@observer
class Image64 extends React.Component {
  state = { data: '' };
  componentWillMount() {
    const emptyImage = this.props.imgType && this.props.imgType === 'heroImage' ? emptyImage2 : emptyImage1;
    if (this.props.srcUrl) {
      this.props.imageStore.getBase64Content(this.props.srcUrl).then((res) => {
        if (res.includes('data:')) {
          this.setState({ data: res || emptyImage });
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
  componentWillReceiveProps() {
    const emptyImage = this.props.imgType && this.props.imgType === 'heroImage' ? emptyImage2 : emptyImage1;
    if (this.props.srcUrl) {
      this.props.imageStore.getBase64Content(this.props.srcUrl).then((res) => {
        if (res.includes('data:')) {
          this.setState({ data: res || emptyImage });
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
