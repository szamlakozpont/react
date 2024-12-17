import React from 'react';
import { useTranslation } from 'react-i18next';
import { DataColumnsProp } from '../../types/Table.type';
import { Button } from '@mui/material';
import { tableVariables } from '../../../utils/variables';
import { tableActions } from '../../../store/appSlices/TableSlice';
import { useReduxDispatch } from '../../../store/Store';

export const useDataColumnsPdfSchema = () => {
  const { t } = useTranslation(['pdfschema']);
  const dispatch = useReduxDispatch();

  const handleClickSupplier = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, suppliers: string[]) => {
    e.preventDefault();
    dispatch(tableActions.setPdfSchemaSuppliers(suppliers));
    dispatch(tableActions.setIsPdfSchemaJsonListModalOpen(true));
  };

  const handleClickData = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: any) => {
    e.preventDefault();
    dispatch(tableActions.setRowCustom(data));
    dispatch(tableActions.setIsPdfSchemaEditModalOpen(true));
    dispatch(tableActions.setIsChosenSuppliersModalInit(true));
    dispatch(tableActions.setIsDefaultPdfSchemaModalInit(true));
  };

  const handleClickDefaultSupplier = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, default_suppliers: string[]) => {
    e.preventDefault();
    dispatch(tableActions.setPdfSchemaSuppliers(default_suppliers));
    dispatch(tableActions.setIsPdfSchemaJsonListModalOpen(true));
  };
  const selectOptions = [{ id: '0', label: t('allSchemas', { ns: ['pdfschema'] }) }];

  const dataColumns: DataColumnsProp[] = [
    { id: 'id', label: t('id', { ns: ['pdfschema'] }), type: 'number' },
    { id: 'pdfschema_name', label: t('pdfschemaName', { ns: ['pdfschema'] }), type: 'text' },
    {
      id: 'suppliers',
      label: t('suppliers', { ns: ['pdfschema'] }),
      type: 'string',
      component: (row) => {
        return row.suppliers.length > 0 ? (
          <Button size="small" sx={{ textTransform: 'uppercase' }} onClick={(e) => handleClickSupplier(e, row.suppliers)}>
            <span className={`bg-transparent ${tableVariables.buttonsColorText} text-nowrap`}>{t('suppliers', { ns: ['pdfschema'] })}</span>
          </Button>
        ) : (
          <></>
        );
      },
    },
    {
      id: 'default_suppliers',
      label: t('defaultSuppliers', { ns: ['pdfschema'] }),
      type: 'string',
      component: (row) => {
        return row.default_suppliers.length > 0 ? (
          <Button size="small" sx={{ textTransform: 'uppercase' }} onClick={(e) => handleClickDefaultSupplier(e, row.default_suppliers)}>
            <span className={`bg-transparent ${tableVariables.buttonsColorText} text-nowrap`}>{t('defaultSuppliers', { ns: ['pdfschema'] })}</span>
          </Button>
        ) : (
          <></>
        );
      },
    },
    {
      id: 'data',
      label: t('data', { ns: ['pdfschema'] }),
      type: 'string',
      component: (row) => {
        return (
          <Button size="small" sx={{ textTransform: 'uppercase' }} onClick={(e) => handleClickData(e, row)}>
            <span className={`bg-transparent ${tableVariables.buttonsColorText} text-nowrap`}>{t('editPdfSchema', { ns: ['pdfschema'] })}</span>
          </Button>
        );
      },
    },
  ];

  const dataColumnsJson: DataColumnsProp[] = [
    { id: 'name', label: t('name', { ns: ['pdfschema'] }), type: 'string' },
    { id: 'type', label: t('type', { ns: ['pdfschema'] }), type: 'string' },
    { id: 'content', label: t('content', { ns: ['pdfschema'] }), type: 'string' },
    { id: 'position_x', label: t('positionX', { ns: ['pdfschema'] }), type: 'string' },
    { id: 'position_y', label: t('positionY', { ns: ['pdfschema'] }), type: 'string' },
    { id: 'width', label: t('width', { ns: ['pdfschema'] }), type: 'string' },
    { id: 'height', label: t('height', { ns: ['pdfschema'] }), type: 'string' },
    { id: 'font_size', label: t('fontSize', { ns: ['pdfschema'] }), type: 'string' },
    { id: 'font_color', label: t('fontColor', { ns: ['pdfschema'] }), type: 'string' },
  ];

  const dataColumnsSuppliers: DataColumnsProp[] = [
    { id: 'id', label: t('id', { ns: ['supplier'] }), type: 'number' },
    { id: 'name', label: t('name', { ns: ['supplier'] }), type: 'string' },
    { id: 'address', label: t('address', { ns: ['supplier'] }), type: 'string' },
    { id: 'tax_number', label: t('taxNumber', { ns: ['supplier'] }), type: 'string' },
  ];

  return { selectOptions, dataColumns, dataColumnsJson, dataColumnsSuppliers };
};
