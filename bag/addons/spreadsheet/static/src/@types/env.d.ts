import { SpreadsheetChildEnv as SSChildEnv } from "@bag/o-spreadsheet";
import { Services } from "services";

declare module "@spreadsheet" {
    import { Model } from "@bag/o-spreadsheet";

    export interface SpreadsheetChildEnv extends SSChildEnv {
        model: BagSpreadsheetModel;
        services: Services;
    }
}
