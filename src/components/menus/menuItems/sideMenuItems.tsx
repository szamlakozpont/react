import React, { useCallback, useMemo } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptIcon from '@mui/icons-material/Receipt';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import SettingsIcon from '@mui/icons-material/Settings';
import AbcIcon from '@mui/icons-material/Abc';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import PaymentsIcon from '@mui/icons-material/Payments';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import ArticleIcon from '@mui/icons-material/Article';
import PersonIcon from '@mui/icons-material/Person';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AttributionIcon from '@mui/icons-material/Attribution';
import { useTranslation } from 'react-i18next';
import { usePermissions } from '../../../logics/usePermissions';

export const useSideMenuItems = () => {
  const { t } = useTranslation(['sidebar']);
  const { isSupportUser, isSupplierUser } = usePermissions();

  const onClick = useCallback(() => {
    console.log('');
  }, []);
  const adminadminUserSideMenuItems = useMemo(
    () => [
      { name: 'home', label: t('home', { ns: ['sidebar'] }), Icon: HomeIcon, functionProp: onClick },
      {
        name: 'invoices',
        label: t('invoices', { ns: ['sidebar'] }),
        functionProp: onClick,
        Icon: ReceiptIcon,
        items: [
          { name: 'outgoingInvoices', label: t('outgoingInvoices', { ns: ['sidebar'] }), functionProp: onClick },
          { name: 'asideInvoices', label: t('asideInvoices', { ns: ['sidebar'] }), functionProp: onClick },
          { name: 'newInvoice', label: t('newInvoice', { ns: ['sidebar'] }), functionProp: onClick },
          { name: 'incomingInvoices', label: t('incomingInvoices', { ns: ['sidebar'] }), functionProp: onClick },
          { name: 'invoicesStore', label: t('invoicesStore', { ns: ['sidebar'] }), functionProp: onClick },
        ],
      },
      {
        name: 'suppliers',
        label: t('suppliers', { ns: ['sidebar'] }),
        functionProp: onClick,
        Icon: AccountCircleIcon,
        items: [
          { name: 'suppliersList', label: t('suppliersList', { ns: ['sidebar'] }), href: '/suppliers', functionProp: () => {} },
          { name: 'newSupplier', label: t('newSupplier', { ns: ['sidebar'] }), functionProp: () => {} },
        ],
      },
      {
        name: 'customers',
        label: t('customers', { ns: ['sidebar'] }),
        functionProp: onClick,
        Icon: AttributionIcon,
        items: [
          { name: 'customersList', label: t('customersList', { ns: ['sidebar'] }), href: '/customers', functionProp: () => {} },
          { name: 'newCustomer', label: t('newCustomer', { ns: ['sidebar'] }), functionProp: () => {} },
        ],
      },
      {
        name: 'users',
        label: t('users', { ns: ['sidebar'] }),
        functionProp: onClick,
        Icon: PersonIcon,
        items: [
          { name: 'usersList', label: t('usersList', { ns: ['sidebar'] }), href: '/users', functionProp: () => {} },
          { name: 'newUser', label: t('newUser', { ns: ['sidebar'] }), functionProp: () => {} },
        ],
      },
      { name: 'divider' },
      {
        name: 'productList',
        label: t('productList', { ns: ['sidebar'] }),
        functionProp: onClick,
        Icon: AbcIcon,
      },
      {
        name: 'attachedFiles',
        label: t('attachedFiles', { ns: ['sidebar'] }),
        functionProp: onClick,
        Icon: FilePresentIcon,
      },
      { name: 'divider' },
      {
        name: 'bankTransactions',
        label: t('bankTransactions', { ns: ['sidebar'] }),
        functionProp: onClick,
        Icon: LocalAtmIcon,
        items: [
          { name: 'bankPayments', label: t('bankPayments', { ns: ['sidebar'] }), functionProp: onClick },
          { name: 'bankRefunds', label: t('bankRefunds', { ns: ['sidebar'] }), functionProp: onClick },
        ],
      },
      { name: 'divider' },
      {
        name: 'navTransactions',
        label: t('navTransactions', { ns: ['sidebar'] }),
        functionProp: onClick,
        Icon: PaymentsIcon,
        items: [
          { name: 'navOutgoingInvoices', label: t('navOutgoingInvoices', { ns: ['sidebar'] }), functionProp: onClick },
          { name: 'navInvoicesList', label: t('navInvoicesList', { ns: ['sidebar'] }), functionProp: onClick },
        ],
      },
      { name: 'divider' },
      {
        name: 'statistics',
        label: t('statistics', { ns: ['sidebar'] }),
        functionProp: onClick,
        Icon: QueryStatsIcon,
        items: [
          { name: 'sentInvoices', label: t('sentInvoices', { ns: ['sidebar'] }), functionProp: onClick },
          { name: 'partnerAnalytics', label: t('partnerAnalytics', { ns: ['sidebar'] }), functionProp: onClick },
        ],
      },
      { name: 'divider' },
      {
        name: 'settings',
        label: t('settings', { ns: ['sidebar'] }),
        Icon: SettingsIcon,
        items: [
          { name: 'companyProfile', label: t('companyProfile', { ns: ['sidebar'] }), functionProp: onClick },
          { name: 'divider' },
          {
            name: 'notifications',
            label: t('notifications', { ns: ['sidebar'] }),
            Icon: NotificationsIcon,
            items: [
              { name: 'email', label: t('email', { ns: ['sidebar'] }), functionProp: onClick },
              { name: 'schedule', label: t('schedule', { ns: ['sidebar'] }), functionProp: onClick },
            ],
          },
          {
            name: 'desktop',
            label: t('desktop', { ns: ['sidebar'] }),
            Icon: DesktopWindowsIcon,
            items: [{ name: 'lightDarkMode', label: t('lightDarkMode', { ns: ['sidebar'] }), functionProp: onClick }],
          },
        ],
      },
      {
        name: 'divider',
      },
      {
        name: 'documentation',
        label: t('documentation', { ns: ['sidebar'] }),
        functionProp: onClick,
        Icon: ArticleIcon,
        items: [
          { name: 'faq', label: t('faq', { ns: ['sidebar'] }), functionProp: onClick },
          { name: 'usersGuide', label: t('usersGuide', { ns: ['sidebar'] }), functionProp: onClick },
        ],
      },
    ],
    [onClick, t],
  );

  const szallitoUserSideMenuItems = useMemo(
    () => [
      { name: 'home', label: t('home', { ns: ['sidebar'] }), Icon: HomeIcon, functionProp: onClick },
      {
        name: 'invoices',
        label: t('invoices', { ns: ['sidebar'] }),
        functionProp: onClick,
        Icon: ReceiptIcon,
        items: [
          { name: 'outgoingInvoices', label: t('outgoingInvoices', { ns: ['sidebar'] }), functionProp: onClick },
          { name: 'asideInvoices', label: t('asideInvoices', { ns: ['sidebar'] }), functionProp: onClick },
          { name: 'newInvoice', label: t('newInvoice', { ns: ['sidebar'] }), functionProp: onClick },
          { name: 'incomingInvoices', label: t('incomingInvoices', { ns: ['sidebar'] }), functionProp: onClick },
          { name: 'invoicesStore', label: t('invoicesStore', { ns: ['sidebar'] }), functionProp: onClick },
        ],
      },
      { name: 'divider' },
      {
        name: 'productList',
        label: t('productList', { ns: ['sidebar'] }),
        functionProp: onClick,
        Icon: AbcIcon,
      },
      {
        name: 'attachedFiles',
        label: t('attachedFiles', { ns: ['sidebar'] }),
        functionProp: onClick,
        Icon: FilePresentIcon,
      },
      { name: 'divider' },
      {
        name: 'bankTransactions',
        label: t('bankTransactions', { ns: ['sidebar'] }),
        functionProp: onClick,
        Icon: LocalAtmIcon,
        items: [
          { name: 'bankPayments', label: t('bankPayments', { ns: ['sidebar'] }), functionProp: onClick },
          { name: 'bankRefunds', label: t('bankRefunds', { ns: ['sidebar'] }), functionProp: onClick },
        ],
      },
      { name: 'divider' },
      {
        name: 'navTransactions',
        label: t('navTransactions', { ns: ['sidebar'] }),
        functionProp: onClick,
        Icon: PaymentsIcon,
        items: [
          { name: 'navOutgoingInvoices', label: t('navOutgoingInvoices', { ns: ['sidebar'] }), functionProp: onClick },
          { name: 'navInvoicesList', label: t('navInvoicesList', { ns: ['sidebar'] }), functionProp: onClick },
        ],
      },
      { name: 'divider' },
      {
        name: 'statistics',
        label: t('statistics', { ns: ['sidebar'] }),
        functionProp: onClick,
        Icon: QueryStatsIcon,
        items: [
          { name: 'sentInvoices', label: t('sentInvoices', { ns: ['sidebar'] }), functionProp: onClick },
          { name: 'partnerAnalytics', label: t('partnerAnalytics', { ns: ['sidebar'] }), functionProp: onClick },
        ],
      },
      { name: 'divider' },
      {
        name: 'settings',
        label: t('settings', { ns: ['sidebar'] }),
        Icon: SettingsIcon,
        items: [
          { name: 'companyProfile', label: t('companyProfile', { ns: ['sidebar'] }), functionProp: onClick },
          { name: 'divider' },
          {
            name: 'notifications',
            label: t('notifications', { ns: ['sidebar'] }),
            Icon: NotificationsIcon,
            items: [
              { name: 'email', label: t('email', { ns: ['sidebar'] }), functionProp: onClick },
              { name: 'schedule', label: t('schedule', { ns: ['sidebar'] }), functionProp: onClick },
            ],
          },
          {
            name: 'desktop',
            label: t('desktop', { ns: ['sidebar'] }),
            Icon: DesktopWindowsIcon,
            items: [{ name: 'lightDarkMode', label: t('lightDarkMode', { ns: ['sidebar'] }), functionProp: onClick }],
          },
        ],
      },
      {
        name: 'divider',
      },
      {
        name: 'documentation',
        label: t('documentation', { ns: ['sidebar'] }),
        functionProp: onClick,
        Icon: ArticleIcon,
        items: [
          { name: 'faq', label: t('faq', { ns: ['sidebar'] }), functionProp: onClick },
          { name: 'usersGuide', label: t('usersGuide', { ns: ['sidebar'] }), functionProp: onClick },
        ],
      },
    ],
    [onClick, t],
  );

  const vevoUserSideMenuItems = useMemo(
    () => [
      { name: 'home', label: t('home', { ns: ['sidebar'] }), Icon: HomeIcon, functionProp: onClick },
      {
        name: 'invoices',
        label: t('invoices', { ns: ['sidebar'] }),
        functionProp: onClick,
        Icon: ReceiptIcon,
        items: [
          { name: 'outgoingInvoices', label: t('outgoingInvoices', { ns: ['sidebar'] }), functionProp: onClick },
          { name: 'asideInvoices', label: t('asideInvoices', { ns: ['sidebar'] }), functionProp: onClick },
          { name: 'newInvoice', label: t('newInvoice', { ns: ['sidebar'] }), functionProp: onClick },
          { name: 'incomingInvoices', label: t('incomingInvoices', { ns: ['sidebar'] }), functionProp: onClick },
          { name: 'invoicesStore', label: t('invoicesStore', { ns: ['sidebar'] }), functionProp: onClick },
        ],
      },
      { name: 'divider' },
      {
        name: 'productList',
        label: t('productList', { ns: ['sidebar'] }),
        functionProp: onClick,
        Icon: AbcIcon,
      },
      {
        name: 'attachedFiles',
        label: t('attachedFiles', { ns: ['sidebar'] }),
        functionProp: onClick,
        Icon: FilePresentIcon,
      },
      { name: 'divider' },
      {
        name: 'bankTransactions',
        label: t('bankTransactions', { ns: ['sidebar'] }),
        functionProp: onClick,
        Icon: LocalAtmIcon,
        items: [
          { name: 'bankPayments', label: t('bankPayments', { ns: ['sidebar'] }), functionProp: onClick },
          { name: 'bankRefunds', label: t('bankRefunds', { ns: ['sidebar'] }), functionProp: onClick },
        ],
      },
      { name: 'divider' },
      {
        name: 'navTransactions',
        label: t('navTransactions', { ns: ['sidebar'] }),
        functionProp: onClick,
        Icon: PaymentsIcon,
        items: [
          { name: 'navOutgoingInvoices', label: t('navOutgoingInvoices', { ns: ['sidebar'] }), functionProp: onClick },
          { name: 'navInvoicesList', label: t('navInvoicesList', { ns: ['sidebar'] }), functionProp: onClick },
        ],
      },
      { name: 'divider' },
      {
        name: 'statistics',
        label: t('statistics', { ns: ['sidebar'] }),
        functionProp: onClick,
        Icon: QueryStatsIcon,
        items: [
          { name: 'sentInvoices', label: t('sentInvoices', { ns: ['sidebar'] }), functionProp: onClick },
          { name: 'partnerAnalytics', label: t('partnerAnalytics', { ns: ['sidebar'] }), functionProp: onClick },
        ],
      },
      { name: 'divider' },
      {
        name: 'settings',
        label: t('settings', { ns: ['sidebar'] }),
        Icon: SettingsIcon,
        items: [
          { name: 'companyProfile', label: t('companyProfile', { ns: ['sidebar'] }), functionProp: onClick },
          { name: 'divider' },
          {
            name: 'notifications',
            label: t('notifications', { ns: ['sidebar'] }),
            Icon: NotificationsIcon,
            items: [
              { name: 'email', label: t('email', { ns: ['sidebar'] }), functionProp: onClick },
              { name: 'schedule', label: t('schedule', { ns: ['sidebar'] }), functionProp: onClick },
            ],
          },
          {
            name: 'desktop',
            label: t('desktop', { ns: ['sidebar'] }),
            Icon: DesktopWindowsIcon,
            items: [{ name: 'lightDarkMode', label: t('lightDarkMode', { ns: ['sidebar'] }), functionProp: onClick }],
          },
        ],
      },
      {
        name: 'divider',
      },
      {
        name: 'documentation',
        label: t('documentation', { ns: ['sidebar'] }),
        functionProp: onClick,
        Icon: ArticleIcon,
        items: [
          { name: 'faq', label: t('faq', { ns: ['sidebar'] }), functionProp: onClick },
          { name: 'usersGuide', label: t('usersGuide', { ns: ['sidebar'] }), functionProp: onClick },
        ],
      },
    ],
    [onClick, t],
  );

  const sideMenuItems = isSupportUser ? adminadminUserSideMenuItems : isSupplierUser ? szallitoUserSideMenuItems : vevoUserSideMenuItems;
  return sideMenuItems;
};
