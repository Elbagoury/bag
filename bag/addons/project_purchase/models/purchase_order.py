# Part of Bag. See LICENSE file for full copyright and licensing details.

from bag import fields, models


class PurchaseOrder(models.Model):
    _inherit = 'purchase.order'

    project_id = fields.Many2one('project.project')
