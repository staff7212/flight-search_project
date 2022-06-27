
import Flight from '../flight/Flight';
import './flightsItem.scss';

const FlightsItem = ({price, carrier, legOne, legTwo}) => {
  return (
    <div className="flights-item">
      <div className="flights-item__header">
        <div className="logo">
          <img src="" alt="logo" />
        </div>
        <div className="flights-item__price">
          <div className="flights-item__price__sum">{price} &#8381;</div>
          <div className="flights-item__price__title">Стоимость для одного взрослого пассажира</div>
        </div>
      </div>

      <Flight carrier={carrier} leg={legOne}/>

      <div className="flights-item__divider"></div>
      
      <Flight carrier={carrier} leg={legTwo}/>

      <button className="flights-item__btn">Выбрать</button>
    </div>
  )
};

export default FlightsItem;