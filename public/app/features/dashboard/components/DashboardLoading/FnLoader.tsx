import { Box, CircularProgress, CircularProgressProps, Typography, type BoxProps } from '@mui/material';
import React, { type ReactNode, type FC, type HTMLAttributes } from 'react';

import { useTheme2 } from '@grafana/ui';

import logoUrl from './fn-logo.svg';

export type FnLoaderProps = {
  outerContainerProps?: Omit<BoxProps, 'children'>;
  innerContainerProps?: Omit<BoxProps, 'children'>;
  circularProgressProps?: CircularProgressProps;
  imageProps?: HTMLAttributes<HTMLImageElement>;
  text?: ReactNode;
};

export const FnLoader: FC<FnLoaderProps> = ({
  outerContainerProps,
  innerContainerProps,
  circularProgressProps,
  imageProps,
  text,
}) => {
  const theme = useTheme2();

  return (
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
        <CircularProgress
          role="alert"
          aria-busy="true"
          aria-label="Loading..."
          disableShrink
          sx={{
            color: theme.colors.primary.main,
          }}
          {...circularProgressProps}
        />
      </Box>
      {typeof text === 'string' ? <Typography>{text}</Typography> : text || null}
    </Box>
  );
};
