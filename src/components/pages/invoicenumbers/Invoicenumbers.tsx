import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReduxDispatch, useReduxSelector } from '../../../store/Store';
import { IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import { usePermissions } from '../../../logics/usePermissions';
import { useAxios } from '../../../logics/useAxios';
import { API_DATA, API_SELECTLIST_SUPPLIERS, tableVariables } from '../../../utils/variables';
import { useTable } from '../../../logics/useTable';
import { Refresh } from '@mui/icons-material';
import InputModal from '../../UI/InputModal';
import ConfirmModal from '../../UI/ConfirmModal';
import TableFilter from '../../UI/TableFilter';
import { useFilters } from '../../../logics/useFilters';
import { FilterItemType } from '../../types/Table.type';
import { useInvoiceNumber } from '../../../logics/useInvoiceNumber';
import { useDataColumnsInvoiceNumber } from '../../fields/invoiceNumber/dataColumns';
import { useCreateInvoiceNumbersFields } from '../../fields/invoiceNumber/createFields';
import { ItemModal } from '../../UI/ItemModal';
import { SelectSearch } from '../../UI/SelectSearch';
import useSWRImmutable from 'swr/immutable';
import { TableMain } from '../../UI/Table/TableMain';
import { useColors } from '../../../logics/useColors';
import { homeActions } from '../../../store/appSlices/HomeSlice';

const InvoiceNumber: React.FC = () => {
  const { t } = useTranslation(['supplier']);
  const selectLabel = t('supplierType', { ns: ['supplier'] });
  const isUserSignedIn = useReduxSelector((state) => state.auth.isSignedIn);
  const isItemModalOpen = useReduxSelector((state) => state.table.isItemModalOpen);
  const isInvoiceNumberCreateModalOpen = useReduxSelector((state) => state.table.isInvoiceNumberCreateModalOpen);
  const isInvoiceNumberEditModalOpen = useReduxSelector((state) => state.table.isInvoiceNumberEditModalOpen);
  const isInvoiceNumberDeleteModalOpen = useReduxSelector((state) => state.table.isInvoiceNumberDeleteModalOpen);
  const rowCustom = useReduxSelector((state) => state.table.rowCustom);
  const [invoiceNumberType, setInvoiceNumberType] = useState('0');
  const [loadingSelectList, setLoadingSelectList] = useState(true);
  const [Filters, setFilters] = useState<FilterItemType[]>([]);
  const { isSupportUser, isSupplierUser, userSupplierId, userSupplierName } = usePermissions();
  const [invoiceNumberSupplier, setInvoiceNumberSupplier] = useState<string>(userSupplierId ? userSupplierId : '0');
  const { apiService } = useAxios();
  const dispatch = useReduxDispatch();

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
    mutate: mutate,
  } = useSWRImmutable(
    (isSupportUser || isSupplierUser) && invoiceNumberSupplier
      ? [API_DATA + `/list/invoicenumbers/${invoiceNumberSupplier}/${invoiceNumberType ? `?type=${invoiceNumberType}` : ''}`, 'GET', '']
      : null,
    ([url, method, body]) => apiService({ url: url, method: method, data: body }),
  );

  const { dataColumns } = useDataColumnsInvoiceNumber();

  const { openDeleteSelectedConfirm } = useTable({ apiValue: 'invoicenumbers' });

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
  } = useInvoiceNumber({
    mutate,
  });

  const fields = useCreateInvoiceNumbersFields(setLoadingSelectList);

  useEffect(() => {
    dispatch(homeActions.setPageName('invoicenumber'));
  }, [dispatch]);

  return isUserSignedIn && isSupportUser ? (
    <>
      <div className="bg-transparent h-full">
        <div className="mt-2 flex gap-5 items-center">
          <Tooltip arrow title="Refresh data">
            <IconButton onClick={() => mutate()}>
              <Refresh sx={{ fontSize: 30, color: tableVariables.buttonsColor, '&:hover': { scale: '1.5' } }} />
            </IconButton>
          </Tooltip>

          {/* <button
            className={`bg-transparent ${buttonsColorText} px-4 border ${tableVariables.buttonsHeight} align-middle ${buttonsColorBorder} ${tableVariables.buttonsColorHover} hover:text-white hover:border-transparent py-0 rounded-full`}
            onClick={handleOpenCreateModal}
          >
            <Tooltip title={t('createInvoiceNumber', { ns: ['supplier'] })}>
              <Typography sx={{ color: buttonsColorText }}>
                <span>{t('createInvoiceNumber', { ns: ['supplier'] }).toUpperCase()}</span>
              </Typography>
            </Tooltip>
          </button> */}

          {isSupportUser && invoiceNumberSupplier && (
            <SelectSearch
              selectLabel={t('supplier', { ns: ['invoice'] })}
              selectValue={invoiceNumberSupplier}
              onSelect={setInvoiceNumberSupplier}
              rounded={true}
              minWidth={250}
              minHeight={tableVariables.selectHeight}
              async
              apiLink={API_SELECTLIST_SUPPLIERS}
              initSelectOptions={{ id: '0', label: t('allSuppliers', { ns: ['invoice'] }) }}
              defaultSelectOptions={userSupplierId && userSupplierName ? { id: userSupplierId, label: userSupplierName } : undefined}
              nonEditable={isSupplierUser}
            />
          )}
          <TableFilter Columns={dataColumns} Filters={Filters} setFilters={setFilters} />

          <div className="m-auto" style={{ color: titleTextColor }}>
            {t('invoiceNumbersTitle', { ns: ['supplier'] })}
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
                mutate={mutate}
                apiValue="invoicenumbers"
                translation="invoicenumber"
              />
            </div>
          </div>

          {isInvoiceNumberCreateModalOpen && !loadingSelectList && (
            <InputModal
              openModal={isInvoiceNumberCreateModalOpen}
              handleCloseModal={handleCloseCreateModal}
              handleClose={handleCloseCreate}
              handleCancel={handleCancelCreate}
              onSubmitProp={onSubmitCreateProp}
              resetOnSubmit
              modalTitle={t('createInvoiceNumbersTitle', { ns: ['supplier'] })}
              contentText={t('toCreateInvoiceNumbers', { ns: ['supplier'] })}
              submitText={t('create', { ns: ['supplier'] })}
              fields={fields}
              translation="supplier"
              invoiceNumbers
            />
          )}

          {isInvoiceNumberEditModalOpen && !loadingSelectList && (
            <InputModal
              openModal={isInvoiceNumberEditModalOpen}
              handleCloseModal={handleCloseEditModal}
              handleClose={handleCloseEdit}
              handleCancel={handleCancelEdit}
              onSubmitProp={onSubmitEditProp}
              resetOnSubmit
              modalTitle={t('editInvoiceNumbersTitle', { ns: ['supplier'] })}
              contentText={t('toEditInvoiceNumbers', { ns: ['supplier'] })}
              submitText={t('update', { ns: ['supplier'] })}
              fields={fields}
              translation="supplier"
              defaultValues={rowCustom}
              edit
              invoiceNumbers
            />
          )}

          {isInvoiceNumberDeleteModalOpen && (
            <ConfirmModal
              openModal={isInvoiceNumberDeleteModalOpen}
              handleCloseModal={handleCloseDeleteModal}
              handleClose={handleCloseDelete}
              handleCancel={handleCancelDelete}
              onConfirmProp={onDelete}
              modalTitle={t('deleteInvoiceNumbersTitle', { ns: ['supplier'] })}
              contentText={t('toDeleteInvoiceNumbers', { ns: ['supplier'] })}
              confirmText={t('delete', { ns: ['supplier'] })}
              translation="supplier"
            />
          )}
          {isItemModalOpen && <ItemModal apiLink={'/list/supplier'} title={t('listSupplierTitle', { ns: ['supplier'] })} translation="supplier" />}
        </>
      </div>
    </>
  ) : (
    <></>
  );
};

export default InvoiceNumber;
