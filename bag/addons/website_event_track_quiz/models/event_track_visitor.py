# -*- coding: utf-8 -*-
# Part of Bag. See LICENSE file for full copyright and licensing details.

from bag import fields, models


class TrackVisitor(models.Model):
    _name = 'event.track.visitor'
    _inherit = ['event.track.visitor']

    quiz_completed = fields.Boolean('Completed')
    quiz_points = fields.Integer("Quiz Points", default=0)
