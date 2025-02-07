# -*- coding: utf-8 -*-
# Part of Bag. See LICENSE file for full copyright and licensing details.

from bag import models


class Partner(models.Model):
    _inherit = 'res.partner'
    _mailing_enabled = True
