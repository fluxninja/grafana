import { css } from '@emotion/css';
import { isString,  isFunction } from 'lodash';
import React, { CSSProperties, FunctionComponent, PropsWithChildren, ReactElement, useMemo } from 'react';
// eslint-disable-next-line no-restricted-imports
import { useSelector } from 'react-redux';

import { selectors } from '@grafana/e2e-selectors';
import { Tooltip } from '@grafana/ui';
import { FnGlobalState } from 'app/core/reducers/fn-slice';
import type { StoreState } from 'app/types';

import { variableAdapters } from '../adapters';
import { VariableHide, VariableModel } from '../types';
import { FnLoggerService } from 'app/fn_logger';

interface Props {
  variable: VariableModel;
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
    <div className="gf-form">
      <PickerLabel variable={props.variable} />
      {props.variable.hide !== VariableHide.hideVariable && PickerToRender && (
        <div className={renderWrapperStyle}>
          <PickerToRender variable={props.variable} readOnly={props.readOnly ?? false} />
        </div>
      )}
    </div>
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
  const { FNDashboard, mode } = useSelector<StoreState, FnGlobalState>(({ fnGlobalState }) => fnGlobalState);

  const labelOrName = useMemo(() => {
    const value = variable.label || variable.name;

    return FNDashboard ? transformFnLabel(value) : value;
  }, [variable, FNDashboard]);

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

  const elementId = `var-${variable.id}`;

  if (variable.description) {
    return (
      <Tooltip content={variable.description} placement={'bottom'}>
        <label
          className="gf-form-label gf-form-label--variable"
          style={fnLabelStyle}
          data-testid={selectors.pages.Dashboard.SubMenu.submenuItemLabels(labelOrName)}
          htmlFor={elementId}
        >
          {labelOrName}
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
      {labelOrName}
    </label>
  );
}



const TRANSFORMERS =  new Map<string | RegExp, string | ((value: string) => string)>([
  ['druid_adhoc_filters', "ad-hoc filter" ],
  [/\_/g, " "],
  ['lowerCase', (value: string) => value.toLowerCase() ],
])

function transformFnLabel(label: unknown, value = {current: label}) {
  if (!isString(label)) {
    FnLoggerService.warn(null, "Label is not a string.", {label})
    return label
  }

  if (!label) {
    return label
  }


 TRANSFORMERS.forEach(( replaceValue: string | ((value: string) => string), searchValue: string|RegExp) => {
  value.current = isFunction(replaceValue) ? replaceValue(value.current) :`${ value.current}`.replace(searchValue, replaceValue)
})

return value.current


}