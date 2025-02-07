# -*- coding: ascii -*-
# Part of Bag. See LICENSE file for full copyright and licensing details.

from bag import fields, models


class ReportLayout(models.Model):
    _name = "report.layout"
    _description = 'Report Layout'
    _order = 'sequence'

    view_id = fields.Many2one('ir.ui.view', 'Document Template', required=True)
    image = fields.Char(string="Preview image src")
    pdf = fields.Char(string="Preview pdf src")

    sequence = fields.Integer(default=50)
    name = fields.Char()
