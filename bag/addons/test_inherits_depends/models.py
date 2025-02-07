# Part of Bag. See LICENSE file for full copyright and licensing details.

from bag import models, fields


# We add a field on this model
class Unit(models.Model):
    _inherit = 'test.unit'

    second_name = fields.Char()
