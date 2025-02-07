# -*- coding: utf-8 -*-
# Part of Bag. See LICENSE file for full copyright and licensing details.

from bag import fields, models


class UtmCampaign(models.Model):
    _inherit = ['utm.campaign']
    _description = 'UTM Campaign'

    click_count = fields.Integer(string="Number of clicks generated by the campaign", compute="_compute_clicks_count")

    def _compute_clicks_count(self):
        click_data = self.env['link.tracker.click']._read_group(
            [('campaign_id', 'in', self.ids)],
            ['campaign_id'], ['__count'])

        mapped_data = {campaign.id: count for campaign, count in click_data}

        for campaign in self:
            campaign.click_count = mapped_data.get(campaign.id, 0)
