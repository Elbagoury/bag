# -*- coding: utf-8 -*-
# Part of Bag. See LICENSE file for full copyright and licensing details.

from bag import fields, models


class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    stock_move_sms_validation = fields.Boolean(
        related='company_id.stock_move_sms_validation',
        string='SMS Validation with stock move', readonly=False)
    stock_sms_confirmation_template_id = fields.Many2one(
        related='company_id.stock_sms_confirmation_template_id', readonly=False)
