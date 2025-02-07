# Part of Bag. See LICENSE file for full copyright and licensing details.

from bag import fields, models


class Website(models.Model):
    _inherit = 'website'

    newsletter_id = fields.Many2one(string="Newsletter List", comodel_name='mailing.list')
