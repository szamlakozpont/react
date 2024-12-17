import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Zoom } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useTextToSpeech from '../../logics/useTextToSpeech';

type ConfirmModalProps = {
  openModal: boolean;
  handleCloseModal: any;
  handleClose: () => void;
  handleCancel: () => void;
  onConfirmProp: (() => Promise<unknown>) | (() => void);
  modalTitle: string;
  contentText: string;
  confirmText: string;
  translation: string;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({ openModal, handleCloseModal, handleClose, handleCancel, onConfirmProp, modalTitle, contentText, confirmText, translation }) => {
  const { t } = useTranslation([translation]);

  const { handlePlay, handleStop } = useTextToSpeech();

  const handleCancelModal = () => {
    handleCancel();
  };

  const onConfirm = async () => {
    const response = await onConfirmProp();
    if (response === 'success') {
      handleClose();
    }
  };

  return (
    <>
      <Dialog open={openModal} onClose={handleCloseModal} scroll="paper">
        <DialogTitle className="flex items-center justify-center text-2xl py-5" onMouseEnter={() => handlePlay(modalTitle)} onMouseLeave={() => handleStop()}>
          {modalTitle}
        </DialogTitle>
        <DialogContent dividers={true} onMouseEnter={() => handlePlay(contentText)} onMouseLeave={() => handleStop()}>
          <Zoom in={true} style={{ transitionDelay: openModal ? '100ms' : '0ms' }} timeout={700}>
            <DialogContentText>
              <div className="flex items-center justify-center pb-5">{contentText}</div>
            </DialogContentText>
          </Zoom>
        </DialogContent>
        <DialogActions>
          <div className="flex gap-9 mr-7 mb-7">
            <Button onClick={handleCancelModal} onMouseEnter={() => handlePlay(t('cancel', { ns: [translation] }))} onMouseLeave={() => handleStop()}>
              <span className="bg-transparent text-red-500 px-4 border border-red-500 hover:bg-red-500 hover:text-white hover:border-transparent py-0 hover:scale-125 rounded-full">
                {t('cancel', { ns: [translation] })}
              </span>
            </Button>
            <Button onClick={onConfirm} onMouseEnter={() => handlePlay(confirmText)} onMouseLeave={() => handleStop()}>
              <span className="bg-transparent text-sky-600 px-4 border border-sky-600 hover:bg-sky-600 hover:text-white hover:border-transparent py-0 hover:scale-125 rounded-full">{confirmText}</span>
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default ConfirmModal;
