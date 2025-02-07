/** @bag-module */

import { registries, EvaluationError } from "@bag/o-spreadsheet";

const LOADING_ERROR = "Loading...";

registries.errorTypes.add(LOADING_ERROR);

/**
 * @param {{ value: unknown }} valueOrError
 * @returns {boolean}
 */
export function isLoadingError(valueOrError) {
    return valueOrError.value === LOADING_ERROR;
}

export class LoadingDataError extends EvaluationError {
    constructor() {
        super("", LOADING_ERROR);
    }
}
