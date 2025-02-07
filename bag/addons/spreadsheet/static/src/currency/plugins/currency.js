/** @bag-module */

import { EvaluationError, helpers, registries } from "@bag/o-spreadsheet";
import { BagUIPlugin } from "@spreadsheet/plugins";
import { toServerDateString } from "@spreadsheet/helpers/helpers";
import { _t } from "@web/core/l10n/translation";
const { featurePluginRegistry } = registries;
const { createCurrencyFormat } = helpers;

/**
 * @typedef Currency
 * @property {string} name
 * @property {string} code
 * @property {string} symbol
 * @property {number} decimalPlaces
 * @property {"before" | "after"} position
 */

export class CurrencyPlugin extends BagUIPlugin {
    static getters = /** @type {const} */ ([
        "getCurrencyRate",
        "computeFormatFromCurrency",
        "getCompanyCurrencyFormat",
    ]);

    constructor(config) {
        super(config);
        /** @type {string | undefined} */
        this.currentCompanyCurrency = config.defaultCurrency;
        /** @type {import("@spreadsheet/data_sources/server_data").ServerData} */
        this._serverData = config.custom.bagDataProvider?.serverData;
    }

    get serverData() {
        if (!this._serverData) {
            throw new Error(
                "'serverData' is not defined, please make sure a 'BagDataProvider' instance is provided to the model."
            );
        }
        return this._serverData;
    }

    // -------------------------------------------------------------------------
    // Getters
    // -------------------------------------------------------------------------

    /**
     * Get the currency rate between the two given currencies
     * @param {string} from Currency from
     * @param {string} to Currency to
     * @param {string | undefined} date
     * @param {number | undefined} companyId
     * @returns {number|string}
     */
    getCurrencyRate(from, to, date, companyId) {
        const data = this.serverData.batch.get("res.currency.rate", "get_rates_for_spreadsheet", {
            from,
            to,
            date: date ? toServerDateString(date) : undefined,
            company_id: companyId,
        });
        const rate = data !== undefined ? data.rate : undefined;
        if (rate === false) {
            throw new EvaluationError(_t("Currency rate unavailable."));
        }
        return rate;
    }

    /**
     * @param {Currency | undefined} currency
     * @returns {string | undefined}
     */
    computeFormatFromCurrency(currency) {
        if (!currency) {
            return undefined;
        }
        return createCurrencyFormat({
            symbol: currency.symbol,
            position: currency.position,
            decimalPlaces: currency.decimalPlaces,
        });
    }

    /**
     * Returns the default display format of a the company currency
     * @param {number} [companyId]
     * @returns {string | undefined}
     */
    getCompanyCurrencyFormat(companyId) {
        if (!companyId && this.currentCompanyCurrency) {
            return this.computeFormatFromCurrency(this.currentCompanyCurrency);
        }
        const currency = this.serverData.get(
            "res.currency",
            "get_company_currency_for_spreadsheet",
            [companyId]
        );
        if (currency === false) {
            throw new EvaluationError(_t("Currency not available for this company."));
        }
        return this.computeFormatFromCurrency(currency);
    }
}

featurePluginRegistry.add("bagCurrency", CurrencyPlugin);
