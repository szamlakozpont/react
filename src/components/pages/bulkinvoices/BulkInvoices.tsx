import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReduxDispatch, useReduxSelector } from '../../../store/Store';
import { Tooltip, Typography, useTheme } from '@mui/material';
import { usePermissions } from '../../../logics/usePermissions';
import { useAxios } from '../../../logics/useAxios';
import { API_DATA, tableVariables } from '../../../utils/variables';
import ConfirmModal from '../../UI/ConfirmModal';
import { useFilters } from '../../../logics/useFilters';
import { FilterItemType } from '../../types/Table.type';
import TableFilter from '../../UI/TableFilter';
import { ItemModal } from '../../UI/ItemModal';
import { useBulkInvoice } from '../../../logics/useBulkInvoices';
import { useDataColumnsBulkInvoice } from '../../fields/bulkinvoice/dataColumns';
import { useCreateBulkInvoiceFields } from '../../fields/bulkinvoice/createFields';
import { ImportFileModal } from '../../UI/ImportFileModal';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { DateTimeSelect } from '../../UI/DateTimeSelect';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TableMain } from '../../UI/Table/TableMain';
import useSWRImmutable from 'swr/immutable';
import InputModal from '../../UI/InputModal';
import { useColors } from '../../../logics/useColors';
import { homeActions } from '../../../store/appSlices/HomeSlice';

const BulkInvoices: React.FC = () => {
  const { t, i18n } = useTranslation(['bulkinvoice']);
  const selectLabel = t('invoiceType', { ns: ['bulkinvoice'] });
  const isItemModalOpen = useReduxSelector((state) => state.table.isItemModalOpen);
  const isInvoiceCreateModalOpen = useReduxSelector((state) => state.table.isInvoiceCreateModalOpen);
  const isBulkInvoiceEditModalOpen = useReduxSelector((state) => state.table.isBulkInvoiceEditModalOpen);
  const isBulkInvoiceDeleteModalOpen = useReduxSelector((state) => state.table.isBulkInvoiceDeleteModalOpen);
  const [invoiceType, setInvoiceType] = useState('0');
  const rowCustom = useReduxSelector((state) => state.table.rowCustom);
  const [Filters, setFilters] = useState<FilterItemType[]>([]);
  const isBulkInvoiceImportModalOpen = useReduxSelector((state) => state.table.isBulkInvoiceImportModalOpen);
  const { isSupportUser, userSupplierId, userSupplierName } = usePermissions();
  const [invoiceSupplier, setInvoiceSupplier] = useState<string>(userSupplierId ? userSupplierId : '0');
  const [invoicePartner, setInvoicePartner] = useState<string>('0');
  const [loadingSelectList, setLoadingSelectList] = useState(true);
  const [data, setData] = useState<any>([]);
  const [partnerIds, setPartnerIds] = useState<number[]>([]);
  const [partnersData, setPartnersData] = useState<any>([]);
  const [count, setCount] = useState<number>();
  const [apiInit, setApiInit] = useState(false);
  const [invoiceCompletionDate, setInvoiceCompletionDate] = useState(dayjs());
  const { apiService } = useAxios();
  const dispatch = useReduxDispatch();

  const {
    mixins: { toolbar },
  } = useTheme();
  const appHeight = parseInt(toolbar?.minHeight as string) + 8;

  const { titleTextColor, buttonsColorBorder, buttonsColorText } = useColors();

  const {
    data: fetchedDataSupplier,
    error: isLoadingDataErrorSupplier,
    isLoading: isLoadingDataSupplier,
    isValidating: isFetchingDataSupplier,
  } = useSWRImmutable(userSupplierId ? [API_DATA + '/list/supplier' + `/${userSupplierId}`, 'GET', ''] : null, ([url, method, body]) => apiService({ url: url, method: method, data: body }));

  const defaultvalues = useMemo(
    () =>
      fetchedDataSupplier && !isLoadingDataSupplier
        ? {
            supplierId: userSupplierId,
            supplierName: fetchedDataSupplier.name,
            supplierTaxNumber: fetchedDataSupplier.tax_number,
            supplierEuTaxNumber: fetchedDataSupplier.eu_tax_number,
            supplierAddress: fetchedDataSupplier.address,
            editable: true,
          }
        : {},
    [fetchedDataSupplier, isLoadingDataSupplier, userSupplierId],
  );

  useEffect(() => {
    const fetchData = async () => {
      if (apiInit && count) {
        setApiInit(false);
        try {
          const response = await apiService({ url: API_DATA + '/partnersdata/', method: 'POST', data: JSON.stringify(partnerIds) });
          setPartnersData(response);
        } catch (error) {
          const err = error as AxiosError;
          toast.error(`${err.response?.statusText}`);
          setPartnersData(undefined);
        }
      }
    };
    fetchData();
  }, [apiInit, apiService, count, partnerIds]);

  const dataWithPartnersProfile = useMemo(() => {
    if (data.length > 0) {
      if (partnersData.length > 0) {
        const data_ = data.map((item: any, index: number) => Object.assign({}, item, partnersData[index]));
        return data_;
      }
      return data;
    }
    return [];
  }, [data, partnersData]);

  const { csvColumns } = useDataColumnsBulkInvoice();

  const { fetchedData_filtered } = useFilters({ Filters: Filters, Columns: csvColumns, fetchedData: dataWithPartnersProfile, bulkInvoices: true });

  const { fields } = useCreateBulkInvoiceFields();

  const dateFields = useMemo(() => {
    const array = [] as string[];
    fields.forEach((field) =>
      field.items.forEach((x) => {
        if (x.type === 'date') array.push(x.name);
      }),
    );
    return array;
  }, [fields]);

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
    handleOpenImportModal,
  } = useBulkInvoice({
    dateFields,
  });

  useEffect(() => {
    dispatch(homeActions.setPageName('bulkinvoices'));
  }, [dispatch]);

  return isSupportUser ? (
    <>
      <div className="bg-transparent h-full">
        <div className="ml-2 mt-2 flex gap-5 items-center">
          {/* <button
            className={`bg-transparent ${buttonsColorText} px-4 border ${tableVariables.buttonsHeight} align-middle ${buttonsColorBorder} ${tableVariables.buttonsColorHover} hover:text-white hover:border-transparent py-0 rounded-full`}
            onClick={() => {}}
          >
            <Tooltip title={t('makeInvoices', { ns: ['bulkinvoice'] })}>
              <Typography sx={{ color: buttonsColorText }}>
                <span>{t('makeInvoices', { ns: ['bulkinvoice'] }).toUpperCase()}</span>
              </Typography>
            </Tooltip>
          </button> */}

          <TableFilter Columns={csvColumns} Filters={Filters} setFilters={setFilters} />

          {/* <button
            className={`bg-transparent ${buttonsColorText} px-4 border ${tableVariables.buttonsHeight} align-middle ${tableVariables.buttonsColorBorder} ${tableVariables.buttonsColorHover} hover:text-white hover:border-transparent py-0 rounded-full`}
            onClick={handleOpenImportModal}
          >
            <Tooltip title={t('importFile', { ns: ['bulkinvoice'] })}>
              <Typography sx={{ color: buttonsColorText }}>
                <span>{t('importFile', { ns: ['bulkinvoice'] }).toUpperCase()}</span>
              </Typography>
            </Tooltip>
          </button> */}

          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n?.language}>
            <DateTimeSelect
              className="ml-5"
              selectLabel={t('invoiceCompletionDate', { ns: ['bulkinvoice'] })}
              selectValue={invoiceCompletionDate ? dayjs(invoiceCompletionDate) : dayjs('')}
              disabled={false}
              onChange={setInvoiceCompletionDate}
              rounded={false}
              minWidth={100}
              nonEditable={false}
              error={undefined}
              dateWithTime={false}
            />
          </LocalizationProvider>

          <div className="m-auto" style={{ color: titleTextColor }}>
            {t('bulkInvoicesTitle', { ns: ['bulkinvoice'] })}
          </div>
        </div>
        <>
          <div className={` flex justify-items-center h-[calc(100%-${appHeight}px)]`}>
            <div className={`w-[100%] absolute left-[50%] top-[calc(${appHeight}px)] -translate-x-1/2`}>
              <TableMain
                rows={fetchedData_filtered}
                isLoadingData={isLoadingDataSupplier}
                isFetchingData={isFetchingDataSupplier}
                dataColumns={csvColumns}
                tableTitle={t('importedDataFromCsv', { ns: ['bulkinvoice'] })}
                selectId={'partner_id'}
                handleOpenEditModal={handleOpenEditModal}
                handleOpenDeleteModal={handleOpenDeleteModal}
                translation="bulkinvoice"
              />
            </div>
          </div>

          {isInvoiceCreateModalOpen && defaultvalues && (
            <InputModal
              openModal={isInvoiceCreateModalOpen}
              handleCloseModal={handleCloseCreateModal}
              handleClose={handleCloseCreate}
              handleCancel={handleCancelCreate}
              onSubmitProp={onSubmitCreateProp}
              resetOnSubmit
              modalTitle={t('createBulkInvoiceTitle', { ns: ['bulkinvoice'] })}
              contentText={t('toCreateBulkInvoice', { ns: ['bulkinvoice'] })}
              submitText={t('create', { ns: ['bulkinvoice'] })}
              fields={fields}
              translation="bulkinvoice"
              defaultValues={defaultvalues}
            />
          )}

          {isBulkInvoiceEditModalOpen && defaultvalues && (
            <InputModal
              openModal={isBulkInvoiceEditModalOpen}
              handleCloseModal={handleCloseEditModal}
              handleClose={handleCloseEdit}
              handleCancel={handleCancelEdit}
              onSubmitProp={onSubmitEditProp}
              resetOnSubmit
              modalTitle={t('editBulkInvoiceTitle', { ns: ['bulkinvoice'] })}
              contentText={t('toEditBulkInvoice', { ns: ['bulkinvoice'] })}
              submitText={t('update', { ns: ['bulkinvoice'] })}
              fields={fields}
              translation="bulkinvoice"
              defaultValues={rowCustom}
              edit
            />
          )}

          {isBulkInvoiceDeleteModalOpen && (
            <ConfirmModal
              openModal={isBulkInvoiceDeleteModalOpen}
              handleCloseModal={handleCloseDeleteModal}
              handleClose={handleCloseDelete}
              handleCancel={handleCancelDelete}
              onConfirmProp={onDelete}
              modalTitle={t('deleteBulkInvoiceTitle', { ns: ['bulkinvoice'] })}
              contentText={t('toDeleteBulkInvoice', { ns: ['bulkinvoice'] })}
              confirmText={t('delete', { ns: ['bulkinvoice'] })}
              translation="invoice"
            />
          )}

          {isBulkInvoiceImportModalOpen && <ImportFileModal setData={setData} setPartnerIds={setPartnerIds} setCount={setCount} setApiInit={setApiInit} />}
          {isItemModalOpen && <ItemModal apiLink={'/list/invoicenumbers'} title={t('listInvoiceNumbersTitle', { ns: ['bulkinvoice'] })} translation="invoice" />}
        </>
      </div>
    </>
  ) : (
    <></>
  );
};

export default BulkInvoices;
