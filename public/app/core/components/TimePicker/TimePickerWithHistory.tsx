import { merge, uniqBy } from 'lodash';
import React, { CSSProperties, FC, useEffect } from 'react';
// eslint-disable-next-line no-restricted-imports
import { useDispatch, useSelector } from 'react-redux';

import { TimeRange, isDateTime, rangeUtil, TimeZone, toUtc } from '@grafana/data';
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
  }, [fnGlobalTimeRange, onSaveToStore, pickerProps, values]);

  return (
    <TimeRangePicker
      {...merge({}, pickerProps, { value: pickerProps.value })}
      history={convertIfJson(values)}
      onChange={(value) => {
        dispatch(
          updatePartialFnStates({
            fnGlobalTimeRange: value,
          })
        );
      }}
      fnText={<FnText />}
    />
  );
};

function deserializeHistory(values: TimePickerHistoryItem[], timeZone: TimeZone | undefined): TimeRange[] {
  return values.map((item) => rangeUtil.convertRawToRange(item, timeZone));
}

function migrateHistory(values: LSTimePickerHistoryItem[]): TimePickerHistoryItem[] {
  return values.map((item) => {
    const fromValue = typeof item.from === 'string' ? item.from : item.from.toISOString();
    const toValue = typeof item.to === 'string' ? item.to : item.to.toISOString();

    return {
      from: fromValue,
      to: toValue,
    };
  });
}

function onAppendToHistory(
  newTimeRange: TimeRange,
  values: TimePickerHistoryItem[],
  onSaveToStore: (values: TimePickerHistoryItem[]) => void
) {
  if (!isAbsolute(newTimeRange)) {
    return;
  }

  // Convert DateTime objects to strings
  const toAppend = {
    from: typeof newTimeRange.raw.from === 'string' ? newTimeRange.raw.from : newTimeRange.raw.from.toISOString(),
    to: typeof newTimeRange.raw.to === 'string' ? newTimeRange.raw.to : newTimeRange.raw.to.toISOString(),
  };

  const toStore = limit([toAppend, ...values]);
  onSaveToStore(toStore);
}

function isAbsolute(value: TimeRange): boolean {
  return isDateTime(value.raw.from) || isDateTime(value.raw.to);
}

function limit(value: TimePickerHistoryItem[]): TimePickerHistoryItem[] {
  return uniqBy(value, (v) => v.from + v.to).slice(0, 4);
}
