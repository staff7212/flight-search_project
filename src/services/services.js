
const _transformDuration = (num) => {
  const hours = Math.trunc(num / 60) 
  const minutes = num % 60;

  const getZero = (num) => {
    if (num >= 0 && num < 10){
        return `0${num}`;
    } else {
        return num;
    }
  }

  return {hours:getZero(hours), minutes:getZero(minutes)}
};

const _transformDate = (newDate) => {
  const date = new Date(newDate);

  const options = { weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit'};

  const [{value:weekday}, _,
        {value:day}, __, 
        {value:month}, ___, 
        {value:hour}, 
        {value: literal}, 
        {value:minute}] = new Intl.DateTimeFormat('ru-Ru', options).formatToParts(date);

  return {weekday, day, month, time: `${hour}${literal}${minute}`}
};

export const _transformFlights = ({ flight:{carrier, price, legs}, flightToken}) => {
  return {
    flightToken,
    carrier: carrier?.caption,
    price: price.totalFeeAndTaxes.amount.slice(0, -3),
    totalDuration: legs[0].duration + legs[1].duration,
    legOne: {
      operatingAirline: legs[0].segments[0]?.operatingAirline?.caption,
      duration: _transformDuration(legs[0].duration),
      transfer: legs[0].segments.length - 1,
      departureAirport: legs[0].segments[0].departureAirport,
      departureCity: legs[0].segments[0].departureCity?.caption,
      departureDate: _transformDate(legs[0].segments[0].departureDate),
      arrivalAirport: legs[0].segments[legs[0].segments.length - 1].arrivalAirport,
      arrivalCity: legs[0].segments[legs[0].segments.length - 1].arrivalCity?.caption,
      arrivalDate: _transformDate(legs[0].segments[legs[0].segments.length - 1].arrivalDate),
    },
    legTwo: {
      operatingAirline: legs[1].segments[legs[1].segments.length - 1]?.operatingAirline?.caption,
      duration: _transformDuration(legs[1].duration),
      transfer: legs[1].segments.length - 1,
      departureAirport: legs[1].segments[0].departureAirport,
      departureCity: legs[1].segments[0].departureCity?.caption,
      departureDate: _transformDate(legs[1].segments[0].departureDate),

      arrivalAirport: legs[1].segments[legs[1].segments.length - 1].arrivalAirport,
      arrivalCity: legs[1].segments[legs[1].segments.length - 1].arrivalCity?.caption,
      arrivalDate: _transformDate(legs[1].segments[legs[1].segments.length - 1].arrivalDate),
    },
  };
};