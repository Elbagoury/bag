# Part of Bag. See LICENSE file for full copyright and licensing details.

from bag import models


class StockRule(models.Model):
    _inherit = 'stock.rule'

    def _prepare_purchase_order(self, company_id, origins, values):
        res = super()._prepare_purchase_order(company_id, origins, values)
        if values[0].get('project_id'):
            res['project_id'] = values[0].get('project_id')
        return res
