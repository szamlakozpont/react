import React, { Fragment, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useTextToSpeech from '../../logics/useTextToSpeech';
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Grid, IconButton, Slide, TextField, Typography, Zoom } from '@mui/material';
import { useReduxDispatch } from '../../store/Store';
import { homeActions } from '../../store/appSlices/HomeSlice';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';

type PanelModalProps = {
  modal: string;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" mountOnEnter unmountOnExit ref={ref} {...props} onExited={() => {}} />;
});

export const PanelModal: React.FC<PanelModalProps> = ({ modal }) => {
  const { t } = useTranslation(['home']);
  const [open, setOpen] = useState(true);
  const dispatch = useReduxDispatch();
  const { handlePlay, handleStop } = useTextToSpeech();

  const handleClose = () => {
    switch (modal) {
      case '1': {
        dispatch(homeActions.setIsPanel1ModalOpen(false));
        break;
      }
      case '2': {
        dispatch(homeActions.setIsPanel2ModalOpen(false));
        break;
      }
      case '3': {
        dispatch(homeActions.setIsPanel3ModalOpen(false));
        break;
      }
      default:
    }
    setOpen(false);
  };

  const handleCloseModal: DialogProps['onClose'] = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    handleClose();
  };

  const title = modal === '1' ? 'Szolgáltatásaink' : modal === '2' ? 'Rólunk' : 'Kapcsolat';
  // t('accessibilityOptions', { ns: ['home'] })

  const PanelText1: React.FC = () => (
    <div
      onMouseEnter={() => handlePlay('Számla kiállítása, kezelése, nyilvántartása és archiválása egyszerűen és gyorsan, minden törvényi előírásnak megfelelően. Teljes Forrás net integráció')}
      onMouseLeave={() => handleStop()}
    >
      Számla kiállítása, kezelése, nyilvántartása és archiválása egyszerűen és gyorsan, minden törvényi előírásnak megfelelően. Teljes Forrás.net integráció
    </div>
  );
  const PanelText2: React.FC = () => (
    <div
      onMouseEnter={() => handlePlay('A Közszámla a Griffszoft csapatának terméke, amely több mint 35 éves tapasztalattal rendelkezik az informatikai megoldások terén')}
      onMouseLeave={() => handleStop()}
    >
      A Közszámla a{' '}
      <a href="https://www.griffsoft.hu/" target="_blank" rel="noreferrer">
        <span className="text-blue-500">GriffSoft</span>
      </a>{' '}
      csapatának terméke, amely több mint 35 éves tapasztalattal rendelkezik az informatikai megoldások terén.
    </div>
  );

  const PanelText3: React.FC = () => (
    <div className="App">
      {/* <Typography gutterBottom variant="h3" align="center">
        Közszámla
      </Typography> */}

      <div className="flex items-center justify-center">
        <img
          src={require('../../static/company_s.png')}
          alt="Company"
          width="320px"
          color="white"
          onMouseEnter={() => handlePlay('Közszámla. Elektronikus számla megoldás')}
          onMouseLeave={() => handleStop()}
        />
      </div>
      <Grid>
        <Card style={{ maxWidth: 450, padding: '20px 5px', margin: '0 auto' }}>
          <CardContent>
            <Typography gutterBottom variant="h5" onMouseEnter={() => handlePlay('Legyen partnerünk')} onMouseLeave={() => handleStop()}>
              Legyen partnerünk!
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              gutterBottom
              onMouseEnter={() => handlePlay('Kérjük töltse ki ezt a sablont és munkatársunk felveszi Önnel a kapcsolatot.')}
              onMouseLeave={() => handleStop()}
            >
              Kérjük töltse ki ezt a sablont és munkatársunk felveszi Önnel a kapcsolatot.
              {/* Fill up the form and our team will get back to you within 24 hours. */}
            </Typography>
            <form action="https://formsubmit.co/your@email.com" method="post" encType="text/plain" autoComplete="off">
              <Grid container spacing={1}>
                <Grid xs={12} sm={6} item onMouseEnter={() => handlePlay('Kérjük írja az Ön keresztnevét ide')} onMouseLeave={() => handleStop()}>
                  <TextField placeholder="Keresztnév" label="Keresztnév" variant="outlined" fullWidth required />
                </Grid>
                <Grid xs={12} sm={6} item onMouseEnter={() => handlePlay('Kérjük írja az Ön vezetéknevét ide')} onMouseLeave={() => handleStop()}>
                  <TextField placeholder="Vezetéknév" label="Vezetéknév" variant="outlined" fullWidth required />
                </Grid>
                <Grid item xs={12} onMouseEnter={() => handlePlay('Kérjük írja az Ön ímél címét ide')} onMouseLeave={() => handleStop()}>
                  <TextField type="email" placeholder="Email" label="Email" variant="outlined" fullWidth required />
                </Grid>
                {/* <Grid item xs={12}>
                  <TextField type="number" placeholder="Telefonszám" label="Telefonszám" variant="outlined" fullWidth required />
                </Grid> */}
                <Grid item xs={12} onMouseEnter={() => handlePlay('Kérjük írja az üzenetet ide')} onMouseLeave={() => handleStop()}>
                  <TextField label="Üzenet" multiline rows={4} placeholder="Kérjük írja az üzenetet ide" variant="outlined" fullWidth required />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    //  href={'mailto:ujteszt@szamlakozpont.hu'}
                    variant="contained"
                    color="primary"
                    fullWidth
                    onMouseEnter={() => handlePlay('ímél elküldés')}
                    onMouseLeave={() => handleStop()}
                  >
                    Elküld
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </div>
  );

  const panelText = useMemo(() => (modal === '1' ? <PanelText1 /> : modal === '2' ? <PanelText2 /> : <PanelText3 />), [modal]);
  return (
    <Fragment>
      <Dialog fullWidth={true} maxWidth={'sm'} open={open} onClose={handleCloseModal} TransitionComponent={Transition} keepMounted>
        <DialogTitle
          className="flex items-center justify-center text-2xl py-5"
          // onMouseEnter={() => handlePlay(title)}
          // onMouseLeave={() => handleStop()}
        >
          {title}
          <IconButton sx={{ ml: 'auto' }} onClick={handleClose} onMouseEnter={() => handlePlay(t('cancel', { ns: ['home'] }))} onMouseLeave={() => handleStop()}>
            <span className="bg-transparent text-blue-500 px-1 hover:bg-blue-500 hover:text-white hover:border-transparent py-0 hover:scale-125 rounded-full">
              <CloseIcon />
            </span>
          </IconButton>
        </DialogTitle>

        <DialogContent dividers={true}>
          <Zoom in={true} style={{ transitionDelay: open ? '100ms' : '0ms' }} timeout={700}>
            <div className="bg-transparent mb-7 pb-1 px-4">{panelText}</div>
          </Zoom>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </Fragment>
  );
};
