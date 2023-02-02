package result

import (
	"encoding/json"
	"testing"
	"time"

	"github.com/grafana/grafana-plugin-sdk-go/data"
	"github.com/stretchr/testify/assert"
)

func TestTimeseriesResultUnmarshal(t *testing.T) {
	input := []byte(`[
		{
			"timestamp": "2022-10-14T08:08:10.000Z",
			"result": {
				"dog_count": 47,
				"dog_rate": 2.083,
				"dog_name": "foo"
			}
		},
		{
			"timestamp": "2022-10-14T08:08:11.000Z",
			"result": {
				"dog_count": 75,
				"dog_rate": 3.846,
				"dog_name": "bar"
			}
		}
	]`)

	var res TimeseriesResult
	err := json.Unmarshal(input, &res)
	assert.Nil(t, err, "Failed to unmarshal response")
	assert.Equal(t, len(res), 2, "Wrong number of unmarshalled results")
	frame := res.Frame()
	assert.Equal(t, len(frame.Fields), 4, "Wrong number of framed fields")

	assert.Equal(t, frame.Fields[0].Name, "timestamp")
	assert.Equal(t, frame.Fields[0].Type(), data.FieldTypeTime)
	assert.Equal(t, frame.Fields[0].Len(), 2)
	assert.Equal(t, frame.Fields[0].At(0), time.Time(time.Date(2022, time.October, 14, 8, 8, 10, 0, time.UTC)))
	assert.Equal(t, frame.Fields[0].At(1), time.Time(time.Date(2022, time.October, 14, 8, 8, 11, 0, time.UTC)))

	assert.Equal(t, frame.Fields[1].Name, "dog_count")
	assert.Equal(t, frame.Fields[1].Type(), data.FieldTypeFloat64)
	assert.Equal(t, frame.Fields[1].At(0), float64(47))
	assert.Equal(t, frame.Fields[1].At(1), float64(75))

	assert.Equal(t, frame.Fields[2].Name, "dog_name")
	assert.Equal(t, frame.Fields[2].Type(), data.FieldTypeString)
	assert.Equal(t, frame.Fields[2].At(0), "foo")
	assert.Equal(t, frame.Fields[2].At(1), "bar")

	assert.Equal(t, frame.Fields[3].Name, "dog_rate")
	assert.Equal(t, frame.Fields[3].Type(), data.FieldTypeFloat64)
	assert.Equal(t, frame.Fields[3].At(0), float64(2.083))
	assert.Equal(t, frame.Fields[3].At(1), float64(3.846))
}

func TestMultiValueColumnUnnest(t *testing.T) {
	input := []byte(`[
		{
			"timestamp": "2022-10-14T08:08:10.000Z",
			"result": {
				"dog_count": 47,
        "dog_name": "foo",
        "dog_friends": ["bar", "baz"]
			}
		},
		{
			"timestamp": "2022-10-14T08:08:11.000Z",
			"result": {
				"dog_count": 75,
        "dog_name": "bar",
        "dog_friends": ["foo"]
			}
		},
		{
			"timestamp": "2022-10-14T08:08:12.000Z",
			"result": {
				"dog_count": 42,
        "dog_name": "baz",
        "dog_friends": ["foo", "ken", "woof"]
			}
		}
	]`)

	var res TimeseriesResult
	err := json.Unmarshal(input, &res)
	assert.Nil(t, err, "Failed to unmarshal response")
	assert.Equal(t, len(res), 6, "Wrong number of unmarshalled results")
	frame := res.Frame()
	assert.Equal(t, len(frame.Fields), 4, "Wrong number of framed fields")

	assert.Equal(t, frame.Fields[0].Name, "timestamp")
	assert.Equal(t, frame.Fields[0].Type(), data.FieldTypeTime)
	assert.Equal(t, frame.Fields[0].Len(), 6)
	assert.Equal(t, frame.Fields[0].At(0), time.Time(time.Date(2022, time.October, 14, 8, 8, 10, 0, time.UTC)))
	assert.Equal(t, frame.Fields[0].At(1), time.Time(time.Date(2022, time.October, 14, 8, 8, 10, 0, time.UTC)))
	assert.Equal(t, frame.Fields[0].At(2), time.Time(time.Date(2022, time.October, 14, 8, 8, 11, 0, time.UTC)))
	assert.Equal(t, frame.Fields[0].At(3), time.Time(time.Date(2022, time.October, 14, 8, 8, 12, 0, time.UTC)))
	assert.Equal(t, frame.Fields[0].At(4), time.Time(time.Date(2022, time.October, 14, 8, 8, 12, 0, time.UTC)))
	assert.Equal(t, frame.Fields[0].At(5), time.Time(time.Date(2022, time.October, 14, 8, 8, 12, 0, time.UTC)))

	assert.Equal(t, frame.Fields[1].Name, "dog_count")
	assert.Equal(t, frame.Fields[1].Type(), data.FieldTypeFloat64)
	assert.Equal(t, frame.Fields[1].Len(), 6)
	assert.Equal(t, frame.Fields[1].At(0), float64(47))
	assert.Equal(t, frame.Fields[1].At(1), float64(47))
	assert.Equal(t, frame.Fields[1].At(2), float64(75))
	assert.Equal(t, frame.Fields[1].At(3), float64(42))
	assert.Equal(t, frame.Fields[1].At(4), float64(42))
	assert.Equal(t, frame.Fields[1].At(5), float64(42))

	assert.Equal(t, frame.Fields[2].Name, "dog_friends")
	assert.Equal(t, frame.Fields[2].Type(), data.FieldTypeString)
	assert.Equal(t, frame.Fields[2].At(0), "bar")
	assert.Equal(t, frame.Fields[2].At(1), "baz")
	assert.Equal(t, frame.Fields[2].At(2), "foo")
	assert.Equal(t, frame.Fields[2].At(3), "foo")
	assert.Equal(t, frame.Fields[2].At(4), "ken")
	assert.Equal(t, frame.Fields[2].At(5), "woof")

	assert.Equal(t, frame.Fields[3].Name, "dog_name")
	assert.Equal(t, frame.Fields[3].Type(), data.FieldTypeString)
	assert.Equal(t, frame.Fields[3].At(0), "foo")
	assert.Equal(t, frame.Fields[3].At(1), "foo")
	assert.Equal(t, frame.Fields[3].At(2), "bar")
	assert.Equal(t, frame.Fields[3].At(3), "baz")
	assert.Equal(t, frame.Fields[3].At(4), "baz")
	assert.Equal(t, frame.Fields[3].At(5), "baz")
}
