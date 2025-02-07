# Part of Bag. See LICENSE file for full copyright and licensing details.

from bag import fields, models

class ReportProjectTaskUser(models.Model):
    _inherit = 'report.project.task.user'

    user_skill_ids = fields.One2many('hr.employee.skill', related='user_ids.employee_skill_ids', string='Skills')
