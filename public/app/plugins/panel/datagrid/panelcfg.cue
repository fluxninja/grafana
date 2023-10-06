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

<<<<<<<< HEAD:public/app/plugins/panel/canvas/panelcfg.cue
composableKinds: PanelCfg: {
	lineage: {
		seqs: [
			{
				schemas: [
					{
						PanelOptions: {
							// anything for now
							...
						} @cuetsy(kind="interface")
					},
				]
			},
		]
	}
|||||||| 78f0340031:public/app/plugins/panel/canvas/models.cue
import "github.com/grafana/thema"

Panel: thema.#Lineage & {
	name: "canvas"
	seqs: [
		{
			schemas: [
				{
					PanelOptions: {
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
				Options: {
					selectedSeries: int32 & >=0 | *0
				} @cuetsy(kind="interface")
			}
		}]
		lenses: []
	}
>>>>>>>> v10.1.1:public/app/plugins/panel/datagrid/panelcfg.cue
}
