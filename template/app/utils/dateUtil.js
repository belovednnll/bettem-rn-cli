function DateTime(date) {
  if (arguments.length === 0) this.date = new Date()
  else if (date instanceof Date) this.date = new Date(date)
  else throw Error('Argument must be a date object. ' + date + ' was given')
}

// function handlerDate(date) {
//   let newDate
//   let parts
//   const isoExp = /^\s*(\d{4})-(\d\d)-(\d\d)\s(\d\d):(\d\d):(\d\d)\s*$/;
//   try {
//       parts = isoExp.exec(date);
//   } catch(e) {
//       return null;
//   }
//   if (parts) {
//     newDate = new Date(parts[1], parts[2] - 1, parts[3], parts[4], parts[5], parts[6]);
//   } else {
//       return null;
//   }
//   return newDate;
// }

DateTime.SUNDAY = 0
DateTime.MONDAY = 1
DateTime.TUESDAY = 2
DateTime.WEDNESDAY = 3
DateTime.THURSDAY = 4
DateTime.FRIDAY = 5
DateTime.SATURDAY = 6

DateTime.daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
DateTime.y2kYear = 50
DateTime.monthNumbers = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
}

/**
 * Returns DateTime for given date and time
 * @param year
 * @param month 1-12
 * @param day 1-31
 * @param hours 0-23
 * @param minutes 0-59
 * @param seconds 0-59
 * @returns {DateTime} new DateTime object or throws error
 */
DateTime.fromDateTime = (year, month, day, hours, minutes, seconds) =>
  new DateTime(
    createSafeDate(+year, +month, +day, +hours, +minutes, +seconds || 0)
  )

/**
 * Returns DateTime for given date by setting time to midnight
 * @param year
 * @param month
 * @param day
 * @returns {DateTime} new DateTime object or throws error
 */
DateTime.fromDate = (year, month, day) =>
  DateTime.fromDateTime(year, month, day, 0, 0, 0)

/**
 * Returns DateTime from given Date object
 * @param date
 * @returns {DateTime}
 */
DateTime.fromDateObject = date => new DateTime(date)

/**
 * Returns DateTime from ISO date ignoring time information
 * @param isoDatee String YYYY-MM-DDTHH-MM
 * @return {DateTime}
 */
DateTime.fromIsoDate = isoDatee => {
  const optionalTimePattern = /^\d{4}-[01]\d-[0-3]\d(T[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z?))?$/
  if (!optionalTimePattern.test(isoDatee))
    throw Error(
      isoDatee + ' is not valid ISO Date (YYYY-MM-DD or YYYY-MM-DDTHH:MM)'
    )
  const date = parseDate(isoDatee.split('T')[0])
  return DateTime.fromDate(date.year, date.month, date.day)
}

/**
 * Returns DateTime with time from ISO date
 * @param isoDateTime String YYYY-MM-DDTHH-MM
 * @return {DateTime} Returns DateTime or throws error for invalid syntax
 */
DateTime.fromIsoDateTime = isoDateTime => {
  const fullPatternTest = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z?)/
  if (!fullPatternTest.test(isoDateTime))
    throw Error(isoDateTime + ' is not valid ISO Date (YYYY-MM-DDTHH:MM)')

  const dateAndTime = isoDateTime.split('T')
  const time = parseTime(dateAndTime.length === 2 && dateAndTime[1])
  const date = parseDate(dateAndTime[0])
  return DateTime.fromDateTime(
    date.year,
    date.month,
    date.day,
    time.hours,
    time.minutes,
    time.seconds
  )
}

/**
 * Returns DateTime from current time in milliseconds
 * @param ms
 * @returns {DateTime}
 */
DateTime.fromMillis = ms => new DateTime(new Date(ms))

/**
 * Returns new DateTime with milliseconds set to 0
 */
DateTime.prototype.withResetMS = () => {
  const newDate = this.clone()
  newDate.date.setMilliseconds(0)
  return newDate
}

/**
 * Returns new DateTime with given hours and minutes and 0 milliseconds
 * @param h 0-23
 * @param m 0-59
 */
DateTime.prototype.withTime = (h, m) => {
  const dateWithTime = this.clone()
  dateWithTime.date.setHours(h)
  dateWithTime.date.setMinutes(m)
  dateWithTime.date.setSeconds(0)
  dateWithTime.date.setMilliseconds(0)
  return dateWithTime
}

DateTime.SECOND = 1000
DateTime.MINUTE = 60 * DateTime.SECOND
DateTime.HOUR = 60 * DateTime.MINUTE
DateTime.DAY = 24 * DateTime.HOUR
DateTime.WEEK = 7 * DateTime.DAY

/**
 * Returns new DateTime with current time
 * @returns {DateTime}
 */
DateTime.now = () => new DateTime()

/**
 * Returns new DateTime with current date and midnight time
 */
DateTime.today = () => DateTime.now().getOnlyDate()

/**
 * Returns time in milliseconds
 * @returns {number} milliseconds
 */
DateTime.prototype.getTime = () => this.date.getTime()

/**
 * Returns year
 * @returns {number} year
 */
DateTime.prototype.getFullYear = () => this.date.getFullYear()

/**
 * Returns day of month
 * @returns {number} 1-31
 */
DateTime.prototype.getDate = () => this.date.getDate()

/**
 * Returns month
 * @returns {number} 1-12
 */
DateTime.prototype.getMonth = () => this.date.getMonth() + 1

/**
 * Returns day of week. 0=sunday, 1=monday, ...
 * @returns {number} 0-6
 */
DateTime.prototype.getDay = () => this.date.getDay()

/**
 * Returns hours
 * @returns {number} 0-23
 */
DateTime.prototype.getHours = () => this.date.getHours()

/**
 * Returns minutes
 * @returns {number} 0-59
 */
DateTime.prototype.getMinutes = () => this.date.getMinutes()

/**
 * Returns seconds
 * @returns {number} 0-59
 */
DateTime.prototype.getSeconds = () => this.date.getSeconds()

/**
 * Returns milliseconds
 * @returns {number} 0-999
 */
DateTime.prototype.getMilliseconds = () => this.date.getMilliseconds()

/**
 * Returns days in month for current DateTime
 * @returns {number}
 */
DateTime.prototype.getDaysInMonth = () =>
  DateTime.getDaysInMonth(this.getFullYear(), this.getMonth())

/**
 * Returns days in year for current Date
 * @returns {*}
 */
DateTime.prototype.getDayInYear = () =>
  DateTime.getDayInYear(this.getFullYear(), this.getMonth(), this.getDate())

/**
 * Returns new DateTime with given days later
 * @param days
 * @returns {DateTime}
 */
DateTime.plusDays = days => {
  const newDateTime = DateTime.fromMillis(this.getTime() + days * DateTime.DAY)
  const hours = this.getHours()

  // Fix the DateTime offset caused by daylight saving time
  let delta = hours - newDateTime.getHours()
  if (delta !== 0) {
    // Correct the delta to be between [-12, 12]
    if (delta > 12) {
      delta -= 24
    }
    if (delta < -12) {
      delta += 24
    }
    return DateTime.fromMillis(newDateTime.getTime() + delta * DateTime.HOUR)
  }
  return newDateTime
}

/**
 * Returns new DateTime with given minutes later
 * @param minutes
 * @returns {DateTime}
 */
DateTime.prototype.plusMinutes = minutes =>
  DateTime.fromMillis(this.clone().getTime() + minutes * DateTime.MINUTE)

/**
 * Returns new DateTime with given minutes earlier
 * @param minutes
 * @returns {DateTime}
 */
DateTime.prototype.minusMinutes = minutes => this.plusMinutes(-minutes)

/**
 * Returns new DateTime with given days earlier
 * @param days
 * @returns {DateTime}
 */
DateTime.prototype.minusDays = days => this.plusDays(-days)

/**
 * Compares DateTimes. Examples:
 * earlier.compareTo(later)) < 0
 * later.compareTo(earlier)) > 0
 * later.compareTo(later)) == 0
 * @param date {DateTime}
 * @returns {number}
 */
DateTime.prototype.compareTo = function(date) {
  if (!date) {
    return 1
  }
  const diff = this.getTime() - date.getTime()
  return diff === 0 ? 0 : diff / Math.abs(diff)
}

/**
 * Returns true if DateTime is within today
 */
DateTime.prototype.isToday = () => this.equalsOnlyDate(DateTime.today())

/**
 * Returns the week number of current DateTime
 * @param {string} weekNumberingSystem US or ISO
 * @returns {number}
 */
DateTime.prototype.getWeekInYear = weekNumberingSystem => {
  if (weekNumberingSystem !== 'US' && weekNumberingSystem !== 'ISO') {
    throw new Error(
      'Week numbering system must be either US or ISO, was ' +
        weekNumberingSystem
    )
  }

  let firstDay = new Date(this.getFullYear(), 0, 1).getDay()
  if (weekNumberingSystem === 'US') {
    return Math.ceil((this.getDayInYear() + firstDay) / 7)
  }
  const THU = 4
  let weekday = this.getDay()
  if (weekday === 0) weekday = 7
  if (firstDay === 0) firstDay = 7
  // If Dec 29 falls on Mon, Dec 30 on Mon or Tue, Dec 31 on Mon - Wed, it's on the first week of next year
  if (
    this.getMonth() === 12 &&
    this.getDate() >= 29 &&
    this.getDate() - weekday > 27
  ) {
    return 1
  }
  // If Jan 1-3 falls on Fri, Sat or Sun, it's on the last week of the previous year
  if (this.getMonth() === 1 && this.getDate() < 4 && weekday > THU) {
    return new DateTime(new Date(this.getFullYear() - 1, 11, 31)).getWeekInYear(
      'ISO'
    )
  }
  let week = Math.ceil((this.getDayInYear() + firstDay - 1) / 7)
  // If first days of this year are on last year's last week, the above gives one week too much
  if (firstDay > THU) week -= 1
  return week
}

/**
 * Creates clone of current DateTime
 * @returns {DateTime}
 */
DateTime.prototype.clone = () => new DateTime(this.date)

/**
 * Returs true if month is odd, ie. january=true
 * @returns {boolean}
 */
DateTime.prototype.isOddMonth = () => this.getMonth() % 2 === 0

/**
 * Returns true if given DateTime has same day as current DateTime
 * @param date
 * @returns {boolean}
 */
DateTime.prototype.equalsOnlyDate = date => {
  if (!date) return false
  return (
    this.getMonth() === date.getMonth() &&
    this.getDate() === date.getDate() &&
    this.getFullYear() === date.getFullYear()
  )
}

/**
 * Returns first date of month from current date
 * @returns {DateTime}
 */
DateTime.prototype.firstDateOfMonth = () =>
  DateTime.fromDate(this.date.getFullYear(), this.date.getMonth() + 1, 1)

/**
 * Returns last date of month from current date
 * @returns {DateTime}
 */
DateTime.prototype.lastDateOfMonth = () =>
  DateTime.fromDate(this.getFullYear(), this.getMonth(), this.getDaysInMonth())

/**
 * Returns number of days between current and given date
 * @param date
 * @returns {number}
 */
DateTime.prototype.distanceInDays = date => {
  const first = parseInt(this.getTime() / DateTime.DAY, 10)
  const last = parseInt(date.getTime() / DateTime.DAY, 10)
  return last - first
}

/**
 * Returns new DateTime from same week with given weekDay
 * @param weekday 0=sunday, 1=monday, ...
 * @returns {DateTime}
 */
DateTime.prototype.withWeekday = weekday =>
  this.plusDays(weekday - this.getDay())

/**
 * Returns new DateTime with midnight time
 * @returns {DateTime}
 */
DateTime.prototype.getOnlyDate = () =>
  DateTime.fromDate(
    this.date.getFullYear(),
    this.date.getMonth(),
    this.date.getDate()
  )

/**
 * Returns true if date is in weekend
 * @returns {boolean}
 */
DateTime.prototype.isWeekend = () => this.getDay() === 6 || this.getDay() === 0

/**
 * Returns default string representation
 */
DateTime.prototype.toString = () => this.toISOString()

/**
 * Returns first date from same week
 * @param locale Based on locale it can be a monday or a sunday
 * @returns {DateTime}
 */
DateTime.prototype.getFirstDateOfWeek = locale => {
  const firstWeekday = locale ? locale.firstWeekday : DateTime.MONDAY
  if (firstWeekday === this.getDay) return this.clone()
  return this.plusDays(
    firstWeekday - this.getDay() - (firstWeekday > this.getDay() ? 7 : 0)
  )
}

/**
 * Returns ISO DateTime string: YYYY-MM-DDT:HH:MM:SS
 * @returns {string}
 */
DateTime.prototype.toISOString = () =>
  isoDate.call(this) + 'T' + isoTime.call(this)

/**
 * Returns ISO Date string: YYYY-MM-DD
 */
DateTime.prototype.toISODateString = () => isoDate.call(this)

/**
 * Returns true if current DateTime is between start and end DateTimes
 * @param {DateTime} start
 * @param {DateTime} end
 * @returns {boolean}
 */
DateTime.prototype.isBetweenDates = (start, end) => {
  if (start.getTime() > end.getTime())
    throw Error("start date can't be after end date")
  const onlyDate = this.getOnlyDate()
  return (
    onlyDate.compareTo(start.getOnlyDate()) >= 0 &&
    onlyDate.compareTo(end.getOnlyDate()) <= 0
  )
}

/**
 * Returns number of days for given month
 * @param {Number} year Year of month
 * @param {Number} month Number of month (1-12)
 * @returns {Number} [28-31]
 */
DateTime.getDaysInMonth = (year, month) => {
  if (month > 12 || month < 1) throw new Error('Month must be between 1-12')
  const yearAndMonth = year * 12 + month
  return DateTime.fromDate(
    Math.floor(yearAndMonth / 12),
    yearAndMonth % 12 + 1,
    1
  )
    .minusDays(1)
    .getDate()
}

/**
 * Returns index of given day from beginning of year
 * @param year year
 * @param month month
 * @param day day
 * @returns {Number} index number starting grom beginning of year
 */
DateTime.getDayInYear = (year, month, day) =>
  DateTime.fromDate(year, 1, 1).distanceInDays(
    DateTime.fromDate(year, month, day)
  ) + 1

function isoDate() {
  return (
    this.getFullYear() +
    '-' +
    twoDigits(this.getMonth()) +
    '-' +
    twoDigits(this.getDate())
  )
}

function isoTime() {
  return (
    twoDigits(this.getHours()) +
    ':' +
    twoDigits(this.getMinutes()) +
    ':' +
    twoDigits(this.getSeconds())
  )
}

function twoDigits(value) {
  return value < 10 ? '0' + value : '' + value
}

function createSafeDate(year, month, date, hourss, minutess, secondss) {
  const hours = hourss || 0
  const minutes = minutess || 0
  const seconds = secondss || 0
  const newDate = new Date(year, month - 1, date, hours, minutes, seconds, 0)
  if (
    newDate.toString() === 'Invalid Date' ||
    month !== newDate.getMonth() + 1 ||
    year !== newDate.getFullYear() ||
    date !== newDate.getDate() ||
    hours !== newDate.getHours() ||
    minutes !== newDate.getMinutes() ||
    seconds !== newDate.getSeconds()
  )
    throw Error(
      'Invalid Date: ' +
        year +
        '-' +
        month +
        '-' +
        date +
        ' ' +
        hours +
        ':' +
        minutes +
        ':' +
        seconds
    )
  return newDate
}

function parseDate(str) {
  const dateComponents = str.split('-')
  return {
    year: +dateComponents[0],
    month: +dateComponents[1],
    day: +dateComponents[2],
  }
}

function parseTime(str) {
  if (str) {
    const timeComponents = str.split(':')
    return {
      hours: +timeComponents[0],
      minutes: +timeComponents[1],
      seconds: +timeComponents[2] || 0,
    }
  }
  return { hours: 0, minutes: 0 }
}

module.exports = DateTime
