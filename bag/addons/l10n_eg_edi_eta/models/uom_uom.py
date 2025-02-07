# -*- coding: utf-8 -*-
# Part of Bag. See LICENSE file for full copyright and licensing details.

from bag import models, fields


class UomCode(models.Model):
    _name = 'l10n_eg_edi.uom.code'
    _description = 'ETA code for the unit of measures'

    name = fields.Char(required=True, translate=True)
    code = fields.Char(required=True)


class UomUom(models.Model):
    _inherit = 'uom.uom'

    l10n_eg_unit_code_id = fields.Many2one('l10n_eg_edi.uom.code', string='ETA Unit Code',
                                           help='This is the type of unit according to egyptian tax authority')
