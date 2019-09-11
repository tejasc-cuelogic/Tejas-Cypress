import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { Image } from 'semantic-ui-react';
import { UPLOADS_CONFIG } from '../../../constants/aws';
import apiService from '../../../api/restApi';
import emptyImage1 from '../../../assets/images/gallery-placeholder-3-2.jpg';
import emptyImage2 from '../../../assets/images/gallery-placeholder-16-9.jpg';
import emptyImage3 from '../../../assets/images/gallery-placeholder-1-1.jpg';
import userPlaceholder from '../../../assets/images/leader-placeholder.jpg';
import Helper from '../../../helper/utility';

function Image64(props) {
  const [data, setData] = useState(props.avatar ? userPlaceholder : props.avatarPlaceholder ? emptyImage3 : props.imgType && props.imgType === 'heroImage' ? emptyImage2 : emptyImage1);

  async function getImage() {
    const emptyImage = props.avatar ? userPlaceholder : props.avatarPlaceholder ? emptyImage3 : props.imgType && props.imgType === 'heroImage' ? emptyImage2 : emptyImage1;
    if (props.srcUrl) {
      const imgUrl = (props.srcUrl.includes('https://') || props.srcUrl.includes('http://')) ? props.srcUrl : `https://${UPLOADS_CONFIG.bucket}/${props.srcUrl}`;
      try {
        const imgName = Helper.processImageFileName(imgUrl, props.uiStore.responsiveVars);
        const result = await apiService.getRemoteFile(imgName);
        setData(result.text.includes('data:') ? (result.text || emptyImage) : (imgName || emptyImage));
      } catch (e) {
        setData(emptyImage);
      }
    } else {
      setData(emptyImage);
    }
  }

  useEffect(() => {
    getImage();
  }, []);

  return props.bg ? (
    <div {...props} style={{ backgroundImage: `url(${data})` }} />
  )
    : <Image {...props} src={data} />;
}

export default inject('uiStore')(observer(Image64));
