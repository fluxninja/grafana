import { FC, useMemo } from 'react';

import { ModalRoot, PortalContainer } from '@grafana/ui';
import { AppWrapper } from 'app/AppWrapper';
import app from 'app/app';
import { FnGlobalState, FnPropMappedFromState } from 'app/core/reducers/fn-slice';
import { useSelector } from 'app/types';

import { FNDashboardProps } from '../types';
import { RenderPortal } from '../utils';

import { RenderFNDashboard } from './render-fn-dashboard';

type FNDashboardComponentProps = Omit<FNDashboardProps, FnPropMappedFromState>;

export const FNDashboard: FC<FNDashboardComponentProps> = (props) => {
  return (
    <AppWrapper app={app} isMFE>
      <DashboardPortal {...props} />
    </AppWrapper>
  );
};

export const DashboardPortal: FC<FNDashboardComponentProps> = (p) => {
  const globalFnProps = useSelector<FnGlobalState>(({ fnGlobalState }) => fnGlobalState);

  const props = useMemo(
    () => ({
      ...p,
      ...globalFnProps,
    }),
    [p, globalFnProps]
  );

  const content = useMemo(() => {
    if (!props.FNDashboard) {
      return null;
    }

    const { uid, queryParams = {} } = props;

    if (!uid) {
      return null;
    }

    return (
      <RenderFNDashboard
        {...{
          ...props,
          uid,
          queryParams,
        }}
      />
    );
  }, [props]);

  return (
    <RenderPortal ID="grafana-portal">
      <ModalRoot />
      <PortalContainer />
      {content}
    </RenderPortal>
  );
};
