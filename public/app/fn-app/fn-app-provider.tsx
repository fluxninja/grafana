import { Action, KBarProvider } from 'kbar';
import { useState, useEffect, FC, PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Router } from 'react-router-dom';
import { CompatRouter } from 'react-router-dom-v5-compat';

import {
  config,
  locationService,
  LocationServiceProvider,
  navigationLogger,
  reportInteraction,
} from '@grafana/runtime';
import { ErrorBoundaryAlert, GlobalStyles } from '@grafana/ui';
import { AngularRoot } from 'app/angular/AngularRoot';
import { loadAndInitAngularIfEnabled } from 'app/angular/loadAndInitAngularIfEnabled';
import { AppChrome } from 'app/core/components/AppChrome/AppChrome';
import { ModalsContextProvider } from 'app/core/context/ModalsContextProvider';
import { ThemeProvider } from 'app/core/utils/ConfigProvider';
import { FnLoader } from 'app/features/dashboard/components/DashboardLoading/FnLoader';
import { FnLoggerService } from 'app/fn_logger';
import { store } from 'app/store/store';

import { GrafanaContext } from '../core/context/GrafanaContext';
import app from '../fn_app';

import { FNDashboardProps } from './types';

type FnAppProviderProps = Pick<FNDashboardProps, 'fnError'>;

export const FnAppProvider: FC<PropsWithChildren<FnAppProviderProps>> = (props) => {
  const { children } = props;

  const [ready, setReady] = useState(false);
  navigationLogger('AppWrapper', false, 'rendering');
  useEffect(() => {
    loadAndInitAngularIfEnabled()
      .then(() => {
        setReady(true);
        $('.preloader').remove();
      })
      .catch(FnLoggerService.error);
  }, []);

  const commandPaletteActionSelected = (action: Action) => {
    reportInteraction('command_palette_action_selected', {
      actionId: action.id,
      actionName: action.name,
    });
  };

  if (!store || !ready) {
    return <FnLoader />;
  }

  return (
    <Provider store={store}>
      <BrowserRouter>
        <ErrorBoundaryAlert style="page">
          <GrafanaContext.Provider value={app.context}>
            <ThemeProvider value={config.theme2}>
              <KBarProvider
                actions={[]}
                options={{ enableHistory: true, callbacks: { onSelectAction: commandPaletteActionSelected } }}
              >
                <Router history={locationService.getHistory()}>
                  <LocationServiceProvider service={locationService}>
                    <CompatRouter>
                      <ModalsContextProvider>
                        <GlobalStyles />
                        <div className="grafana-app">
                          <AppChrome>
                            <AngularRoot />
                            {children}
                          </AppChrome>
                        </div>
                      </ModalsContextProvider>
                    </CompatRouter>
                  </LocationServiceProvider>
                </Router>
              </KBarProvider>
            </ThemeProvider>
          </GrafanaContext.Provider>
        </ErrorBoundaryAlert>
      </BrowserRouter>
    </Provider>
  );
};
