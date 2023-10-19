import { pick } from 'lodash';
import React, { FC, useMemo } from 'react';

import { FnPropMappedFromState, fnPropsMappedFromState } from 'app/core/reducers/fn-slice';
import { StoreState, useSelector } from 'app/types';

import { AngularRoot } from '../../angular/AngularRoot';
import { FnAppProvider } from '../fn-app-provider';
import { FNDashboardProps } from '../types';
import { RenderPortal } from '../utils';

import { RenderFNDashboard } from './render-fn-dashboard';

type FNDashboardComponentProps = Omit<FNDashboardProps, FnPropMappedFromState>;

export const FNDashboard: FC<FNDashboardComponentProps> = (props) => {
  return (
    <FnAppProvider fnError={props.fnError}>
      <div className="page-dashboard">
        <AngularRoot />
        <DashboardPortal {...props} />
      </div>
    </FnAppProvider>
  );
};

function mapStateToProps() {
  return ({ fnGlobalState }: StoreState) => pick(fnGlobalState, ...fnPropsMappedFromState);
}

export const DashboardPortal: FC<FNDashboardComponentProps> = (p) => {
  const globalFnProps = useSelector(mapStateToProps());

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

  return <RenderPortal ID="grafana-portal">{content}</RenderPortal>;
};
