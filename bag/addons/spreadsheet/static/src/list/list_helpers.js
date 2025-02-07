/** @bag-module */
// @ts-check

import { helpers } from "@bag/o-spreadsheet";

const { getFunctionsFromTokens } = helpers;

/** @typedef {import("@bag/o-spreadsheet").Token} Token */

/**
 * Parse a spreadsheet formula and detect the number of LIST functions that are
 * present in the given formula.
 *
 * @param {Token[]} tokens
 *
 * @returns {number}
 */
export function getNumberOfListFormulas(tokens) {
    return getFunctionsFromTokens(tokens, ["ODOO.LIST", "ODOO.LIST.HEADER"]).length;
}

/**
 * Get the first List function description of the given formula.
 *
 * @param {Token[]} tokens
 *
 * @returns {import("../helpers/bag_functions_helpers").BagFunctionDescription|undefined}
 */
export function getFirstListFunction(tokens) {
    return getFunctionsFromTokens(tokens, ["ODOO.LIST", "ODOO.LIST.HEADER"])[0];
}
