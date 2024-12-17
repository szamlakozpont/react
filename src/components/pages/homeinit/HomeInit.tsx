import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { useLogo } from '../../../logics/useLogo';
import { useTheme } from '@mui/material';
import HomePublic from '../homePublic/HomePublic';

const HomeInit: React.FC<{ showLogo: boolean; setShowLogo: Dispatch<SetStateAction<boolean>> }> = (props) => {
  const canvasLogo = useRef<HTMLCanvasElement | null>(null);
  const { canvasAnimate } = useLogo(canvasLogo, props.setShowLogo);
  const {
    mixins: { toolbar },
  } = useTheme();

  const appHeight = parseInt(toolbar?.minHeight as string) + 8;

  useEffect(() => {
    if (props.showLogo) canvasAnimate();
  }, [canvasAnimate, props.showLogo]);

  return (
    <>
      {props.showLogo ? (
        <div className={'absolute size-full left-[50%] top-[50%]  -translate-x-1/2  -translate-y-1/2'} id="canvasWrapper">
          <canvas ref={canvasLogo} />
        </div>
      ) : (
        <div> {<HomePublic />} </div>
      )}
    </>
  );
};

export default HomeInit;
