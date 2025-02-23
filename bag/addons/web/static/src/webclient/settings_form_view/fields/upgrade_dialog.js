import { Dialog } from "@web/core/dialog/dialog";
import { useService } from "@web/core/utils/hooks";

import { Component } from "@bag/owl";

export class UpgradeDialog extends Component {
    static template = "web.UpgradeDialog";
    static components = { Dialog };
    static props = {
        close: Function,
    };
    setup() {
        this.orm = useService("orm");
    }
    async _confirmUpgrade() {
        const usersCount = await this.orm.call("res.users", "search_count", [
            [["share", "=", false]],
        ]);
        window.open(
            "https://www.bag.com/bag-oy/upgrade?num_users=" + usersCount,
            "_blank"
        );
        this.props.close();
    }
}
