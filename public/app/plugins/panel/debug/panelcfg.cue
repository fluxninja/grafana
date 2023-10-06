// Copyright 2023 Grafana Labs
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

<<<<<<<< HEAD:public/app/plugins/panel/alertGroups/panelcfg.cue
composableKinds: PanelCfg: {
	lineage: {
		seqs: [
			{
				schemas: [
					{
						PanelOptions: {
							// Comma-separated list of values used to filter alert results
							labels: string
							// Name of the alertmanager used as a source for alerts
							alertmanager: string
							// Expand all alert groups by default
							expandAll: bool
						} @cuetsy(kind="interface")
					},
				]
			},
		]
	}
|||||||| 78f0340031:public/app/plugins/panel/heatmap/models.cue
import "github.com/grafana/thema"

Panel: thema.#Lineage & {
	name: "heatmap"
	seqs: [
		{
			schemas: [
				{
					PanelOptions: {
						// anything for now
						...
					} @cuetsy(kind="interface")
					PanelFieldConfig: {
						// anything for now
						...
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
				UpdateConfig: {
					render:        bool
					dataChanged:   bool
					schemaChanged: bool
				} @cuetsy(kind="type")

				DebugMode: "render" | "events" | "cursor" | "State" | "ThrowError" @cuetsy(kind="enum")

				Options: {
					mode:      DebugMode
					counters?: UpdateConfig
				} @cuetsy(kind="interface")
			}
		}]
		lenses: []
	}
>>>>>>>> v10.1.1:public/app/plugins/panel/debug/panelcfg.cue
}
