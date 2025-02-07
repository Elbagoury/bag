# -*- coding: utf-8 -*-
# Part of Bag. See LICENSE file for full copyright and licensing details.

import bag


def db_list(force=False, host=None):
    return []

bag.http.db_list = db_list
