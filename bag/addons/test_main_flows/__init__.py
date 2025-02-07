# -*- coding: utf-8 -*-
# Part of Bag. See LICENSE file for full copyright and licensing details.
from .models import model_multicompany

#
# Conditional installation of oy modules.
#
# This module is defined in community but some steps (defined with 'edition: "oy"')
# are only used to test oy. As it's not possible to direcly add oy
# modules dependencies, this post install hook will install accounting if exists.
#
def _auto_install_oy_dependencies(env):
    module_list = ['accountant']
    module_ids = env['ir.module.module'].search([('name', 'in', module_list), ('state', '=', 'uninstalled')])
    module_ids.sudo().button_install()
