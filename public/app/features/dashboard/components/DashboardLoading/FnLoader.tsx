import { Box, CircularProgress, CircularProgressProps, Typography, type BoxProps } from '@mui/material';
import React, { type ReactNode, type FC } from 'react';

import { useTheme2 } from '@grafana/ui';

import { CodeRabbitLogo } from './CodeRabbitLogo';

export type FnLoaderProps = {
  outerContainerProps?: Omit<BoxProps, 'children'>;
  innerContainerProps?: Omit<BoxProps, 'children'>;
  circularProgressProps?: CircularProgressProps;
  text?: ReactNode;
};

export const FnLoader: FC<FnLoaderProps> = ({
  outerContainerProps,
  innerContainerProps,
  circularProgressProps,
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
      <CodeRabbitLogo width={350} />
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
