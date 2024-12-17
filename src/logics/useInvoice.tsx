import { API_CREATE_INVOICE, API_DELETE_INVOICE, API_UPDATE_INVOICE } from './../utils/variables';
import React from 'react';
import { tableActions } from '../store/appSlices/TableSlice';
import { useAPI } from './useAPI';
import { useReduxDispatch, useReduxSelector } from '../store/Store';
import { KeyedMutator } from 'swr';
import { API_DATA } from '../utils/variables';
import { convertKey, keyConvert } from '../utils/common';
import { DialogProps } from '@mui/material';
import dayjs from 'dayjs';

type UseInvoiceProps = {
  mutateInvoices: KeyedMutator<any>;
  jsonFields: {
    label?: string;
    items: {
      name: string;
      type: string;
    }[];
  }[];
  sumFields: {
    label?: string;
    items: {
      name: string;
      type: string;
    }[];
  }[];
  dateFields: string[];
};

type FormInputsProps = {
  [key: string]: any;
};

export const useInvoice = ({ mutateInvoices, jsonFields, dateFields, sumFields }: UseInvoiceProps) => {
  const dispatch = useReduxDispatch();
  const rowCustom = useReduxSelector((state) => state.table.rowCustom);
  const rowId = useReduxSelector((state) => state.table.rowId);
  const userType = useReduxSelector((state) => state.auth.user.type);
  const profileSupport = useReduxSelector((state) => state.auth.profileSupport);
  const profileSupplier = useReduxSelector((state) => state.auth.profileSupplier);
  const supplierId = userType === '1' ? profileSupport.supplierId : userType === '2' ? profileSupplier.supplierId : undefined;

  const { createData, updateData, deleteData } = useAPI();

  const handleOpenCreateModal = () => {
    dispatch(tableActions.setIsInvoiceCreateModalOpen(true));
  };

  const handleCloseCreate = () => {
    dispatch(tableActions.setIsInvoiceCreateModalOpen(false));
  };

  const handleCloseCreateModal: DialogProps['onClose'] = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    dispatch(tableActions.setIsInvoiceCreateModalOpen(false));
  };

  const handleCancelCreate = () => {
    dispatch(tableActions.setIsInvoiceCreateModalOpen(false));
  };

  const onSubmitCreateProp = async (data: FormInputsProps) => {
    const newData = {} as FormInputsProps;
    const baseData = {} as FormInputsProps;
    const jsonData = {} as any;
    const sumData = {} as FormInputsProps;

    Object.keys(data.baseField).map((key: any) => {
      const value = dateFields.includes(key) ? data.baseField[key as keyof typeof data.baseField].format('YYYY-MM-DD') : data.baseField[key as keyof typeof data.baseField];
      baseData[convertKey(key) as keyof typeof baseData] = value;
    });
    baseData['supplier'] = supplierId;
    if (baseData.partner_id) {
      baseData['partner'] = baseData.partner_id;
    }
    if (baseData.invoice_number_id) {
      baseData['invoicenumber'] = baseData.invoice_number_id;
    }

    data.jsonField.map((item: any, index: number) => {
      jsonData[index] = {};
      Object.keys(item).map((key: any) => {
        const value = dateFields.includes(key) ? data.jsonField[index][key as keyof typeof data.jsonField].format('YYYY-MM-DD') : data.jsonField[index][key as keyof typeof data.jsonField];
        jsonData[index][convertKey(key) as keyof typeof jsonData] = value;
      });
    });

    Object.keys(data.sumField).map((key: any) => {
      const value = dateFields.includes(key) ? data.sumField[key as keyof typeof data.sumField].format('YYYY-MM-DD') : data.sumField[key as keyof typeof data.sumField];
      sumData[convertKey(key) as keyof typeof sumData] = value;
    });

    newData['baseData'] = baseData;
    newData['jsonData'] = jsonData;
    newData['sumData'] = sumData;

    const api = `${API_DATA}${API_CREATE_INVOICE}`;
    try {
      const { response } = await createData(api, newData);
      mutateInvoices();
    } catch (err) {
      return err;
    }
    dispatch(tableActions.setIsInvoiceCreateModalOpen(false));
  };

  const handleOpenEditModal = (row: any) => {
    const newData = {} as any;
    const json = [] as any;
    const itemsId = row['items']['id'];
    const itemsInvoice = row['items']['invoice'];
    const sums = {} as any;
    Object.keys(row).map((key: string) => {
      newData[keyConvert(key)] = row[key as keyof typeof row];

      if (key === 'items') {
        Object.keys(row[key]['data']).map((index) => {
          const dict = {} as any;
          Object.keys(row[key]['data'][index]).map((item) => {
            dict[keyConvert(item)] = row[key]['data'][index][item];
          });
          json[index] = dict;
        });
      }
      if (key === 'invoice_sums') {
        Object.keys(row[key]).map((item) => {
          sums[keyConvert(item)] = row[key][item];
        });
      }
    });

    newData['invoiceItems'] = { id: itemsId, data: json, invoice: itemsInvoice };
    newData['invoiceSums'] = sums;
    dispatch(tableActions.setRowCustom(newData));
    dispatch(tableActions.setIsInvoiceEditModalOpen(true));
  };

  const handleCloseEdit = () => {
    dispatch(tableActions.setIsInvoiceEditModalOpen(false));
    dispatch(tableActions.setRowCustom({}));
  };

  const handleCloseEditModal: DialogProps['onClose'] = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    dispatch(tableActions.setIsInvoiceEditModalOpen(false));
    dispatch(tableActions.setRowCustom({}));
  };

  const handleCancelEdit = () => {
    dispatch(tableActions.setIsInvoiceEditModalOpen(false));
    dispatch(tableActions.setRowCustom({}));
  };

  const onSubmitEditProp = async (data: FormInputsProps) => {
    const newData = {} as FormInputsProps;
    const baseData = {} as FormInputsProps;
    const jsonData = {} as any;
    const sumData = {} as FormInputsProps;

    Object.keys(data.baseField).map((key: any) => {
      const value = dateFields.includes(key) ? dayjs(data.baseField[key as keyof typeof data.baseField]).format('YYYY-MM-DD') : data.baseField[key as keyof typeof data.baseField];
      baseData[convertKey(key) as keyof typeof baseData] = value;
    });
    baseData['supplier'] = supplierId;
    if (baseData.partner_id) {
      baseData['partner'] = baseData.partner_id;
    }

    if (baseData.invoice_number_id) {
      baseData['invoicenumber'] = baseData.invoice_number_id;
    }

    data.jsonField.map((item: any, index: number) => {
      jsonData[index] = {};
      Object.keys(item).map((key: any) => {
        const value = dateFields.includes(key) ? dayjs(data.jsonField[index][key as keyof typeof data.jsonField]).format('YYYY-MM-DD') : data.jsonField[index][key as keyof typeof data.jsonField];
        jsonData[index][convertKey(key) as keyof typeof jsonData] = value;
      });
    });

    Object.keys(data.sumField).map((key: any) => {
      const value = dateFields.includes(key) ? dayjs(data.sumField[key as keyof typeof data.sumField]).format('YYYY-MM-DD') : data.sumField[key as keyof typeof data.sumField];
      sumData[convertKey(key) as keyof typeof sumData] = value;
    });

    newData['baseData'] = baseData;
    newData['jsonData'] = jsonData;
    newData['sumData'] = sumData;

    const id = rowCustom['id' as keyof typeof rowCustom];
    const api = `${API_DATA}${API_UPDATE_INVOICE}/${id}`;
    try {
      await updateData(api, newData);
      mutateInvoices();
      dispatch(tableActions.setRowCustom({}));
    } catch (err) {
      return err;
    }
    dispatch(tableActions.setIsInvoiceEditModalOpen(false));
  };

  const handleOpenDeleteModal = (rowId: string) => {
    dispatch(tableActions.setRowId(rowId));
    dispatch(tableActions.setIsInvoiceDeleteModalOpen(true));
  };

  const handleCloseDelete = () => {
    dispatch(tableActions.setIsInvoiceDeleteModalOpen(false));
    dispatch(tableActions.setRowId(''));
  };

  const handleCloseDeleteModal: DialogProps['onClose'] = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    dispatch(tableActions.setIsInvoiceDeleteModalOpen(false));
    dispatch(tableActions.setRowId(''));
  };

  const handleCancelDelete = () => {
    dispatch(tableActions.setIsInvoiceDeleteModalOpen(false));
    dispatch(tableActions.setRowId(''));
  };

  const onDelete = async () => {
    const id = rowId;
    const api = `${API_DATA}${API_DELETE_INVOICE}/${id}`;
    try {
      const { response } = await deleteData(api);
      mutateInvoices();
      dispatch(tableActions.setRowId(''));
    } catch (err) {
      return err;
    }
    dispatch(tableActions.setIsInvoiceDeleteModalOpen(false));
  };

  const handleOpenRowDetailModal = (row: any) => {
    const newData = {} as any;
    const json = [] as any;
    const itemsId = row.original['items']['id'];
    const itemsInvoice = row.original['items']['invoice'];
    const sums = {} as any;
    Object.keys(row.original).map((key: string) => {
      newData[keyConvert(key)] = row.original[key as keyof typeof row];

      if (key === 'items') {
        Object.keys(row.original[key]['data']).map((index) => {
          const dict = {} as any;
          Object.keys(row.original[key]['data'][index]).map((item) => {
            dict[keyConvert(item)] = row.original[key]['data'][index][item];
          });
          json[index] = dict;
        });
      }
      if (key === 'invoice_sums') {
        Object.keys(row.original[key]).map((item) => {
          sums[keyConvert(item)] = row.original[key][item];
        });
      }
    });

    newData['invoiceItems'] = { id: itemsId, data: json, invoice: itemsInvoice };
    newData['invoiceSums'] = sums;
    dispatch(tableActions.setRowCustom(newData));
    dispatch(tableActions.setIsItemModalOpen(true));
  };

  return {
    handleOpenCreateModal,
    handleCloseCreate,
    handleCloseCreateModal,
    handleCancelCreate,
    onSubmitCreateProp,
    handleOpenEditModal,
    handleCloseEdit,
    handleCloseEditModal,
    handleCancelEdit,
    onSubmitEditProp,
    handleOpenDeleteModal,
    handleCloseDelete,
    handleCloseDeleteModal,
    handleCancelDelete,
    onDelete,
    handleOpenRowDetailModal,
  };
};
