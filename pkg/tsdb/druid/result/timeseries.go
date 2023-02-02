package result

import (
	"encoding/json"
	"sort"
	"time"

	"github.com/grafana/grafana-plugin-sdk-go/data"
)

type TimeseriesResult []TimeseriesRecord

// Frame returns data formatted as Grafana Frame.
func (t *TimeseriesResult) Frame() *data.Frame {
	columns := t.Columns()
	fields := make([]*data.Field, len(columns))
	for i, column := range columns {
		labels := data.Labels{}
		fields[i] = data.NewField(column, labels, t.Values(column))
	}
	return data.NewFrame("", fields...)
}

// Columns returns list of columns. It calls `Columns()` on first record. If
// no records are available it returns nil.
func (t *TimeseriesResult) Columns() []string {
	for _, r := range *t {
		return r.Columns()
	}
	return nil
}

// Values returns all values for given column.
func (t *TimeseriesResult) Values(column string) interface{} {
	if len(*t) == 0 {
		return nil
	}
	results := make([]interface{}, len(*t))
	for i, r := range *t {
		results[i] = r.Value(column)
	}
	return toTypedResults(results)
}

// Unmarshal TimeSeriesResult, unnesting records to not contain MultiValue fields.
func (t *TimeseriesResult) UnmarshalJSON(data []byte) error {
	var unmarshaled []TimeseriesRecord
	if err := json.Unmarshal(data, &unmarshaled); err != nil {
		return err
	}
	// Quick checks to avoid copying data if not needed
	if len(unmarshaled) == 0 {
		*t = unmarshaled
		return nil
	}
	first_record := unmarshaled[0]
	need_unnesting := false
	for _, column := range first_record.Columns() {
		value := first_record.Value(column)
		if _, ok := value.([]interface{}); ok {
			need_unnesting = true
			break
		}
	}
	if !need_unnesting {
		*t = unmarshaled
		return nil
	}
	// We need to unnest, by iterating over columns and duplicating current row
	slice := make([]TimeseriesRecord, 0)
	for _, record := range unmarshaled {
		newRecords := make([]TimeseriesRecord, 1)
		newRecords[0].Timestamp = record.Timestamp
		newRecords[0].Result = make(map[string]interface{})
		// Copy over columns, skipping the timestamp column
		for _, column := range record.Columns()[1:] {
			value := record.Value(column)
			if array, ok := value.([]interface{}); ok {
				// We copy each existing record and add it to the newRecords array
				// multiple times, setting the current column for one of the values from the array
				existingRecords := newRecords
				newRecords = make([]TimeseriesRecord, len(newRecords)*len(array))
				for exIdx, existing := range existingRecords {
					for elemIdx, elem := range array {
						newRecord := TimeseriesRecord{
							Timestamp: existing.Timestamp,
							Result:    copyMap(existing.Result),
						}
						newRecord.Result[column] = elem
						newRecords[exIdx*len(array)+elemIdx] = newRecord
					}
				}
			} else {
				// We got a primitive value, so just add it to all records
				for _, newRecord := range newRecords {
					newRecord.Result[column] = value
				}
			}
		}
		slice = append(slice, newRecords...)
	}
	*t = slice
	return nil
}

type TimeseriesRecord struct {
	Timestamp time.Time              `json:"timestamp"`
	Result    map[string]interface{} `json:"result"`
}

// Columns returns list of columns for given record.
// The first column will always be "timestamp" followed by other columns sorted
// alphabetically.
func (t *TimeseriesRecord) Columns() []string {
	columns := make([]string, len(t.Result)+1)
	columns[0] = timestampColumn
	i := 1
	for c := range t.Result {
		columns[i] = c
		i++
	}
	sort.Strings(columns[1:])
	return columns
}

// Value returns value for given column.
func (t *TimeseriesRecord) Value(column string) interface{} {
	if column == timestampColumn {
		return t.Timestamp
	}
	v, ok := t.Result[column]
	if !ok {
		return nil
	}
	return v
}
