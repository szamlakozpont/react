import { Template } from '@pdfme/common';

export const getBaseTemplate = () => {
  const template: Template = {
    schemas: [
      {
        name: {
          type: 'text',
          position: { x: 25.06, y: 26.35 },
          width: 77.77,
          height: 18.7,
          fontSize: 36,
          fontColor: '#14b351',
        },
        photo: {
          type: 'image',
          position: { x: 119.6, y: 26.2 },
          width: 60,
          height: 27.6,
        },
        age: {
          type: 'text',
          position: { x: 36, y: 179.46 },
          width: 43.38,
          height: 6.12,
          fontSize: 12,
        },
        sex: {
          type: 'text',
          position: { x: 36, y: 186.23 },
          width: 43.38,
          height: 6.12,
          fontSize: 12,
        },
        weight: {
          type: 'text',
          position: { x: 40, y: 192.99 },
          width: 43.38,
          height: 6.12,
          fontSize: 12,
        },
        breed: {
          type: 'text',
          position: { x: 40, y: 199.09 },
          width: 43.38,
          height: 6.12,
          fontSize: 12,
        },
        qrcode: {
          type: 'qrcode',
          position: { x: 115.09, y: 204.43 },
          width: 26.53,
          height: 26.53,
        },
        mytable: {
          type: 'table',
         
          position: { x: 27.38, y: 92.1 },
          width: 150,
          height: 57.5184,
          content: '[["Alice","New York","Alice is a freelance web designer and developer"],["Bob","Paris","Bob is a freelance illustrator and graphic designer"]]',
          showHead: true,
          head: ['Name', 'City', 'Description'],
          headWidthPercentages: [30, 30, 40],
          tableStyles: { borderWidth: 0.3, borderColor: '#000000' },
          headStyles: {
            fontName: 'NotoSerifJP-Regular',
            fontSize: 13,
            characterSpacing: 0,
            alignment: 'left',
            verticalAlignment: 'middle',
            lineHeight: 1,
            fontColor: '#ffffff',
            borderColor: '',
            backgroundColor: '#2980ba',
            borderWidth: { top: 0, right: 0, bottom: 0, left: 0 },
            padding: { top: 5, right: 5, bottom: 5, left: 5 },
          },
          bodyStyles: {
            fontName: 'NotoSerifJP-Regular',
            fontSize: 13,
            characterSpacing: 0,
            alignment: 'left',
            verticalAlignment: 'middle',
            lineHeight: 1,
            fontColor: '#000000',
            borderColor: '#888888',
            backgroundColor: '',
            alternateBackgroundColor: '#f5f5f5',
            borderWidth: { top: 0.1, right: 0.1, bottom: 0.1, left: 0.1 },
            padding: { top: 5, right: 5, bottom: 5, left: 5 },
          },
          columnStyles: {},
        },
      },
    ],
    basePdf: { width: 210, height: 297, padding: [10, 10, 10, 10] },
  };
  return template;
};
