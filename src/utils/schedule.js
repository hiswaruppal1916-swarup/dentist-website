export const CLOSED_DAYS = [1, 5]; // 1 = Monday, 5 = Friday

export const DEFAULT_SCHEDULE = {
  slotDurationMinutes: 30,
  minNoticeMinutes: 30,
  morningStart: '08:00',
  morningEnd: '12:00',
  eveningStart: '16:00',
  eveningEnd: '20:00'
};

// Check if a given Date or YYYY-MM-DD string is a closed day
export function isClinicClosedOnDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const dow = d.getDay();
  return CLOSED_DAYS.includes(dow);
}

// Generate all standard 30-min slots for open days
export function generateDaySlots(morningStart = '08:00', morningEnd = '12:00', eveningStart = '16:00', eveningEnd = '20:00', slotDuration = 30) {
  const slots = [];

  function addRange(startStr, endStr, period) {
    const [sH, sM] = startStr.split(':').map(Number);
    const [eH, eM] = endStr.split(':').map(Number);
    
    let currentMin = sH * 60 + sM;
    const endMin = eH * 60 + eM;

    while (currentMin < endMin) {
      const h = Math.floor(currentMin / 60);
      const m = currentMin % 60;
      const time24 = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      
      // Format 12hr display
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 === 0 ? 12 : h % 12;
      const label = `${h12}:${String(m).padStart(2, '0')} ${ampm}`;

      slots.push({
        time: time24,
        label: label,
        period: period
      });

      currentMin += slotDuration;
    }
  }

  addRange(morningStart, morningEnd, 'Morning');
  addRange(eveningStart, eveningEnd, 'Evening');

  return slots;
}

// Filter slots based on existing bookings and same-day notice
export function getAvailableSlots(dateStr, bookedTimes = [], config = DEFAULT_SCHEDULE) {
  if (isClinicClosedOnDate(dateStr)) {
    return [];
  }

  const allSlots = generateDaySlots(
    config.morningStart || '08:00',
    config.morningEnd || '12:00',
    config.eveningStart || '16:00',
    config.eveningEnd || '20:00',
    config.slotDurationMinutes || 30
  );

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const isToday = dateStr === todayStr;

  // Normalized booked times (HH:MM)
  const bookedSet = new Set(bookedTimes.map(t => t.substring(0, 5)));

  return allSlots.map(slot => {
    let isAvailable = true;
    let disabledReason = '';

    // Check if already booked
    if (bookedSet.has(slot.time)) {
      isAvailable = false;
      disabledReason = 'Booked';
    }

    // Check same-day past time + notice
    if (isToday) {
      const [sH, sM] = slot.time.split(':').map(Number);
      const slotDate = new Date();
      slotDate.setHours(sH, sM, 0, 0);

      const cutoffTime = new Date(now.getTime() + (config.minNoticeMinutes || 30) * 60 * 1000);
      if (slotDate < cutoffTime) {
        isAvailable = false;
        disabledReason = 'Passed / Notice Required';
      }
    }

    return {
      ...slot,
      isAvailable,
      disabledReason
    };
  });
}

// Format Date for patient display
export function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Convert 24hr string to 12hr
export function formatDisplayTime(timeStr) {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  const h = Number(parts[0]);
  const m = parts[1] || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m} ${ampm}`;
}
