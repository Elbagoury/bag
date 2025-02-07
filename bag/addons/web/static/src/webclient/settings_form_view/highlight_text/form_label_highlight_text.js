import { FormLabel } from "@web/views/form/form_label";
import { HighlightText } from "./highlight_text";
import { upgradeBooleanField } from "../fields/upgrade_boolean_field";

export class FormLabelHighlightText extends FormLabel {
    static template = "web.FormLabelHighlightText";
    static components = { HighlightText };
    setup() {
        super.setup();
        const isOY = bag.info && bag.info.isOY;
        if (this.props.fieldInfo?.field === upgradeBooleanField && !isOY) {
            this.upgradeOY = true;
        }
    }
}
