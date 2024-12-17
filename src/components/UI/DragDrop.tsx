import React, { useEffect, useState } from 'react';
import { Delete, UploadFile } from '@mui/icons-material';
import { tableVariables } from '../../utils/variables';
import { Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';

type DragDropProps = {
  onFilesSelected: any;
  text: string;
  textSupported: string;
  multiple?: boolean;
  width?: any;
  height?: any;
};

const DragDrop: React.FC<DragDropProps> = ({ onFilesSelected, text, textSupported, multiple = false, width = undefined, height = undefined }) => {
  const { t } = useTranslation(['bulkinvoice']);
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (event: any) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const newFiles = Array.from(selectedFiles);
      setFiles((prevFiles: any) => [...prevFiles, ...newFiles]);
    }
  };

  const handleDrop = (event: any) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const newFiles = Array.from(droppedFiles);
      setFiles((prevFiles: any) => [...prevFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  useEffect(() => {
    onFilesSelected(files);
  }, [files, onFilesSelected]);

  return (
    <section className="bg-white border-solid rounded-[8px]" style={{ width: width, height: height }}>
      <div
        className={` border-dashed border-2 border-[#4282fe] bg-[#f4fbff] p-[10px] flex flex-col items-center justify-center relative rounded-[8px] cursor-pointer ${files.length > 0 ? 'active' : ''}`}
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
      >
        <UploadFile />
        <div className="mb-3">
          <p>{text}</p>
          <p>{textSupported}</p>
        </div>

        {((!multiple && files.length === 0) || multiple) && (
          <>
            <input type="file" hidden id="browse" onChange={handleFileChange} accept=".csv, .xls, .xlsx" multiple={multiple} />
            <label
              htmlFor="browse"
              className={`cursor-pointer mb-8 bg-transparent ${tableVariables.buttonsColorText} px-4 border ${tableVariables.buttonsHeight} align-middle ${tableVariables.buttonsColorBorder} ${tableVariables.buttonsColorHover} hover:text-white hover:border-transparent py-0 rounded-full`}
            >
              <span>{t('browseFile', { ns: ['bulkinvoice'] }).toUpperCase()}</span>
            </label>
          </>
        )}

        {files.length > 0 && (
          <div className="size-full overflow-auto">
            {files.map((file, index) => (
              <div className="flex flex-row p-1 border-1 border-solid rounded-[8px]" key={index}>
                <div className="mb-3">
                  {file.name}
                 

                  <Tooltip title={t('deleteFile', { ns: ['bulkinvoice'] })}>
                    <Delete className="text-sky-600" onClick={() => handleRemoveFile(index)} />
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default DragDrop;
