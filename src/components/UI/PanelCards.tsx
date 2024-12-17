import React, { useState } from 'react';
import Card from '@mui/material/Card';
import { Box, CardActionArea, CardHeader, CardMedia } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import useTextToSpeech from '../../logics/useTextToSpeech';
import { useReduxDispatch } from '../../store/Store';
import { homeActions } from '../../store/appSlices/HomeSlice';
import { menuBackgroundColor } from '../../utils/variables';

type PanelCardProps = {
  linkto: string;
  title: string;
  subheader: string;
  backgroundColor: string;
  image: string;
  image_?: string;
  panelWidth: number;
  panelHeight: number;
  cardMediaHeight: number;
  marginLeft?: string;
  marginRight?: string;
  marginTop?: string;
  marginBottom?: string;
  modal?: string;
};

type ImageToogleOnMouseProps = {
  primaryImg: string;
  secondaryImg: string;
  height: number;
};

export const ImageToggleOnMouse: React.FC<ImageToogleOnMouseProps> = ({ primaryImg, secondaryImg, height }) => {
  const [imgSrc, setImgSrc] = useState(primaryImg);

  const mouseEnter = () => {
    setImgSrc(secondaryImg);
  };

  const mouseLeave = () => {
    setImgSrc(primaryImg);
  };

  return (
    <Box onMouseEnter={(e) => mouseEnter()} onMouseLeave={(e) => mouseLeave()} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <CardMedia sx={{ height: height }} component="img" image={imgSrc} />
    </Box>
  );
};

const PanelCard: React.FC<PanelCardProps> = ({
  linkto,
  title,
  subheader,
  backgroundColor,
  image,
  image_,
  panelWidth,
  panelHeight,
  cardMediaHeight,
  marginLeft,
  marginRight,
  marginTop,
  marginBottom,
  modal,
}) => {
  const { handlePlay, handleStop } = useTextToSpeech();
  const dispatch = useReduxDispatch();

  const onClick = () => {
    switch (modal) {
      case '1': {
        dispatch(homeActions.setIsPanel1ModalOpen(true));
        break;
      }
      case '2': {
        dispatch(homeActions.setIsPanel2ModalOpen(true));
        break;
      }
      case '3': {
        dispatch(homeActions.setIsPanel3ModalOpen(true));
        break;
      }
      default:
    }
  };

  return (
    <Card
      sx={{
        width: panelWidth,
        height: panelHeight,
        marginLeft: marginLeft ? marginLeft : '',
        marginRight: marginRight ? marginRight : '',
        marginTop: marginTop ? marginTop : '',
        marginBottom: marginBottom ? marginBottom : '',
        ':hover': {
          boxShadow: '20px 20px 40px rgba(8, 100, 170, 0.95)',
        },
        border: 0.6,
        borderColor: menuBackgroundColor,
      }}
      onMouseEnter={() => handlePlay(title)}
      onMouseLeave={() => handleStop()}
    >
      <CardActionArea component={RouterLink} to={linkto} onClick={() => (modal ? onClick() : {})}>
        <CardHeader sx={{ background: backgroundColor }} avatar={<></>} title={title} subheader={subheader} />
        {!image_ ? <CardMedia sx={{ height: cardMediaHeight }} component="img" image={image} /> : <ImageToggleOnMouse primaryImg={image} secondaryImg={image_} height={cardMediaHeight} />}
      </CardActionArea>
    </Card>
  );
};

export default PanelCard;
