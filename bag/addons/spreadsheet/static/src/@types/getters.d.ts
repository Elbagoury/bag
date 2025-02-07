import { CorePlugin, Model, UID } from "@bag/o-spreadsheet";
import { ChartBagMenuPlugin, BagChartCorePlugin, BagChartUIPlugin } from "@spreadsheet/chart";
import { CurrencyPlugin } from "@spreadsheet/currency/plugins/currency";
import { AccountingPlugin } from "addons/spreadsheet_account/static/src/plugins/accounting_plugin";
import { GlobalFiltersCorePlugin, GlobalFiltersUIPlugin } from "@spreadsheet/global_filters";
import { ListCorePlugin, ListUIPlugin } from "@spreadsheet/list";
import { IrMenuPlugin } from "@spreadsheet/ir_ui_menu/ir_ui_menu_plugin";
import { PivotBagCorePlugin } from "@spreadsheet/pivot";
import { PivotCoreGlobalFilterPlugin } from "@spreadsheet/pivot/plugins/pivot_core_global_filter_plugin";

type Getters = Model["getters"];
type CoreGetters = CorePlugin["getters"];

/**
 * Union of all getter names of a plugin.
 *
 * e.g. With the following plugin
 * @example
 * class MyPlugin {
 *   static getters = [
 *     "getCell",
 *     "getCellValue",
 *   ] as const;
 *   getCell() { ... }
 *   getCellValue() { ... }
 * }
 * type Names = GetterNames<typeof MyPlugin>
 * // is equivalent to "getCell" | "getCellValue"
 */
type GetterNames<Plugin extends { getters: readonly string[] }> = Plugin["getters"][number];

/**
 * Extract getter methods from a plugin, based on its `getters` static array.
 * @example
 * class MyPlugin {
 *   static getters = [
 *     "getCell",
 *     "getCellValue",
 *   ] as const;
 *   getCell() { ... }
 *   getCellValue() { ... }
 * }
 * type MyPluginGetters = PluginGetters<typeof MyPlugin>;
 * // MyPluginGetters is equivalent to:
 * // {
 * //   getCell: () => ...,
 * //   getCellValue: () => ...,
 * // }
 */
type PluginGetters<Plugin extends { new (...args: unknown[]): any; getters: readonly string[] }> =
    Pick<InstanceType<Plugin>, GetterNames<Plugin>>;

declare module "@spreadsheet" {
    /**
     * Add getters from custom plugins defined in bag
     */

    interface BagCoreGetters extends CoreGetters {}
    interface BagCoreGetters extends PluginGetters<typeof GlobalFiltersCorePlugin> {}
    interface BagCoreGetters extends PluginGetters<typeof ListCorePlugin> {}
    interface BagCoreGetters extends PluginGetters<typeof BagChartCorePlugin> {}
    interface BagCoreGetters extends PluginGetters<typeof ChartBagMenuPlugin> {}
    interface BagCoreGetters extends PluginGetters<typeof IrMenuPlugin> {}
    interface BagCoreGetters extends PluginGetters<typeof PivotBagCorePlugin> {}
    interface BagCoreGetters extends PluginGetters<typeof PivotCoreGlobalFilterPlugin> {}

    interface BagGetters extends Getters {}
    interface BagGetters extends BagCoreGetters {}
    interface BagGetters extends PluginGetters<typeof GlobalFiltersUIPlugin> {}
    interface BagGetters extends PluginGetters<typeof ListUIPlugin> {}
    interface BagGetters extends PluginGetters<typeof BagChartUIPlugin> {}
    interface BagGetters extends PluginGetters<typeof CurrencyPlugin> {}
    interface BagGetters extends PluginGetters<typeof AccountingPlugin> {}
}
