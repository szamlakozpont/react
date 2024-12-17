import React from 'react';
import { tableActions } from '../store/appSlices/TableSlice';
import { useAPI } from './useAPI';
import { useReduxDispatch, useReduxSelector } from '../store/Store';
import { KeyedMutator } from 'swr';
import { API_DATA } from '../utils/variables';
import { DialogProps } from '@mui/material';
import { usePermissions } from './usePermissions';
import { authActions } from '../store/appSlices/AuthSlice';
import { table } from 'console';

type UsePdfSchemaProps = {
  mutate: KeyedMutator<any>;
  jsonFields: {
    label?: string;
    items: {
      name: string;
      type: string;
    }[];
  }[];
  dateFields: string[];
};

export type FormInputsProps = {
  [key: string]: any;
};

export const usePdfSchema = ({ mutate, dateFields }: UsePdfSchemaProps) => {
  const dispatch = useReduxDispatch();
  const rowCustom = useReduxSelector((state) => state.table.rowCustom);
  const rowId = useReduxSelector((state) => state.table.rowId);

  const { createData, updateData, deleteData } = useAPI();
  const { isSupportUser, isSupplierUser, userSupplierId } = usePermissions();

  const handleOpenCreateModal = () => {
    dispatch(tableActions.setIsPdfSchemaCreateModalOpen(true));
    dispatch(tableActions.setIsChosenSuppliersModalInit(true));
    dispatch(tableActions.setIsDefaultPdfSchemaModalInit(true));
  };

  const handleCloseCreate = () => {
    dispatch(tableActions.setIsPdfSchemaCreateModalOpen(false));
    dispatch(tableActions.setChosenSuppliersIds([]));
    dispatch(tableActions.setPdfSchemaName(''));
    dispatch(tableActions.setChosenSuppliersNames([]));
    dispatch(tableActions.setChosenDefaultSuppliersIds([]));
    dispatch(tableActions.setChosenDefaultSuppliersNames([]));
    dispatch(tableActions.setIsChosenSuppliersModalInit(false));
    dispatch(tableActions.setIsDefaultPdfSchemaModalInit(false));
  };

  const handleCloseCreateModal: DialogProps['onClose'] = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    dispatch(tableActions.setIsPdfSchemaCreateModalOpen(false));
    dispatch(tableActions.setChosenSuppliersIds([]));
    dispatch(tableActions.setPdfSchemaName(''));
    dispatch(tableActions.setChosenSuppliersNames([]));
    dispatch(tableActions.setChosenDefaultSuppliersIds([]));
    dispatch(tableActions.setChosenDefaultSuppliersNames([]));
    dispatch(tableActions.setIsChosenSuppliersModalInit(false));
    dispatch(tableActions.setIsDefaultPdfSchemaModalInit(false));
  };

  const handleCancelCreate = () => {
    dispatch(tableActions.setIsPdfSchemaCreateModalOpen(false));
    dispatch(tableActions.setChosenSuppliersIds([]));
    dispatch(tableActions.setPdfSchemaName(''));
    dispatch(tableActions.setChosenSuppliersNames([]));
    dispatch(tableActions.setChosenDefaultSuppliersIds([]));
    dispatch(tableActions.setChosenDefaultSuppliersNames([]));
    dispatch(tableActions.setIsChosenSuppliersModalInit(false));
    dispatch(tableActions.setIsDefaultPdfSchemaModalInit(false));
  };

  const onSubmitCreateProp = async (data: FormInputsProps) => {
    const api = `${API_DATA}/create/pdfschemas/`;
    try {
      const { response } = await createData(api, data);
      mutate();
    } catch (err) {
      return err;
    }
    dispatch(tableActions.setIsPdfSchemaCreateModalOpen(false));
    dispatch(tableActions.setIsChosenSuppliersModalInit(false));
    dispatch(tableActions.setIsDefaultPdfSchemaModalInit(false));
  };

  const handleOpenEditModal = (row: any) => {
    dispatch(tableActions.setRowCustom(row));
    dispatch(tableActions.setIsPdfSchemaEditModalOpen(true));
    dispatch(tableActions.setIsChosenSuppliersModalInit(true));
    dispatch(tableActions.setIsDefaultPdfSchemaModalInit(false));
  };

  const handleCloseEdit = () => {
    dispatch(tableActions.setIsPdfSchemaEditModalOpen(false));
    dispatch(tableActions.setRowCustom({}));
    dispatch(tableActions.setChosenSuppliersIds([]));
    dispatch(tableActions.setPdfSchemaName(''));
    dispatch(tableActions.setChosenSuppliersNames([]));
    dispatch(tableActions.setChosenDefaultSuppliersIds([]));
    dispatch(tableActions.setChosenDefaultSuppliersNames([]));
    dispatch(tableActions.setIsChosenSuppliersModalInit(false));
    dispatch(tableActions.setIsDefaultPdfSchemaModalInit(false));
  };

  const handleCloseEditModal: DialogProps['onClose'] = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    dispatch(tableActions.setIsPdfSchemaEditModalOpen(false));
    dispatch(tableActions.setRowCustom({}));
    dispatch(tableActions.setChosenSuppliersIds([]));
    dispatch(tableActions.setPdfSchemaName(''));
    dispatch(tableActions.setChosenSuppliersNames([]));
    dispatch(tableActions.setChosenDefaultSuppliersIds([]));
    dispatch(tableActions.setChosenDefaultSuppliersNames([]));
    dispatch(tableActions.setIsChosenSuppliersModalInit(false));
    dispatch(tableActions.setIsDefaultPdfSchemaModalInit(false));
  };

  const handleCancelEdit = () => {
    dispatch(tableActions.setIsPdfSchemaEditModalOpen(false));
    dispatch(tableActions.setRowCustom({}));
    dispatch(tableActions.setChosenSuppliersIds([]));
    dispatch(tableActions.setPdfSchemaName(''));
    dispatch(tableActions.setChosenSuppliersNames([]));
    dispatch(tableActions.setChosenDefaultSuppliersIds([]));
    dispatch(tableActions.setChosenDefaultSuppliersNames([]));
    dispatch(tableActions.setIsChosenSuppliersModalInit(false));
    dispatch(tableActions.setIsDefaultPdfSchemaModalInit(false));
  };

  const modifyUserProfileSupplier = (id: string, newData: FormInputsProps) => {
    if (isSupportUser) {
      dispatch(authActions.setProfileSupportSupplierId(newData.supplierId));
      dispatch(authActions.setProfileSupportSupplierName(newData.supplierName));
    } else if (isSupplierUser) {
      dispatch(authActions.setProfileSupplierSupplierId(newData.supplierId));
      dispatch(authActions.setProfileSupplierSupplierName(newData.supplierName));
    }
  };

  const onSubmitEditProp = async (data: FormInputsProps) => {
    const id = rowCustom['id' as keyof typeof rowCustom];
    const api = `${API_DATA}/update/pdfschema/${id}`;
    try {
      const { response } = await updateData(api, data);
      mutate();
      dispatch(tableActions.setRowCustom({}));
    } catch (err) {
      return err;
    }
    dispatch(tableActions.setIsPdfSchemaEditModalOpen(false));
    dispatch(tableActions.setIsChosenSuppliersModalInit(false));
    dispatch(tableActions.setIsDefaultPdfSchemaModalInit(false));
  };
  const handleOpenDeleteModal = (rowId: string) => {
    dispatch(tableActions.setRowId(rowId));
    dispatch(tableActions.setIsPdfSchemaDeleteModalOpen(true));
  };

  const handleCloseDelete = () => {
    dispatch(tableActions.setIsPdfSchemaDeleteModalOpen(false));
    dispatch(tableActions.setRowId(''));
  };

  const handleCloseDeleteModal: DialogProps['onClose'] = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    dispatch(tableActions.setIsPdfSchemaDeleteModalOpen(false));
    dispatch(tableActions.setRowId(''));
  };

  const handleCancelDelete = () => {
    dispatch(tableActions.setIsPdfSchemaDeleteModalOpen(false));
    dispatch(tableActions.setRowId(''));
  };

  const onDelete = async () => {
    const id = rowId;
    const api = `${API_DATA}/delete/pdfschema/${id}`;
    try {
      const { response } = await deleteData(api);
      mutate();
      dispatch(tableActions.setRowId(''));
    } catch (err) {
      return err;
    }
    dispatch(tableActions.setIsPdfSchemaDeleteModalOpen(false));
  };

  const handleOpenRowDetailModal = (rowId: string) => {
    dispatch(tableActions.setRowId(rowId));
    dispatch(tableActions.setIsItemModalOpen(true));
  };

  const handleOpenPdfSchemaSuppliersModal = () => {
    dispatch(tableActions.setIsPdfSchemaSuppliersModalOpen(true));
  };

  const handleClosePdfSchemaSuppliers = () => {
    dispatch(tableActions.setIsPdfSchemaSuppliersModalOpen(false));
  };

  const handleClosePdfSchemaSuppliersModal: DialogProps['onClose'] = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    dispatch(tableActions.setIsPdfSchemaSuppliersModalOpen(false));
  };

  const handleCancelPdfSchemaSuppliers = () => {
    dispatch(tableActions.setIsPdfSchemaSuppliersModalOpen(false));
  };

  const handleOpenPdfSchemaDefaultModal = () => {
    dispatch(tableActions.setIsPdfSchemaDefaultModalOpen(true));
  };

  const handleClosePdfSchemaDefault = () => {
    dispatch(tableActions.setIsPdfSchemaDefaultModalOpen(false));
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
    handleOpenPdfSchemaSuppliersModal,
    handleClosePdfSchemaSuppliersModal,
    handleClosePdfSchemaSuppliers,
    handleCancelPdfSchemaSuppliers,
    handleOpenPdfSchemaDefaultModal,
    handleClosePdfSchemaDefault,
  };
};
