import { useEffect } from 'react';

import { NavModel, NavModelItem } from '@grafana/data';
import { FnGlobalState } from 'app/core/reducers/fn-slice';
import { HOME_NAV_ID } from 'app/core/reducers/navModel';
import { useSelector } from 'app/types';

import { Branding } from '../Branding/Branding';
import { buildBreadcrumbs } from '../Breadcrumbs/utils';

export function usePageTitle(navModel?: NavModel, pageNav?: NavModelItem) {
  const homeNav = useSelector((state) => state.navIndex)?.[HOME_NAV_ID];
  const { FNDashboard, pageTitle } = useSelector<FnGlobalState>((state) => state.fnGlobalState);

  useEffect(() => {
    const sectionNav = (navModel?.node !== navModel?.main ? navModel?.node : navModel?.main) ?? { text: 'Grafana' };
    const parts: string[] = buildBreadcrumbs(sectionNav, pageNav, homeNav)
      .map((crumb) => crumb.text)
      .reverse();

    // Override `Home` with the custom brand title
    parts[parts.length - 1] = Branding.AppTitle;

    document.title = !FNDashboard ? parts.join(' - ') : pageTitle ? pageTitle : 'Flux Ninja';
  }, [FNDashboard, homeNav, navModel, pageNav, pageTitle]);
}
