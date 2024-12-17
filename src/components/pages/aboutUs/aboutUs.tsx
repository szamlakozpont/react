import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material';

const AboutUs: React.FC = () => {
  const { i18n } = useTranslation(['home']);
  const {
    mixins: { toolbar },
  } = useTheme();
  const appHeight = parseInt(toolbar?.minHeight as string) + 8;

  return <div className="bg-transparent h-screen w-screen absolute left-[50%] -translate-x-1/2 " style={{ top: appHeight }}></div>;
};

export default AboutUs;
