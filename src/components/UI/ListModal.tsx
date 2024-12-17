import React, { Fragment, useEffect, useMemo, useState } from 'react';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Button, DialogActions, Zoom } from '@mui/material';
import { useReduxDispatch, useReduxSelector } from '../../store/Store';
import { tableActions } from '../../store/appSlices/TableSlice';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';
import { useAxios } from '../../logics/useAxios';
import { API_DATA, serverPagination, JsonNoDataModals } from '../../utils/variables';
import { Spinner } from './Spinner';
import { TableList } from './TableList/TableList';
import { DataColumnsProp } from '../types/Table.type';
import { TableListJson } from './TableList/TableListJson';

type ListModalProps = {
  apiLink?: string;
  title: string;
  translation: string;
  modal: number;
  jsonData?: DataColumnsProp[];
  columns?: DataColumnsProp[];
  pdfschemaSuppliers?: string[];
  noJson?: boolean;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" mountOnEnter unmountOnExit ref={ref} {...props} onExited={() => {}} />;
});

export const ListModal: React.FC<ListModalProps> = ({ modal, apiLink, title, translation, jsonData, columns, pdfschemaSuppliers, noJson }) => {
  const { t } = useTranslation(['table']);
  const dispatch = useReduxDispatch();
  const rowId = useReduxSelector((state) => state.table.rowId);
  const rowCustom = useReduxSelector((state) => state.table.rowCustom);
  const rowCustom_ = useReduxSelector((state) => state.table.rowCustom_);
  const [open, setOpen] = useState(false);

  const { apiService } = useAxios();

  const {
    data: fetchedData,
    error: isLoadingDataError,
    isLoading: isLoadingData,
    isValidating: isFetchingData,
  } = useSWR(open && !jsonData && !pdfschemaSuppliers ? [API_DATA + apiLink + `/${rowId}`, 'GET', ''] : null, ([url, method, body]) => apiService({ url: url, method: method, data: body }));

  const data = useMemo(() => {
    if (fetchedData) {
      if (!serverPagination) return fetchedData;
      return fetchedData.results;
    } else if (jsonData) {
      return modal !== 12 ? rowCustom : rowCustom_;
    } else if (pdfschemaSuppliers) return pdfschemaSuppliers;

    return undefined;
  }, [fetchedData, jsonData, modal, pdfschemaSuppliers, rowCustom, rowCustom_]);

  useEffect(() => {
    if (modal) {
      setOpen(true);
    }
  }, [modal]);

  const handleClose = () => {
    switch (modal) {
      case 1: {
        dispatch(tableActions.setIsPartnersListModalOpen(false));
        break;
      }
      case 2: {
        dispatch(tableActions.setIsInvoicesListModalOpen(false));
        break;
      }
      case 3: {
        dispatch(tableActions.setIsInvoiceNumbersListModalOpen(false));
        break;
      }
      case 4: {
        dispatch(tableActions.setIsPdfSchemaJsonListModalOpen(false));
        break;
      }
      case 5: {
        dispatch(tableActions.setIsInvoiceJsonListModalOpen(false));
        break;
      }
      case 6: {
        dispatch(tableActions.setIsEmailSentLogJsonListModalOpen(false));
        break;
      }
      case 7: {
        dispatch(tableActions.setIsEmailErrorLogJsonListModalOpen(false));
        break;
      }
      case 8: {
        dispatch(tableActions.setIsEmailLoginJsonListModalOpen(false));
        break;
      }
      case 9: {
        dispatch(tableActions.setIsEmailDataJsonListModalOpen(false));
        break;
      }
      case 10: {
        dispatch(tableActions.setIsInvoiceRecipientsListModalOpen(false));
        break;
      }
      case 11: {
        dispatch(tableActions.setIsInvoiceAttachmentsListModalOpen(false));
        break;
      }
      case 12: {
        dispatch(tableActions.setIsInvoiceAttachmentSignatureListModalOpen(false));
        dispatch(tableActions.setRowCustom_({}));
        break;
      }
      default:
        dispatch(tableActions.setIsPartnersListModalOpen(false));
    }
    setOpen(false);

    if (!jsonData) dispatch(tableActions.setRowId(''));
    else if (modal !== 12) dispatch(tableActions.setRowCustom({}));
  };

  const handleCloseModal: DialogProps['onClose'] = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    handleClose();
  };

  return (
    <Fragment>
      <Dialog fullWidth={true} maxWidth={'md'} open={open} onClose={handleCloseModal} TransitionComponent={Transition} keepMounted>
        <DialogTitle className="flex items-center justify-center text-2xl py-5">{title}</DialogTitle>
        <DialogContent dividers={true}>
          {isLoadingData || isFetchingData || (!data && !jsonData) ? (
            <Spinner text={'Loading ...'} color={'primary'} />
          ) : (
            <Zoom in={true} style={{ transitionDelay: open ? '100ms' : '0ms' }} timeout={700}>
              <div className="bg-transparent mb-7 pb-1 px-4 border border-sky-600">
                {!data ? (
                  <span>{`${t('noData', { ns: ['table'] })} 😳`}</span>
                ) : (!jsonData && !pdfschemaSuppliers && data && data.length > 0) || JsonNoDataModals.includes(modal) ? (
                  <TableList
                    rows={JsonNoDataModals.includes(modal) ? [data] : data}
                    selectId={JsonNoDataModals.includes(modal) ? (columns ? data[0] : undefined) : data[0][0]}
                    columns={columns}
                    translation={translation}
                    noJson={noJson}
                  />
                ) : jsonData && data ? (
                  <TableListJson rows={data} selectId={data[0][0]} columns={columns} translation={translation} />
                ) : pdfschemaSuppliers && data && data.length > 0 ? (
                  <TableList rows={data} selectId={data[0][0]} columns={columns} translation={translation} align={'right'} />
                ) : (
                  <></>
                )}
              </div>
            </Zoom>
          )}
        </DialogContent>
        <DialogActions>
          <div className="flex gap-9 mr-7 mb-7">
            <Button onClick={handleClose}>
              <span className="bg-transparent text-red-500 px-4 border border-red-500 hover:bg-red-500 hover:text-white hover:border-transparent py-0 hover:scale-125 rounded-full">
                {t('close', { ns: ['table'] })}
              </span>
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
