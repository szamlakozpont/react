import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Template, checkTemplate, Lang } from '@pdfme/common';
import { Designer } from '@pdfme/ui';
import { Box, Button, TextField, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { generatePDF, getPlugins, getTemplatePresets, getTemplateByPreset } from './helper';
import { getInvoiceTemplate } from './InvoiceTemplate';
import { SelectAutoWidth } from '../Select';
import { API_DATA, API_SELECTLIST_SUPPLIERS, serverPagination, tableVariables } from '../../../utils/variables';
import { useAxios } from '../../../logics/useAxios';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { FormInputsProps } from '../../../logics/usePdfSchema';
import { useReduxDispatch, useReduxSelector } from '../../../store/Store';
import { tableActions } from '../../../store/appSlices/TableSlice';
import useSWR from 'swr';
import { ChooseSupplierModal } from '../ChooseSupplierModal';
import { Spinner } from '../Spinner';
import { ChooseDefaultSupplierModal } from '../ChooseDefaultSupplierModal';

type PdfDesignerProps = {
  handleCancel: () => void;
  translation: string;
  handleOpenPdfSchemaSuppliersModal: () => void;
  handleClosePdfSchemaSuppliers: () => void;
  handleOpenPdfSchemaDefaultModal: () => void;
  handleClosePdfSchemaDefault: () => void;
  onSaveDataBase?: any;
  dataPdfSchema?: any;
  loadingCondition?: boolean;
};

const PdfDesigner: React.FC<PdfDesignerProps> = ({
  loadingCondition = true,
  handleCancel,
  translation,
  handleOpenPdfSchemaSuppliersModal,
  handleClosePdfSchemaSuppliers,
  handleOpenPdfSchemaDefaultModal,
  handleClosePdfSchemaDefault,
  onSaveDataBase,
  dataPdfSchema,
}) => {
  const { i18n, t } = useTranslation([translation]);
  const designerRef = useRef<HTMLDivElement | null>(null);
  const designer = useRef<Designer | null>(null);
  const [templatePreset, setTemplatePreset] = useState<string>('invoice');
  const [lang, setLang] = useState<Lang>('en');
  const [schemaName, setSchemaName] = useState(useReduxSelector((state) => state.table.pdfschemaName));
  const chosenSuppliersIds = useReduxSelector((state) => state.table.chosenSuppliersIds);
  const chosenDefaultSuppliersIds = useReduxSelector((state) => state.table.chosenDefaultSuppliersIds);
  const isPdfSchemaSuppliersModalOpen = useReduxSelector((state) => state.table.isPdfSchemaSuppliersModalOpen);
  const isPdfSchemaDefaultModalOpen = useReduxSelector((state) => state.table.isPdfSchemaDefaultModalOpen);
  const rowCustom = useReduxSelector((state) => state.table.rowCustom);
  const isChosenSuppliersModalInit = useReduxSelector((state) => state.table.isChosenSuppliersModalInit);
  const isDefaultPdfSchemaModalInit = useReduxSelector((state) => state.table.isDefaultPdfSchemaModalInit);
  const create = useReduxSelector((state) => state.table.isPdfSchemaCreateModalOpen);
  const [init, setInit] = useState(true);
  const dispatch = useReduxDispatch();

  const { apiService } = useAxios();

  const {
    data: fetchedDataSelectSuppliers,
    error: isLoadingDataErrorSelectSuppliers,
    isLoading: isLoadingDataSelectSuppliers,
    isValidating: isFetchingDataSelectSuppliers,
  } = useSWR(loadingCondition ? [API_DATA + API_SELECTLIST_SUPPLIERS, 'GET', ''] : null, ([url, method, body]) => apiService({ url: url, method: method, data: body }));

  const {
    data: fetchedDataDefaultSuppliers,
    error: isLoadingDataErrorDefaultSuppliers,
    isLoading: isLoadingDataDefaultSuppliers,
    isValidating: isFetchingDataDefaultSuppliers,
  } = useSWR(loadingCondition ? [API_DATA + API_SELECTLIST_SUPPLIERS, 'GET', ''] : null, ([url, method, body]) => apiService({ url: url, method: method, data: body }));

  const dataSelectSuppliers = useMemo(() => {
    if (fetchedDataSelectSuppliers) {
      if (!serverPagination) return fetchedDataSelectSuppliers;
      return fetchedDataSelectSuppliers.results;
    } else return undefined;
  }, [fetchedDataSelectSuppliers]);

  const dataDefaultSuppliers = useMemo(() => {
    if (fetchedDataDefaultSuppliers) {
      if (!serverPagination) return fetchedDataDefaultSuppliers;
      return fetchedDataDefaultSuppliers.results;
    } else return undefined;
  }, [fetchedDataDefaultSuppliers]);

  const readFile = (file: File | null, type: 'text' | 'dataURL' | 'arrayBuffer') => {
    return new Promise<string | ArrayBuffer>((r) => {
      const fileReader = new FileReader();
      fileReader.addEventListener('load', (e) => {
        if (e && e.target && e.target.result && file !== null) {
          r(e.target.result);
        }
      });
      if (file !== null) {
        if (type === 'text') {
          fileReader.readAsText(file);
        } else if (type === 'dataURL') {
          fileReader.readAsDataURL(file);
        } else if (type === 'arrayBuffer') {
          fileReader.readAsArrayBuffer(file);
        }
      }
    });
  };

  const cloneDeep = (obj: any) => JSON.parse(JSON.stringify(obj));

  const getTemplateFromJsonFile = async (file: File) => {
    const jsonStr = await readFile(file, 'text');
    const template: Template = JSON.parse(jsonStr as string);
    checkTemplate(template);
    return template;
  };

  const downloadJsonFile = (json: any, title: string) => {
    if (typeof window !== 'undefined') {
      const blob = new Blob([JSON.stringify(json)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  useEffect(() => {
    if (designerRef.current) {
      let template = dataPdfSchema ? dataPdfSchema.data : getTemplateByPreset(templatePreset || '');
      try {
        checkTemplate(template);
        template = template as Template;
      } catch {
        console.log('Error');
      }

      designer.current = new Designer({
        domContainer: designerRef.current,
        template,
        options: {
          lang,
          labels: {
            clear: '🗑️',
          },
          theme: {
            token: {
              colorPrimary: '#25c2a0',
            },
          },
        },
        plugins: getPlugins(),
      });

      designer.current.onChangeTemplate(() => {
        setTemplatePreset('invoice');
      });
    }
  }, [dataPdfSchema, designerRef, lang, templatePreset]);

  useEffect(() => {
    if (init) {
      if (dataPdfSchema) {
        dispatch(tableActions.setPdfSchemaName(dataPdfSchema.pdfschema_name));
        setSchemaName(dataPdfSchema.pdfschema_name);
      }

      if (isChosenSuppliersModalInit && !create) {
        const currentSuppliersNames = [] as string[];
        const currentSuppliersIds = [] as string[];
        (rowCustom as any).suppliers.map((item: any) => {
          currentSuppliersNames.push(item.name);
          currentSuppliersIds.push(item.id);
        });
        dispatch(tableActions.setChosenSuppliersIds(currentSuppliersIds));
        dispatch(tableActions.setChosenSuppliersNames(currentSuppliersNames));
      }

      if (isDefaultPdfSchemaModalInit && !create) {
        const currentDefaultSuppliersNames = [] as string[];
        const currentDefaultSuppliersIds = [] as string[];
        (rowCustom as any).default_suppliers.map((item: any) => {
          currentDefaultSuppliersNames.push(item.name);
          currentDefaultSuppliersIds.push(item.id);
        });
        dispatch(tableActions.setChosenDefaultSuppliersIds(currentDefaultSuppliersIds));
        dispatch(tableActions.setChosenDefaultSuppliersNames(currentDefaultSuppliersNames));
      }
      setInit(false);
    }
  }, [create, dataPdfSchema, dispatch, init, isChosenSuppliersModalInit, isDefaultPdfSchemaModalInit, rowCustom]);

  const handleSetPdfSchemaName = (value: string) => {
    setSchemaName(value);
  };

  const onChangeBasePDF = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files) {
      readFile(e.target.files[0], 'dataURL').then(async (basePdf) => {
        if (designer.current) {
          designer.current.updateTemplate(
            Object.assign(cloneDeep(designer.current.getTemplate()), {
              basePdf,
            }),
          );
        }
      });
    }
  };

  const onLoadTemplate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files) {
      getTemplateFromJsonFile(e.target.files[0])
        .then((t) => {
          if (designer.current) {
            designer.current.updateTemplate(t);
          }
        })
        .catch((e) => {
          alert(`${t('invalidTemplateFile', { ns: [translation] })} ${e}`);
        });
    }
  };

  const onDownloadTemplate = () => {
    if (designer.current) {
      downloadJsonFile(designer.current.getTemplate(), 'template');
    }
  };

  const onSaveNestJs = async (template?: Template) => {
    if (designer.current) {
      try {
        const response_pdf = await apiService({ url: API_DATA + `/generatepdf/${1}`, method: 'POST', data: JSON.stringify(template || designer.current.getTemplate()) });
        const objectUrl = `data:application/pdf;base64,${response_pdf}`;
        const link = document.createElement('a');
        link.href = objectUrl;
        link.setAttribute('download', 'invoice_pdf.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(objectUrl);
      } catch (error) {
        const err = error as AxiosError;
        toast.error(`${err.response?.statusText}`);
      }
    }
  };

  const onSaveTemplate = async (template?: Template) => {
    if (designer.current) {
      try {
        const data = {} as FormInputsProps;
        data.pdfschema_name = schemaName;
        data.pdfschema_suppliers = chosenSuppliersIds;
        data.pdfschema_default_suppliers = chosenDefaultSuppliersIds;
        data.data = template || designer.current.getTemplate();
        onSaveDataBase(data);
        dispatch(tableActions.setChosenSuppliersIds([]));
        dispatch(tableActions.setChosenSuppliersNames([]));
        dispatch(tableActions.setChosenDefaultSuppliersIds([]));
        dispatch(tableActions.setChosenDefaultSuppliersNames([]));
        dispatch(tableActions.setPdfSchemaName(''));
      } catch (error) {
        const err = error as AxiosError;
        toast.error(`${err.response?.statusText}`);
      }
    }
  };

  const onResetTemplate = () => {
    if (designer.current) {
      designer.current.updateTemplate(getInvoiceTemplate());
    }
  };

  const selectTemplateOptions = useMemo(() => {
    return getTemplatePresets().map((preset) => ({ id: preset.key, label: t(preset.label, { ns: ['pdfschema'] }) }));
  }, [t]);

  useEffect(() => {
    const lang = i18n.language === 'hu' ? 'en' : 'en';
    setLang(lang as Lang);
    if (designer.current) {
      designer.current.updateOptions({ lang: lang as Lang });
    }
  }, [i18n.language]);

  return (
    <>
      <div className="flex gap-1 mx-[50px] mb-1">
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '16ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              required
              id="schema"
              label={t('schemaName', { ns: ['pdfschema'] })}
              variant="standard"
              value={schemaName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleSetPdfSchemaName(event.target.value);
              }}
            />
          </div>
        </Box>

        {!dataPdfSchema && (
          <SelectAutoWidth
            selectLabel={t('pdfTemplateType', { ns: ['pdfschema'] })}
            selectValue={templatePreset}
            onSelect={setTemplatePreset}
            selectOptions={selectTemplateOptions!}
            minHeight={tableVariables.selectHeight}
          />
        )}

        <Button onClick={handleOpenPdfSchemaSuppliersModal}>
          <span className="bg-transparent text-sky-600 px-4 border border-sky-600 hover:bg-sky-600 hover:text-white hover:border-transparent py-0 hover:scale-125 rounded-full">
            {t('suppliers', { ns: [translation] })}
          </span>
        </Button>

        {
          <Button onClick={handleOpenPdfSchemaDefaultModal}>
            <Tooltip title={t('setPdfSchemaDefaults', { ns: ['pdfschema'] })}>
              <span className="bg-transparent text-sky-600 px-4 border border-sky-600 hover:bg-sky-600 hover:text-white hover:border-transparent py-0 hover:scale-125 rounded-full">
                {t('defaultSuppliers', { ns: [translation] })}
              </span>
            </Tooltip>
          </Button>
        }

        <Button onClick={handleCancel}>
          <span className="bg-transparent text-red-500 px-4 border border-red-500 hover:bg-red-500 hover:text-white hover:border-transparent py-0 hover:scale-125 rounded-full">
            {t('cancel', { ns: [translation] })}
          </span>
        </Button>

        <Button component="label">
          <span className="bg-transparent text-sky-600 px-4 border border-sky-600 hover:bg-sky-600 hover:text-white hover:border-transparent py-0 hover:scale-125 rounded-full">
            {t('loadTemplate', { ns: [translation] }).toUpperCase()}
          </span>
          <input type="file" accept="application/json" onChange={onLoadTemplate} hidden />
        </Button>

        <Button onClick={onDownloadTemplate}>
          <span className="bg-transparent text-sky-600 px-4 border border-sky-600 hover:bg-sky-600 hover:text-white hover:border-transparent py-0 hover:scale-125 rounded-full">
            {t('downloadTemplate', { ns: [translation] }).toUpperCase()}
          </span>
        </Button>

        <Button onClick={() => onSaveTemplate()}>
          <span className="bg-transparent text-sky-600 px-4 border border-sky-600 hover:bg-sky-600 hover:text-white hover:border-transparent py-0 hover:scale-125 rounded-full">
            {t('saveTemplate', { ns: [translation] }).toUpperCase()}
          </span>
        </Button>

        <Button onClick={onResetTemplate}>
          <span className="bg-transparent text-sky-600 px-4 border border-sky-600 hover:bg-sky-600 hover:text-white hover:border-transparent py-0 hover:scale-125 rounded-full">
            {t('resetTemplate', { ns: [translation] }).toUpperCase()}
          </span>
        </Button>

        <Button onClick={() => generatePDF(designer.current, templatePreset)}>
          <span className="bg-transparent text-sky-600 px-4 border border-sky-600 hover:bg-sky-600 hover:text-white hover:border-transparent py-0 hover:scale-125 rounded-full">
            {t('viewPdf', { ns: [translation] }).toUpperCase()}
          </span>
        </Button>
      </div>

      {isLoadingDataSelectSuppliers ? (
        <Spinner text={'Loading ...'} color={'primary'} />
      ) : (
        <div className={'h-[calc(100vh_-_200px)] overflow-y-auto'}>
          <div ref={designerRef} />
        </div>
      )}

      {isPdfSchemaSuppliersModalOpen && (
        <ChooseSupplierModal
          title={t('chooseSupplier', { ns: ['pdfschema'] })}
          translation="pdfschema"
          handleClose={handleClosePdfSchemaSuppliers}
          dataSelectSuppliers={dataSelectSuppliers}
          rowCustom={rowCustom}
        />
      )}

      {isPdfSchemaDefaultModalOpen && (
        <ChooseDefaultSupplierModal title={t('chooseDefault', { ns: ['pdfschema'] })} translation="pdfschema" handleClose={handleClosePdfSchemaDefault} dataSelectSuppliers={dataSelectSuppliers} />
      )}
    </>
  );
};

export default PdfDesigner;
