import React, { Dispatch, SetStateAction } from 'react';
import { IconButton, Menu, Tooltip } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../../utils/variables';
import ReactCountryFlag from 'react-country-flag';
import useTextToSpeech from '../../logics/useTextToSpeech';

type LanguageMenuProps = {
  isOpenSelectLanguager: HTMLElement | null;
  setIsOpenSelectLanguage: Dispatch<SetStateAction<HTMLElement | null>>;
  selectedLanguage: any;
  setSelectedLanguage: React.Dispatch<any>;
};

const LanguageMenu: React.FC<LanguageMenuProps> = ({ isOpenSelectLanguager, setIsOpenSelectLanguage, selectedLanguage, setSelectedLanguage }) => {
  const { i18n, t } = useTranslation(['home', 'appbar', 'sidebar', 'user']);

  const { handlePlay, handleStop } = useTextToSpeech();

  const handleOpenLanguageMenu = (event: React.MouseEvent<HTMLElement>) => {
    setIsOpenSelectLanguage(event.currentTarget);
  };

  const handleCloseLanguageMenu = () => {
    setIsOpenSelectLanguage(null);
  };

  const onLanguageChange = (language: string) => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
      const selected = LANGUAGES.find((item) => item.langCode === language);
      window.localStorage.setItem('APP_LANGUAGE', JSON.stringify(selected?.langCode));
      setSelectedLanguage(selected);
    }
    handleCloseLanguageMenu();
  };

  return (
    <div>
      <Tooltip arrow title={t('changeLanguage', { ns: ['appbar'] })}>
        <IconButton
          size="small"
          aria-label="account of current user"
          aria-controls="language-menu"
          aria-haspopup="true"
          onClick={handleOpenLanguageMenu}
          onMouseEnter={() => handlePlay(t('changeLanguage', { ns: ['appbar'] }))}
          onMouseLeave={() => handleStop()}
          color="inherit"
          className=""
        >
          <LanguageIcon className="mr-1" />

          {selectedLanguage.name}
        </IconButton>
      </Tooltip>

      <Menu
        id="language-menu"
        anchorEl={isOpenSelectLanguager}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={Boolean(isOpenSelectLanguager)}
        onClose={handleCloseLanguageMenu}
      >
        <div className="py-1 grid grid-cols-1 gap-2" role="none">
          {LANGUAGES.map((language, index) => (
            <button
              key={language.langCode}
              onClick={() => onLanguageChange(language.langCode)}
              onMouseEnter={() => handlePlay(language.name, language.langCode)}
              onMouseLeave={() => handleStop()}
              className={`${
                i18n.language === language.langCode ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
              } px-4 py-2 text-sm text-start items-center inline-flex hover:bg-gray-300 ${index % 2 === 0 ? 'rounded-r' : 'rounded-l'}`}
              role="menuitem"
            >
              <ReactCountryFlag className="flag__attributes" countryCode={language.countryCode} svg />
              <span className="ml-1 truncate">{language.name}</span>
            </button>
          ))}
        </div>
      </Menu>
    </div>
  );
};

export default LanguageMenu;
