# Part of Bag. See LICENSE file for full copyright and licensing details.

from bag.tests.common import TransactionCase


class TestHrScenario(TransactionCase):

    def test_load_scenario(self):
        self.env['hr.employee']._load_scenario()
