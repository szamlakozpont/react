import React from 'react';
import { OverridableStringUnion } from '@mui/types';
import { SvgIconPropsSizeOverrides } from '@mui/material';
import { green, red, yellow } from '@mui/material/colors';
import ReactCountryFlag from 'react-country-flag';

export const sidebarVariables = {
  depthPadding: 20,
  sidebarWidth: 250,
  gridHeight: 130,
  listItemPadding: 0,
  listItemPaddingDepth: 5,
  iconsColor: 'primary',

  backgrounColor: '#2196f3',
  backgroundImage: "url('https://images.unsplash.com/photo-1531315630201-bb15abeb1653?ixlib=rb-1.2.1&auto=format&fit=crop&w=375&q=80')",
  avatarBackgroundColor: '#7e57c2',
  avatarColor: '#fff',
};

export const appbarVariables = {
  userIconsize: 'large' as OverridableStringUnion<'large' | 'small' | 'inherit' | 'medium', SvgIconPropsSizeOverrides> | undefined,
  selectedIconColor: 'yellow',
};

export const homeVariables = {
  signInCardWidth: 450,
  signInCardTimeout: 1500,
  supportPanelCardWidth: 345,
};

export const authVariables = {
  userNameMinCharacter: 5,
  userNameMaxCharacter: 16,
  userPasswordMinCharacter: 7,
  userPasswordMinDigit: 1,
  userPasswordMinUpper: 1,
};

export const panelVariables = {
  supportPanelBackgroundColorLight: 'rgba(178, 65, 48, 0.3), rgba(178, 65, 48, 0.1)',
  supportPanelBackgroundColorDark: 'rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.6)',
  supplierPanelBackgroundColor: 'rgba(9, 148, 143, 0.3), rgba(9, 148, 143, 0.1)',
  customerPanelBackgroundColor: 'rgba(178, 165, 48, 0.3), rgba(178, 165, 48, 0.1)',
  supportPanelColors: [red[100], yellow[100], green[100]],
  supplierPanelColors: [red[100], yellow[100], green[100]],
  customerPanelColors: [red[100], yellow[100], green[100]],
};

export const regExpVariables = {
  emailPattern: /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9.-]+\.)+[A-Za-z]{2,}$/,
  postalCodePattern: /^[0-9]{4}$/,
  taxNumberPattern: /^[0-9]{8}-{0,1}[0-9]{1}-{0,1}[0-9]{2}$/,
  euTaxNumberPattern: /^[A-Z]{2}[0-9]{8}$/,
  invoiceNumberTextPattern: /^[a-zA-Z]{0,7}$/,
};

export const INIT_IS_BACKGROUND = true;

export const INIT_LIGHT_MODE = true;

export const tableVariables = {
  buttonsColor: '#0284c7',

  buttonsColorText: 'text-sky-600',
  buttonsColorTextBackground: 'text-white',

  buttonsColorBorder: 'border-sky-600',
  buttonsColorBorderBackground: 'border-[#fff3e6]',

  buttonsColorTextError: 'text-red-600',
  buttonsColorHover: 'hover:bg-sky-600',
  buttonsColorGroupHover: 'group-hover:bg-sky-600',
  buttonsColorGroupHoverError: 'group-hover:bg-red-600',
  groupHoverColorText: 'group-hover:text-sky-600',
  groupHoverColorTextError: 'group-hover:text-red-600',
  buttonsHeight: 'h-[35px]',
  selectHeight: 35,

  selectBorderColor: '#0284c7', // blue
  selectBorderColorBackground: '#fff3e6', // light cream

  titleTextColor: '#000000', // black
  titleTextColorDark: '#fff3e6', // light cream

  titleTextColorBackground: '#ffffff', // white

  selectLabelTextColor: '#0284c7', // blue
  selectLabelTextColorBackground: '#ffffff', // white

  backgroundColor: '#ffffff', // white
  backgroundColorBackGround: '#fff3e6', // light cream

  backgroundColorLight: '#ffffff', // white
  backgroundColorDark: '#37474f', // grey

  backgroundColorLightMode: '#ffffff', // '#c6a3aa'

  backgroundColorBackGroundLight: '#fff3e6', // light cream
  backgroundColorBackGroundDark: '#212121', // light black

  selectOptionsColor: '#e1f5fe', // light blue
  selectOptionsColorBackGround: '#ffccbc', // light orange

  noDataFontSize: 35,
};

export const menuBackgroundColor = '#e65730';

export const mobileSizeWidth = 600;

export const szamlakozpontSupplierId = '1';
export const serverPagination = false;
export const serverPageSize = 10;

export const SUPPORT_USER_TYPE = 'support'; // support user type name in db
export const SUPPLIER_USER_TYPE = 'supplier'; // supplier user type name in db
export const CUSTOMER_USER_TYPE = 'customer'; // customer user type name in db

export const PDFLINK_INVALID_PIN_INPUT_COUNT = 10;

export const NESTJS_HTTPS = process.env.REACT_APP_NESTJS_HTTPS === 'true';

// FIX IP
export const FIXIP_SUPPORT = process.env.REACT_APP_FIXIP_SUPPORT;
export const FIXIP_SUPPLIER = process.env.REACT_APP_FIXIP_SUPPLIER;

export const ENCRYPT_SALT = '$2a$10$tm2zBjdMhPjITOqUCJw2fO';

// API
export const API =
  `${process.env.REACT_APP_NESTJS_HTTPS === 'true' ? 'https://' : 'http://'}${process.env.REACT_APP_LOCAL_DEVELOPMENT === 'true' ? process.env.REACT_APP_DEV_API : process.env.REACT_APP_PROD_API}` as string;
export const API_AUTH =
  `${process.env.REACT_APP_NESTJS_HTTPS === 'true' ? 'https://' : 'http://'}${process.env.REACT_APP_LOCAL_DEVELOPMENT === 'true' ? process.env.REACT_APP_DEV_API_AUTH : process.env.REACT_APP_PROD_API_AUTH}` as string;
export const API_DATA =
  `${process.env.REACT_APP_NESTJS_HTTPS === 'true' ? 'https://' : 'http://'}${process.env.REACT_APP_LOCAL_DEVELOPMENT === 'true' ? process.env.REACT_APP_DEV_API_DATA : process.env.REACT_APP_PROD_API_DATA}` as string;

// AUTH
export const API_USER_SIGN_IN = process.env.REACT_APP_USER_SIGN_IN;
export const API_USER_SIGN_IN_TFA = process.env.REACT_APP_USER_SIGN_IN_TFA;
export const API_USER_SIGN_OUT = process.env.REACT_APP_USER_SIGN_OUT;

// SUPPLIERS
export const API_LIST_SUPPLIERS = process.env.REACT_APP_LIST_SUPPLIERS;
export const API_CREATE_SUPPLIER = process.env.REACT_APP_CREATE_SUPPLIER;
export const API_LIST_PARTNERS_OF_SUPPLIER = process.env.REACT_APP_LIST_PARTNERS_OF_SUPPLIER;
export const API_DELETE_SUPPLIER = process.env.REACT_APP_DELETE_SUPPLIER;
export const API_LIST_SUPPLIER = process.env.REACT_APP_LIST_SUPPLIER;
export const API_SELECTLIST_SUPPLIERS = process.env.REACT_APP_SELECTLIST_SUPPLIERS;
export const API_SELECTLIST_SUPPLIER_PARTNER = process.env.REACT_APP_SELECTLIST_SUPPLIER_PARTNERS;

// INVOICES
export const API_LIST_INVOICES = process.env.REACT_APP_LIST_INVOICES;
export const API_DELETE_INVOICE = process.env.REACT_APP_DELETE_INVOICE;
export const API_UPDATE_INVOICE = process.env.REACT_APP_UPDATE_INVOICE;
export const API_CREATE_INVOICE = process.env.REACT_APP_CREATE_INVOICE;

// FILEVIEW
export const API_PDF_FILEVIEW = process.env.REACT_APP_PDF_FILEVIEW;
export const API_ATTACHMENT_FILEVIEW = process.env.REACT_APP_ATTACHMENT_FILEVIEW;

// PARTNERS
export const API_LIST_PARTNERS = process.env.REACT_APP_LIST_PARTNERS;
export const API_LIST_INVOICES_OF_PARTNER = process.env.REACT_APP_LIST_INVOICES_OF_PARTNER;

// USERS
export const API_LIST_USERS = process.env.REACT_APP_LIST_USERS;
export const API_CREATE_USER = process.env.REACT_APP_CREATE_USER;
export const API_DELETE_USER = process.env.REACT_APP_DELETE_USER;

// PDFLINK
export const API_PDFLINK = process.env.REACT_APP_LOCAL_DEVELOPMENT === 'true' ? process.env.REACT_APP_PDFLINK_DEV_LOCAL : (process.env.REACT_APP_PDFLINK as string);

// EMAILS
export const API_LIST_EMAILS = process.env.REACT_APP_LIST_EMAILS;

// BULKDELETE
export const API_BULKDELETE = process.env.REACT_APP_BULKDELETE;

// INVOICENUMBERS
export const API_SELECTLIST_INVOICENUMBERS = process.env.REACT_APP_SELECTLIST_INVOICENUMBERS;

// PDFSCHEMAS
export const API_SELECTLIST_PDFSCHEMAS = process.env.REACT_APP_SELECTLIST_PDFSCHEMAS;

export const JsonNoDataModals = [9];

export const LANGUAGES = [
  { flag: <ReactCountryFlag className="flag__attributes" countryCode={'HU'} svg />, name: 'Magyar', countryCode: 'HU', langCode: 'hu' },
  { flag: <ReactCountryFlag className="flag__attributes" countryCode={'GB'} svg />, name: 'English', countryCode: 'GB', langCode: 'en' },
  { flag: <ReactCountryFlag className="flag__attributes" countryCode={'ES'} svg />, name: 'Español', countryCode: 'ES', langCode: 'es' },
];
