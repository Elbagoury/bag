# Part of Bag. See LICENSE file for full copyright and licensing details.

from bag import fields, models

class ProjectTask(models.Model):
    _inherit = "project.task"

    user_skill_ids = fields.One2many('hr.employee.skill', related='user_ids.employee_skill_ids')
