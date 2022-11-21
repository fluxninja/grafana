import { difference } from "lodash";

import { 
  // DashboardConfig,
    DashboardType, 
    httpDashboardFilters, 
    httpDashboardQueryParams, 
    prometheusDashboardFilters, 
    prometheusDashboardQueryParams, 
    signalDashboardFilters, 
    signalDashboardQueryParams 
} from "./types";

export type ResourceType =
| "FluxMeter"
| "Classifier"
| "ConcurrencyLimiter"
| "RateLimiter"
| "Signal";

export const FluxMeterResource: ResourceType = "FluxMeter";
export const ClassifierResource: ResourceType = "Classifier";
export const ConcurrencyLimiterResource: ResourceType = "ConcurrencyLimiter";
export const RateLimiterResource: ResourceType = "RateLimiter";
export const SignalResource: ResourceType = "Signal";

export const DASHBOARDS = {
    FLOW_ANALYTICS: "flow-analytics",
    PROMETHEUS: "flux-meter",
    SIGNAL: "signal",
  };

export type FlowAnalyticsDashboardFilter = typeof httpDashboardFilters[number];

export type PrometheusDashboardFilter =
typeof prometheusDashboardFilters[number];

export type SignalDashboardFilter = typeof signalDashboardFilters[number];

export type FlowAnalyticsDashboardQueryParam =
`var-${FlowAnalyticsDashboardFilter}`;
export type PrometheusDashboardQueryParam = `var-${PrometheusDashboardFilter}`;
export type SignalDashboardQueryParam = `var-${SignalDashboardFilter}`;


export type DashboardQueryParam =
  | FlowAnalyticsDashboardQueryParam
  | PrometheusDashboardQueryParam
  | SignalDashboardQueryParam;

function getHiddenFilters<F extends string = DashboardQueryParam>(
    availableFilters: F[] | readonly F[],
  ) {
    return (enabledFilters: F[] | readonly F[]) =>
      difference([...availableFilters], [...enabledFilters]) as F[];
  }


  
export const HIDE_FILTERS_BY_DASHBOARD_TYPE: {
    [D in DashboardType]: (
      enabledFilters: DashboardQueryParam[] | readonly DashboardQueryParam[],
    ) => DashboardQueryParam[];
  } = {
    FLOW_ANALYTICS: getHiddenFilters(httpDashboardQueryParams),
    PROMETHEUS: getHiddenFilters(prometheusDashboardQueryParams),
    SIGNAL: getHiddenFilters(signalDashboardQueryParams),
};

// export const config: Omit<DashboardConfig<"FLOW_ANALYTICS">, "queryParams"> = {
//   name: "service-summary",
//   slug: "http",
//   uuid: DASHBOARDS.FLOW_ANALYTICS,
//   hiddenVariables: [
//     "var-agent_group",
//     "var-fn_project_id",
//     "var-services",
//     "var-controller_id",
//     "var-control_point",
//   ],
//   filters: [],
// };
