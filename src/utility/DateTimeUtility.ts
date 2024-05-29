export function getDateTimeFromString(timeString: string): Date  {
    const timeHourString = timeString.split(":")[0];
    const timeMinuteString = timeString.split(":")[1];
    const timeHour = parseInt(timeHourString);
    const timeMinute = parseInt(timeMinuteString);
    var date = new Date(Date.now());
    date.setHours(timeHour);
    date.setMinutes(timeMinute);
    date.setSeconds(0);

    return date;
}

export function formatDateTimeToString(date: Date): string {
    if (!date) return "";
    return new Date(date).toLocaleTimeString('en-us', { hour: "2-digit", minute: "2-digit"})
  }