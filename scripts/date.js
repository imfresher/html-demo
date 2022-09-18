import moment from 'moment-timezone';

const date = {};

date.timeZone = () => {
  let timeZone = moment.tz.guess();

  return timeZone;
};

date.dateTime = () => moment.tz(date.timeZone()).format();

export default date;
