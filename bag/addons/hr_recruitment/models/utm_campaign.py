# -*- coding:utf-8 -*-
# Part of Bag. See LICENSE file for full copyright and licensing details.

from bag import _, api, models

from bag.exceptions import UserError


class UtmCampaign(models.Model):
    _inherit = 'utm.campaign'

    @api.ondelete(at_uninstall=False)
    def _unlink_except_utm_campaign_job(self):
        utm_campaign_job = self.env.ref('hr_recruitment.utm_campaign_job', raise_if_not_found=False)
        if utm_campaign_job and utm_campaign_job in self:
            raise UserError(_(
                "The UTM campaign '%s' cannot be deleted as it is used in the recruitment process.",
                utm_campaign_job.name
            ))
