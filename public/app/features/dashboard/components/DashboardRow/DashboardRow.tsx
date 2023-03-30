import { css, cx } from '@emotion/css';
import { indexOf } from 'lodash';
import React, { Component } from 'react';
import { Unsubscribable } from 'rxjs';
import {connect} from "react-redux"

import { GrafanaTheme2 } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { getTemplateSrv, RefreshEvent } from '@grafana/runtime';
import { Icon, TextLink, Themeable2, withTheme2 } from '@grafana/ui';
import appEvents from 'app/core/app_events';
import { SHARED_DASHBOARD_QUERY } from 'app/plugins/datasource/dashboard/types';

import { ShowConfirmModalEvent } from '../../../../types/events';
import { DashboardModel } from '../../state/DashboardModel';
import { PanelModel } from '../../state/PanelModel';
import { RowOptionsButton } from '../RowOptions/RowOptionsButton';
import { StoreState } from 'app/types';

export interface DashboardRowProps extends Themeable2 {
  panel: PanelModel;
  dashboard: DashboardModel;
  isFnDashboard: boolean
}

 class Component extends React.Component<DashboardRowProps> {
  sub?: Unsubscribable;

  componentDidMount() {
    this.sub = this.props.dashboard.events.subscribe(RefreshEvent, this.onVariableUpdated);
  }

  componentWillUnmount() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  onVariableUpdated = () => {
    this.forceUpdate();
  };

  onToggle = () => {
    this.props.dashboard.toggleRow(this.props.panel);
  };

  getWarning = () => {
    const panels = !!this.props.panel.panels?.length
      ? this.props.panel.panels
      : this.props.dashboard.getRowPanels(indexOf(this.props.dashboard.panels, this.props.panel));
    const isAnyPanelUsingDashboardDS = panels.some((p) => p.datasource?.uid === SHARED_DASHBOARD_QUERY);
    if (isAnyPanelUsingDashboardDS) {
      return (
        <div>
          <p>
            Panels in this row use the {SHARED_DASHBOARD_QUERY} data source. These panels will reference the panel in
            the original row, not the ones in the repeated rows.
          </p>
          <TextLink
            external
            href={
              'https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/create-dashboard/#configure-repeating-rows'
            }
          >
            Learn more
          </TextLink>
        </div>
      );
    }

    return undefined;
  };

  onUpdate = (title: string, repeat?: string | null) => {
    this.props.panel.setProperty('title', title);
    this.props.panel.setProperty('repeat', repeat ?? undefined);
    this.props.panel.render();
    this.props.dashboard.processRepeats();
    this.forceUpdate();
  };

  onDelete = () => {
    appEvents.publish(
      new ShowConfirmModalEvent({
        title: 'Delete row',
        text: 'Are you sure you want to remove this row and all its panels?',
        altActionText: 'Delete row only',
        icon: 'trash-alt',
        onConfirm: () => {
          this.props.dashboard.removeRow(this.props.panel, true);
        },
        onAltAction: () => {
          this.props.dashboard.removeRow(this.props.panel, false);
        },
      })
    );
  };

  render() {
    const classes = classNames({
      'dashboard-row': true,
      'dashboard-row--collapsed': this.props.panel.collapsed,
    });

    const {isFnDashboard} = this.props

    const title = getTemplateSrv().replace(this.props.panel.title, this.props.panel.scopedVars, 'text');
    const count = this.props.panel.panels ? this.props.panel.panels.length : 0;
    const panels = count === 1 ? 'panel' : 'panels';
    const canEdit = this.props.dashboard.meta.canEdit === true && !isFnDashboard;


    return (
      <div
        className={cx(styles.dashboardRow, {
          [styles.dashboardRowCollapsed]: collapsed,
        })}
        data-testid="dashboard-row-container"
      >
        <button
          aria-expanded={!collapsed}
          className={cx(styles.title, 'pointer')}
          type="button"
          data-testid={selectors.components.DashboardRow.title(title)}
          onClick={this.onToggle}
        >
          <Icon name={collapsed ? 'angle-right' : 'angle-down'} />
          {title}
          <span
            className={cx(styles.count, {
              [styles.countCollapsed]: collapsed,
            })}
          >
            ({count} {panels})
          </span>
        </button>
        {canEdit && (
          <div className={styles.actions}>
            <RowOptionsButton
              title={this.props.panel.title}
              repeat={this.props.panel.repeat}
              onUpdate={this.onUpdate}
              warning={this.getWarning()}
            />
            <button type="button" className="pointer" onClick={this.onDelete} aria-label="Delete row">
              <Icon name="trash-alt" />
            </button>
          </div>
        )}
        {collapsed === true && (
          /* disabling the a11y rules here as the button handles keyboard interactions */
          /* this is just to provide a better experience for mouse users */
          /* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
          <div
            className={cx({
              [styles.toggleTargetCollapsed]: collapsed,
            })}
            onClick={this.onToggle}
          >
            &nbsp;
          </div>
        )}
        {canEdit && (
          <div
            data-testid="dashboard-row-drag"
            className={cx(styles.dragHandle, 'grid-drag-handle', {
              [styles.dragHandleCollapsed]: collapsed,
            })}
          />
        )}
      </div>
    );
  }
}


function mapStateToProps () {
  return (state: StoreState) =>  ({
    isFnDashboard: state.fnGlobalState.FNDashboard
  });
}


export const DashboardRow = connect(mapStateToProps)(Component);
