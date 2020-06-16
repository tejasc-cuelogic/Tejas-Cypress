import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { Image } from 'semantic-ui-react';
import { UPLOADS_CONFIG } from '../../../constants/aws';
// import apiService from '../../../api/restApi';
import emptyImage1 from '../../../assets/images/gallery-placeholder-3-2.jpg';
import emptyImage2 from '../../../assets/images/gallery-placeholder-16-9.jpg';
import emptyImage3 from '../../../assets/images/gallery-placeholder-1-1.jpg';
import userPlaceholder from '../../../assets/images/leader-placeholder.jpg';
import Helper from '../../../helper/utility';

function Image64(props) {
  const [data, setData] = useState(props.avatar ? userPlaceholder : props.avatarPlaceholder ? emptyImage3 : props.imgType && props.imgType === 'heroImage' ? emptyImage2 : emptyImage1);
  const [oData, setOData] = useState(props.avatar ? userPlaceholder : props.avatarPlaceholder ? emptyImage3 : props.imgType && props.imgType === 'heroImage' ? emptyImage2 : emptyImage1);
  const [emptyImg, setEmptyImg] = useState(props.avatar ? userPlaceholder : props.avatarPlaceholder ? emptyImage3 : props.imgType && props.imgType === 'heroImage' ? emptyImage2 : emptyImage1);

  async function getImage() {
    const emptyImage = props.avatar ? userPlaceholder : props.avatarPlaceholder ? emptyImage3 : props.imgType && props.imgType === 'heroImage' ? emptyImage2 : emptyImage1;
    setEmptyImg(emptyImage);
    if (props.srcUrl) {
      const imgUrl = (props.srcUrl.includes('https://') || props.srcUrl.includes('http://')) ? props.srcUrl : `https://${UPLOADS_CONFIG.bucket}/${encodeURI(props.srcUrl)}`;
      try {
        const imgName = (props.avatar || props.originalImg) ? imgUrl : Helper.processImageFileName(imgUrl, props.uiStore.responsiveVars);
        setOData(imgUrl || emptyImage);
        // Deprecated the API call for getting base64 of an image
        // const result = await apiService.getRemoteFile(imgName);
        // setData(result.text.includes('data:') ? (result.text || emptyImage) : (imgName || emptyImage));
        setData((imgName || emptyImage));
      } catch (e) {
        setData(emptyImage);
      }
    } else {
      setData(emptyImage);
    }
  }

  function handelOnError(e) {
    e.target.error = null;
    if (!e.target.src.includes('data:') && (e.target.src.includes('http://') || e.target.src.includes('https://'))) {
      const email = {
        graphqlError: { operationName: 'Image Processing' },
        filePath: e.target.src,
        urlLocation: window.location.href,
        message: 'The requested file is not found in bucket.',
        key: props.srcUrl,
      };

      const params = {
        emailContent: JSON.stringify(email),
      };
      props.authStore.notifyApplicationError(params);
    }
    if (e.target.src.includes('__1920') || e.target.src.includes('__1024') || e.target.src.includes('__640')) {
      e.target.src = `${oData}`;
    } else {
      e.target.src = emptyImg;
    }
  }

  useEffect(() => {
    setTimeout(() => {
      getImage();
    }, props.setTimeout || 0);
  }, props.reRender ? null : []);

  return props.bg ? (
    <div {...props} style={{ backgroundImage: `url(${data})` }} />
  )
    : <Image {...props} alt={props.alt || 'Image not found!'} src={`${data}`} onError={handelOnError} />;
}

export default inject('uiStore', 'authStore')(observer(Image64));
