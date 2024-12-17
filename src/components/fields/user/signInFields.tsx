import React from 'react';
import { regExpVariables } from '../../../utils/variables';
import { useTranslation } from 'react-i18next';

export type SignInFieldsProps = {
  name: string;
  email: string;
  password: string;
};

export const useSignInFields = () => {
  const { t } = useTranslation(['user']);

  return [
    {
      label: t('signInData', { ns: ['user'] }),
      items: [
        { name: 'name', type: 'text' },
        { name: 'email', type: 'email', pattern: regExpVariables.emailPattern },
        { name: 'password', type: 'password' },
      ],
    },
  ];
};
