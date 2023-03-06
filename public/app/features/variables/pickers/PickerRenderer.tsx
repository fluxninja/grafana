import { css } from '@emotion/css';
import React, { CSSProperties, FunctionComponent, PropsWithChildren, ReactElement, useMemo } from 'react';
import { Stack } from '@mui/material';
// eslint-disable-next-line no-restricted-imports
import { useSelector } from 'react-redux';

import { TypedVariableModel, VariableHide } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { Tooltip } from '@grafana/ui';
import { FnGlobalState } from 'app/core/reducers/fn-slice';
import type { StoreState } from 'app/types';

import { variableAdapters } from '../adapters';
import { VARIABLE_PREFIX } from '../constants';

interface Props {
  variable: TypedVariableModel;
  readOnly?: boolean;
}

const renderWrapperStyle = css`
  & button,
  & span,
  & label,
  & input {
    height: 24px;
    font-size: 12px;
    line-height: 24px;
    align-self: center;
  }
`;

export const PickerRenderer: FunctionComponent<Props> = (props) => {
  const PickerToRender = useMemo(() => variableAdapters.get(props.variable.type).picker, [props.variable]);

  if (!props.variable) {
    return <div>Couldn&apos;t load variable</div>;
  }

  return (
    <Stack gap={0}>
      <PickerLabel variable={props.variable} />
      {props.variable.hide !== VariableHide.hideVariable && PickerToRender && (
        <div className={renderWrapperStyle}>
          <PickerToRender variable={props.variable} readOnly={props.readOnly ?? false} />
        </div>
      )}
    </Stack>
  );
};

const COMMON_PICKER_LABEL_STYLE: CSSProperties = {
  borderRadius: '2px',
  border: 'none',
  fontWeight: 400,
  fontSize: '12px',
  padding: '3px 6px',
  letterSpacing: '0.15px',
  height: '24px',
};

function PickerLabel({ variable }: PropsWithChildren<Props>): ReactElement | null {
  const labelOrName = useMemo(() => variable.label || variable.name, [variable]);
  const { FNDashboard, mode } = useSelector<StoreState, FnGlobalState>(({ fnGlobalState }) => fnGlobalState);

  const fnLabelStyle = useMemo(
    () => ({
      ...COMMON_PICKER_LABEL_STYLE,
      ...(FNDashboard
        ? {
            color: mode === 'light' ? '#2D333E' : '#DBD9D7',
            backgroundColor: mode === 'light' ? '#E0E0E0' : '#56524D',
          }
        : {}),
    }),
    [mode, FNDashboard]
  );

  if (variable.hide !== VariableHide.dontHide) {
    return null;
  }
  const fnLabelOrName = FNDashboard ? labelOrName.replace('druid_adhoc_filters', 'ad-hoc') : labelOrName;

  const elementId = VARIABLE_PREFIX + variable.id;
  if (variable.description) {
    return (
      <Tooltip content={variable.description} placement={'bottom'}>
        <label
          className="gf-form-label gf-form-label--variable"
          style={fnLabelStyle}
          data-testid={selectors.pages.Dashboard.SubMenu.submenuItemLabels(labelOrName)}
          htmlFor={elementId}
        >
          {fnLabelOrName}
        </label>
      </Tooltip>
    );
  }
  return (
    <label
      className="gf-form-label gf-form-label--variable"
      style={fnLabelStyle}
      data-testid={selectors.pages.Dashboard.SubMenu.submenuItemLabels(labelOrName)}
      htmlFor={elementId}
    >
      {fnLabelOrName}
    </label>
  );
}
