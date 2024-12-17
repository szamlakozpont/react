import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material';
import InfoPanelPublic from './panels/InfoPanelPublic';
import { useReduxSelector } from '../../../store/Store';
import { PanelModal } from '../../UI/PanelModal';

const HomePublic: React.FC = () => {
  const { i18n } = useTranslation(['home']);
  const isPanel1ModalOpen = useReduxSelector((state) => state.home.isPanel1ModalOpen);
  const isPanel2ModalOpen = useReduxSelector((state) => state.home.isPanel2ModalOpen);
  const isPanel3ModalOpen = useReduxSelector((state) => state.home.isPanel3ModalOpen);

  const {
    mixins: { toolbar },
  } = useTheme();
  const appHeight = parseInt(toolbar?.minHeight as string) + 8;

  useEffect(() => {
    const language = window.localStorage.getItem('APP_LANGUAGE');
    if (language !== null) i18n.changeLanguage(JSON.parse(language));
  }, [i18n]);
  return (
    <>
      <div className="bg-transparent h-screen w-screen absolute left-[50%] -translate-x-1/2 " style={{ top: appHeight }}>
        {<InfoPanelPublic appHeight={appHeight} />}
      </div>
      {isPanel1ModalOpen && <PanelModal modal="1" />}
      {isPanel2ModalOpen && <PanelModal modal="2" />}
      {isPanel3ModalOpen && <PanelModal modal="3" />}
    </>
  );
};

export default HomePublic;
