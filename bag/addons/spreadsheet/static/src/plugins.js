/** @bag-module */

import { CorePlugin, UIPlugin } from "@bag/o-spreadsheet";

/**
 * An o-spreadsheet core plugin with access to all custom Bag plugins
 * @type {import("@spreadsheet").BagCorePluginConstructor}
 **/
export const BagCorePlugin = CorePlugin;

/**
 * An o-spreadsheet UI plugin with access to all custom Bag plugins
 * @type {import("@spreadsheet").BagUIPluginConstructor}
 **/
export const BagUIPlugin = UIPlugin;
