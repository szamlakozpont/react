import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import HomePrivate from './pages/homePrivate/HomePrivate';
import 'react-toastify/dist/ReactToastify.css';
import AppMenu from './menus/AppMenu';
import Suppliers from './pages/suppliers/Suppliers';
import Customers from './pages/customers/Customers';
import Users from './pages/users/Users';
import Invoices from './pages/invoices/Invoices';
import Partners from './pages/partners/Partners';
import InvoiceNumber from './pages/invoicenumbers/Invoicenumbers';
import BulkInvoices from './pages/bulkinvoices/BulkInvoices';
import PdfSchemas from './pages/pdfschemas/PdfSchemas';
import PdfLink from './pages/pdflink/PdfLink';
import HomeInit from './pages/homeinit/HomeInit';
import { useReduxDispatch } from '../store/Store';
import { homeActions } from '../store/appSlices/HomeSlice';
import { FIXIP_SUPPORT, FIXIP_SUPPLIER } from '../utils/variables';
import { usePermissions } from '../logics/usePermissions';
import { Layout } from './Layout';
import Emails from './pages/emails/Emails';
import AboutUs from './pages/aboutUs/aboutUs';
import Footer from './menus/Footer';

const App: React.FC = () => {
  const { isSupportUser, isSupplierUser } = usePermissions();
  const dispatch = useReduxDispatch();
  const [showLogo, setShowLogo] = useState(true);
  const [fixIp, setFixIp] = useState(FIXIP_SUPPORT);

  useEffect(() => {
    if (isSupportUser) setFixIp(FIXIP_SUPPORT);
    else if (isSupplierUser) setFixIp(FIXIP_SUPPLIER);
  }, [isSupplierUser, isSupportUser]);

  useEffect(() => {
    const setWidthHeight = () => {
      dispatch(homeActions.setWindowWidth(window.innerWidth));
      dispatch(homeActions.setWindowHeight(window.innerHeight));
    };
    window.addEventListener('resize', setWidthHeight);
    return () => {
      window.removeEventListener('resize', setWidthHeight);
    };
  }, [dispatch]);

  return (
    <>
      {!showLogo && <AppMenu showLogo={showLogo} />}
      <Layout showLogo={showLogo}>
        <Routes>
          <Route path="/" element={<HomeInit showLogo={showLogo} setShowLogo={setShowLogo} />} />
          <Route path="/pdflink/:hash" element={<PdfLink showLogo={showLogo} setShowLogo={setShowLogo} />} />

          <Route path="/login" element={<HomePrivate showLogo={showLogo} setShowLogo={setShowLogo} />} />
          <Route path={`${fixIp}/suppliers`} element={<Suppliers />} />
          <Route path={`${fixIp}/invoicenumber`} element={<InvoiceNumber />} />
          <Route path={`${fixIp}/partners`} element={<Partners />} />
          <Route path={`${fixIp}/customers`} element={<Customers />} />
          <Route path={`${fixIp}/users`} element={<Users />} />
          <Route path={`${fixIp}/invoices`} element={<Invoices />} />
          <Route path={`${fixIp}/bulkinvoices`} element={<BulkInvoices />} />
          <Route path={`${fixIp}/pdfschemas`} element={<PdfSchemas />} />
          <Route path={`${fixIp}/emails`} element={<Emails />} />
          <Route path={`${fixIp}/aboutus`} element={<AboutUs />} />

          {/* <Route path="/" element={<HomeInit showLogo={showLogo} setShowLogo={setShowLogo} />} /> */}
          {/* <Route path="/" element={<Home />} /> */}
        </Routes>
        {!showLogo && <Footer />}
      </Layout>
      <ToastContainer limit={5} closeOnClick={true} pauseOnHover={true} className="!w-fit !max-w-xl !whitespace-pre-line" />
    </>
  );
};

export default App;
