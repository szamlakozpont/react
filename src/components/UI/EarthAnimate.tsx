import React from 'react';
import { useReduxDispatch } from '../../store/Store';
import { tableActions } from '../../store/appSlices/TableSlice';

import '../scss/earth.scss';
import backgroundImage from '../../static/earth.jpeg';
import useTextToSpeech from '../../logics/useTextToSpeech';
import { useTranslation } from 'react-i18next';

export const EarthEffect = () => {
  const { t } = useTranslation(['home']);
  const dispatch = useReduxDispatch();
  const animate = true;

  const { handlePlay, handleStop } = useTextToSpeech();

  const handleClick = async () => {
    dispatch(tableActions.setIsMapModalOpen(true));
  };

  return (
    <>
      <div className="flex items-center justify-center" onMouseEnter={() => handlePlay(t('geoStats', { ns: ['home'] }))} onMouseLeave={() => handleStop()}>
        <div
          className="EarthAnimate"
          style={
            animate
              ? ({
                  '--Height': '250px',
                  backgroundImage: `url(${backgroundImage})`,
                  backgroundSize: 'auto 100%',
                } as React.CSSProperties)
              : ({ '--Height': '110px' } as React.CSSProperties)
          }
          onClick={() => handleClick()}
        >
          <span>STATS</span>
        </div>
      </div>
    </>
  );
};
