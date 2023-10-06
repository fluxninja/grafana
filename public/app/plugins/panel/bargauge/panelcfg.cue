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

<<<<<<<< HEAD:public/app/plugins/panel/stat/panelcfg.cue
composableKinds: PanelCfg: {
	maturity: "experimental"

	lineage: {
		seqs: [
			{
				schemas: [
					{
						PanelOptions: {
							common.SingleStatBaseOptions
							graphMode:   common.BigValueGraphMode | *"area"
							colorMode:   common.BigValueColorMode | *"value"
							justifyMode: common.BigValueJustifyMode | *"auto"
							textMode:    common.BigValueTextMode | *"auto"
						} @cuetsy(kind="interface")
					},
				]
			},
		]
	}
|||||||| 78f0340031:public/app/plugins/panel/stat/models.cue
Panel: thema.#Lineage & {
	name: "stat"
	seqs: [
		{
			schemas: [
				{
					PanelOptions: {
						ui.SingleStatBaseOptions
						graphMode:   ui.BigValueGraphMode | *"area"
						colorMode:   ui.BigValueColorMode | *"value"
						justifyMode: ui.BigValueJustifyMode | *"auto"
						textMode:    ui.BigValueTextMode | *"auto"
					} @cuetsy(kind="interface")
				},
			]
		},
	]
========
composableKinds: PanelCfg: {
	maturity: "experimental"

	lineage: {
		schemas: [{
			version: [0, 0]
			schema: {
				Options: {
					common.SingleStatBaseOptions
					displayMode:  common.BarGaugeDisplayMode & (*"gradient" | _)
					valueMode:    common.BarGaugeValueMode & (*"color" | _)
					showUnfilled: bool | *true
					minVizWidth:  uint32 | *0
					minVizHeight: uint32 | *10
				} @cuetsy(kind="interface")
			}
		}]
		lenses: []
	}
>>>>>>>> v10.1.1:public/app/plugins/panel/bargauge/panelcfg.cue
}
