import React from 'react';
import { useTranslation } from 'react-i18next';
import PanelCard from '../../../UI/PanelCards';
import { mobileSizeWidth, panelVariables } from '../../../../utils/variables';
import { useReduxSelector } from '../../../../store/Store';
import { Typography } from '@mui/material';
import useTextToSpeech from '../../../../logics/useTextToSpeech';

type InfoPanelPublicProps = {
  appHeight: number;
};

const InfoPanelPublic: React.FC<InfoPanelPublicProps> = ({ appHeight }) => {
  const { t } = useTranslation(['griff']);
  const numberOfPanels = 3;
  const windowWidth = useReduxSelector((state) => state.home.windowWidth);
  const windowHeight = useReduxSelector((state) => state.home.windowHeight);
  const gapWidth = windowWidth * 0.03;
  const panelWidth = windowWidth >= mobileSizeWidth ? (windowWidth - gapWidth * (numberOfPanels + 1)) / numberOfPanels : windowWidth - gapWidth * 2 > 300 ? 300 : windowWidth * 0.9 - gapWidth * 2;
  const panelHeight = panelWidth > 250 ? panelWidth * 1.1 : panelWidth > 100 ? panelWidth * 1.3 : windowHeight * 0.3;
  const cardMediaHeight = panelWidth > 250 ? panelHeight * 0.8 : panelHeight * 0.7;

  const { handlePlay, handleStop } = useTextToSpeech();

  return (
    <div className="overflow-y-scroll" style={{ height: windowHeight - (appHeight + Math.min(windowHeight * 0.1, 50)) }}>
      <div className={`${windowWidth > mobileSizeWidth ? 'flex items-center justify-center text-white p-5' : 'flex flex-col items-center text-orange-500 p-5'}`}>
        {/* <img src={require('../../../../static/construction.png')} alt="ConstructionIcon"></img>
        <span className={`${windowWidth > mobileSizeWidth ? 'text-xl' : 'text-l'}`}>{t('underConstruction', { ns: ['griff'] })}</span> */}

        <Typography
          gutterBottom
          variant={windowWidth > 600 ? 'h3' : 'h6'}
          align="center"
          color="white"
          onMouseEnter={() => handlePlay('Egyszerű és hatékony elektronikus számla megoldás költségvetési intézmények és önkormányzatok számára.')}
          onMouseLeave={() => handleStop()}
        >
          Egyszerű és hatékony elektronikus számla megoldás költségvetési intézmények és önkormányzatok számára.
        </Typography>
      </div>
      <div className={`${windowWidth > mobileSizeWidth ? ' flex flex-row justify-items-between' : 'flex flex-col items-center'} `}>
        <PanelCard
          linkto=""
          title={'Szolgáltatásaink'}
          subheader=""
          // title={`${t('eInvoice', { ns: ['griff'] })}`}
          // subheader={`${t('send', { ns: ['griff'] })}`}
          backgroundColor={panelVariables.supportPanelColors[0]}
          image={require('../../../../static/e-szamla.png')}
          panelWidth={panelWidth}
          panelHeight={panelHeight}
          cardMediaHeight={cardMediaHeight}
          marginLeft={`${windowWidth > mobileSizeWidth ? gapWidth : 0}px`}
          marginRight={`${windowWidth > mobileSizeWidth ? gapWidth : 0}px`}
          marginTop={`${windowWidth <= mobileSizeWidth ? gapWidth : 0}px`}
          marginBottom={`${windowWidth <= mobileSizeWidth ? gapWidth : 0}px`}
          modal="1"
        />
        <PanelCard
          linkto=""
          title={'Rólunk'}
          subheader=""
          // title={`${t('economical', { ns: ['griff'] })}`}
          // subheader={`${t('costEffective', { ns: ['griff'] })}`}
          backgroundColor={panelVariables.supportPanelColors[1]}
          image={require('../../../../static/e-szamla-elonyei.png')}
          panelWidth={panelWidth}
          panelHeight={panelHeight}
          cardMediaHeight={cardMediaHeight}
          marginRight={`${windowWidth > mobileSizeWidth ? gapWidth : 0}px`}
          marginBottom={`${windowWidth <= mobileSizeWidth ? gapWidth : 0}px`}
          modal="2"
        />
        <PanelCard
          linkto=""
          title={'Kapcsolat'}
          subheader=""
          // title={`${t('complex', { ns: ['griff'] })}`}
          // subheader={`${t('integration', { ns: ['griff'] })}`}
          backgroundColor={panelVariables.supportPanelColors[2]}
          image={require('../../../../static/integracio.png')}
          panelWidth={panelWidth}
          panelHeight={panelHeight}
          cardMediaHeight={cardMediaHeight}
          marginRight={`${windowWidth > mobileSizeWidth ? gapWidth : 0}px`}
          marginBottom={`${windowWidth <= mobileSizeWidth ? gapWidth : 0}px`}
          modal="3"
        />
      </div>
    </div>
  );
};

export default InfoPanelPublic;
