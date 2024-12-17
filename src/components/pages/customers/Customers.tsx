import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReduxDispatch, useReduxSelector } from '../../../store/Store';
import { IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import { usePermissions } from '../../../logics/usePermissions';
import { useAxios } from '../../../logics/useAxios';
import { API_DATA, tableVariables } from '../../../utils/variables';
import { SelectAutoWidth } from '../../UI/Select';
import { useTable } from '../../../logics/useTable';
import { BulkCreateModal } from '../../UI/BulkCreateModal';
import { Refresh } from '@mui/icons-material';
import { useCustomer } from '../../../logics/useCustomer';
import { useCreateCustomerFields } from '../../fields/customer/createFields';
import InputModal from '../../UI/InputModal';
import ConfirmModal from '../../UI/ConfirmModal';
import { useDataColumnsCustomer } from '../../fields/customer/dataColumns';
import TableFilter from '../../UI/TableFilter';
import { useFilters } from '../../../logics/useFilters';
import { FilterItemType } from '../../types/Table.type';
import useSWRImmutable from 'swr/immutable';
import { TableMain } from '../../UI/Table/TableMain';
import { useColors } from '../../../logics/useColors';
import { homeActions } from '../../../store/appSlices/HomeSlice';

const Customers: React.FC = () => {
  const { t } = useTranslation(['customer']);
  const selectLabel = t('customerType', { ns: ['customer'] });
  const isUserSignedIn = useReduxSelector((state) => state.auth.isSignedIn);
  const isItemModalOpen = useReduxSelector((state) => state.table.isItemModalOpen);
  const isBulkCreateModalOpen = useReduxSelector((state) => state.table.isBulkCreateModalOpen);
  const isCustomerCreateModalOpen = useReduxSelector((state) => state.table.isCustomerCreateModalOpen);
  const isCustomerEditModalOpen = useReduxSelector((state) => state.table.isCustomerEditModalOpen);
  const isCustomerDeleteModalOpen = useReduxSelector((state) => state.table.isCustomerDeleteModalOpen);
  const rowCustom = useReduxSelector((state) => state.table.rowCustom);
  const [customerType, setCustomerType] = useState('0');
  const [Filters, setFilters] = useState<FilterItemType[]>([]);
  const { isSupportUser } = usePermissions();
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
    mutate: mutateCustomers,
  } = useSWRImmutable(isUserSignedIn && isSupportUser ? [API_DATA + `/list/customers/${customerType ? `?type=${customerType}` : ''}`, 'GET', ''] : null, ([url, method, body]) =>
    apiService({ url: url, method: method, data: body }),
  );

  const { selectOptions, dataColumns } = useDataColumnsCustomer();

  const { openDeleteSelectedConfirm, openBulkCreateModal } = useTable({ apiValue: 'customers' });

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
  } = useCustomer({
    mutateCustomers,
  });

  const fields = useCreateCustomerFields();

  useEffect(() => {
    dispatch(homeActions.setPageName('customers'));
  }, [dispatch]);

  return isUserSignedIn && isSupportUser ? (
    <>
      <div className="bg-transparent h-full">
        <div className="mt-2 flex gap-5 items-center">
          <Tooltip arrow title="Refresh data">
            <IconButton onClick={() => mutateCustomers()}>
              <Refresh sx={{ fontSize: 30, color: tableVariables.buttonsColor, '&:hover': { scale: '1.5' } }} />
            </IconButton>
          </Tooltip>

          {/* <button
            className={`bg-transparent ${buttonsColorText} px-4 border ${tableVariables.buttonsHeight} align-middle ${buttonsColorBorder} ${tableVariables.buttonsColorHover} hover:text-white hover:border-transparent py-0 rounded-full`}
            onClick={handleOpenCreateModal}
          >
            <Tooltip title={t('createCustomer', { ns: ['customer'] })}>
              <Typography sx={{ color: buttonsColorText }}>
                <span>{t('createCustomer', { ns: ['customer'] }).toUpperCase()}</span>
              </Typography>
            </Tooltip>
          </button> */}

          <SelectAutoWidth selectLabel={selectLabel!} selectValue={customerType} onSelect={setCustomerType} selectOptions={selectOptions!} minHeight={tableVariables.selectHeight} />

          <TableFilter Columns={dataColumns} Filters={Filters} setFilters={setFilters} />

          <div className="m-auto" style={{ color: titleTextColor }}>
            {t('customersTitle', { ns: ['customer'] })}
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
                mutate={mutateCustomers}
                apiValue="customers"
                translation="customer"
              />
            </div>
          </div>

          {isCustomerCreateModalOpen && (
            <InputModal
              openModal={isCustomerCreateModalOpen}
              handleCloseModal={handleCloseCreateModal}
              handleClose={handleCloseCreate}
              handleCancel={handleCancelCreate}
              onSubmitProp={onSubmitCreateProp}
              resetOnSubmit
              modalTitle={t('createCustomerTitle', { ns: ['customer'] })}
              contentText={t('toCreateCustomer', { ns: ['customer'] })}
              submitText={t('create', { ns: ['customer'] })}
              fields={fields}
              translation="customer"
            />
          )}

          {isCustomerEditModalOpen && (
            <InputModal
              openModal={isCustomerEditModalOpen}
              handleCloseModal={handleCloseEditModal}
              handleClose={handleCloseEdit}
              handleCancel={handleCancelEdit}
              onSubmitProp={onSubmitEditProp}
              resetOnSubmit
              modalTitle={t('editCustomerTitle', { ns: ['customer'] })}
              contentText={t('toEditCustomer', { ns: ['customer'] })}
              submitText={t('update', { ns: ['customer'] })}
              fields={fields}
              translation="customer"
              defaultValues={rowCustom}
              edit
            />
          )}

          {isCustomerDeleteModalOpen && (
            <ConfirmModal
              openModal={isCustomerDeleteModalOpen}
              handleCloseModal={handleCloseDeleteModal}
              handleClose={handleCloseDelete}
              handleCancel={handleCancelDelete}
              onConfirmProp={onDelete}
              modalTitle={t('deleteCustomerTitle', { ns: ['customer'] })}
              contentText={t('toDeleteCustomer', { ns: ['customer'] })}
              confirmText={t('delete', { ns: ['customer'] })}
              translation="customer"
            />
          )}
        </>
      </div>
    </>
  ) : (
    <></>
  );
};

export default Customers;
