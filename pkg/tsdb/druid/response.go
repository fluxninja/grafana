package druid

import "sort"

type TimeseriesResult []TimeseriesRecord

// Columns returns list of columns. It calls `Columns()` on first record. If
// no records are available it returns nil.
func (t *TimeseriesResult) Columns() []string {
	for _, r := range *t {
		return r.Columns()
	}
	return nil
}

type TimeseriesRecord struct {
	Timestamp string         `json:"timestamp"`
	Result    map[string]any `json:"result"`
}

// Columns returns list of columns for given record.
// The first column will always be "timestamp" followed by other columns sorter
// alphabetically.
func (t *TimeseriesRecord) Columns() []string {
	columns := make([]string, len(t.Result)+1)
	columns[0] = "timestamp"
	i := 1
	for c := range t.Result {
		columns[i] = c
		i++
	}
	sort.Strings(columns[1:])
	return columns
}
