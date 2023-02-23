import { pick } from 'lodash';
import React, { FC, Suspense, useMemo } from 'react';
import { lazily } from 'react-lazily';
import { connect, MapStateToProps } from 'react-redux';

import {
  FnGlobalState,
  FN_STATE_KEY,
  FnPropMappedFromState,
  fnPropsMappedFromState,
  FnPropsMappedFromState,
} from 'app/core/reducers/fn-slice';

import { FNDashboardProps } from '../types';
import { RenderPortal } from '../utils';

const { RenderFNDashboard } = lazily(() => import('./render-fn-dashboard'));
const { FnAppProvider } = lazily(() => import('../fn-app-provider'));
const { AngularRoot } = lazily(() => import('../../angular/AngularRoot'));

type FNDashboardComponentProps = Omit<FNDashboardProps, FnPropMappedFromState>;

export const FNDashboard: FC<FNDashboardComponentProps> = (props) => {
  return (
    <Suspense fallback={<>{props.fnLoader}</>}>
      <FnAppProvider fnError={props.fnError}>
        <div className="page-dashboard">
          <AngularRoot />
          <DashboardPortal {...props} />
        </div>
      </FnAppProvider>
    </Suspense>
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
