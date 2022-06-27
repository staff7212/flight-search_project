
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { store } from '../../store';
import { selectAll } from '../../flightsSlice';
import { fetchFlights, addFlights, setSortFilter } from '../../flightsSlice';
import FlightsItem from '../flightsItem/FlighstItem';

import './flightsList.scss';

const FlightsList = () => {

  const [offset, setOffset] = useState(2);
  const allFlights = selectAll(store.getState());
  const dispatch = useDispatch();
  const {flightsLoadingStatus, visibleFlights, sortFilter, amount} = useSelector(state => state.flights);
  
  useEffect(() => {
    dispatch(fetchFlights());
  }, [])

  useEffect(() => {
    dispatch(addFlights(allFlights.slice(0, offset)))
  }, [offset])

  useEffect(() => {
    dispatch(setSortFilter(sortFilter))
  }, [visibleFlights])

  if (flightsLoadingStatus === "loading") {
    return <h2>Loading......</h2>;
  } else if (flightsLoadingStatus === "error") {
    return <h2>Error!!!</h2>
  }
  
  const onFilteredPrice = (arr, amount) => {
    let Arr = [];

    if (amount.amountFrom === '' && amount.amountTo === '') {
      return arr;
    }
    if (amount.amountFrom >= 0 && amount.amountTo > 0 ) {
      Arr = arr.filter(item => +item.price >= amount.amountFrom && +item.price <= amount.amountTo);
      return Arr;
    }
    if (amount.amountFrom >= 0) {
      Arr = arr.filter(item => +item.price >= amount.amountFrom)
    }
    if (amount.amountTo > 0) {
      Arr = arr.filter(item => +item.price <= amount.amountTo)
    }
    return Arr
  }

  const onOffsetsChanged = () => {
    setOffset(offset => offset + 2);
  }
  
  const renderFlightList = (arr) => {
    if (arr.length === 0) return <h2>Таких рейсов нет</h2>
    
    return arr.map(({flightToken, ...props}) => {
      return <FlightsItem key={flightToken} {...props}/>
    });
  }
  
  const flightsArr = onFilteredPrice(visibleFlights, amount);
  const elements = renderFlightList(flightsArr); 
  return (
    <div className="flights-list">

      {elements}
      <button onClick={onOffsetsChanged} className="flights-list__btn">Показать ещё</button>
    </div>
  )
};

export default FlightsList;