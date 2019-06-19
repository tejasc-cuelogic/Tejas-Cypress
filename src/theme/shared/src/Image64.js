import React, { useState, useEffect } from 'react';
import { Image } from 'semantic-ui-react';
import { UPLOADS_CONFIG } from '../../../constants/aws';
import apiService from '../../../api/restApi';
import emptyImage1 from '../../../assets/images/gallery-placeholder-3-2.jpg';
import emptyImage2 from '../../../assets/images/gallery-placeholder-16-9.jpg';
import emptyImage3 from '../../../assets/images/gallery-placeholder-1-1.jpg';
import userPlaceholder from '../../../assets/images/leader-placeholder.jpg';

function Image64(props) {
  const [data, setData] = useState(props.avatar ? userPlaceholder : props.avatarPlaceholder ? emptyImage3 : props.imgType && props.imgType === 'heroImage' ? emptyImage2 : emptyImage1);

  useEffect(async () => {
    const emptyImage = props.avatar ? userPlaceholder : props.avatarPlaceholder ? emptyImage3 : props.imgType && props.imgType === 'heroImage' ? emptyImage2 : emptyImage1;
    if (props.srcUrl) {
      const imgUrl = (props.srcUrl.includes('https://') || props.srcUrl.includes('http://')) ? props.srcUrl : `https://${UPLOADS_CONFIG.bucket}/${props.srcUrl}`;
      try {
        const result = await apiService.getRemoteFile(imgUrl);
        setData(result.includes('data:') ? (result || emptyImage) : (imgUrl || emptyImage));
      } catch (e) {
        setData(emptyImage);
      }
    } else {
      setData(emptyImage);
    }
  });

  return props.bg ? (
    <div {...props} style={{ backgroundImage: `url(${data})` }} />
  )
    : <Image {...props} src={data} />;
}

export default Image64;
