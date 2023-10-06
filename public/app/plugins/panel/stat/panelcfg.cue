// Copyright 2023 Grafana Labs
//
// Licensed under the Apache License, Version 2.0 (the "License")
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

<<<<<<<< HEAD:public/app/plugins/panel/logs/panelcfg.cue
composableKinds: PanelCfg: {
	maturity: "experimental"

	lineage: {
		seqs: [
			{
				schemas: [
					{
						PanelOptions: {
							showLabels:         bool
							showCommonLabels:   bool
							showTime:           bool
							wrapLogMessage:     bool
							prettifyLogMessage: bool
							enableLogDetails:   bool
							sortOrder:          common.LogsSortOrder
							dedupStrategy:      common.LogsDedupStrategy
						} @cuetsy(kind="interface")
					},
				]
			},
		]
	}
|||||||| 78f0340031:public/app/plugins/panel/table/models.cue
Panel: thema.#Lineage & {
	name: "table"
	seqs: [
		{
			schemas: [
				{
					PanelOptions: {
						frameIndex:    number | *0
						showHeader:    bool | *true
						showTypeIcons: bool | *false
						sortBy?: [...ui.TableSortByFieldState]
					} @cuetsy(kind="interface")
					PanelFieldConfig: ui.TableFieldOptions & {} @cuetsy(kind="interface")
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
					graphMode:   common.BigValueGraphMode & (*"area" | _)
					colorMode:   common.BigValueColorMode & (*"value" | _)
					justifyMode: common.BigValueJustifyMode & (*"auto" | _)
					textMode:    common.BigValueTextMode & (*"auto" | _)
				} @cuetsy(kind="interface")
			}
		}]
		lenses: []
	}
>>>>>>>> v10.1.1:public/app/plugins/panel/stat/panelcfg.cue
}
