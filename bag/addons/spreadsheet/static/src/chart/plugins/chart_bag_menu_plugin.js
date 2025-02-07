/** @bag-module */

import { BagCorePlugin } from "@spreadsheet/plugins";
import { coreTypes, helpers } from "@bag/o-spreadsheet";
import { omit } from "@web/core/utils/objects";
const { deepEquals } = helpers;

/** Plugin that link charts with Bag menus. It can contain either the Id of the bag menu, or its xml id. */
export class ChartBagMenuPlugin extends BagCorePlugin {
    static getters = /** @type {const} */ (["getChartBagMenu"]);
    constructor(config) {
        super(config);
        this.bagMenuReference = {};
    }

    /**
     * Handle a spreadsheet command
     * @param {Object} cmd Command
     */
    handle(cmd) {
        switch (cmd.type) {
            case "LINK_ODOO_MENU_TO_CHART":
                this.history.update("bagMenuReference", cmd.chartId, cmd.bagMenuId);
                break;
            case "DELETE_FIGURE":
                this.history.update("bagMenuReference", cmd.id, undefined);
                break;
            case "DUPLICATE_SHEET":
                this.updateOnDuplicateSheet(cmd.sheetId, cmd.sheetIdTo);
                break;
        }
    }

    updateOnDuplicateSheet(sheetIdFrom, sheetIdTo) {
        for (const oldChartId of this.getters.getChartIds(sheetIdFrom)) {
            if (!this.bagMenuReference[oldChartId]) {
                continue;
            }
            const oldChartDefinition = this.getters.getChartDefinition(oldChartId);
            const oldFigure = this.getters.getFigure(sheetIdFrom, oldChartId);
            const newChartId = this.getters.getChartIds(sheetIdTo).find((newChartId) => {
                const newChartDefinition = this.getters.getChartDefinition(newChartId);
                const newFigure = this.getters.getFigure(sheetIdTo, newChartId);
                return (
                    deepEquals(oldChartDefinition, newChartDefinition) &&
                    deepEquals(omit(newFigure, "id"), omit(oldFigure, "id")) // compare size and position
                );
            });

            if (newChartId) {
                this.history.update(
                    "bagMenuReference",
                    newChartId,
                    this.bagMenuReference[oldChartId]
                );
            }
        }
    }

    /**
     * Get bag menu linked to the chart
     *
     * @param {string} chartId
     * @returns {object | undefined}
     */
    getChartBagMenu(chartId) {
        const menuId = this.bagMenuReference[chartId];
        return menuId ? this.getters.getIrMenu(menuId) : undefined;
    }

    import(data) {
        if (data.chartBagMenusReferences) {
            this.bagMenuReference = data.chartBagMenusReferences;
        }
    }

    export(data) {
        data.chartBagMenusReferences = this.bagMenuReference;
    }
}

coreTypes.add("LINK_ODOO_MENU_TO_CHART");
