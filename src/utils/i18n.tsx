import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEnglishHome from '../utils/translations/English/englishHome.json';
import translationEnglishSideBar from '../utils/translations/English/englishSideBar.json';
import translationEnglishAppBar from '../utils/translations/English/englishAppBar.json';
import translationEnglishUser from '../utils/translations/English/englishUser.json';
import translationEnglishSupplier from '../utils/translations/English/englishSupplier.json';
import translationEnglishPartner from '../utils/translations/English/englishPartner.json';
import translationEnglishInvoice from '../utils/translations/English/englishInvoice.json';
import translationEnglishCustomer from '../utils/translations/English/englishCustomer.json';
import translationEnglishTable from '../utils/translations/English/englishTable.json';
import translationEnglishBulkInvoice from '../utils/translations/English/englishBulkInvoice.json';
import translationEnglishPdfSchema from '../utils/translations/English/englishPdfSchema.json';
import translationEnglishPdfLink from '../utils/translations/English/englishPdfLink.json';
import translationEnglishGriff from '../utils/translations/English/englishGriff.json';
import translationEnglishEmail from '../utils/translations/English/englishEmail.json';

import translationHungarianHome from '../utils/translations/Hungarian/hungarianHome.json';
import translationHungarianSideBar from '../utils/translations/Hungarian/hungarianSideBar.json';
import translationHungarianAppBar from '../utils/translations/Hungarian/hungarianAppBar.json';
import translationHungarianUser from '../utils/translations/Hungarian/hungarianUser.json';
import translationHungarianSupplier from '../utils/translations/Hungarian/hungarianSupplier.json';
import translationHungarianPartner from '../utils/translations/Hungarian/hungarianPartner.json';
import translationHungarianInvoice from '../utils/translations/Hungarian/hungarianInvoice.json';
import translationHungarianCustomer from '../utils/translations/Hungarian/hungarianCustomer.json';
import translationHungarianTable from '../utils/translations/Hungarian/hungarianTable.json';
import translationHungarianBulkInvoice from '../utils/translations/Hungarian/hungarianBulkInvoice.json';
import translationHungarianPdfSchema from '../utils/translations/Hungarian/hungarianPdfSchema.json';
import translationHungarianPdfLink from '../utils/translations/Hungarian/hungarianPdfLink.json';
import translationHungarianGriff from '../utils/translations/Hungarian/hungarianGriff.json';
import translationHungarianEmail from '../utils/translations/Hungarian/hungarianEmail.json';

import translationSpanishHome from '../utils/translations/Spanish/spanishHome.json';
import translationSpanishSideBar from '../utils/translations/Spanish/spanishSideBar.json';
import translationSpanishAppBar from '../utils/translations/Spanish/spanishAppBar.json';
import translationSpanishUser from '../utils/translations/Spanish/spanishUser.json';
import translationSpanishSupplier from '../utils/translations/Spanish/spanishSupplier.json';
import translationSpanishPartner from '../utils/translations/Spanish/spanishPartner.json';
import translationSpanishInvoice from '../utils/translations/Spanish/spanishInvoice.json';
import translationSpanishCustomer from '../utils/translations/Spanish/spanishCustomer.json';
import translationSpanishTable from '../utils/translations/Spanish/spanishTable.json';
import translationSpanishBulkInvoice from '../utils/translations/Spanish/spanishBulkInvoice.json';
import translationSpanishPdfSchema from '../utils/translations/Spanish/spanishPdfSchema.json';
import translationSpanishPdfLink from '../utils/translations/Spanish/spanishPdfLink.json';
import translationSpanishGriff from '../utils/translations/Spanish/spanishGriff.json';
import translationSpanishEmail from '../utils/translations/Spanish/spanishEmail.json';

const resources = {
  en: {
    home: translationEnglishHome,
    sidebar: translationEnglishSideBar,
    appbar: translationEnglishAppBar,
    user: translationEnglishUser,
    supplier: translationEnglishSupplier,
    partner: translationEnglishPartner,
    invoice: translationEnglishInvoice,
    customer: translationEnglishCustomer,
    table: translationEnglishTable,
    bulkinvoice: translationEnglishBulkInvoice,
    pdfschema: translationEnglishPdfSchema,
    pdflink: translationEnglishPdfLink,
    griff: translationEnglishGriff,
    email: translationEnglishEmail,
  },

  hu: {
    home: translationHungarianHome,
    sidebar: translationHungarianSideBar,
    appbar: translationHungarianAppBar,
    user: translationHungarianUser,
    supplier: translationHungarianSupplier,
    partner: translationHungarianPartner,
    invoice: translationHungarianInvoice,
    customer: translationHungarianCustomer,
    table: translationHungarianTable,
    bulkinvoice: translationHungarianBulkInvoice,
    pdfschema: translationHungarianPdfSchema,
    pdflink: translationHungarianPdfLink,
    griff: translationHungarianGriff,
    email: translationHungarianEmail,
  },

  es: {
    home: translationSpanishHome,
    sidebar: translationSpanishSideBar,
    appbar: translationSpanishAppBar,
    user: translationSpanishUser,
    supplier: translationSpanishSupplier,
    partner: translationSpanishPartner,
    invoice: translationSpanishInvoice,
    customer: translationSpanishCustomer,
    table: translationSpanishTable,
    bulkinvoice: translationSpanishBulkInvoice,
    pdfschema: translationSpanishPdfSchema,
    pdflink: translationSpanishPdfLink,
    griff: translationSpanishGriff,
    email: translationSpanishEmail,
  },
};

// const language = window.localStorage.getItem('APP_LANGUAGE') as string;
const language = 'hu';
i18next.use(initReactI18next).init({
  resources,
  lng: language,
  fallbackLng: 'en',
});

export default i18next;
