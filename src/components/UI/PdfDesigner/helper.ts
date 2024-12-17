import { Template, Font, checkTemplate, getInputFromTemplate } from '@pdfme/common';
import { Form, Viewer, Designer } from '@pdfme/ui';
import { generate } from '@pdfme/generator';
import { text, readOnlyText, barcodes, image, readOnlyImage, svg, readOnlySvg, line, tableBeta, rectangle, ellipse } from '@pdfme/schemas';
import { getInvoiceTemplate } from './InvoiceTemplate';
import { getCertificateTemplate } from './CertificateTemplate';
import { invoiceInputs } from './InvoiceInputs';
import { baseInputs } from './BaseInputs';

const fontObjList = [
  {
    fallback: true,
    label: 'NotoSerifJP-Regular',
    url: '/fonts/NotoSerifJP-Regular.otf',
  },
  {
    fallback: false,
    label: 'NotoSansJP-Regular',
    url: '/fonts/NotoSansJP-Regular.otf',
  },
];

export const translations: { label: string; value: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ko', label: 'Korean' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ar', label: 'Arabic' },
  { value: 'th', label: 'Thai' },
  { value: 'pl', label: 'Polish' },
  { value: 'it', label: 'Italian' },
  { value: 'de', label: 'German' },
  { value: 'fr', label: 'French' },
  { value: 'es', label: 'Spanish' },
];

export const getFontsData = async () => {
  const fontDataList = await Promise.all(
    fontObjList.map(async (font) => ({
      ...font,
      data: await fetch(font.url).then((res) => res.arrayBuffer()),
    })),
  );

  return fontDataList.reduce((acc, font) => ({ ...acc, [font.label]: font }), {} as Font);
};

export const readFile = (file: File | null, type: 'text' | 'dataURL' | 'arrayBuffer') => {
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

export const cloneDeep = (obj: unknown) => JSON.parse(JSON.stringify(obj));

export const getTemplateFromJsonFile = async (file: File) => {
  const jsonStr = await readFile(file, 'text');
  const template: Template = JSON.parse(jsonStr as string);
  checkTemplate(template);
  return template;
};

export const downloadJsonFile = (json: unknown, title: string) => {
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

export const handleLoadTemplate = (e: React.ChangeEvent<HTMLInputElement>, currentRef: Designer | Form | Viewer | null) => {
  if (e.target && e.target.files) {
    getTemplateFromJsonFile(e.target.files[0])
      .then((t) => {
        if (!currentRef) return;
        currentRef.updateTemplate(t);
      })
      .catch((e) => {
        alert(`Invalid template file.
--------------------------
${e}`);
      });
  }
};

export const getPlugins = () => {
  return {
    Text: text,
    ReadOnlyText: readOnlyText,
    Table: tableBeta,
    Line: line,
    Rectangle: rectangle,
    Ellipse: ellipse,
    Image: image,
    ReadOnlyImage: readOnlyImage,
    SVG: svg,
    ReadOnlySvg: readOnlySvg,
    QR: barcodes.qrcode,
    Code128: barcodes.code128,
  };
};

export const generatePDF = async (currentRef: Designer | Form | Viewer | null, templatePreset: string) => {
  if (!currentRef) return;
  const template = currentRef.getTemplate();
  

  const inputs_ = templatePreset === 'invoice' ? invoiceInputs : baseInputs;

  const pdf = await generate({
    template,
    inputs: getInputFromTemplate(template),
   
    options: {
    
      title: 'pdf',
    },
    plugins: getPlugins(),
  });

  const blob = new Blob([pdf.buffer], { type: 'application/pdf' });
  window.open(URL.createObjectURL(blob), 'pdf', 'position=center,scrollbars=yes,resizable=yes,width=500,height=auto');
};

export const isJsonString = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const getBlankTemplate = () => ({ schemas: [{}], basePdf: { width: 210, height: 297, padding: [0, 0, 0, 0] } }) as Template;

export const getTemplatePresets = (): {
  key: string;
  label: string;
  template: () => Template;
}[] => [
  { key: 'invoice', label: 'Invoice', template: getInvoiceTemplate },
  { key: 'certificate', label: 'Certificate', template: getCertificateTemplate },
  { key: 'blank', label: 'Blank', template: getBlankTemplate },
];

export const getTemplateByPreset = (templatePreset: string): Template => {
  const templatePresets = getTemplatePresets();
  const preset = templatePresets.find((preset) => preset.key === templatePreset);
  return preset ? preset.template() : templatePresets[0].template();
};
