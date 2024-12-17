import React from 'react';
import { useTranslation } from 'react-i18next';
import backgroundImage from '../../../../static/background.jpg';
import PanelCard from '../../../UI/PanelCards';
import { panelVariables } from '../../../../utils/variables';
import { useReduxSelector } from '../../../../store/Store';

type CustomerPanelProps = {
  appHeight: number;
};

const CustomerPanel: React.FC<CustomerPanelProps> = ({ appHeight }) => {
  const { t } = useTranslation(['home']);
  const numberOfPanels = 3;
  const windowWidth = useReduxSelector((state) => state.home.windowWidth);
  const windowHeight = useReduxSelector((state) => state.home.windowHeight);
  const panelWidth = (windowWidth - (windowWidth / numberOfPanels / 6) * 4) / numberOfPanels;
  const panelHeight = panelWidth + 150;
  const cardMediaHeight = panelHeight - 100;

  return (
    <div
      className="bg-no-repeat bg-cover bg-center bg-fixed h-screen "
      // style={{ backgroundImage: `linear-gradient(${panelVariables.customerPanelBackgroundColor}), url(${backgroundImage})` }}
    >
      <div className={`absolute left-[50%] top-[50%] -translate-x-1/2  -translate-y-1/2 flex justify-items-between gap-[50px] h-[calc(100%-${appHeight}px)] `}>
        {/* <PanelCard
          linkto=""
          title={`${t('sentInvoices', { ns: ['supplier'] })}`}
          subheader={`${t('searchExport', { ns: ['supplier'] })}`}
          backgroundColor={panelVariables.customerPanelColors[0]}
          image={require('../../../../static/invoices.jpg')}
          panelWidth={panelWidth}
          panelHeight={panelHeight}
          cardMediaHeight={cardMediaHeight}
        />
        <PanelCard
          linkto=""
          title={`${t('statistics', { ns: ['supplier'] })}`}
          subheader={`${t('graphs', { ns: ['supplier'] })}`}
          backgroundColor={panelVariables.customerPanelColors[1]}
          image={require('../../../../static/graph.jpg')}
          panelWidth={panelWidth}
          panelHeight={panelHeight}
          cardMediaHeight={cardMediaHeight}
        />
        <PanelCard
          linkto=""
          title={`${t('statistics', { ns: ['supplier'] })}`}
          subheader={`${t('graphs', { ns: ['supplier'] })}`}
          backgroundColor={panelVariables.customerPanelColors[2]}
          image={require('../../../../static/newinvoice.jpg')}
          panelWidth={panelWidth}
          panelHeight={panelHeight}
          cardMediaHeight={cardMediaHeight}
        /> */}
      </div>
    </div>
  );
};

export default CustomerPanel;
