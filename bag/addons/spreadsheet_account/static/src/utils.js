/** @bag-module **/
// @ts-check

import { helpers } from "@bag/o-spreadsheet";

const { getFunctionsFromTokens } = helpers;

/**
 * @typedef {import("@bag/o-spreadsheet").Token} Token
 * @typedef  {import("@spreadsheet/helpers/bag_functions_helpers").BagFunctionDescription} BagFunctionDescription
 */

/**
 * @param {Token[]} tokens
 * @returns {number}
 */
export function getNumberOfAccountFormulas(tokens) {
    return getFunctionsFromTokens(tokens, ["ODOO.BALANCE", "ODOO.CREDIT", "ODOO.DEBIT"]).length;
}

/**
 * Get the first Account function description of the given formula.
 *
 * @param {Token[]} tokens
 * @returns {BagFunctionDescription | undefined}
 */
export function getFirstAccountFunction(tokens) {
    return getFunctionsFromTokens(tokens, ["ODOO.BALANCE", "ODOO.CREDIT", "ODOO.DEBIT"])[0];
}
