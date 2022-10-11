import moment from 'moment'
export const formatDuration = (value, baseUnit) => {
    const duration = moment.duration(toMillis(value, baseUnit));
    return `${Math.floor(duration.asDays())}d ${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`;
  };

export const toMillis = (value, baseUnit) => {
	switch (baseUnit) {
		case "nanoseconds":
			return value / 1000000;
		case "microseconds":
			return value / 1000;
		case "milliseconds":
			return value;
		case "seconds":
		default:
			return value * 1000;
	}
};

export default formatDuration;