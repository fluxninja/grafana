import { Box, Typography, type BoxProps } from '@mui/material';
import Lottie, { type LottieComponentProps } from 'lottie-react';
import React, { type ReactNode, type FC, type HTMLAttributes } from 'react';

import logoUrl from './fn-logo.svg';
import logoLoader from './fn-lottie-loader.json';

export type FnLoaderProps = {
  outerContainerProps?: Omit<BoxProps, 'children'>;
  innerContainerProps?: Omit<BoxProps, 'children'>;
  lottieProps?: LottieComponentProps;
  imageProps?: HTMLAttributes<HTMLImageElement>;
  text?: ReactNode;
};

export const FnLoader: FC<FnLoaderProps> = ({
  outerContainerProps,
  innerContainerProps,
  lottieProps,
  imageProps,
  text,
}) => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    flexDirection="column"
    paddingTop="150px"
    {...outerContainerProps}
  >
    <img src={logoUrl} alt={'FluxNinja logo'} style={{ transform: 'scale(4)' }} {...imageProps} />
    <Box marginTop="100px" {...innerContainerProps}>
      <Lottie
        animationData={logoLoader}
        aria-label="Loading..."
        style={{ maxWidth: '150px', margin: '0 auto' }}
        {...lottieProps}
      />
    </Box>
    {typeof text === 'string' ? <Typography>{text}</Typography> : text || null}
  </Box>
);
