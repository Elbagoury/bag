# -*- coding: utf-8 -*-
# Part of Bag. See LICENSE file for full copyright and licensing details.

from . import models
from . import report


def _pos_sale_post_init(env):
    env['pos.config']._ensure_downpayment_product()
