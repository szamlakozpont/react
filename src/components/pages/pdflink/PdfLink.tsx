import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardActions, CardContent, Slide, useTheme } from '@mui/material';
import { useParams } from 'react-router-dom';
import { homeVariables, API, API_PDFLINK, serverPagination, ENCRYPT_SALT, PDFLINK_INVALID_PIN_INPUT_COUNT } from '../../../utils/variables';
import { PinInput } from 'react-input-pin-code';
import { useAxios } from '../../../logics/useAxios';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useLogo } from '../../../logics/useLogo';
import { useColors } from '../../../logics/useColors';
dayjs.extend(customParseFormat);

const PdfLink: React.FC<{ showLogo: boolean; setShowLogo: Dispatch<SetStateAction<boolean>> }> = (props) => {
  const { t, i18n } = useTranslation(['pdflink']);
  const [isInit, setIsInit] = useState(true);
  const [pin, setPin] = useState(['', '', '', '']);
  const [isError, setIsError] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [isSendHash, setIsSendHash] = useState(false);
  const [isLoadInit, setIsLoadInit] = useState(true);
  const [initPinInputCount, setInitPinInputCount] = useState<number | undefined>(undefined);
  const [initLastPinInputTime, setInitLastPinInputTime] = useState<string | undefined>(undefined);
  const [isOnComplete, SetIsOnComplete] = useState(false);
  const [fetchedData, setFetchedData] = useState<any>(undefined);
  const [invalidPinCount, setInvalidPinCount] = useState(0);
  const [invalidPinCountLimit, setInvalidPinCountLimit] = useState<number | undefined>(undefined);
  const [isPinDisabled, setIsPinDisabled] = useState(false);
  const { apiService } = useAxios();

  const { hash } = useParams();
  const canvasLogo = useRef<HTMLCanvasElement | null>(null);
  const { canvasAnimate } = useLogo(canvasLogo, props.setShowLogo);

  const {
    mixins: { toolbar },
  } = useTheme();
  const appHeight = parseInt(toolbar?.minHeight as string) + 8;

  const { titleTextColor, buttonsColorBorder, buttonsColorText } = useColors();

  useEffect(() => {
    if (props.showLogo) canvasAnimate();
  }, [canvasAnimate, props.showLogo]);

  const onCompletePin = () => {
    if (!isOnComplete) {
      SetIsOnComplete(true);
      setIsSendHash(true);
    }
  };

  useEffect(() => {
    const sendHash = async () => {
      const code = await bcrypt.hash(pin[0] + pin[1] + pin[2] + pin[3], ENCRYPT_SALT);
      try {
        const response = await axios({
          method: 'GET',
          url: `${API}${API_PDFLINK}/${hash}/`,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            code: code,
          },
        });

        const data = await response.data;

        if (data.data.error) {
          setIsError(true);
          if (data.data.invalidPinCount) {
            setInvalidPinCount(data.data.invalidPinCount);
          }
          if (data.data.invalidPinCountLimit) {
            setInvalidPinCountLimit(data.data.invalidPinCountLimit);
          }
          if (data.data.isPinDisabled) {
            setIsPinDisabled(data.data.isPinDisabled);
          }
        } else {
          setShowButtons(true);
        }
        setFetchedData(data);
        if (i18n.language !== data.data.language.toLowerCase()) i18n.changeLanguage(data.data.language.toLowerCase());
      } catch (err: any) {
        if (err.response.data.message) {
          toast.error(err.response.data.message);
        } else if (err.response.data.error) {
          toast.error(err.response.data.error);
        } else if (err.message) {
          toast.error(err.message);
        } else if (err.request) {
          toast.error(err.request.responseText);
        } else {
          throw new Error(`${t('axiosFailed', { ns: ['user'] })}`);
        }
      }
      return true;
    };

    if (isSendHash) {
      if (invalidPinCount < PDFLINK_INVALID_PIN_INPUT_COUNT) {
        sendHash();
        setIsSendHash(false);
      } else {
        toast.error('You have reached view limit of pin input count! Please ask new pdf link!');
      }
    }
  }, [fetchedData, hash, i18n, invalidPinCount, isSendHash, pin, t]);

  const {
    data: loadData,
    error: isLoadingDataError,
    isLoading: isLoadingData,
    isValidating: isFetchingData,
    mutate: mutateInvoices,
  } = useSWR(isLoadInit ? [API + `${API_PDFLINK}/${hash}/`, 'GET', ''] : null, ([url, method, body]) => apiService({ url: url, method: method, data: body }));

  useEffect(() => {
    if (isLoadInit && loadData) {
      if (!serverPagination) {
        setInitPinInputCount(loadData.data.pinInputCount);
        setInitLastPinInputTime(loadData.data.lastPinInputTime);
        setInvalidPinCount(loadData.data.invalidPinCount);
        setInvalidPinCountLimit(loadData.data.invalidPinCountLimit);
        setIsPinDisabled(loadData.data.isPinDisabled);
        if (i18n.language !== loadData.data.language.toLowerCase()) i18n.changeLanguage(loadData.data.language.toLowerCase());
      } else {
        setInitPinInputCount(loadData.results.data.pinInputCount);
        setInitLastPinInputTime(loadData.results.data.lastPinInputTime);
        setInvalidPinCount(loadData.results.data.invalidPinCount);
        setInvalidPinCountLimit(loadData.results.data.invalidPinCountLimit);
        setIsPinDisabled(loadData.results.data.isPinDisabled);
        if (i18n.language !== loadData.results.data.language.toLowerCase()) i18n.changeLanguage(loadData.results.data.language.toLowerCase());
      }
      setIsLoadInit(false);
    }
  }, [i18n, i18n.language, isLoadInit, loadData]);

  const lastPinInputTime = useMemo(() => {
    const time = fetchedData ? fetchedData.data.lastPinInputTime : initLastPinInputTime ? initLastPinInputTime : '';
    const timeFormat = time ? (i18n.language === 'hu' ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : dayjs(time).format('DD/MM/YYYY HH:mm:ss')) : '';
    return timeFormat;
  }, [fetchedData, i18n.language, initLastPinInputTime]);

  const receivedAtTime = useMemo(() => {
    const time = fetchedData && fetchedData.data.receivedAt ? fetchedData.data.receivedAt : '';
    const timeFormat = time ? (i18n.language === 'hu' ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : dayjs(time).format('DD/MM/YYYY HH:mm:ss')) : '';
    return timeFormat;
  }, [fetchedData, i18n.language]);

  const changePin = (values: string[]) => {
    setPin(values);
    SetIsOnComplete(false);
    values.forEach((item) => {
      if (item === '' && isError) {
        setIsError(false);
      }
    });
  };

  useEffect(() => {
    const handleBeforeUnload = (e: any) => {
      e.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const viewPdf = async () => {
    const pdf = await fetch(fetchedData.data.pdf);
    const blobFromFetch = await pdf.blob();
    const blob = new Blob([blobFromFetch], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
  };

  const savePdf = async () => {
    const linkSource = await fetchedData.data.pdf;
    const link = document.createElement('a');
    link.href = linkSource;
    const fileName = `pdf_${fetchedData.data.invoiceNumber}.pdf`;
    link.download = fileName;
    link.click();
  };

  return (
    <>
      {props.showLogo ? (
        <div className={'absolute size-full'}>
          <div className={'absolute size-full left-[50%] top-[50%]  -translate-x-1/2  -translate-y-1/2'} id="canvasWrapper">
            <canvas ref={canvasLogo} />
          </div>
        </div>
      ) : (
        <div className={`flex justify-items-center h-[calc(100%-${appHeight}px)]`}>
          <div className={'absolute left-[50%] top-[100px] -translate-x-1/2 '}>
            <Slide
              direction="up"
              in={isInit}
              timeout={homeVariables.signInCardTimeout}
              easing={{
                enter: 'cubic-bezier(0, 1.6, .8, 1)',
              }}
              mountOnEnter
              unmountOnExit
              onExited={() => {}}
            >
              <Card sx={{ minWidth: homeVariables.signInCardWidth }}>
                <CardContent>
                  <div className="flex items-center justify-center text-3xl pb-5">Számlaközpont Zrt.</div>
                  <div className="flex items-center justify-center text-xl pb-1">{`${t('welcome', { ns: ['pdflink'] })} ${fetchedData && fetchedData.data.partnerName ? fetchedData.data.partnerName : ''} !`}</div>
                  {!isPinDisabled ? (
                    <>
                      <div className="flex items-center justify-center">{showButtons ? t('pleaseSelect', { ns: ['pdflink'] }) : t('pleaseEnterPin', { ns: ['pdflink'] })}</div>
                      <div className={`flex items-center justify-center ${isError ? 'pt-0 text-red-500' : 'pt-6'}`}>{isError ? t('errorPin', { ns: ['pdflink'] }) : ''}</div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center text-red-500">{t('disabledPin', { ns: ['pdflink'] })}</div>
                  )}
                </CardContent>

                <CardActions>
                  {!showButtons ? (
                    !isPinDisabled && (
                      <div className="flex mx-auto gap-7 mb-1">
                        <PinInput values={pin} onChange={(value, index, values) => changePin(values)} onComplete={() => onCompletePin()} />
                      </div>
                    )
                  ) : (
                    <div className="flex mx-auto gap-7 mb-1">
                      <button
                        className="bg-transparent text-sky-600 px-4 border border-sky-600 hover:bg-sky-600 hover:text-white hover:border-transparent py-2 hover:scale-110 rounded-full"
                        onClick={viewPdf}
                      >
                        {t('viewPdf', { ns: ['pdflink'] })}
                      </button>
                      <button
                        className="bg-transparent text-sky-600 px-4 border border-sky-600 hover:bg-sky-600 hover:text-white hover:border-transparent py-2 hover:scale-110 rounded-full"
                        onClick={savePdf}
                      >
                        {t('savePdf', { ns: ['pdflink'] })}
                      </button>
                    </div>
                  )}
                </CardActions>

                <CardContent>
                  <div className={'flex items-center justify-center '}>
                    {`${t('pinInputCount', { ns: ['pdflink'] })}: ${fetchedData ? fetchedData.data.pinInputCount : initPinInputCount ? initPinInputCount : '0'} ${t('times', { ns: ['pdflink'] })}`}
                  </div>
                  {invalidPinCountLimit && <div className={'flex items-center justify-center '}>{`${t('remainingPinCount', { ns: ['pdflink'] })}: ${invalidPinCountLimit - invalidPinCount}`}</div>}

                  {((fetchedData && fetchedData.data.lastPinInputTime && fetchedData.data.pinInputCount > 0) || (!fetchedData && initPinInputCount && initPinInputCount > 0)) && (
                    <div className={'flex items-center justify-center '}>{`${t('lastPinInputTime', { ns: ['pdflink'] })}: ${lastPinInputTime}`}</div>
                  )}
                  {receivedAtTime && <div className={'flex items-center justify-center '}>{`${t('receivedAt', { ns: ['pdflink'] })}: ${receivedAtTime}`}</div>}
                </CardContent>
              </Card>
            </Slide>
          </div>
        </div>
      )}

      {isValid ? (
        <div className="bg-transparent h-full">
          <div className="mt-2 flex gap-5 items-center">
            <div className="m-auto" style={{ color: titleTextColor }}>
              <div> {t('pdfLink', { ns: ['pdflink'] })}</div>
              <div>{hash}</div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default PdfLink;
