# Part of Bag. See LICENSE file for full copyright and licensing details.

from bag import models


class ResGroups(models.Model):
    _name = "res.groups"
    _inherit = ["res.groups", "bus.listener.mixin"]
