// Copyright 2021 Grafana Labs
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package grafanaplugin

import (
	"github.com/grafana/grafana/packages/grafana-schema/src/common"
)

<<<<<<<< HEAD:public/app/plugins/panel/bargauge/panelcfg.cue
composableKinds: PanelCfg: {
	maturity: "experimental"

	lineage: {
		seqs: [
			{
				schemas: [
					{
						PanelOptions: {
							common.SingleStatBaseOptions
							displayMode:  common.BarGaugeDisplayMode | *"gradient"
							valueMode:    common.BarGaugeValueMode | *"color"
							showUnfilled: bool | *true
							minVizWidth:  uint32 | *0
							minVizHeight: uint32 | *10
						} @cuetsy(kind="interface")
					},
				]
			},
		]
	}
|||||||| 78f0340031:public/app/plugins/panel/bargauge/models.cue
Panel: thema.#Lineage & {
	name: "bargauge"
	seqs: [
		{
			schemas: [
				{
					PanelOptions: {
						ui.SingleStatBaseOptions
						displayMode:  ui.BarGaugeDisplayMode | *"gradient"
						showUnfilled: bool | *true
						minVizWidth:  uint32 | *0
						minVizHeight: uint32 | *10
					} @cuetsy(kind="interface")
				},
			]
		},
	]
========
composableKinds: PanelCfg: lineage: {
	schemas: [{
		version: [0, 0]
		schema: {
			// Identical to timeseries... except it does not have timezone settings
			Options: {
				legend:  common.VizLegendOptions
				tooltip: common.VizTooltipOptions

				// Name of the x field to use (defaults to first number)
				xField?: string
			} @cuetsy(kind="interface")

			FieldConfig: common.GraphFieldConfig & {} @cuetsy(kind="interface")
		}
	}]
	lenses: []
>>>>>>>> v10.1.1:public/app/plugins/panel/trend/panelcfg.cue
}
