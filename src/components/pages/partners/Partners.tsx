import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReduxDispatch, useReduxSelector } from '../../../store/Store';
import { IconButton, Tooltip, useTheme } from '@mui/material';
import { usePermissions } from '../../../logics/usePermissions';
import { useAxios } from '../../../logics/useAxios';
import { API_DATA, API_LIST_INVOICES_OF_PARTNER, API_LIST_PARTNERS, serverPagination, tableVariables } from '../../../utils/variables';
import { ItemModal } from '../../UI/ItemModal';
import { Refresh } from '@mui/icons-material';
import { useCreatePartnerFields } from '../../fields/partner/createFields';
import { usePartner } from '../../../logics/usePartner';
import InputModal from '../../UI/InputModal';
import ConfirmModal from '../../UI/ConfirmModal';
import { useDataColumnsPartner } from '../../fields/partner/dataColumns';
import TableFilter from '../../UI/TableFilter';
import { useFilters } from '../../../logics/useFilters';
import { FilterItemType } from '../../types/Table.type';
import { ListModal } from '../../UI/ListModal';
import { BulkCreatePartnersModal } from '../../UI/BulkCreatePartnersModal';
import useSWRImmutable from 'swr/immutable';
import { TableMain } from '../../UI/Table/TableMain';
import { useDataColumnsInvoice } from '../../fields/invoice/dataColumns';
import { useColors } from '../../../logics/useColors';
import { homeActions } from '../../../store/appSlices/HomeSlice';
import useTextToSpeech from '../../../logics/useTextToSpeech';

const Partners: React.FC = () => {
  const { t } = useTranslation(['partner']);
  const selectLabel = t('partnerType', { ns: ['partner'] });
  const selectLabelProfile = t('withProfile', { ns: ['partner'] });
  const isUserSignedIn = useReduxSelector((state) => state.auth.isSignedIn);
  const isItemModalOpen = useReduxSelector((state) => state.table.isItemModalOpen);
  const isBulkCreatePartnersModalOpen = useReduxSelector((state) => state.table.isBulkCreatePartnersModalOpen);
  const isPartnerCreateModalOpen = useReduxSelector((state) => state.table.isPartnerCreateModalOpen);
  const isPartnerEditModalOpen = useReduxSelector((state) => state.table.isPartnerEditModalOpen);
  const isPartnerDeleteModalOpen = useReduxSelector((state) => state.table.isPartnerDeleteModalOpen);
  const rowCustom = useReduxSelector((state) => state.table.rowCustom);
  const isInvoicesListModalOpen = useReduxSelector((state) => state.table.isInvoicesListModalOpen);
  const isInvoiceJsonListModalOpen = useReduxSelector((state) => state.table.isInvoiceJsonListModalOpen);
  const [partnerType, setPartnerType] = useState('0');
  const { isSupportUser, isSupplierUser, userSupplierId, userSupplierName } = usePermissions();
  const [loadingSelectList, setLoadingSelectList] = useState(true);
  const [Filters, setFilters] = useState<FilterItemType[]>([]);
  const [selectWithProfile, setSelectWithProfile] = useState('false');
  const isInvoiceRecipientsListModalOpen = useReduxSelector((state) => state.table.isInvoiceRecipientsListModalOpen);
  const isInvoiceAttachmentsListModalOpen = useReduxSelector((state) => state.table.isInvoiceAttachmentsListModalOpen);
  const isInvoiceAttachmentSignatureListModalOpen = useReduxSelector((state) => state.table.isInvoceAttachmentSignatureListModalOpen);
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
    mutate: mutatePartners,
  } = useSWRImmutable(isSupportUser ? [API_DATA + API_LIST_PARTNERS + `/${partnerType ? `?type=${partnerType}` : ''}`, 'GET', ''] : null, ([url, method, body]) =>
    apiService({ url: url, method: method, data: body }),
  );

  const data = useMemo(() => {
    if (fetchedData) {
      if (!serverPagination) return fetchedData;
      return fetchedData.results;
    } else return undefined;
  }, [fetchedData]);

  const defaultvalues = useMemo(() => {
    if (rowCustom && 'profileName' in rowCustom) {
      const values = { ...rowCustom, isPartnerProfile: true };
      return values;
    } else {
      const values = { ...rowCustom, isPartnerProfile: false };
      return values;
    }
  }, [rowCustom]);

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
    openBulkCreatePartnersModal,
  } = usePartner({
    mutatePartners,
  });

  const { selectOptions, dataColumns, dataColumnsProfile } = useDataColumnsPartner();

  const { dataColumns: dataColumnsInvoice } = useDataColumnsInvoice();

  const { dataColumnsJson: dataColumnsInvoiceJson, dataColumnsRecipients: dataColumnsInvoiceRecipients, dataColumnsAttachments, dataColumnsSignatureInfo } = useDataColumnsInvoice();

  const { fields, partnerProfileFields } = useCreatePartnerFields(setLoadingSelectList);

  const hasProfile = useMemo(() => {
    if (selectWithProfile === 'true') return true;
    else return false;
  }, [selectWithProfile]);

  const fields_ = () => {
    if (!hasProfile) {
      return fields.map((field) => ({
        ...field,
        items: field.items.filter((x) => x.name !== 'isPartnerProfile'),
      }));
    }
    return fields;
  };

  const dataColumns_ = useMemo(() => {
    if (hasProfile && dataColumnsProfile) return [...dataColumns, ...dataColumnsProfile];
    else return dataColumns;
  }, [dataColumns, dataColumnsProfile, hasProfile]);

  const { fetchedData_filtered } = useFilters({ Filters: Filters, Columns: dataColumns_, fetchedData: data });

  useEffect(() => {
    dispatch(homeActions.setPageName('partners'));
  }, [dispatch]);

  return isSupportUser ? (
    <>
      <div className="bg-transparent h-full">
        <div className="mt-2 flex gap-5 items-center">
          <Tooltip arrow title={t('refreshData', { ns: ['table'] })}>
            <IconButton onClick={() => mutatePartners()} onMouseEnter={() => handlePlay(t('refreshData', { ns: ['table'] }))} onMouseLeave={() => handleStop()}>
              <Refresh sx={{ fontSize: 30, color: tableVariables.buttonsColor, '&:hover': { scale: '1.5' } }} />
            </IconButton>
          </Tooltip>

          {/* <button
            className={`bg-transparent ${buttonsColorText} px-4 border ${tableVariables.buttonsHeight} align-middle ${buttonsColorBorder} ${tableVariables.buttonsColorHover} hover:text-white hover:border-transparent py-0 rounded-full`}
            onClick={openBulkCreatePartnersModal}
          >
            <Tooltip title={t('createBulkPartner', { ns: ['partner'] })}>
              <Typography sx={{ color: buttonsColorText }}>
                <span>{t('createBulkPartner', { ns: ['partner'] }).toUpperCase()}</span>
              </Typography>
            </Tooltip>
          </button> */}

          {/* <button
            className={`bg-transparent ${buttonsColorText} px-4 border ${tableVariables.buttonsHeight} align-middle ${buttonsColorBorder} ${tableVariables.buttonsColorHover} hover:text-white hover:border-transparent py-0 rounded-full`}
            onClick={handleOpenCreateModal}
          >
            <Tooltip title={t('createPartner', { ns: ['partner'] })}>
              <Typography sx={{ color: buttonsColorText }}>
                <span>{t('createPartner', { ns: ['partner'] }).toUpperCase()}</span>
              </Typography>
            </Tooltip>
          </button> */}

          {/* <SelectAutoWidth selectLabel={selectLabel!} selectValue={partnerType} onSelect={setPartnerType} selectOptions={selectOptions!} minHeight={tableVariables.selectHeight} /> */}

          {/* <SelectAutoWidth
            selectLabel={selectLabelProfile!}
            selectValue={selectWithProfile}
            onSelect={setSelectWithProfile}
            selectOptions={[
              { id: 'true', label: t('trueProfile', { ns: ['partner'] }) },
              { id: 'false', label: t('falseProfile', { ns: ['partner'] }) },
            ]}
            minHeight={tableVariables.selectHeight}
          /> */}

          <TableFilter Columns={dataColumns_} Filters={Filters} setFilters={setFilters} />

          <div className="m-auto" style={{ color: titleTextColor }}>
            {t('partnersTitle_', { ns: ['partner'] })}
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
                mutate={mutatePartners}
                apiValue="partners"
                translation="partner"
              />
            </div>
          </div>

          {isPartnerCreateModalOpen && !loadingSelectList && (
            <InputModal
              openModal={isPartnerCreateModalOpen}
              handleCloseModal={handleCloseCreateModal}
              handleClose={handleCloseCreate}
              handleCancel={handleCancelCreate}
              onSubmitProp={onSubmitCreateProp}
              resetOnSubmit
              modalTitle={t('createPartnerTitle', { ns: ['partner'] })}
              contentText={t('toCreatePartner', { ns: ['partner'] })}
              submitText={t('create', { ns: ['partner'] })}
              fields={fields_()}
              translation="partner"
              userSupplierId={userSupplierId?.toString()}
              partnerProfileFields={selectWithProfile ? partnerProfileFields : undefined}
              partners
            />
          )}

          {isPartnerEditModalOpen && !loadingSelectList && (
            <InputModal
              openModal={isPartnerEditModalOpen}
              handleCloseModal={handleCloseEditModal}
              handleClose={handleCloseEdit}
              handleCancel={handleCancelEdit}
              onSubmitProp={onSubmitEditProp}
              resetOnSubmit
              modalTitle={t('editPartnerTitle', { ns: ['partner'] })}
              contentText={t('toEditPartner', { ns: ['partner'] })}
              submitText={t('update', { ns: ['partner'] })}
              fields={fields_()}
              translation="partner"
              defaultValues={defaultvalues}
              userSupplierId={userSupplierId?.toString()}
              partnerProfileFields={selectWithProfile ? partnerProfileFields : undefined}
              partners
              edit
            />
          )}

          {isPartnerDeleteModalOpen && (
            <ConfirmModal
              openModal={isPartnerDeleteModalOpen}
              handleCloseModal={handleCloseDeleteModal}
              handleClose={handleCloseDelete}
              handleCancel={handleCancelDelete}
              onConfirmProp={onDelete}
              modalTitle={t('deletePartnerTitle', { ns: ['partner'] })}
              contentText={t('toDeletePartner', { ns: ['partner'] })}
              confirmText={t('delete', { ns: ['partner'] })}
              translation="partner"
            />
          )}
          {isBulkCreatePartnersModalOpen && <BulkCreatePartnersModal mutate={mutatePartners} apiLink={'/bulkcreate/partners/'} apiLinkArgument={'?profile='} />}
          {isItemModalOpen && <ItemModal apiLink={'/list/supplier'} title={t('listSupplierTitle', { ns: ['supplier'] })} translation="supplier" />}
          {isInvoicesListModalOpen && (
            <ListModal modal={2} columns={dataColumnsInvoice} apiLink={API_LIST_INVOICES_OF_PARTNER} title={t('listInvoicesTitle', { ns: ['partner'] })} translation="invoice" />
          )}
          {isInvoiceJsonListModalOpen && <ListModal modal={5} jsonData={data} columns={dataColumnsInvoiceJson} title={t('listInvoiceJsonTitle', { ns: ['invoice'] })} translation="invoice" />}
          {isInvoiceRecipientsListModalOpen && (
            <ListModal modal={10} jsonData={data} columns={dataColumnsInvoiceRecipients} title={t('listInvoiceRecipientsTitle', { ns: ['invoice'] })} translation="invoice" />
          )}
          {isInvoiceAttachmentsListModalOpen && (
            <ListModal modal={11} jsonData={data} columns={dataColumnsAttachments} title={t('listInvoiceAttachmentsTitle', { ns: ['invoice'] })} translation="invoice" />
          )}
          {isInvoiceAttachmentSignatureListModalOpen && (
            <ListModal modal={12} jsonData={data} columns={dataColumnsSignatureInfo} title={t('listSignatureInfoTitle', { ns: ['invoice'] })} translation="invoice" />
          )}
        </>
      </div>
    </>
  ) : (
    <></>
  );
};

export default Partners;
