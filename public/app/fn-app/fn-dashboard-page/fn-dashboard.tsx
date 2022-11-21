import { get } from 'lodash';
import { parse as parseQueryParams } from 'query-string';
import React, { FC, Suspense, useMemo } from 'react';
import { lazily } from 'react-lazily';
import { useLocation } from 'react-router-dom';

import { HIDE_FILTERS_BY_DASHBOARD_TYPE } from '../filter-constants';
import { FNDashboardProps } from '../types';
import { RenderPortal } from '../utils';

const { RenderFNDashboard } = lazily(() => import('./render-fn-dashboard'));
const { FnAppProvider } = lazily(() => import('../fn-app-provider'));
const { AngularRoot } = lazily(() => import('../../angular/AngularRoot'));

export const FNDashboard: FC<FNDashboardProps> = (props) => (
  <Suspense fallback={<>{props.fnLoader}</>}>
    <FnAppProvider fnError={props.fnError}>
      <div className="page-dashboard">
        <AngularRoot />
        <DashboardPortal {...props}/>
      </div>
    </FnAppProvider>
  </Suspense>
);

export const DashboardPortal: FC<FNDashboardProps> = (props) =>{
  const location = useLocation();

 console.log(location,  "location");

  const portal = useMemo(() =>{
    const { search } = location;
    const queryParams = parseQueryParams(search);

    const { dashboardUID, slug, dashboardType } = queryParams
    console.log(queryParams, dashboardUID, slug,  "queryParams");
    if(!dashboardUID){
      return null;
    }

    const newProps: FNDashboardProps = {
      ...props,
      uid: dashboardUID as string,
      slug: slug as string,
      queryParams: queryParams,
      hiddenVariables: get(HIDE_FILTERS_BY_DASHBOARD_TYPE, dashboardType as string)([]) 
     }
     console.log(`QueryParams:`, queryParams, `Props:`, newProps, "query Params for location")
    return(
      <RenderPortal ID="grafana-portal" >
         <RenderFNDashboard {...newProps} />
      </RenderPortal>
    )
  },[location, props])

  return <>{portal}</>
}
