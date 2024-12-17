import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReduxDispatch, useReduxSelector } from '../../../store/Store';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { Slide, useTheme } from '@mui/material';
import { homeVariables } from '../../../utils/variables';
import SignInModal from '../../UI/userModals/SignInModal';
import { usePermissions } from '../../../logics/usePermissions';
import SupportPanel from './panels/SupportPanel';
import SupplierPanel from './panels/SupplierPanel';
import CustomerPanel from './panels/CustomerPanel';
import { homeActions } from '../../../store/appSlices/HomeSlice';
import { MapModal } from '../../UI/MapModal';
import useTextToSpeech from '../../../logics/useTextToSpeech';
// import SignUpModal from '../../modals/userModals/SignUpModal';

const HomePrivate: React.FC<{ showLogo: boolean; setShowLogo: Dispatch<SetStateAction<boolean>> }> = (props) => {
  const { i18n, t } = useTranslation(['home']);
  const isUserSignedIn = useReduxSelector((state) => state.auth.isSignedIn);
  const [isInit, setIsInit] = useState(!isUserSignedIn);
  const [isSignInClick, setIsSignInClick] = useState(false);
  // const [isSignUpClick, setIsSignUpClick] = useState(false);
  // const [openSignUpModal, setOpenSignUpModal] = useState(false);
  const [openSignInModal, setOpenSignInModal] = useState(false);
  const { isSupportUser, isSupplierUser, isCustomerUser } = usePermissions();
  const isMapModalOpen = useReduxSelector((state) => state.table.isMapModalOpen);

  const dispatch = useReduxDispatch();

  const { handlePlay, handleStop } = useTextToSpeech();

  const {
    mixins: { toolbar },
  } = useTheme();
  const appHeight = parseInt(toolbar?.minHeight as string) + 8;

  useEffect(() => {
    if (props.showLogo) props.setShowLogo(false);
  }, [props]);

  const handleSignIn = () => {
    setIsInit(false);
    setIsSignInClick(true);
  };

  // const handleSignUp = () => {
  //   setIsInit(false);
  //   setIsSignUpClick(true);
  // };

  const handleFunction = () => {
    if (isSignInClick) {
      setIsSignInClick(false);
      setOpenSignInModal(true);
    }
    // else if (isSignUpClick) {
    //   setIsSignUpClick(false);
    //   setOpenSignUpModal(true);
    // }
  };

  useEffect(() => {
    if (!isUserSignedIn) {
      const language = window.localStorage.getItem('APP_LANGUAGE');
      if (language !== null) i18n.changeLanguage(JSON.parse(language));
      setIsInit(true);
    }
  }, [i18n, isUserSignedIn]);

  useEffect(() => {
    dispatch(homeActions.setPageName('login'));
  }, [dispatch]);

  return (
    <div className="bg-transparent h-full">
      <div className={`flex justify-items-center h-[calc(100%-${appHeight}px)]`}>
        <div className={'absolute left-[50%] top-[100px] -translate-x-1/2 '}>
          <Slide
            direction="up"
            in={isInit}
            timeout={homeVariables.signInCardTimeout}
            easing={{
              enter: 'cubic-bezier(0, 1.6, .8, 1)',
            }}
            mountOnEnter
            unmountOnExit
            onExited={handleFunction}
          >
            <Card sx={{ minWidth: homeVariables.signInCardWidth }}>
              <CardContent>
                <div className="flex items-center justify-center text-3xl pb-5" onMouseEnter={() => handlePlay(t('title_', { ns: ['home'] }))} onMouseLeave={() => handleStop()}>
                  {t('title', { ns: ['home'] })}
                </div>
                <div className="flex items-center justify-center text-xl pb-1" onMouseEnter={() => handlePlay(t('welcome', { ns: ['home'] }))} onMouseLeave={() => handleStop()}>
                  {t('welcome', { ns: ['home'] })}
                </div>
                <div className="flex items-center justify-center" onMouseEnter={() => handlePlay(t('pleaseSignIn', { ns: ['home'] }))} onMouseLeave={() => handleStop()}>
                  {t('pleaseSignIn', { ns: ['home'] })}
                </div>
              </CardContent>
              <CardActions>
                <div className="flex mx-auto gap-7 mb-1">
                  <button
                    className="bg-transparent text-sky-600 px-4 border border-sky-600 hover:bg-sky-600 hover:text-white hover:border-transparent py-2 hover:scale-110 rounded-full"
                    onClick={handleSignIn}
                    onMouseEnter={() => handlePlay(t('signIn', { ns: ['home'] }))}
                    onMouseLeave={() => handleStop()}
                  >
                    {t('signIn', { ns: ['home'] })}
                  </button>
                  {/* <button
                    className="bg-transparent text-sky-600 px-4 border border-sky-600 hover:bg-sky-600 hover:text-white hover:border-transparent py-2 hover:scale-110 rounded-full"
                    onClick={handleSignUp}
                  >
                    {t('signUp', { ns: ['home'] })}
                  </button> */}
                </div>
              </CardActions>
            </Card>
          </Slide>
        </div>
      </div>

      {isUserSignedIn && isSupportUser && <SupportPanel appHeight={appHeight} />}
      {isUserSignedIn && isSupplierUser && <SupplierPanel appHeight={appHeight} />}
      {isUserSignedIn && isCustomerUser && <CustomerPanel appHeight={appHeight} />}
      {isMapModalOpen && <MapModal />}

      <SignInModal openSignInModal={openSignInModal} setOpenSignInModal={setOpenSignInModal} setIsInit={setIsInit} />
      {/* <SignUpModal openSignUpModal={openSignUpModal} setOpenSignUpModal={setOpenSignUpModal} setIsInit={setIsInit} /> */}
    </div>
  );
};

export default HomePrivate;
