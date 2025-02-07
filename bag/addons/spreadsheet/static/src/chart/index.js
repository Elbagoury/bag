/** @bag-module */

import * as spreadsheet from "@bag/o-spreadsheet";

const { chartComponentRegistry } = spreadsheet.registries;
const { ChartJsComponent } = spreadsheet.components;

chartComponentRegistry.add("bag_bar", ChartJsComponent);
chartComponentRegistry.add("bag_line", ChartJsComponent);
chartComponentRegistry.add("bag_pie", ChartJsComponent);

import { BagChartCorePlugin } from "./plugins/bag_chart_core_plugin";
import { ChartBagMenuPlugin } from "./plugins/chart_bag_menu_plugin";
import { BagChartUIPlugin } from "./plugins/bag_chart_ui_plugin";

export { BagChartCorePlugin, ChartBagMenuPlugin, BagChartUIPlugin };
