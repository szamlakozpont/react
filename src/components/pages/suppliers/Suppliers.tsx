import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReduxDispatch, useReduxSelector } from '../../../store/Store';
import { IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import { usePermissions } from '../../../logics/usePermissions';
import { useAxios } from '../../../logics/useAxios';
import { API_DATA, API_LIST_PARTNERS_OF_SUPPLIER, API_LIST_SUPPLIERS, tableVariables } from '../../../utils/variables';
import { useTable } from '../../../logics/useTable';
import { ItemModal } from '../../UI/ItemModal';
import { Refresh } from '@mui/icons-material';
import { useSupplier } from '../../../logics/useSupplier';
import { useCreateSupplierFields } from '../../fields/supplier/createFields';
import InputModal from '../../UI/InputModal';
import ConfirmModal from '../../UI/ConfirmModal';
import { useDataColumnsSupplier } from '../../fields/supplier/dataColumns';
import { ListModal } from '../../UI/ListModal';
import TableFilter from '../../UI/TableFilter';
import { useFilters } from '../../../logics/useFilters';
import { FilterItemType } from '../../types/Table.type';
import useSWRImmutable from 'swr/immutable';
import { TableMain } from '../../UI/Table/TableMain';
import { SelectAutoWidth } from '../../UI/Select';
import { BulkCreateSuppliersModal } from '../../UI/BulkCreateSuppliersModal';
import { useColors } from '../../../logics/useColors';
import { homeActions } from '../../../store/appSlices/HomeSlice';
import useTextToSpeech from '../../../logics/useTextToSpeech';

const Suppliers: React.FC = () => {
  const { t } = useTranslation(['supplier']);
  const selectLabel = t('supplierType', { ns: ['supplier'] });
  const isUserSignedIn = useReduxSelector((state) => state.auth.isSignedIn);
  const isItemModalOpen = useReduxSelector((state) => state.table.isItemModalOpen);
  const isPartnersListModalOpen = useReduxSelector((state) => state.table.isPartnersListModalOpen);
  const isInvoiceNumbersListModalOpen = useReduxSelector((state) => state.table.isInvoiceNumbersListModalOpen);
  const isBulkCreateSuppliersModalOpen = useReduxSelector((state) => state.table.isBulkCreateSuppliersModalOpen);
  const isSupplierCreateModalOpen = useReduxSelector((state) => state.table.isSupplierCreateModalOpen);
  const isSupplierEditModalOpen = useReduxSelector((state) => state.table.isSupplierEditModalOpen);
  const isSupplierDeleteModalOpen = useReduxSelector((state) => state.table.isSupplierDeleteModalOpen);
  const rowCustom = useReduxSelector((state) => state.table.rowCustom);
  const [supplierType, setSupplierType] = useState('0');
  const [Filters, setFilters] = useState<FilterItemType[]>([]);
  const { isSupportUser } = usePermissions();
  const { apiService } = useAxios();

  const dispatch = useReduxDispatch();

  const { handlePlay, handleStop } = useTextToSpeech();

  const {
    mixins: { toolbar },
  } = useTheme();
  const appHeight = parseInt(toolbar?.minHeight as string) + 8;

  const { titleTextColor, buttonsColorBorder, buttonsColorText } = useColors();

  const {
    data: fetchedData,
    error: isLoadingDataError,
    isLoading: isLoadingData,
    isValidating: isFetchingData,
    mutate: mutateSuppliers,
  } = useSWRImmutable(isUserSignedIn && isSupportUser ? [API_DATA + API_LIST_SUPPLIERS + `/${supplierType ? `?type=${supplierType}` : ''}`, 'GET', ''] : null, ([url, method, body]) =>
    apiService({ url: url, method: method, data: body }),
  );

  const { selectOptions, dataColumns } = useDataColumnsSupplier();

  const { openDeleteSelectedConfirm, openBulkCreateModal } = useTable({ apiValue: 'suppliers' });

  const { fetchedData_filtered } = useFilters({ Filters: Filters, Columns: dataColumns, fetchedData: fetchedData });

  const {
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
    openBulkCreateSuppliersModal,
  } = useSupplier({
    mutateSuppliers,
  });

  const fields = useCreateSupplierFields();

  useEffect(() => {
    dispatch(homeActions.setPageName('suppliers'));
  }, [dispatch]);

  return isUserSignedIn && isSupportUser ? (
    <>
      <div className="bg-transparent h-full">
        <div className="mt-2 flex gap-5 items-center">
          <Tooltip arrow title={t('refreshData', { ns: ['table'] })}>
            <IconButton onClick={() => mutateSuppliers()} onMouseEnter={() => handlePlay(t('refreshData', { ns: ['table'] }))} onMouseLeave={() => handleStop()}>
              <Refresh sx={{ fontSize: 30, color: tableVariables.buttonsColor, '&:hover': { scale: '1.5' } }} />
            </IconButton>
          </Tooltip>

          {/* <button
            className={`bg-transparent ${tableVariables.buttonsColorText} px-4 border ${tableVariables.buttonsHeight} align-middle ${tableVariables.buttonsColorBorder} ${tableVariables.buttonsColorHover} hover:text-white hover:border-transparent py-0 rounded-full`}
            onClick={openBulkCreateSuppliersModal}
          >
            <Tooltip title={t('createBulkSupplier', { ns: ['supplier'] })}>
              <span>{t('createBulkSupplier', { ns: ['supplier'] }).toUpperCase()}</span>
            </Tooltip>
          </button> */}

          <button
            className={`bg-transparent ${buttonsColorText} px-4 border ${tableVariables.buttonsHeight} align-middle ${buttonsColorBorder} ${tableVariables.buttonsColorHover} hover:text-white hover:border-transparent py-0 rounded-full`}
            onClick={handleOpenCreateModal}
            onMouseEnter={() => handlePlay(t('createSupplier', { ns: ['supplier'] }))}
            onMouseLeave={() => handleStop()}
          >
            <Tooltip title={t('createSupplier', { ns: ['supplier'] })}>
              <Typography sx={{ color: buttonsColorText }}>
                <span>{t('createSupplier', { ns: ['supplier'] }).toUpperCase()}</span>
              </Typography>
            </Tooltip>
          </button>

          {/* <SelectAutoWidth selectLabel={selectLabel!} selectValue={supplierType} onSelect={setSupplierType} selectOptions={selectOptions!} minHeight={tableVariables.selectHeight} /> */}

          <TableFilter Columns={dataColumns} Filters={Filters} setFilters={setFilters} />

          <div className="m-auto" style={{ color: titleTextColor }}>
            {t('suppliersTitle', { ns: ['supplier'] })}
          </div>
        </div>
        <>
          <div className={` flex justify-items-center h-[calc(100%-${appHeight}px)]`}>
            <div className={`w-[100%] absolute left-[50%] top-[calc(${appHeight}px)] -translate-x-1/2`}>
              <TableMain
                rows={fetchedData_filtered}
                isLoadingData={isLoadingData}
                isFetchingData={isFetchingData}
                dataColumns={dataColumns}
                selectId={'id'}
                handleOpenEditModal={handleOpenEditModal}
                handleOpenDeleteModal={handleOpenDeleteModal}
                mutate={mutateSuppliers}
                apiValue="suppliers"
                translation="supplier"
              />
            </div>
          </div>

          {isSupplierCreateModalOpen && (
            <InputModal
              openModal={isSupplierCreateModalOpen}
              handleCloseModal={handleCloseCreateModal}
              handleClose={handleCloseCreate}
              handleCancel={handleCancelCreate}
              onSubmitProp={onSubmitCreateProp}
              resetOnSubmit
              modalTitle={t('createSupplierTitle', { ns: ['supplier'] })}
              contentText={t('toCreateSupplier', { ns: ['supplier'] })}
              submitText={t('create', { ns: ['supplier'] })}
              fields={fields}
              translation="supplier"
            />
          )}

          {isSupplierEditModalOpen && (
            <InputModal
              openModal={isSupplierEditModalOpen}
              handleCloseModal={handleCloseEditModal}
              handleClose={handleCloseEdit}
              handleCancel={handleCancelEdit}
              onSubmitProp={onSubmitEditProp}
              resetOnSubmit
              modalTitle={t('editSupplierTitle', { ns: ['supplier'] })}
              contentText={t('toEditSupplier', { ns: ['supplier'] })}
              submitText={t('update', { ns: ['supplier'] })}
              fields={fields}
              translation="supplier"
              defaultValues={rowCustom}
              edit
            />
          )}

          {isSupplierDeleteModalOpen && (
            <ConfirmModal
              openModal={isSupplierDeleteModalOpen}
              handleCloseModal={handleCloseDeleteModal}
              handleClose={handleCloseDelete}
              handleCancel={handleCancelDelete}
              onConfirmProp={onDelete}
              modalTitle={t('deleteSupplierTitle', { ns: ['supplier'] })}
              contentText={t('toDeleteSupplier', { ns: ['supplier'] })}
              confirmText={t('delete', { ns: ['supplier'] })}
              translation="supplier"
            />
          )}

          {/* {isBulkCreateSuppliersModalOpen && <BulkCreateSuppliersModal mutate={mutateSuppliers} apiLink={'/bulkcreate/suppliers/'} />} */}
          {isPartnersListModalOpen && <ListModal modal={1} apiLink={API_LIST_PARTNERS_OF_SUPPLIER} title={t('listPartnerTitle_', { ns: ['supplier'] })} translation="partner" />}
          {isInvoiceNumbersListModalOpen && <ListModal modal={3} apiLink={'/supplier/invoicenumbers'} title={t('invoiceNumbersTitle', { ns: ['supplier'] })} translation="supplier" />}
          {isItemModalOpen && <ItemModal apiLink={'/list/supplier'} title={t('listSupplierTitle', { ns: ['supplier'] })} translation="supplier" />}
        </>
      </div>
    </>
  ) : (
    <></>
  );
};

export default Suppliers;
