/**
 * Interface for calendar event properties
 */
interface CalendarEvent {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  organizer?: {
    name: string;
    email: string;
  };
  attendees?: Array<{
    name: string;
    email: string;
    rsvp?: boolean;
  }>;
  url?: string;
  categories?: string[];
  alarm?: {
    minutesBefore: number;
    action: 'DISPLAY' | 'EMAIL' | 'AUDIO';
  };
}

/**
 * Utility function to escape special characters in iCalendar format
 */
function escapeICalText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n');
}

/**
 * Format date to iCalendar UTC format (YYYYMMDDTHHMMSSZ)
 */
function formatICalDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

/**
 * Generate a unique UID for the event
 */
function generateUID(): string {
  return `${Date.now()}@${Math.random().toString(36).substring(2, 11)}@example.com`;
}

/**
 * Main function to generate iCalendar format for an event
 */
function generateCalendarEvent(event: CalendarEvent, productId: string = '-//MyApp//EN'): string {
  const lines: string[] = [];

  // Calendar header
  lines.push('BEGIN:VCALENDAR');
  lines.push('VERSION:2.0');
  lines.push('PRODID:' + productId);
  lines.push('CALSCALE:GREGORIAN');
  lines.push('METHOD:PUBLISH');

  // Event start
  lines.push('BEGIN:VEVENT');

  // Event properties
  lines.push(`UID:${generateUID()}`);
  lines.push(`DTSTAMP:${formatICalDate(new Date())}`);
  lines.push(`DTSTART:${formatICalDate(event.startDate)}`);
  lines.push(`DTEND:${formatICalDate(event.endDate)}`);
  lines.push(`SUMMARY:${escapeICalText(event.title)}`);

  // Optional properties
  if (event.description) {
    lines.push(`DESCRIPTION:${escapeICalText(event.description)}`);
  }

  if (event.location) {
    lines.push(`LOCATION:${escapeICalText(event.location)}`);
  }

  if (event.url) {
    lines.push(`URL:${event.url}`);
  }

  if (event.organizer) {
    const organizerEmail = `mailto:${event.organizer.email}`;
    lines.push(`ORGANIZER;CN=${escapeICalText(event.organizer.name)}:${organizerEmail}`);
  }

  // Add attendees
  if (event.attendees && event.attendees.length > 0) {
    for (const attendee of event.attendees) {
      const rsvp = attendee.rsvp !== false ? ';RSVP=TRUE' : '';
      const attendeeEmail = `mailto:${attendee.email}`;
      lines.push(`ATTENDEE;CN=${escapeICalText(attendee.name)}${rsvp};ROLE=REQ-PARTICIPANT:${attendeeEmail}`);
    }
  }

  // Add alarm/reminder
  if (event.alarm) {
    lines.push('BEGIN:VALARM');
    lines.push(`ACTION:${event.alarm.action}`);
    lines.push(`TRIGGER:-PT${event.alarm.minutesBefore}M`);
    lines.push(`DESCRIPTION:${escapeICalText(event.title)}`);
    lines.push('END:VALARM');
  }

  // Add categories
  if (event.categories && event.categories.length > 0) {
    lines.push(`CATEGORIES:${event.categories.join(',')}`);
  }

  // Event end
  lines.push('END:VEVENT');
  lines.push('END:VCALENDAR');

  return lines.join('\r\n');
}

/**
 * Helper function to download calendar as .ics file
 */
function downloadCalendarEvent(event: CalendarEvent, filename: string = 'event.ics'): void {
  const icsContent = generateCalendarEvent(event);
  const blob = new Blob([icsContent], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Helper function to export as string (for APIs)
 */
function exportCalendarEventAsString(event: CalendarEvent): string {
  return generateCalendarEvent(event);
}

// Example usage:
const meetingEvent: CalendarEvent = {
  title: 'Q1 Planning Meeting',
  description: 'Quarterly planning and strategy discussion',
  startDate: new Date('2025-02-15T10:00:00'),
  endDate: new Date('2025-02-15T11:30:00'),
  location: 'Conference Room A',
  organizer: {
    name: 'John Doe',
    email: 'john@example.com',
  },
  attendees: [
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      rsvp: true,
    },
    {
      name: 'Bob Johnson',
      email: 'bob@example.com',
    },
  ],
  url: 'https://example.com/meeting/123',
  categories: ['WORK', 'PLANNING'],
  alarm: {
    minutesBefore: 15,
    action: 'DISPLAY',
  },
};


export {
  type CalendarEvent,
  generateCalendarEvent,
  downloadCalendarEvent,
  exportCalendarEventAsString,
};