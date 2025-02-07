# Part of Bag. See LICENSE file for full copyright and licensing details.

from bag import fields, models


class PickingType(models.Model):
    _inherit = 'stock.picking.type'

    analytic_costs = fields.Boolean(help="Validating stock pickings will generate analytic entries for the selected project. Products set for re-invoicing will also be billed to the customer.")
