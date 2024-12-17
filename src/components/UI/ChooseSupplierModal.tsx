import React, { Fragment, useEffect, useState } from 'react';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Button, DialogActions, Zoom } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Spinner } from './Spinner';
import { TransferList } from './TransferList';
import { tableActions } from '../../store/appSlices/TableSlice';
import { useReduxDispatch, useReduxSelector } from '../../store/Store';

export type DataType = {
  id: string;
  label: string;
}[];

type ChooseSupplierModalProps = {
  title: string;
  translation: string;
  handleClose: () => void;
  dataSelectSuppliers: DataType;
  rowCustom: any;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" mountOnEnter unmountOnExit ref={ref} {...props} onExited={() => {}} />;
});

export const ChooseSupplierModal: React.FC<ChooseSupplierModalProps> = ({ title, translation, handleClose, dataSelectSuppliers, rowCustom }) => {
  const { t } = useTranslation([translation]);
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [labelsOfData, setLabelsOfData] = useState<string[]>([]);
  const [chosen, setChosen] = useState<string[]>([]);
  const [suppliersData, setSuppliersData] = useState<string[]>([]);
  const [init, setInit] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [newChosenSuppliersIds, setNewChosenSuppliersIds] = useState<string[]>([]);
  const [deletedChosenDefaultSuppliersIds, setDeletedChosenDefaultSuppliersIds] = useState<string[]>([]);
  const chosenSuppliersNames = useReduxSelector((state) => state.table.chosenSuppliersNames);
  const chosenDefaultSuppliersIds = useReduxSelector((state) => state.table.chosenDefaultSuppliersIds);
  const dispatch = useReduxDispatch(); 


  useEffect(() => {
    if (dataSelectSuppliers && init) {
      const labels = dataSelectSuppliers
        .map((key) => {
          return key.label;
        })
        .sort();

      if (chosenSuppliersNames.length > 0) {
        setSuppliersData(chosenSuppliersNames);
        setChosen(chosenSuppliersNames);
      }

      setLabelsOfData(labels);
      setLoading(false);
      setInit(false);
    }
  }, [chosenSuppliersNames, dataSelectSuppliers, init]);

  const handleCloseModal: DialogProps['onClose'] = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    handleClose();
  };

  const onDeleteConfirm = () => {
    const newDefaultSuppliersNames = [] as string[];
    const newDefaultSuppliersIds = [] as string[];

    (rowCustom as any).default_suppliers
      .map((item: any) => {
        if (!deletedChosenDefaultSuppliersIds.includes(item.id)) {
          newDefaultSuppliersNames.push(item.name);
          newDefaultSuppliersIds.push(item.id);
        }
      })
      .filter((x: any) => x) as string[];

   
    dispatch(tableActions.setChosenDefaultSuppliersIds(newDefaultSuppliersIds));
    dispatch(tableActions.setChosenDefaultSuppliersNames(newDefaultSuppliersNames));

    dispatch(tableActions.setChosenSuppliersIds(newChosenSuppliersIds));
    dispatch(tableActions.setChosenSuppliersNames(chosen));
    dispatch(tableActions.setIsChosenSuppliersModalInit(false));
    setIsConfirmModalOpen(false);
    handleClose();
  };

  const handleSubmit = () => {
    const newArray = dataSelectSuppliers.map((item) => (chosen.includes(item.label) ? item.id : undefined)).filter((x) => x) as string[];
    if (newArray) {
      const deletedDefaultSuppliersIds = chosenDefaultSuppliersIds
        .map((item) => {
          if (!newArray.includes(item)) return item;
        })
        .filter((x) => x) as string[];

      if (deletedDefaultSuppliersIds.length > 0) {
        setNewChosenSuppliersIds(newArray);
        setDeletedChosenDefaultSuppliersIds(deletedDefaultSuppliersIds);
        setIsConfirmModalOpen(true);
      } else {
        dispatch(tableActions.setChosenSuppliersIds(newArray));
        dispatch(tableActions.setChosenSuppliersNames(chosen));
        dispatch(tableActions.setIsChosenSuppliersModalInit(false));
        handleClose();
      }
    } else {
      handleClose();
    }
  };

  return (
    <Fragment>
      <Dialog fullWidth={true} maxWidth={'md'} open={open} onClose={handleCloseModal} TransitionComponent={Transition} keepMounted>
        <DialogTitle className="flex items-center justify-center text-2xl py-5">{title}</DialogTitle>
        <DialogContent dividers={true}>
          {loading ? (
            <Spinner text={'Loading ...'} color={'primary'} />
          ) : (
            <Zoom in={true} style={{ transitionDelay: open ? '100ms' : '0ms' }} timeout={700}>
              <div className="bg-transparent mb-1 px-4 border border-sky-600">
                {labelsOfData && labelsOfData.length > 0 ? (
                  <TransferList data={labelsOfData} suppliersData={suppliersData} setChosen={setChosen} translation={translation} />
                ) : (
                  <span>{`${t('noData', { ns: ['table'] })} 😳`}</span>
                )}
              </div>
            </Zoom>
          )}
          {isConfirmModalOpen && (
            <>
              <div className="text-sky-600">
                <span>{t('deleteChoosenDefaultSuppliersTitle', { ns: [translation] })} </span>
                <span>{t('todeleteChoosenDefaultSuppliers', { ns: [translation] })}</span>
              </div>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <div className="flex gap-9 mr-7 mb-7">
            <Button onClick={handleClose}>
              <span className="bg-transparent text-red-500 px-4 border border-red-500 hover:bg-red-500 hover:text-white hover:border-transparent py-0 hover:scale-125 rounded-full">
                {t('cancel', { ns: [translation] })}
              </span>
            </Button>
            {!isConfirmModalOpen && (
              <Button onClick={handleSubmit}>
                <span className="bg-transparent text-sky-600 px-4 border border-sky-600 hover:bg-sky-600 hover:text-white hover:border-transparent py-0 hover:scale-125 rounded-full">
                  {t('submit', { ns: [translation] })}
                </span>
              </Button>
            )}
            {isConfirmModalOpen && (
              <Button onClick={onDeleteConfirm}>
                <span className="bg-transparent text-sky-600 px-4 border border-sky-600 hover:bg-sky-600 hover:text-white hover:border-transparent py-0 hover:scale-125 rounded-full">
                  {t('delete', { ns: [translation] })}
                </span>
              </Button>
            )}
          </div>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
