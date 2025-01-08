import { merge, isFunction, isEqual } from 'lodash';
import { useEffect, FC, useMemo, useRef } from 'react';

import { locationService as locationSrv, HistoryWrapper } from '@grafana/runtime';
import DashboardPage, { DashboardPageProps } from 'app/features/dashboard/containers/DashboardPage';
import { DashboardRoutes, StoreState, useSelector } from 'app/types';

import { FNDashboardProps } from '../types';

const locationService = locationSrv as HistoryWrapper;

const DEFAULT_DASHBOARD_PAGE_PROPS: Pick<DashboardPageProps, 'history' | 'route'> & {
  match: Pick<DashboardPageProps['match'], 'isExact' | 'path' | 'url'>;
} = {
  match: {
    isExact: true,
    path: '/d/:uid/:slug?',
    url: '',
  },
  history: locationService.getHistory(),
  route: {
    routeName: DashboardRoutes.Normal,
    path: '/d/:uid/:slug?',
    pageClass: 'page-dashboard',
    component: DashboardPage,
  },
};

export const RenderFNDashboard: FC<FNDashboardProps> = (props) => {
  const { queryParams, controlsContainer, setErrors, hiddenVariables, isLoading } = props;
  const uidRef = useRef<string | null>(null);

  const firstError = useSelector((state: StoreState) => {
    const { appNotifications } = state;

    return Object.values(appNotifications.byId).find(({ severity }) => severity === 'error');
  });

  /**
   * NOTE:
   * Grafana renders notifications in StoredNotifications component.
   * We do not use this component in FN.
   * But we would like to propagate grafana's errors to FN.
   */
  useEffect(() => {
    if (!isFunction(setErrors)) {
      return;
    }

    setErrors(firstError ? { [firstError.timestamp]: firstError.text } : {});
  }, [firstError, setErrors]);

  useEffect(() => {
    let searchParams = getSearchParamsObject();
    if (isEqual(searchParams, queryParams) && uidRef.current === props.uid) {
      return;
    }
    if (uidRef.current !== props.uid) {
      searchParams = {
        ...(searchParams.from ? { from: searchParams.from } : {}),
        ...(searchParams.to ? { to: searchParams.to } : {}),
      };
    }
    locationService.fnPathnameChange(window.location.pathname, {
      ...searchParams,
      ...queryParams,
    });
    uidRef.current = props.uid;
  }, [queryParams, props.uid]);

  const dashboardPageProps: DashboardPageProps = useMemo(() => {
    return merge({}, DEFAULT_DASHBOARD_PAGE_PROPS, {
      ...DEFAULT_DASHBOARD_PAGE_PROPS,
      match: {
        params: {
          ...props,
        },
      },
      location: locationService.getLocation(),
      queryParams: {
        ...getSearchParamsObject(),
        ...queryParams,
      },
      hiddenVariables,
      controlsContainer,
      isLoading,
    });
  }, [controlsContainer, hiddenVariables, isLoading, props, queryParams]);

  return <DashboardPage {...dashboardPageProps} />;
};

function getSearchParamsObject() {
  const searchParams = new URLSearchParams(window.location.search);
  return Object.fromEntries(searchParams.entries());
}
