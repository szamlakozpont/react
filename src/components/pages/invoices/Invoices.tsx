import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReduxDispatch, useReduxSelector } from '../../../store/Store';
import { IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import { usePermissions } from '../../../logics/usePermissions';
import { useAxios } from '../../../logics/useAxios';
import { API_DATA, API_LIST_INVOICES, API_LIST_SUPPLIER, API_SELECTLIST_SUPPLIER_PARTNER, API_SELECTLIST_SUPPLIERS, serverPagination, tableVariables } from '../../../utils/variables';
import { SelectAutoWidth } from '../../UI/Select';
import { useTable } from '../../../logics/useTable';
import { BulkCreateModal } from '../../UI/BulkCreateModal';
import { Refresh } from '@mui/icons-material';
import { useInvoice } from '../../../logics/useInvoice';
import { useCreateInvoiceFields } from '../../fields/invoice/createFields';
import ConfirmModal from '../../UI/ConfirmModal';
import { useDataColumnsInvoice } from '../../fields/invoice/dataColumns';
import { useFilters } from '../../../logics/useFilters';
import { FilterItemType } from '../../types/Table.type';
import InvoiceModal from '../../UI/InvoiceModal';
import { SelectSearch } from '../../UI/SelectSearch';
import TableFilter from '../../UI/TableFilter';
import InvoiceViewModal from '../../UI/InvoiceViewModal';
import { ItemModal } from '../../UI/ItemModal';
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';
import { TableMain } from '../../UI/Table/TableMain';
import { ListModal } from '../../UI/ListModal';
import { tableActions } from '../../../store/appSlices/TableSlice';
import axios from 'axios';
import { create } from 'xmlbuilder';
import { toast } from 'react-toastify';
import { xmlData } from '../../../utils/xmlData';
import { useColors } from '../../../logics/useColors';
import { homeActions } from '../../../store/appSlices/HomeSlice';
import useTextToSpeech from '../../../logics/useTextToSpeech';

const Invoices: React.FC = () => {
  const { i18n, t } = useTranslation(['invoice']);
  const selectLabel = t('invoiceType', { ns: ['invoice'] });
  const isItemModalOpen = useReduxSelector((state) => state.table.isItemModalOpen);
  const isBulkCreateModalOpen = useReduxSelector((state) => state.table.isBulkCreateModalOpen);
  const isInvoiceCreateModalOpen = useReduxSelector((state) => state.table.isInvoiceCreateModalOpen);
  const isInvoiceEditModalOpen = useReduxSelector((state) => state.table.isInvoiceEditModalOpen);
  const isInvoiceDeleteModalOpen = useReduxSelector((state) => state.table.isInvoiceDeleteModalOpen);
  const isInvoiceJsonListModalOpen = useReduxSelector((state) => state.table.isInvoiceJsonListModalOpen);
  const isInvoiceRecipientsListModalOpen = useReduxSelector((state) => state.table.isInvoiceRecipientsListModalOpen);
  const isInvoiceAttachmentsListModalOpen = useReduxSelector((state) => state.table.isInvoiceAttachmentsListModalOpen);
  const isInvoiceAttachmentSignatureListModalOpen = useReduxSelector((state) => state.table.isInvoceAttachmentSignatureListModalOpen);
  const [invoiceType, setInvoiceType] = useState('0');
  const rowCustom = useReduxSelector((state) => state.table.rowCustom);
  const [Filters, setFilters] = useState<FilterItemType[]>([]);

  const { isSupportUser, isSupplierUser, userSupplierId, userSupplierName } = usePermissions();
  const [invoiceSupplier, setInvoiceSupplier] = useState<string>(userSupplierId ? userSupplierId : '0');
  const [invoicePartner, setInvoicePartner] = useState<string>('0');
  const [loadingSelectList, setLoadingSelectList] = useState(true);

  const { handlePlay, handleStop } = useTextToSpeech();

  const dispatch = useReduxDispatch();
  const { apiService } = useAxios();
  const xmlServiceNumber = 1;

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
  } = useSWR(invoiceSupplier && invoiceSupplier !== '0' ? [API_DATA + API_LIST_SUPPLIER + `/${invoiceSupplier}`, 'GET', ''] : null, ([url, method, body]) =>
    apiService({ url: url, method: method, data: body }),
  );

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
            pdfSchemaId: fetchedDataSupplier.default_pdfschema,
            language: i18n.language.toUpperCase() as 'EN' | 'HU',
          }
        : {},
    [fetchedDataSupplier, i18n.language, isLoadingDataSupplier, userSupplierId],
  );

  const {
    data: fetchedData,
    error: isLoadingDataError,
    isLoading: isLoadingData,
    isValidating: isFetchingData,
    mutate: mutateInvoices,
  } = useSWRImmutable(
    (isSupportUser || isSupplierUser) && invoiceSupplier ? [API_DATA + `${API_LIST_INVOICES}/${invoiceSupplier}/${invoicePartner}/${invoiceType ? `?type=${invoiceType}` : ''}`, 'GET', ''] : null,
    ([url, method, body]) => apiService({ url: url, method: method, data: body }),
  );

  const data = useMemo(() => {
    if (fetchedData) {
      if (!serverPagination) return fetchedData;
      return fetchedData.results;
    } else return undefined;
  }, [fetchedData]);

  const { selectOptions, dataColumns, dataColumnsJson, dataColumnsSums, dataColumnsRecipients, dataColumnsAttachments, dataColumnsSignatureInfo } = useDataColumnsInvoice();

  const { openDeleteSelectedConfirm, openBulkCreateModal } = useTable({ apiValue: 'invoices' });

  const dataColumns_ = useMemo(() => [...dataColumns], [dataColumns]);

  const { fetchedData_filtered } = useFilters({ Filters: Filters, Columns: dataColumns_, fetchedData: data });

  const { fields, jsonFields, sumFields } = useCreateInvoiceFields({ setLoadingSelectList, supplierId: invoiceSupplier });

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
  } = useInvoice({
    mutateInvoices,
    jsonFields,
    dateFields,
    sumFields,
  });

  useEffect(() => {
    dispatch(tableActions.setIsInvoiceCreateModalOpen(false));
    dispatch(tableActions.setIsInvoiceEditModalOpen(false));
  }, [dispatch]);

  const sendXml = async () => {
    const a = new Date().getTime();

    for (let index = 0; index < xmlServiceNumber; index++) {
      const response = await axios({
        method: 'POST',
        url: 'http://localhost:5000/webservice/xmlservice',
        data: xmlData,
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/xml',

          taxnumber: '24091271-2-02',
          hash: 'DSR6ELO0U0X60DBDHCZV4YEMUEL6CUZ2',
        },
      });
    }
    const b = new Date().getTime();
    toast.success((b - a) / xmlServiceNumber + 'ms');
    toast.success((b - a) * 0.001 + 's');
    mutateInvoices();

    return;
  };

  useEffect(() => {
    dispatch(homeActions.setPageName('invoices'));
  }, [dispatch]);

  return isSupportUser || isSupplierUser ? (
    <>
      {!isInvoiceCreateModalOpen && !isInvoiceEditModalOpen && (
        <div className="bg-transparent h-full">
          <div className="mt-2 flex gap-5 items-center">
            <Tooltip arrow title={t('refreshData', { ns: ['table'] })}>
              <IconButton onClick={() => mutateInvoices()} onMouseEnter={() => handlePlay(t('refreshData', { ns: ['table'] }))} onMouseLeave={() => handleStop()}>
                <Refresh sx={{ fontSize: 30, color: tableVariables.buttonsColor, '&:hover': { scale: '1.5' } }} />
              </IconButton>
            </Tooltip>

            <SelectAutoWidth selectLabel={selectLabel!} selectValue={invoiceType} onSelect={setInvoiceType} selectOptions={selectOptions!} minHeight={tableVariables.selectHeight} />

            {isSupportUser && invoiceSupplier && (
              <SelectSearch
                selectLabel={t('supplier', { ns: ['invoice'] })}
                selectValue={invoiceSupplier}
                onSelect={setInvoiceSupplier}
                rounded={true}
                minWidth={250}
                minHeight={tableVariables.selectHeight}
                async
                apiLink={API_SELECTLIST_SUPPLIERS}
                initSelectOptions={{ id: '0', label: t('allSuppliers', { ns: ['invoice'] }) }}
                defaultSelectOptions={userSupplierId && userSupplierName ? { id: userSupplierId, label: userSupplierName } : { id: '0', label: t('allSuppliers', { ns: ['invoice'] }) }}
                nonEditable={isSupplierUser}
              />
            )}

            {(isSupportUser || isSupplierUser) && invoiceSupplier && (
              <SelectSearch
                selectLabel={t('supplierPartner', { ns: ['invoice'] })}
                selectValue={invoicePartner}
                onSelect={setInvoicePartner}
                rounded={true}
                minWidth={250}
                minHeight={tableVariables.selectHeight}
                async
                apiLink={`${API_SELECTLIST_SUPPLIER_PARTNER}/${invoiceSupplier}`}
                initSelectOptions={{ id: '0', label: t('allPartners', { ns: ['invoice'] }) }}
                defaultSelectOptions={{ id: '0', label: t('allPartners', { ns: ['invoice'] }) }}
              />
            )}

            <TableFilter Columns={dataColumns_} Filters={Filters} setFilters={setFilters} />

            {/* {invoiceSupplier !== '0' && (
              <button
                className={`bg-transparent ${buttonsColorText} px-4 border ${tableVariables.buttonsHeight} align-middle ${buttonsColorBorder} ${tableVariables.buttonsColorHover} hover:text-white hover:border-transparent py-0 rounded-full`}
                onClick={handleOpenCreateModal}
              >
                <Tooltip title={t('createInvoice', { ns: ['invoice'] })}>
                  <Typography sx={{ color: buttonsColorText }}>
                    <span>{t('createInvoice', { ns: ['invoice'] }).toUpperCase()}</span>
                  </Typography>
                </Tooltip>
              </button>
            )} */}

            {/* <button
              className={`bg-transparent ${buttonsColorText} px-4 border ${tableVariables.buttonsHeight} align-middle ${buttonsColorBorder} ${tableVariables.buttonsColorHover} hover:text-white hover:border-transparent py-0 rounded-full`}
              onClick={sendXml}
            >
              <Tooltip title={t('xmlService 1000', { ns: ['invoice'] })}>
                <Typography sx={{ color: buttonsColorText }}>
                  <span>{t(`xmlService ${xmlServiceNumber}`, { ns: ['invoice'] }).toUpperCase()}</span>
                </Typography>
              </Tooltip>
            </button> */}

            <div className="m-auto" style={{ color: titleTextColor }}>
              {t('invoicesTitle', { ns: ['invoice'] })}
            </div>
          </div>
          <>
            <div className={` flex justify-items-center h-[calc(100%-${appHeight}px)]`}>
              <div className={`w-[100%] absolute left-[50%] top-[calc(${appHeight}px)] -translate-x-1/2`}>
                <TableMain
                  rows={fetchedData_filtered}
                  isLoadingData={isLoadingData}
                  isFetchingData={isFetchingData}
                  dataColumns={dataColumns_}
                  selectId={'id'}
                  handleOpenEditModal={handleOpenEditModal}
                  handleOpenDeleteModal={handleOpenDeleteModal}
                  mutate={mutateInvoices}
                  apiValue="invoices"
                  translation={'invoice'}
                />
              </div>
            </div>

            {isItemModalOpen && defaultvalues && !loadingSelectList && (
              <InvoiceViewModal
                openModal={isInvoiceEditModalOpen}
                handleCloseModal={handleCloseEditModal}
                handleClose={handleCloseEdit}
                handleCancel={handleCancelEdit}
                onSubmitProp={onSubmitEditProp}
                resetOnSubmit
                modalTitle={t('editInvoiceTitle', { ns: ['invoice'] })}
                contentText={t('toEditInvoice', { ns: ['invoice'] })}
                submitText={t('update', { ns: ['invoice'] })}
                baseFields={fields}
                jsonFields={jsonFields}
                sumFields={sumFields}
                dateFields={dateFields}
                translation="invoice"
                defaultValues={rowCustom}
                edit
              />
            )}

            {isInvoiceDeleteModalOpen && (
              <ConfirmModal
                openModal={isInvoiceDeleteModalOpen}
                handleCloseModal={handleCloseDeleteModal}
                handleClose={handleCloseDelete}
                handleCancel={handleCancelDelete}
                onConfirmProp={onDelete}
                modalTitle={t('deleteInvoiceTitle', { ns: ['invoice'] })}
                contentText={t('toDeleteInvoice', { ns: ['invoice'] })}
                confirmText={t('delete', { ns: ['invoice'] })}
                translation="invoice"
              />
            )}
            {isItemModalOpen && <ItemModal apiLink={'/list/invoicenumbers'} title={t('listInvoiceNumbersTitle', { ns: ['invoice'] })} translation="invoice" />}
            {isInvoiceJsonListModalOpen && <ListModal modal={5} jsonData={data} columns={dataColumnsJson} title={t('listInvoiceJsonTitle', { ns: ['invoice'] })} translation="invoice" />}
            {isInvoiceRecipientsListModalOpen && (
              <ListModal modal={10} jsonData={data} columns={dataColumnsRecipients} title={t('listInvoiceRecipientsTitle', { ns: ['invoice'] })} translation="invoice" />
            )}
            {isInvoiceAttachmentsListModalOpen && (
              <ListModal modal={11} jsonData={data} columns={dataColumnsAttachments} title={t('listInvoiceAttachmentsTitle', { ns: ['invoice'] })} translation="invoice" />
            )}
            {isInvoiceAttachmentSignatureListModalOpen && (
              <ListModal modal={12} jsonData={data} columns={dataColumnsSignatureInfo} title={t('listSignatureInfoTitle', { ns: ['invoice'] })} translation="invoice" />
            )}
          </>
        </div>
      )}

      {isInvoiceCreateModalOpen && defaultvalues && !loadingSelectList && (
        <InvoiceModal
          openModal={isInvoiceCreateModalOpen}
          handleCloseModal={handleCloseCreateModal}
          handleClose={handleCloseCreate}
          handleCancel={handleCancelCreate}
          onSubmitProp={onSubmitCreateProp}
          resetOnSubmit
          modalTitle={t('createInvoiceTitle', { ns: ['invoice'] })}
          contentText={t('toCreateInvoice', { ns: ['invoice'] })}
          submitText={t('create', { ns: ['invoice'] })}
          baseFields={fields}
          jsonFields={jsonFields}
          sumFields={sumFields}
          dateFields={dateFields}
          translation="invoice"
          defaultValues={defaultvalues}
        />
      )}

      {isInvoiceEditModalOpen && defaultvalues && !loadingSelectList && (
        <InvoiceModal
          openModal={isInvoiceEditModalOpen}
          handleCloseModal={handleCloseEditModal}
          handleClose={handleCloseEdit}
          handleCancel={handleCancelEdit}
          onSubmitProp={onSubmitEditProp}
          resetOnSubmit
          modalTitle={t('editInvoiceTitle', { ns: ['invoice'] })}
          contentText={t('toEditInvoice', { ns: ['invoice'] })}
          submitText={t('update', { ns: ['invoice'] })}
          baseFields={fields}
          jsonFields={jsonFields}
          sumFields={sumFields}
          dateFields={dateFields}
          translation="invoice"
          defaultValues={rowCustom}
          edit
        />
      )}
    </>
  ) : (
    <></>
  );
};

export default Invoices;
