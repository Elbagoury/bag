/** @bag-module */

/**
 * This file is meant to load the different subparts of the module
 * to guarantee their plugins are loaded in the right order
 *
 * dependency:
 *             other plugins
 *                   |
 *                  ...
 *                   |
 *                filters
 *                /\    \
 *               /  \    \
 *           pivot  list  Bag chart
 */

/** TODO: Introduce a position parameter to the plugin registry in order to load them in a specific order */
import * as spreadsheet from "@bag/o-spreadsheet";
const { corePluginRegistry, coreViewsPluginRegistry } = spreadsheet.registries;

import { GlobalFiltersCorePlugin, GlobalFiltersUIPlugin } from "@spreadsheet/global_filters/index";
import { PivotBagCorePlugin, PivotUIGlobalFilterPlugin } from "@spreadsheet/pivot/index"; // list depends on filter for its getters
import { ListCorePlugin, ListUIPlugin } from "@spreadsheet/list/index"; // pivot depends on filter for its getters
import {
    ChartBagMenuPlugin,
    BagChartCorePlugin,
    BagChartUIPlugin,
} from "@spreadsheet/chart/index"; // Bagchart depends on filter for its getters
import { PivotCoreGlobalFilterPlugin } from "./pivot/plugins/pivot_core_global_filter_plugin";
import { PivotBagUIPlugin } from "./pivot/plugins/pivot_bag_ui_plugin";

corePluginRegistry.add("BagGlobalFiltersCorePlugin", GlobalFiltersCorePlugin);
corePluginRegistry.add("PivotBagCorePlugin", PivotBagCorePlugin);
corePluginRegistry.add("BagPivotGlobalFiltersCorePlugin", PivotCoreGlobalFilterPlugin);
corePluginRegistry.add("BagListCorePlugin", ListCorePlugin);
corePluginRegistry.add("bagChartCorePlugin", BagChartCorePlugin);
corePluginRegistry.add("chartBagMenuPlugin", ChartBagMenuPlugin);

coreViewsPluginRegistry.add("BagGlobalFiltersUIPlugin", GlobalFiltersUIPlugin);
coreViewsPluginRegistry.add("BagPivotGlobalFilterUIPlugin", PivotUIGlobalFilterPlugin);
coreViewsPluginRegistry.add("BagListUIPlugin", ListUIPlugin);
coreViewsPluginRegistry.add("bagChartUIPlugin", BagChartUIPlugin);
coreViewsPluginRegistry.add("bagPivotUIPlugin", PivotBagUIPlugin);
