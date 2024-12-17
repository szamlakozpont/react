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

type ChooseDefaultSupplierModalProps = {
  title: string;
  translation: string;
  handleClose: () => void;
  dataSelectSuppliers: DataType;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" mountOnEnter unmountOnExit ref={ref} {...props} onExited={() => {}} />;
});

export const ChooseDefaultSupplierModal: React.FC<ChooseDefaultSupplierModalProps> = ({ title, translation, handleClose, dataSelectSuppliers }) => {
  const { t } = useTranslation([translation]); 
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [labelsOfData, setLabelsOfData] = useState<(string | undefined)[]>([]);
  const [chosen, setChosen] = useState<string[]>([]);
  const chosenDefaultSuppliersName = useReduxSelector((state) => state.table.chosenDefaultSuppliersNames);
  const [defaultSuppliersData, setDefaultSuppliersData] = useState<string[]>([]);
  const chosenSuppliersIds = useReduxSelector((state) => state.table.chosenSuppliersIds);
  const [init, setInit] = useState(true);
  const dispatch = useReduxDispatch(); 


  useEffect(() => {
    if (dataSelectSuppliers && init) {
      const labels = dataSelectSuppliers
        .map((key) => {
          if (chosenSuppliersIds.includes(key.id)) {
            return key.label;
          }
        })
        .filter((x) => x)
        .sort();

      if (chosenDefaultSuppliersName.length > 0) {
        setDefaultSuppliersData(chosenDefaultSuppliersName);
        setChosen(chosenDefaultSuppliersName);
      }
      setLabelsOfData(labels);
      setLoading(false);
      setInit(false);
    }
  }, [chosenDefaultSuppliersName, chosenSuppliersIds, dataSelectSuppliers, init]);

  const handleCloseModal: DialogProps['onClose'] = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    handleClose();
  };

  const handleSubmit = () => {
    const newArray = dataSelectSuppliers.map((item) => (chosen.includes(item.label) ? item.id : undefined)).filter((x) => x) as string[];
    if (newArray) {
      dispatch(tableActions.setChosenDefaultSuppliersIds(newArray));
      dispatch(tableActions.setChosenDefaultSuppliersNames(chosen));
      dispatch(tableActions.setIsDefaultPdfSchemaModalInit(false));
      setDefaultSuppliersData(chosen);
    }
    handleClose();
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
              <div className="bg-transparent mb-7 pb-1 px-4 border border-sky-600">
                {labelsOfData && labelsOfData.length > 0 ? (
                  <TransferList data={labelsOfData as string[]} suppliersData={defaultSuppliersData} setChosen={setChosen} translation={translation} />
                ) : (
                  <span>{`${t('noData', { ns: ['table'] })} 😳`}</span>
                )}
              </div>
            </Zoom>
          )}
        </DialogContent>
        <DialogActions>
          <div className="flex gap-9 mr-7 mb-7">
            <Button onClick={handleClose}>
              <span className="bg-transparent text-red-500 px-4 border border-red-500 hover:bg-red-500 hover:text-white hover:border-transparent py-0 hover:scale-125 rounded-full">
                {t('cancel', { ns: [translation] })}
              </span>
            </Button>
            <Button onClick={handleSubmit}>
              <span className="bg-transparent text-sky-600 px-4 border border-sky-600 hover:bg-sky-600 hover:text-white hover:border-transparent py-0 hover:scale-125 rounded-full">
                {t('submit', { ns: [translation] })}
              </span>
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
