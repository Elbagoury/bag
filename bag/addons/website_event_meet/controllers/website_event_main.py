# -*- coding: utf-8 -*-
# Part of Bag. See LICENSE file for full copyright and licensing details.

from babel.dates import format_datetime

from bag import _
from bag.http import request
from bag.addons.website_event.controllers import main


class WebsiteEventController(main.WebsiteEventController):
    def _prepare_event_register_values(self, event, **post):
        values = super(WebsiteEventController, self)._prepare_event_register_values(event, **post)

        if "from_room_id" in post and not event.is_ongoing:
            meeting_room = request.env["event.meeting.room"].browse(int(post["from_room_id"])).sudo().exists()
            if meeting_room and meeting_room.is_published:
                date_begin = format_datetime(event.date_begin, format="medium", tzinfo=event.date_tz)

                values["toast_message"] = (
                    _('The event %(name)s starts on %(date_begin)s (%(timezone)s).\nJoin us there to chat about "%(subject)s"!',
                    name=event.name, date_begin=date_begin, timezone=event.date_tz, subject=meeting_room.name)
                )

        return values
