import React from 'react';
import { validateMinMaxLen } from '../../../utils/common';
import { authVariables, regExpVariables } from '../../../utils/variables';
import { useTranslation } from 'react-i18next';

export const useSignUpFields = () => {
  const { t } = useTranslation(['user']);

  return [
    {
      label: t('signInData', { ns: ['user'] }),
      items: [
        {
          name: 'name',
          type: 'text',
          validate: {
            minLen: validateMinMaxLen(
              authVariables.userNameMinCharacter,
              authVariables.userNameMaxCharacter,
              t('minMaxLen', { min: authVariables.userNameMinCharacter, max: authVariables.userNameMaxCharacter, ns: ['user'] }),
            ),
          },
        },
        { name: 'email', type: 'text', pattern: regExpVariables.emailPattern },
        {
          name: 'password',
          type: 'password',
        },
        {
          name: 'passwordRe',
          type: 'password',
        },
      ],
    },
    {
      label: t('baseCompanyData', { ns: ['user'] }),
      items: [
        { name: 'companyName', type: 'text' },
        { name: 'companyPostalCode', type: 'text', pattern: regExpVariables.postalCodePattern },
        { name: 'companyCityName', type: 'text' },
        { name: 'companyPublicPlaceName', type: 'text' },
        { name: 'companyPublicPlaceType', type: 'text' },
        { name: 'companyHouseNumber', type: 'text' },
        { name: 'companyTaxNumber', type: 'text' },
        { name: 'companyEUTaxNumber', required: false, type: 'text' },
        { name: 'companyWebPage', required: false, type: 'text' },
        { name: 'companyContactName', type: 'text' },
        { name: 'companyEmail', type: 'text', pattern: regExpVariables.emailPattern },
        { name: 'companyEServiceEmail', type: 'text', pattern: regExpVariables.emailPattern },
        { name: 'companyPhoneNumber', type: 'text' },
        { name: 'companyEServicePhone', type: 'text' },
      ],
    },
    {
      label: t('baseInvoiceData', { ns: ['user'] }),
      items: [
        { name: 'invoiceBankAccount', type: 'text' },
        { name: 'invoicePhoneNumber', required: false, type: 'text' },
        { name: 'invoiceFaxNumber', required: false, type: 'text' },
      ],
    },
  ];
};
