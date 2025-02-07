# Part of Bag. See LICENSE file for full copyright and licensing details.

from bag import api, models


class ProductComboItem(models.Model):
    _name = 'product.combo.item'
    _inherit = ['product.combo.item', 'pos.load.mixin']

    @api.model
    def _load_pos_data_domain(self, data):
        return [('id', 'in', list(set().union(*[combo.get('combo_item_ids') for combo in data['product.combo']['data']])))]

    @api.model
    def _load_pos_data_fields(self, config_id):
        return ['id', 'combo_id', 'product_id', 'extra_price']
