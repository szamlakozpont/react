import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReduxDispatch, useReduxSelector } from '../../../store/Store';
import { IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import { usePermissions } from '../../../logics/usePermissions';
import { useAxios } from '../../../logics/useAxios';
import { API_DATA, serverPagination, szamlakozpontSupplierId, tableVariables } from '../../../utils/variables';
import { SelectAutoWidth } from '../../UI/Select';
import { ItemModal } from '../../UI/ItemModal';
import { Refresh } from '@mui/icons-material';
import ConfirmModal from '../../UI/ConfirmModal';
import TableFilter from '../../UI/TableFilter';
import { useFilters } from '../../../logics/useFilters';
import { FilterItemType } from '../../types/Table.type';
import useSWRImmutable from 'swr/immutable';
import { TableMain } from '../../UI/Table/TableMain';
import { usePdfSchema } from '../../../logics/usePdfSchema';
import { useDataColumnsPdfSchema } from '../../fields/pdfschema/dataColumns';
import { useCreatePdfSchemaFields } from '../../fields/pdfschema/createFields';
import PdfDesigner from '../../UI/PdfDesigner/PdfDesigner';
import { tableActions } from '../../../store/appSlices/TableSlice';
import { ListModal } from '../../UI/ListModal';
import { useColors } from '../../../logics/useColors';
import { homeActions } from '../../../store/appSlices/HomeSlice';

type PdfComponentProps = {
  handleCancel: () => void;
  onSaveDataBase?: any;
  dataPdfSchema?: object;
};

const PdfSchemas: React.FC = () => {
  const { t } = useTranslation(['pdfschema']);
  const selectLabel = t('pdfSchemaType', { ns: ['pdfschema'] });
  const isUserSignedIn = useReduxSelector((state) => state.auth.isSignedIn);
  const isItemModalOpen = useReduxSelector((state) => state.table.isItemModalOpen);
  const isPdfSchemaJsonListModalOpen = useReduxSelector((state) => state.table.isPdfSchemaJsonListModalOpen);
  const isPdfSchemaCreateModalOpen = useReduxSelector((state) => state.table.isPdfSchemaCreateModalOpen);
  const isPdfSchemaEditModalOpen = useReduxSelector((state) => state.table.isPdfSchemaEditModalOpen);
  const isPdfSchemaDeleteModalOpen = useReduxSelector((state) => state.table.isPdfSchemaDeleteModalOpen);
  const rowCustom = useReduxSelector((state) => state.table.rowCustom);
  const pdfschemaSuppliers = useReduxSelector((state) => state.table.pdfschemaSuppliers);
  const [pdfSchemaType, setPdfSchemaType] = useState('0');
  const [Filters, setFilters] = useState<FilterItemType[]>([]);
  const { isSupportUser, userSupplierId } = usePermissions();
  const [supplierId, setSupplierId] = useState<string>(userSupplierId ? userSupplierId : szamlakozpontSupplierId);
  const [loadingSelectList, setLoadingSelectList] = useState(true);
  const dispatch = useReduxDispatch();
  const { apiService } = useAxios();

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
  } = useSWRImmutable(isUserSignedIn && isSupportUser ? [API_DATA + `/list/pdfschemas/${supplierId}/${pdfSchemaType ? `?type=${pdfSchemaType}` : ''}`, 'GET', ''] : null, ([url, method, body]) =>
    apiService({ url: url, method: method, data: body }),
  );

  const data = useMemo(() => {
    if (fetchedData) {
      if (!serverPagination) return fetchedData;
      return fetchedData.results;
    } else return undefined;
  }, [fetchedData]);

  const { selectOptions, dataColumns, dataColumnsJson, dataColumnsSuppliers } = useDataColumnsPdfSchema();

  const { fetchedData_filtered } = useFilters({ Filters: Filters, Columns: dataColumns, fetchedData: data });

  const { fields, jsonFields } = useCreatePdfSchemaFields({ setLoadingSelectList, userSupplierId });

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
    handleOpenPdfSchemaSuppliersModal,
    handleClosePdfSchemaSuppliersModal,
    handleClosePdfSchemaSuppliers,
    handleCancelPdfSchemaSuppliers,
    handleOpenPdfSchemaDefaultModal,
    handleClosePdfSchemaDefault,
  } = usePdfSchema({
    mutate,
    jsonFields,
    dateFields,
  });

  useEffect(() => {
    dispatch(tableActions.setIsPdfSchemaCreateModalOpen(false));
    dispatch(tableActions.setIsPdfSchemaEditModalOpen(false));
    dispatch(tableActions.setIsPdfSchemaDefaultModalOpen(false));
  }, [dispatch]);

  const PdfComponent: React.FC<PdfComponentProps> = ({ handleCancel, onSaveDataBase, dataPdfSchema }) => {
    return (
      <div className={` flex justify-items-center h-[calc(100%-${appHeight}px)]`}>
        <div className={`w-[100%] absolute left-[50%] top-[calc(${appHeight}px)] -translate-x-1/2 overflow-auto mb-5`}>
          <PdfDesigner
            handleCancel={handleCancel}
            translation="pdfschema"
            handleOpenPdfSchemaSuppliersModal={handleOpenPdfSchemaSuppliersModal}
            handleClosePdfSchemaSuppliers={handleClosePdfSchemaSuppliers}
            handleOpenPdfSchemaDefaultModal={handleOpenPdfSchemaDefaultModal}
            handleClosePdfSchemaDefault={handleClosePdfSchemaDefault}
            onSaveDataBase={onSaveDataBase}
            dataPdfSchema={dataPdfSchema}
          />
        </div>
      </div>
    );
  };

  useEffect(() => {
    dispatch(homeActions.setPageName('pdfschemas'));
  }, [dispatch]);

  return isSupportUser ? (
    <>
      <div className="bg-transparent h-full">
        <div className="mt-2 flex gap-5 items-center">
          {!isPdfSchemaCreateModalOpen && !isPdfSchemaEditModalOpen && (
            <Tooltip arrow title="Refresh data">
              <IconButton onClick={() => mutate()}>
                <Refresh sx={{ fontSize: 30, color: tableVariables.buttonsColor, '&:hover': { scale: '1.5' } }} />
              </IconButton>
            </Tooltip>
          )}

          {!isPdfSchemaCreateModalOpen && !isPdfSchemaEditModalOpen && (
            <button
              className={`bg-transparent ${buttonsColorText} px-4 border ${tableVariables.buttonsHeight} align-middle ${buttonsColorBorder} ${tableVariables.buttonsColorHover} hover:text-white hover:border-transparent py-0 rounded-full`}
              onClick={handleOpenCreateModal}
            >
              <Tooltip title={t('createPdfSchema', { ns: ['pdfschema'] })}>
                <Typography sx={{ color: buttonsColorText }}>
                  <span>{t('createPdfSchema', { ns: ['pdfschema'] }).toUpperCase()}</span>
                </Typography>
              </Tooltip>
            </button>
          )}

          {!isPdfSchemaCreateModalOpen && !isPdfSchemaEditModalOpen && (
            <SelectAutoWidth selectLabel={selectLabel!} selectValue={pdfSchemaType} onSelect={setPdfSchemaType} selectOptions={selectOptions!} minHeight={tableVariables.selectHeight} />
          )}

          {!isPdfSchemaCreateModalOpen && !isPdfSchemaEditModalOpen && <TableFilter Columns={dataColumns} Filters={Filters} setFilters={setFilters} />}

          <div className="m-auto" style={{ color: titleTextColor }}>
            {t('pdfSchemasTitle', { ns: ['pdfschema'] })}
          </div>
        </div>
        <>
          {!isPdfSchemaCreateModalOpen && !isPdfSchemaEditModalOpen && (
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
                  apiValue="pdfschemas"
                  translation="pdfschema"
                />
              </div>
            </div>
          )}
          {isPdfSchemaCreateModalOpen && !loadingSelectList && <PdfComponent handleCancel={handleCancelCreate} onSaveDataBase={onSubmitCreateProp} />}

          {isPdfSchemaEditModalOpen && !loadingSelectList && <PdfComponent handleCancel={handleCancelEdit} onSaveDataBase={onSubmitEditProp} dataPdfSchema={rowCustom} />}

          {isPdfSchemaDeleteModalOpen && (
            <ConfirmModal
              openModal={isPdfSchemaDeleteModalOpen}
              handleCloseModal={handleCloseDeleteModal}
              handleClose={handleCloseDelete}
              handleCancel={handleCancelDelete}
              onConfirmProp={onDelete}
              modalTitle={t('deletePdfSchemaTitle', { ns: ['pdfschema'] })}
              contentText={t('toDeletePdfSchema', { ns: ['pdfschema'] })}
              confirmText={t('delete', { ns: ['pdfschema'] })}
              translation="pdfschema"
            />
          )}
          {isItemModalOpen && <ItemModal apiLink={'/list/supplier'} title={t('listSupplierTitle', { ns: ['supplier'] })} translation="supplier" />}
          {isPdfSchemaJsonListModalOpen && (
            <ListModal modal={4} pdfschemaSuppliers={pdfschemaSuppliers} columns={dataColumnsSuppliers} title={t('listPdfSchemaSuppliersTitle', { ns: ['pdfschema'] })} translation="pdfschema" />
          )}
        </>
      </div>
    </>
  ) : (
    <></>
  );
};

export default PdfSchemas;
