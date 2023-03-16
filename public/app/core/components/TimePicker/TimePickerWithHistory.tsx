import { merge } from 'lodash';
import React, { CSSProperties, FC, useEffect } from 'react';
// eslint-disable-next-line no-restricted-imports
import { useDispatch, useSelector } from 'react-redux';

import { TimeRange, isDateTime, toUtc } from '@grafana/data';
import { TimeRangePickerProps, TimeRangePicker, useTheme2 } from '@grafana/ui';
import { FnGlobalState, updatePartialFnStates } from 'app/core/reducers/fn-slice';
import { StoreState } from 'app/types';

import { LocalStorageValueProvider } from '../LocalStorageValueProvider';

const LOCAL_STORAGE_KEY = 'grafana.dashboard.timepicker.history';

interface Props extends Omit<TimeRangePickerProps, 'history' | 'theme'> {}

const FnText: React.FC = () => {
  const { FNDashboard } = useSelector<StoreState, FnGlobalState>(({ fnGlobalState }) => fnGlobalState);
  const theme = useTheme2();

  const FN_TEXT_STYLE: CSSProperties = { fontWeight: 700, fontSize: 14, marginLeft: 8 };

  return <>{FNDashboard ? <span style={{ ...FN_TEXT_STYLE, color: theme.colors.warning.main }}>UTC</span> : ''}</>;
};

export const TimePickerWithHistory: FC<Props> = (props) => (
  <LocalStorageValueProvider<TimeRange[]> storageKey={LOCAL_STORAGE_KEY} defaultValue={[]}>
    {(values, onSaveToStore) => {
      return <Picker values={values} onSaveToStore={onSaveToStore} pickerProps={props} />;
    }}
  </LocalStorageValueProvider>
);

export interface PickerProps {
  values: TimeRange[];
  onSaveToStore: (value: TimeRange[]) => void;
  pickerProps: Props;
}

export const Picker: FC<PickerProps> = ({ values, onSaveToStore, pickerProps }) => {
  const { fnGlobalTimeRange } = useSelector<StoreState, FnGlobalState>(({ fnGlobalState }) => fnGlobalState);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!fnGlobalTimeRange) {
      return;
    }
    onAppendToHistory(fnGlobalTimeRange, values, onSaveToStore);
    pickerProps.onChange(fnGlobalTimeRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TimeRangePicker
      {...merge({}, pickerProps, { value: fnGlobalTimeRange || pickerProps.value })}
      history={convertIfJson(values)}
      onChange={(value) => {
        dispatch(
          updatePartialFnStates({
            fnGlobalTimeRange: value,
          })
        );
        onAppendToHistory(value, values, onSaveToStore);
        pickerProps.onChange(value);
      }}
      fnText={<FnText />}
    />
  );
};

function convertIfJson(history: TimeRange[]): TimeRange[] {
  return history.map((time) => {
    if (isDateTime(time.from)) {
      return time;
    }

    return {
      from: toUtc(time.from),
      to: toUtc(time.to),
      raw: time.raw,
    };
  });
}

function onAppendToHistory(toAppend: TimeRange, values: TimeRange[], onSaveToStore: (values: TimeRange[]) => void) {
  if (!isAbsolute(toAppend)) {
    return;
  }

  const toStore = limit([toAppend, ...values]);
  onSaveToStore(toStore);
}

function isAbsolute(value: TimeRange): boolean {
  return isDateTime(value.raw.from) || isDateTime(value.raw.to);
}

function limit(value: TimeRange[]): TimeRange[] {
  return value.slice(0, 4);
}
