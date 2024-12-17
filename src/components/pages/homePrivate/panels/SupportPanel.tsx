import React from 'react';
import { useTranslation } from 'react-i18next';
import backgroundImage from '../../../../static/background.jpg';
import PanelCard from '../../../UI/PanelCards';
import { FIXIP_SUPPORT, panelVariables } from '../../../../utils/variables';
import { useReduxSelector } from '../../../../store/Store';
import { EarthEffect } from '../../../UI/EarthAnimate';

type SupportPanelProps = {
  appHeight: number;
};

const SupportPanel: React.FC<SupportPanelProps> = ({ appHeight }) => {
  const { t } = useTranslation(['home']);
  const numberOfPanels = 5;
  const windowWidth = useReduxSelector((state) => state.home.windowWidth);
  const windowHeight = useReduxSelector((state) => state.home.windowHeight);
  const panelWidth = (windowWidth - (windowWidth / numberOfPanels / (numberOfPanels + 3)) * (numberOfPanels + 1)) / numberOfPanels;
  const panelHeight = panelWidth + 100;
  const cardMediaHeight = panelHeight - 100;

  return (
    <div
      className="bg-no-repeat bg-cover bg-center bg-fixed h-screen "
      // style={{ backgroundImage: `linear-gradient(${panelVariables.supportPanelBackgroundColor}), url(${backgroundImage})` }}
    >
      {/* <EarthEffect /> */}
      <div className={`absolute left-[50%] top-[50%] -translate-x-1/2  -translate-y-1/2 flex justify-items-between gap-[50px] h-[calc(100%-${appHeight}px)] `}>
        <PanelCard
          linkto={`${FIXIP_SUPPORT}/suppliers`}
          title={`${t('suppliers', { ns: ['appbar'] })}`}
          subheader=""
          // {`${t('searchExport', { ns: ['supplier'] })}`}
          backgroundColor={panelVariables.supportPanelColors[0]}
          image={require('../../../../static/sell_17511697.png')}
          image_={require('../../../../static/sell_17511697.gif')}
          panelWidth={panelWidth}
          panelHeight={panelHeight}
          cardMediaHeight={cardMediaHeight}
        />
        <PanelCard
          linkto={`${FIXIP_SUPPORT}/partners`}
          title={`${t('partners_', { ns: ['appbar'] })}`}
          subheader=""
          // {`${t('graphs', { ns: ['supplier'] })}`}
          backgroundColor={panelVariables.supportPanelColors[1]}
          image={require('../../../../static/remote-worker_17675749.png')}
          image_={require('../../../../static/remote-worker_17675749.gif')}
          panelWidth={panelWidth}
          panelHeight={panelHeight}
          cardMediaHeight={cardMediaHeight}
        />
        <PanelCard
          linkto={`${FIXIP_SUPPORT}/invoices`}
          title={`${t('invoices', { ns: ['appbar'] })}`}
          subheader=""
          // {`${t('sendingInvoice', { ns: ['supplier'] })}`}
          backgroundColor={panelVariables.supportPanelColors[2]}
          image={require('../../../../static/web-design_10690695.png')}
          image_={require('../../../../static/web-design_10690695.gif')}
          panelWidth={panelWidth}
          panelHeight={panelHeight}
          cardMediaHeight={cardMediaHeight}
        />
        <PanelCard
          linkto={`${FIXIP_SUPPORT}/users`}
          title={`${t('users', { ns: ['appbar'] })}`}
          subheader=""
          // {`${t('searchExport', { ns: ['supplier'] })}`}
          backgroundColor={panelVariables.supportPanelColors[0]}
          image={require('../../../../static/inheritance_11259503.png')}
          image_={require('../../../../static/inheritance_11259503.gif')}
          panelWidth={panelWidth}
          panelHeight={panelHeight}
          cardMediaHeight={cardMediaHeight}
        />
        <PanelCard
          linkto={`${FIXIP_SUPPORT}/emails`}
          title={`${t('emails', { ns: ['appbar'] })}`}
          subheader=""
          // {`${t('searchExport', { ns: ['supplier'] })}`}
          backgroundColor={panelVariables.supportPanelColors[1]}
          image={require('../../../../static/email_10826776.png')}
          image_={require('../../../../static/email_10826776.gif')}
          panelWidth={panelWidth}
          panelHeight={panelHeight}
          cardMediaHeight={cardMediaHeight}
        />
      </div>
    </div>
  );
};

export default SupportPanel;
