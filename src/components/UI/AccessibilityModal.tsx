import React, { Fragment, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useTextToSpeech from '../../logics/useTextToSpeech';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Slide, Slider, Stack, Switch, Typography, Zoom } from '@mui/material';
import { useReduxDispatch, useReduxSelector } from '../../store/Store';
import { homeActions } from '../../store/appSlices/HomeSlice';
import { TransitionProps } from '@mui/material/transitions';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" mountOnEnter unmountOnExit ref={ref} {...props} onExited={() => {}} />;
});

export const AccessibilityModal: React.FC = () => {
  const { t } = useTranslation(['home']);
  const [open, setOpen] = useState(true);
  const isTextToSpeechActive = useReduxSelector((state) => state.home.isTextToSpeechActivce);
  const speechVolume = useReduxSelector((state) => state.home.speechVolume);
  const speechPitch = useReduxSelector((state) => state.home.speechPitch);
  const speechSpeed = useReduxSelector((state) => state.home.speechSpeed);
  const [speechOn, setSpeechOn] = useState(isTextToSpeechActive);
  const [volume, setVolume] = useState(speechVolume);
  const volumeStep = 0.1;
  const defaultVolume = 0.6;
  const [pitch, setPitch] = useState(speechPitch);
  const pitchStep = 0.1;
  const defaultPitch = 1.1;
  const [speed, setSpeed] = useState(speechSpeed);
  const rateStep = 0.1;
  const defaultSpeed = 1;

  const dispatch = useReduxDispatch();
  const { handlePlay, handleTest, handleStop } = useTextToSpeech();

  const handleClose = () => {
    dispatch(homeActions.setIsAccessibilityModalOpen(false));
  };

  const handleCloseModal: DialogProps['onClose'] = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    handleClose();
  };

  const onSwitch = useCallback(() => {
    setSpeechOn(!speechOn);
  }, [speechOn]);

  const onChangeVolume = (newValue: number | number[]) => {
    setVolume(newValue as number);
  };

  const onChange = (prop: string, type: string) => {
    if (prop === 'volume') {
      setVolume(type === 'increase' ? volume + volumeStep : volume - volumeStep);
    } else if (prop === 'pitch') {
      setPitch(type === 'increase' ? pitch + pitchStep : pitch - pitchStep);
    } else if (prop === 'speed') {
      setSpeed(type === 'increase' ? speed + rateStep : speed - rateStep);
    }
  };

  const onChangePitch = (newValue: number | number[]) => {
    setPitch(newValue as number);
  };

  const onChangeSpeed = (newValue: number | number[]) => {
    setSpeed(newValue as number);
  };

  const onReset = () => {
    setVolume(speechVolume);
    setPitch(speechPitch);
    setSpeed(speechSpeed);
  };

  const onConfirm = () => {
    if (speechOn) {
      dispatch(homeActions.setIsTextToSpeechActive(speechOn));
      dispatch(homeActions.setSpeechPitch(pitch));
      dispatch(homeActions.setSpeechVolume(volume));
      dispatch(homeActions.setSpeechSpeed(speed));
    } else {
      dispatch(homeActions.setIsTextToSpeechActive(speechOn));
    }
    window.localStorage.setItem('APP_SPEECHTEXT', JSON.stringify(speechOn));
    handleClose();
  };

  const setDefault = () => {
    setVolume(defaultVolume);
    setPitch(defaultPitch);
    setSpeed(defaultSpeed);
  };

  return (
    <Fragment>
      <Dialog fullWidth={true} maxWidth={'lg'} open={open} onClose={handleCloseModal} TransitionComponent={Transition} keepMounted>
        <DialogTitle className="flex items-center justify-center text-2xl py-5" onMouseEnter={() => handlePlay(t('accessibilityOptions', { ns: ['home'] }))} onMouseLeave={() => handleStop()}>
          {t('accessibilityOptions', { ns: ['home'] })}
        </DialogTitle>
        <DialogContent dividers={true}>
          <Zoom in={true} style={{ transitionDelay: open ? '100ms' : '0ms' }} timeout={700}>
            <div className="bg-transparent mb-7 pb-1 px-4">
              <Stack direction="column" component="label" sx={{ alignItems: 'center', justifyContent: 'center' }}>
                {/* On Off */}
                <Typography alignItems="center" justifyContent="center" onMouseEnter={() => handlePlay(t('textToSpeech', { ns: ['home'] }))} onMouseLeave={() => handleStop()}>
                  {t('textToSpeech', { ns: ['home'] })}
                </Typography>
                <Stack spacing={2} direction="row" component="label" sx={{ alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                  <Typography onMouseEnter={() => handlePlay(t('off', { ns: ['home'] }))} onMouseLeave={() => handleStop()}>
                    {t('off', { ns: ['home'] })}
                  </Typography>
                  <Switch checked={speechOn} onChange={onSwitch} value={isTextToSpeechActive} />
                  <Typography onMouseEnter={() => handlePlay(t('on', { ns: ['home'] }))} onMouseLeave={() => handleStop()}>
                    {t('on', { ns: ['home'] })}
                  </Typography>
                </Stack>
                {speechOn ? (
                  <>
                    {/* Volume */}
                    <Typography alignItems="center" justifyContent="center" onMouseEnter={() => handlePlay(t('volume', { ns: ['home'] }))} onMouseLeave={() => handleStop()}>
                      {t('volume', { ns: ['home'] })}
                    </Typography>
                    <Stack spacing={2} direction="row" component="label" sx={{ alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                      <Typography onMouseEnter={() => handlePlay(t('decreaseVolume', { ns: ['home'] }))} onMouseLeave={() => handleStop()}>
                        <VolumeDown onClick={() => onChange('volume', 'decrease')} />
                      </Typography>
                      <Box sx={{ width: 300 }}>
                        <Slider
                          defaultValue={speechVolume}
                          value={volume}
                          onChange={(_, newValue) => {
                            onChangeVolume(newValue);
                          }}
                          valueLabelDisplay="auto"
                          step={volumeStep}
                          shiftStep={speechVolume}
                          marks
                          min={0.1}
                          max={1}
                        />
                      </Box>
                      <Typography onMouseEnter={() => handlePlay(t('increaseVolume', { ns: ['home'] }))} onMouseLeave={() => handleStop()}>
                        <VolumeUp onClick={() => onChange('volume', 'increase')} />
                      </Typography>
                    </Stack>

                    {/* Pitch */}
                    <Typography alignItems="center" justifyContent="center" onMouseEnter={() => handlePlay(t('pitch', { ns: ['home'] }))} onMouseLeave={() => handleStop()}>
                      {t('pitch', { ns: ['home'] })}
                    </Typography>
                    <Stack spacing={2} direction="row" component="label" sx={{ alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                      <Typography onMouseEnter={() => handlePlay(t('decreasePitch', { ns: ['home'] }))} onMouseLeave={() => handleStop()}>
                        <RemoveIcon onClick={() => onChange('pitch', 'decrease')} />
                      </Typography>
                      <Box sx={{ width: 300 }}>
                        <Slider
                          defaultValue={speechPitch}
                          value={pitch}
                          onChange={(_, newValue) => {
                            onChangePitch(newValue);
                          }}
                          valueLabelDisplay="auto"
                          step={pitchStep}
                          shiftStep={speechPitch}
                          marks
                          min={0.5}
                          max={2}
                        />
                      </Box>
                      <Typography onMouseEnter={() => handlePlay(t('increasePitch', { ns: ['home'] }))} onMouseLeave={() => handleStop()}>
                        <AddIcon onClick={() => onChange('pitch', 'increase')} />
                      </Typography>
                    </Stack>

                    {/* Speed */}
                    <Typography alignItems="center" justifyContent="center" onMouseEnter={() => handlePlay(t('speed', { ns: ['home'] }))} onMouseLeave={() => handleStop()}>
                      {t('speed', { ns: ['home'] })}
                    </Typography>
                    <Stack spacing={2} direction="row" component="label" sx={{ alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                      <Typography onMouseEnter={() => handlePlay(t('decreaseSpeed', { ns: ['home'] }))} onMouseLeave={() => handleStop()}>
                        <RemoveIcon onClick={() => onChange('speed', 'decrease')} />
                      </Typography>
                      <Box sx={{ width: 300 }}>
                        <Slider
                          defaultValue={speechSpeed}
                          value={speed}
                          onChange={(_, newValue) => {
                            onChangeSpeed(newValue);
                          }}
                          valueLabelDisplay="auto"
                          step={rateStep}
                          shiftStep={speechSpeed}
                          marks
                          min={0.1}
                          max={2}
                        />
                      </Box>
                      <Typography onMouseEnter={() => handlePlay(t('increaseSpeed', { ns: ['home'] }))} onMouseLeave={() => handleStop()}>
                        <AddIcon onClick={() => onChange('speed', 'increase')} />
                      </Typography>
                    </Stack>
                    <Stack spacing={2} direction="row" component="label" sx={{ alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                      {/* Reset */}
                      <Button onClick={() => onReset()} onMouseEnter={() => handlePlay(t('reset', { ns: ['home'] }))} onMouseLeave={() => handleStop()}>
                        <span className="bg-transparent text-sky-600 px-4 border border-sky-600 hover:bg-sky-600 hover:text-white hover:border-transparent py-0 hover:scale-125 rounded-full">
                          {t('reset', { ns: ['home'] })}
                        </span>
                      </Button>

                      {/* Test */}
                      <Button onMouseEnter={() => handleTest(t('accessibilityOptions', { ns: ['home'] }), pitch, speed, volume)} onMouseLeave={() => handleStop()}>
                        <span className="bg-transparent text-sky-600 px-4 border border-sky-600 hover:bg-sky-600 hover:text-white hover:border-transparent py-0 hover:scale-125 rounded-full">
                          {t('test', { ns: ['home'] })}
                        </span>
                      </Button>

                      {/* Default */}
                      <Button onClick={() => setDefault()} onMouseEnter={() => handlePlay(t('default', { ns: ['home'] }))} onMouseLeave={() => handleStop()}>
                        <span className="bg-transparent text-sky-600 px-4 border border-sky-600 hover:bg-sky-600 hover:text-white hover:border-transparent py-0 hover:scale-125 rounded-full">
                          {t('default', { ns: ['home'] })}
                        </span>
                      </Button>
                    </Stack>
                  </>
                ) : (
                  <div className="mb-[250px]"></div>
                )}
              </Stack>
            </div>
          </Zoom>
        </DialogContent>
        <DialogActions>
          <div className="flex gap-9 mr-7 mb-7">
            {/* Cancel */}
            <Button onClick={handleClose} onMouseEnter={() => handlePlay(t('cancel', { ns: ['home'] }))} onMouseLeave={() => handleStop()}>
              <span className="bg-transparent text-red-500 px-4 border border-red-500 hover:bg-red-500 hover:text-white hover:border-transparent py-0 hover:scale-125 rounded-full">
                {t('cancel', { ns: ['home'] })}
              </span>
            </Button>

            {/* Confirm */}
            <Button onClick={onConfirm} onMouseEnter={() => handlePlay(t('modify', { ns: ['home'] }))} onMouseLeave={() => handleStop()}>
              <span className="bg-transparent text-sky-600 px-4 border border-sky-600 hover:bg-sky-600 hover:text-white hover:border-transparent py-0 hover:scale-125 rounded-full">
                {t('modify', { ns: ['home'] })}
              </span>
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
