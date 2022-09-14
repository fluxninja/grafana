import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { NavModel, NavModelItem } from '@grafana/data';
import { FnGlobalState } from 'app/core/reducers/fn-slice';
import type { StoreState } from 'app/types';

import { Branding } from '../Branding/Branding';

export function usePageTitle(navModel?: NavModel, pageNav?: NavModelItem) {
  const { FNDashboard, pageTitle } = useSelector<StoreState, FnGlobalState>((state) => state.fnGlobalState);
  useEffect(() => {
    const parts: string[] = [];
    if (pageNav) {
      if (pageNav.children) {
        const activePage = pageNav.children.find((x) => x.active);
        if (activePage) {
          addTitleSegment(parts, activePage);
        }
      }
      addTitleSegment(parts, pageNav);
    }

    if (navModel) {
      if (navModel.node !== navModel.main) {
        addTitleSegment(parts, navModel.node);
      }
      addTitleSegment(parts, navModel.main);
    }
    parts.push(Branding.AppTitle);
    document.title = !FNDashboard ? parts.join(' - ') : pageTitle ? pageTitle : 'Flux Ninja';
  }, [navModel, pageNav, FNDashboard, pageTitle]);
}

function addTitleSegment(parts: string[], node: NavModelItem) {
  if (!node.hideFromBreadcrumbs) {
    parts.push(node.text);
  }
}
