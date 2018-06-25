const _millisecond = 1;
const _second = 1000;
const _minute = 60 * _second;
const _hour = 60 * _minute;
const _day = 24 * _hour;
const _week = 7 * _day;
const _month = (52 / 12) * _week;
const _year = 12 * _month;

module.exports = {
    Millisecond: _millisecond,
    Second: _second,
    Minute: _minute,
    Hour: _hour,
    Day: _day,
    Week: _week,
    Month: _month,
    Year: _year
};