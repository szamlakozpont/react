import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePermissions } from '../../../logics/usePermissions';
import { FIXIP_SUPPLIER, FIXIP_SUPPORT } from '../../../utils/variables';
import EmailIcon from '@mui/icons-material/Email';
import ReceiptIcon from '@mui/icons-material/Receipt';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import { Box } from '@mui/system';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InfoIcon from '@mui/icons-material/Info';

// type ImageToogleOnMouseProps = {
//   primaryImg: any;
//   secondaryImg: any;
//   alt: string;
//   width: string;
//   label: string;
// };

// export const ImageToggleOnMouse: React.FC<ImageToogleOnMouseProps> = ({ primaryImg, secondaryImg, alt, width, label }) => {
//   const [imgSrc, setImgSrc] = useState(primaryImg);
//   const mouseEnter = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
//     setImgSrc(secondaryImg);
//   };
//   const mouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
//     setImgSrc(primaryImg);
//   };
//   return (
//     <Box onMouseEnter={(e) => mouseEnter(e)} onMouseLeave={(e) => mouseLeave(e)} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//       <img src={imgSrc} alt={alt} width={width} />
//       {/* <span className="text-[13px]">{label}</span> */}
//     </Box>
//   );
// };

// export const ImageToggleOnMouse: React.FC<ImageToogleOnMouseProps> = ({ primaryImg, secondaryImg, alt, width }) => {
//   return <img onMouseEnter={(e) => (e.currentTarget.src = secondaryImg)} onMouseLeave={(e) => (e.currentTarget.src = primaryImg)} src={primaryImg} alt={alt} width={width} />;
// };

type IconLabelProps = {
  icon: any;
  label: string;
};

const IconLabel: React.FC<IconLabelProps> = ({ icon, label }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {icon}
      <span className="text-[13px]">{label}</span>
    </Box>
  );
};

export const useAppMenuItems = () => {
  const { t } = useTranslation(['appbar']);
  const { isSupportUser, isSupplierUser } = usePermissions();
  const [fixIp, setFixIp] = useState(FIXIP_SUPPORT);
  const imageWidth = '30';

  useEffect(() => {
    if (isSupportUser) setFixIp(FIXIP_SUPPORT);
    else if (isSupplierUser) setFixIp(FIXIP_SUPPLIER);
  }, [isSupplierUser, isSupportUser]);

  const appMenuItems = useMemo(
    () => [
      {
        label: t('home', { ns: ['appbar'] }),
        href: '/login',
        functionProp: () => {},
        icon: <IconLabel icon={<HomeIcon />} label={t('home', { ns: ['appbar'] })} />,
        className: '',
      },
      isSupportUser
        ? {
            label: t('suppliers', { ns: ['appbar'] }),
            href: `${fixIp}/suppliers`,
            functionProp: () => {},
            icon: <IconLabel icon={<MonetizationOnIcon />} label={t('suppliers', { ns: ['appbar'] })} />,
          }
        : undefined,
      // isSupportUser ? { label: t('invoiceNumbers', { ns: ['appbar'] }), href: `${fixIp}/invoicenumber`, functionProp: () => {} } : undefined,
      isSupportUser
        ? {
            label: t('partners_', { ns: ['appbar'] }),
            href: `${fixIp}/partners`,
            functionProp: () => {},
            icon: <IconLabel icon={<ShoppingCartIcon />} label={t('partners_', { ns: ['appbar'] })} />,
          }
        : undefined,
      // isSupportUser ? { label: t('customers', { ns: ['appbar'] }), href: `${fixIp}/customers`, functionProp: () => {} } : undefined,
      isSupportUser
        ? {
            label: t('users', { ns: ['appbar'] }),
            href: `${fixIp}/users`,
            functionProp: () => {},
            icon: <IconLabel icon={<PeopleIcon />} label={t('users', { ns: ['appbar'] })} />,
            className: '',
          }
        : undefined,
      isSupportUser
        ? {
            label: t('invoices', { ns: ['appbar'] }),
            href: `${fixIp}/invoices`,
            functionProp: () => {},
            // icon: (
            //   <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            //     <ImageToggleOnMouse primaryImg={invoice_img_png} secondaryImg={invoice_img_gif} alt="invoices" width="25" />
            //     <span className="text-[13px]">{t('invoices', { ns: ['appbar'] })}</span>
            //   </Box>
            // ),
            icon: <IconLabel icon={<ReceiptIcon />} label={t('invoices', { ns: ['appbar'] })} />,
            className: '',
          }
        : undefined,
      // isSupportUser ? { label: t('bulkInvoices', { ns: ['appbar'] }), href: `${fixIp}/bulkinvoices`, functionProp: () => {} } : undefined,
      // isSupportUser ? { label: t('pdfSchemas', { ns: ['appbar'] }), href: `${fixIp}/pdfschemas`, functionProp: () => {} } : undefined,
      isSupportUser
        ? {
            label: t('emails_', { ns: ['appbar'] }),
            href: `${fixIp}/emails`,
            functionProp: () => {},
            icon: <IconLabel icon={<EmailIcon />} label={t('emails', { ns: ['appbar'] })} />,
            className: '',
          }
        : undefined,
      isSupportUser
        ? {
            label: t('aboutus', { ns: ['appbar'] }),
            href: `${fixIp}/aboutus`,
            functionProp: () => {},
            icon: <IconLabel icon={<InfoIcon />} label={t('aboutus', { ns: ['appbar'] })} />,
            className: '',
          }
        : undefined,
    ],
    [fixIp, isSupportUser, t],
  );

  return appMenuItems;
};
