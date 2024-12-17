import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useReduxDispatch, useReduxSelector } from '../../store/Store';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppMenuItems } from './menuItems/appMenuItems';
import AppBar from '@mui/material/AppBar';
import SideBar from './SideMenu';
import UserMenu from './UserMenu';
import ProfileModal from '../UI/userModals/ProfileModal';
import PasswordModal from '../UI/userModals/PasswordModal';
import { homeActions } from '../../store/appSlices/HomeSlice';
import LoopIcon from '@mui/icons-material/Loop';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { Tooltip } from '@mui/material';
import { appbarVariables, LANGUAGES, menuBackgroundColor } from '../../utils/variables';
import LanguageMenu from './LanguageMenu';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import useTextToSpeech from '../../logics/useTextToSpeech';
import { AccessibilityModal } from '../UI/AccessibilityModal';

// type LanguageButtonProps = {
//   lang: string;
// };

// const LanguageButton: React.FC<LanguageButtonProps> = ({ lang }) => {
//   const { i18n } = useTranslation(['home', 'appbar', 'sidebar', 'user']);

//   const onLanguageChange = (language: string) => {
//     if (i18n.language !== language) {
//       i18n.changeLanguage(language);
//       window.localStorage.setItem('APP_LANGUAGE', JSON.stringify(language));
//     }
//   };
//   const langCode = lang === 'en' ? 'GB' : 'HU';

//   return (
//     <button onClick={() => onLanguageChange(lang)}>
//       <ReactCountryFlag className="flag__attributes" countryCode={langCode} svg />
//     </button>
//   );
// };

export type AppMenuProps = {
  showLogo: boolean;
};

const AppMenu: React.FC<AppMenuProps> = ({ showLogo }) => {
  const { t, i18n } = useTranslation(['home', 'appbar', 'sidebar', 'user']);
  const dispatch = useReduxDispatch();
  const navigate = useNavigate();
  const [isInit, setIsInit] = useState(true);
  const isUserSignedIn = useReduxSelector((state) => state.auth.isSignedIn);
  const [anchorElMenu, setAnchorElMenu] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [stateDrawer, setStateDrawer] = useState(false);
  const appMenuItems = useAppMenuItems();
  const windowHeight = useReduxSelector((state) => state.home.windowHeight);
  const isBackground = useReduxSelector((state) => state.home.pagesWithBackground);
  const lightMode = useReduxSelector((state) => state.home.lightMode);
  const [isOpenSelectLanguage, setIsOpenSelectLanguage] = useState<null | HTMLElement>(null);
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[1]);
  const pageName = useReduxSelector((state) => state.home.pageName);
  const isAccessibilityModalOpen = useReduxSelector((state) => state.home.isAccessibilityModalOpen);

  const { handlePlay, handleStop } = useTextToSpeech();

  const onChangeStyle = () => {
    dispatch(homeActions.setPagesWithBackground(!isBackground));
  };

  const onChangeLightMode = () => {
    dispatch(homeActions.setLightMode(!lightMode));
  };

  const handleClickAppBarItem = (href: string, functionProp: () => void) => {
    setAnchorElMenu(null);
    if (href) navigate(href);
    else functionProp();
  };

  const handleOpenAccessibilityModal = () => {
    dispatch(homeActions.setIsAccessibilityModalOpen(true));
  };

  const toggleDrawer = (openDrawer: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }
    setStateDrawer(openDrawer);
  };

  useEffect(() => {
    if (isInit) {
      const language = window.localStorage.getItem('APP_LANGUAGE');
      if (language !== null) {
        const selected = LANGUAGES.find((item) => JSON.stringify(item.langCode) === language);
        if (selected) {
          setSelectedLanguage(selected);
          i18n.changeLanguage(JSON.parse(language));
        }
      }
      const speech = window.localStorage.getItem('APP_SPEECHTEXT');

      if (speech !== null) {
        const isSpeechText = speech === 'true';
        dispatch(homeActions.setIsTextToSpeechActive(isSpeechText));
      }
      setIsInit(false);
    }
  }, [i18n, isInit, dispatch]);

  // useEffect(() => {
  //   const handleWindowClick = (event: any) => {
  //     const target = event.target.closest('button');
  //     if (target && target.id === 'LANGUAGE_SELECTOR_ID') {
  //       return;
  //     }
  //     setIsOpenSelectLanguage(false);
  //   };
  //   window.addEventListener('click', handleWindowClick);
  //   return () => {
  //     window.removeEventListener('click', handleWindowClick);
  //   };
  // }, []);

  return (
    <>
      <Box sx={{ flexGrow: 1, paddingY: 1 }}>
        <AppBar position="static" sx={{ height: Math.min(windowHeight * 0.1, 30), justifyContent: 'center' }}>
          <Toolbar sx={{ backgroundColor: menuBackgroundColor }}>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, marginLeft: -3, marginTop: 1 }}
              onMouseEnter={() => handlePlay('Közszámla. Elektronikus számla megoldás')}
              onMouseLeave={() => handleStop()}
            >
              <img src={require('../../static/company_s.png')} alt="Company" width="200px" color="white" />
            </Typography>

            {isUserSignedIn && (
              <Tooltip arrow title={t('menu', { ns: ['appbar'] })}>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  onClick={toggleDrawer(true)}
                  onMouseEnter={() => handlePlay(t('menu', { ns: ['appbar'] }))}
                  onMouseLeave={() => handleStop()}
                >
                  <MenuIcon />
                </IconButton>
              </Tooltip>
            )}

            {isUserSignedIn && (
              <Box sx={{ flexGrow: 1, display: 'flex' }}>
                {appMenuItems.map((item) => {
                  const split = item?.href.split('/') as any;
                  const hrefName = split[split.length - 1];

                  return item ? (
                    <MenuItem
                      key={item.label}
                      className={`${item.className || ''}`}
                      onClick={() => handleClickAppBarItem(item.href, item.functionProp)}
                      onMouseEnter={() => handlePlay(item.label)}
                      onMouseLeave={() => handleStop()}
                      sx={{ my: 0, color: `${pageName === hrefName ? appbarVariables.selectedIconColor : 'white'}`, display: 'block' }}
                    >
                      {item.icon ? item.icon : item.label}
                    </MenuItem>
                  ) : (
                    ''
                  );
                })}
              </Box>
            )}
            {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {t('title', { ns: ['appbar'] })}
            </Typography> */}

            {isUserSignedIn && <UserMenu anchorElUser={anchorElUser} setAnchorElUser={setAnchorElUser} />}
            {isUserSignedIn && (
              <LanguageMenu
                isOpenSelectLanguager={isOpenSelectLanguage}
                setIsOpenSelectLanguage={setIsOpenSelectLanguage}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
              />
            )}

            {/* <div className="px-5 flex gap-4 items-center">
              <LanguageButton lang="en" />
              <LanguageButton lang="hu" />
            </div> */}

            {!showLogo && (
              <div className="px-5 flex gap-4 items-center">
                <Tooltip arrow title={t('accessibility', { ns: ['appbar'] })}>
                  <button onClick={handleOpenAccessibilityModal} onMouseEnter={() => handlePlay(t('accessibility', { ns: ['appbar'] }))} onMouseLeave={() => handleStop()}>
                    <TextIncreaseIcon sx={{ color: 'white' }} />
                  </button>
                </Tooltip>
                {/* <Tooltip arrow title={`${isBackground ? t('changeToNormalMode', { ns: ['appbar'] }) : t('changeToColorMode', { ns: ['appbar'] })}`}>
                  <button
                    onClick={() => onChangeStyle()}
                    onMouseEnter={() => handlePlay(isBackground ? t('changeToNormalMode', { ns: ['appbar'] }) : t('changeToColorMode', { ns: ['appbar'] }))}
                    onMouseLeave={() => handleStop()}
                  >
                    <LoopIcon sx={{ color: isBackground ? 'white' : 'red' }} />
                  </button>
                </Tooltip> */}
                <Tooltip arrow title={`${lightMode ? t('changeToDarkMode', { ns: ['appbar'] }) : t('changeToLightMode', { ns: ['appbar'] })}`}>
                  <button
                    onClick={() => onChangeLightMode()}
                    onMouseEnter={() => handlePlay(lightMode ? t('changeToDarkMode', { ns: ['appbar'] }) : t('changeToLightMode', { ns: ['appbar'] }))}
                    onMouseLeave={() => handleStop()}
                  >
                    {lightMode ? <DarkModeIcon sx={{ color: 'darkgrey' }} /> : <LightModeIcon sx={{ color: 'yellow' }} />}
                  </button>
                </Tooltip>
              </div>
            )}
          </Toolbar>
        </AppBar>
        {isUserSignedIn && <SideBar stateDrawer={stateDrawer} setStateDrawer={setStateDrawer}></SideBar>}
        {isUserSignedIn && (
          <>
            <ProfileModal />
            <PasswordModal />
          </>
        )}
      </Box>
      {isAccessibilityModalOpen && <AccessibilityModal />}
    </>
  );
};

export default AppMenu;
