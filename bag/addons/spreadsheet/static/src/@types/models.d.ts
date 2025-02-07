declare module "@spreadsheet" {
    import { Model } from "@bag/o-spreadsheet";

    export interface BagSpreadsheetModel extends Model {
        getters: BagGetters;
        dispatch: BagDispatch;
    }

    export interface BagSpreadsheetModelConstructor {
        new (
            data: object,
            config: Partial<Model["config"]>,
            revisions: object[]
        ): BagSpreadsheetModel;
    }
}
