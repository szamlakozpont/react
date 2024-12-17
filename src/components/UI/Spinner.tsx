import React from 'react';
import { CircularProgress } from '@mui/material';

type SpinnerProps = {
  text: string;
  color: 'error' | 'primary' | 'secondary' | 'info' | 'success' | 'warning';
};

export const Spinner: React.FC<SpinnerProps> = ({ text, color }) => {
  return (
    <div className="flex h-[400px] justify-center items-center">
      <div className="flex-col">
        <div>
          <CircularProgress size={60} color={color} />
        </div>
        {text}
      </div>
    </div>
  );
};
