# -*- coding: utf-8 -*-
# Part of Bag. See LICENSE file for full copyright and licensing details.

import bag.tests
from bag.addons.pos_self_order.tests.self_order_common_test import SelfOrderCommonTest
from bag import Command


@bag.tests.tagged("post_install", "-at_install")
class TestSelfOrderKiosk(SelfOrderCommonTest):
    def test_self_order_kiosk(self):
        self.pos_config.write({
            'takeaway': True,
            'self_ordering_takeaway': True,
            'self_ordering_mode': 'kiosk',
            'self_ordering_pay_after': 'each',
            'self_ordering_service_mode': 'table',
        })

        self.pos_config.with_user(self.pos_user).open_ui()
        self.pos_config.current_session_id.set_opening_control(0, "")
        self_route = self.pos_config._get_self_order_route()

        # Kiosk, each, table
        self.start_tour(self_route, "self_kiosk_each_table_takeaway_in")
        self.start_tour(self_route, "self_kiosk_each_table_takeaway_out")

        self.pos_config.write({
            'self_ordering_service_mode': 'counter',
        })

        # Kiosk, each, counter
        self.start_tour(self_route, "self_kiosk_each_counter_takeaway_in")
        self.start_tour(self_route, "self_kiosk_each_counter_takeaway_out")

        # Cancel behavior
        self.start_tour(self_route, "self_order_kiosk_cancel")

    def test_duplicate_order_kiosk(self):
        self.pos_config.write({
            'self_ordering_takeaway': False,
            'self_ordering_mode': 'kiosk',
            'self_ordering_pay_after': 'each',
        })
        self.pos_config.with_user(self.pos_user).open_ui()
        self.pos_config.current_session_id.set_opening_control(0, "")
        self_route = self.pos_config._get_self_order_route()
        self.start_tour(self_route, "self_simple_order")
        orders = self.env['pos.order'].search(['&', ('state', '=', 'draft'), '|', ('config_id', '=', self.pos_config.id), ('config_id', 'in', self.pos_config.trusted_config_ids.ids)])
        self.assertEqual(len(orders), 1)

    def test_order_price_null(self):
        self.cola.list_price = 0.00
        self.pos_config.write({
            'self_ordering_takeaway': False,
            'self_ordering_mode': 'kiosk',
            'self_ordering_pay_after': 'each',
        })

        self.pos_config.with_user(self.pos_user).open_ui()
        self.pos_config.current_session_id.set_opening_control(0, "")
        self_route = self.pos_config._get_self_order_route()
        self.start_tour(self_route, "self_order_price_null")

    def test_self_order_language_changes(self):
        self.env['res.lang']._activate_lang('fr_FR')
        self.pos_config.write({
            'self_ordering_available_language_ids': [Command.link(lang.id) for lang in self.env['res.lang'].search([])],
            'self_ordering_takeaway': False,
            'self_ordering_mode': 'kiosk',
            'self_ordering_pay_after': 'each'
        })

        self.pos_config.with_user(self.pos_user).open_ui()
        self_route = self.pos_config._get_self_order_route()
        self.start_tour(self_route, "self_order_language_changes")
