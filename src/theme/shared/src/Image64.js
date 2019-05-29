import React from 'react';
import { Image } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { UPLOADS_CONFIG } from '../../../constants/aws';
import emptyImage1 from '../../../assets/images/gallery-placeholder-3-2.jpg';
import emptyImage2 from '../../../assets/images/gallery-placeholder-16-9.jpg';
import emptyImage3 from '../../../assets/images/gallery-placeholder-1-1.jpg';
import userPlaceholder from '../../../assets/images/leader-placeholder.jpg';

@inject('imageStore')
@observer
class Image64 extends React.Component {
  state = { data: this.props.avatar ? userPlaceholder : this.props.avatarPlaceholder ? emptyImage3 : this.props.imgType && this.props.imgType === 'heroImage' ? emptyImage2 : emptyImage1 };
  componentWillMount() {
    const emptyImage = this.props.avatar ? userPlaceholder : this.props.avatarPlaceholder ? emptyImage3 : this.props.imgType && this.props.imgType === 'heroImage' ? emptyImage2 : emptyImage1;
    if (this.props.srcUrl) {
      const imgUrl = (this.props.srcUrl.includes('https://') || this.props.srcUrl.includes('http://')) ? this.props.srcUrl : `https://${UPLOADS_CONFIG.bucket}/${this.props.srcUrl}`;
      this.props.imageStore.getBase64Content(imgUrl).then((res) => {
        if (res.includes('data:')) {
          this.setState({ data: res || emptyImage });
        } else {
          this.setState({ data: imgUrl || emptyImage });
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
    const emptyImage = this.props.avatar ? userPlaceholder : this.props.avatarPlaceholder ? emptyImage3 : this.props.imgType && this.props.imgType === 'heroImage' ? emptyImage2 : emptyImage1;
    if (this.props.srcUrl) {
      const imgUrl = (this.props.srcUrl.includes('https://') || this.props.srcUrl.includes('http://')) ? this.props.srcUrl : `https://${UPLOADS_CONFIG.bucket}/${this.props.srcUrl}`;
      this.props.imageStore.getBase64Content(imgUrl).then((res) => {
        if (res.includes('data:')) {
          this.setState({ data: res || emptyImage });
        } else {
          this.setState({ data: imgUrl || emptyImage });
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
