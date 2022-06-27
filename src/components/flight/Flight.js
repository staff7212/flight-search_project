
import './flight.scss';

const Flight = ({
  carrier, leg: {
  operatingAirline,
  duration: {hours, minutes},
  transfer, 
  departureAirport,
  departureCity,
  departureDate:  {day:day1, month:month1, time:time1, weekday:weekday1},
  arrivalAirport,
  arrivalCity,
  arrivalDate: {day:day2, month:month2, time:time2, weekday:weekday2},
}}) => {

  const renderTransfer = (transfer) => {
    if (transfer === 0) return null;
    if (transfer === 1) return '1  пересадка';
    if (transfer > 1) return `${transfer} пересадки`;
  }

  return (
    <div className="flight"> 
    <div className="flight-route">
      <div className="flight-route__departure">
        {departureCity}, {departureAirport.caption} <span>({departureAirport.uid})</span>
      </div>

      <div className="flight-route__divider">&rarr;</div>

      <div className="flight-route__arrival">
        {arrivalCity}, {arrivalAirport.caption} <span>({arrivalAirport.uid})</span>
      </div>
    </div>

    <div className="flight-date">
      <div className="flight-date__departure">
        {time1} <span>{day1} {month1} {weekday1}</span>
      </div>

      <div className="flight-date__total-time">
        <div className="icon-clock">&#9200;</div>
        <div className="total-time"> {hours} ч {minutes} мин</div>
      </div>

      <div className="flight-date__arrival">
        <span>{day2} {month2} {weekday2}</span> {time2}
      </div>
    </div>

    <div className="flight-transfer">
      <div className="flight-transfer-divider"></div>
      <div className="flight-transfer__amount">{renderTransfer(transfer)}</div>
    </div>

    <div className="flight-carrier">
      Рейс выполняет: {operatingAirline ? operatingAirline : carrier}
    </div>
  </div>
  )
};

export default Flight;