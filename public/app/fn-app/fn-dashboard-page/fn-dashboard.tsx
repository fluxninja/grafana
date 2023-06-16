import { pick } from 'lodash';
import React, { FC, useMemo } from 'react';
import { connect, MapStateToProps } from 'react-redux';

import {
  FnGlobalState,
  FN_STATE_KEY,
  FnPropMappedFromState,
  fnPropsMappedFromState,
  FnPropsMappedFromState,
} from 'app/core/reducers/fn-slice';

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

function mapStateToProps(): MapStateToProps<
  FnPropsMappedFromState,
  Omit<FNDashboardProps, FnPropMappedFromState>,
  { [K in typeof FN_STATE_KEY]: FnGlobalState }
> {
  return ({ fnGlobalState }) => pick(fnGlobalState, ...fnPropsMappedFromState);
}

export const DashboardPortalComponent: FC<FNDashboardComponentProps & FnPropsMappedFromState> = (props) => {
  const content = useMemo(() => {
    if (!props.FNDashboard) {
      // TODO Use no data
      return null;
    }

    const { uid, slug, queryParams = {} } = props;

    if (!uid || !slug) {
      // TODO Use no data
      return null;
    }

    return (
      <RenderFNDashboard
        {...{
          ...props,
          uid,
          slug,
          queryParams,
        }}
      />
    );
  }, [props]);

  return <RenderPortal ID="grafana-portal">{content}</RenderPortal>;
};

export const DashboardPortal = connect(mapStateToProps())(DashboardPortalComponent);
