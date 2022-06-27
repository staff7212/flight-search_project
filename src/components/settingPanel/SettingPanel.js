
import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSortFilter, onFilters, priceFilter} from '../../flightsSlice';

import './settingPanel.scss';

const SettingPanel = () => {

  const [sort, setSort] = useState('max-price');
  const [amountFrom, setAmountFrom] = useState(0);
  const [amountTo, setAmountTo] = useState(1000000);

  const {  addedFlights } = useSelector(state => state.flights)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSortFilter(sort));
  }, [sort])

  const onChangeSort = e => {
    setSort(e.target.value)
  };

  const onChangeAmountFrom = e => {
    setAmountFrom(e.target.value);
  };

  const onChangeAmountTo = e => {
    setAmountTo(e.target.value);
  };

  const amount = useMemo(() => {
    return {amountFrom, amountTo}
  }, [amountFrom, amountTo])

  useEffect(() => {
    dispatch(onFilters(amount));
  }, [amountFrom, amountTo]);

  const onChangeTransferFilter = ({target: {value, checked}}) => {
    const a = 'trans';
    if (!checked) {
      dispatch(onFilters({value, checked, a}));
      return;
    } 
    dispatch(onFilters({value, checked, a}));
  };

  const onChangeAirlinesFilter = ({target: {value, checked}}) => {
    const a = 'air';
    if (!checked) {
      dispatch(onFilters({value, checked, a}));
      return;
    } 
    dispatch(onFilters({value, checked, a}));
  };

  // получение фильтров с пересадками
  const _getTransferFilters = () => {
    const transfersArr = addedFlights.map(item => {
      return [item.legOne.transfer, item.legTwo.transfer];
    });
    const transfers = Array.from(new Set(transfersArr.flat()));

    const filterItems = transfers.map((item, index) => {
      switch (true) {
        case (item === 0):
          return (
            <div key={index}>
              <input  type="checkbox" id="filterChoice0"
              name="filter" value={item} onChange={onChangeTransferFilter} />
              <label htmlFor="filterChoice0"> - без пересадок</label>
            </div>);
        case (item === 1):
          return (
            <div key={index}>
              <input type="checkbox" id="filterChoice1"
              name="filter" value={item} onChange={onChangeTransferFilter} />
              <label htmlFor="filterChoice1"> - 1 пересадка</label>
            </div>);
        case (item > 1):
          return (
            <div key={index}>
              <input type="checkbox" id={`filterChoice${index}`}
              name="filter" value={item} onChange={onChangeTransferFilter} />
              <label htmlFor={`filterChoice${index}`}> - ${item} пересадки</label>
            </div>);
        default: ;
      }
    });
    return filterItems;
  }

  // получение фильтров с авиалиниями
  const _getAirlinesFilters = () => {
    const airlinesArr = addedFlights.map(({carrier, price}) => {
      return {carrier, price};
    });

    let airlines  = airlinesArr.sort((a, b) => +b.price - +a.price);
    airlines = Object.values(airlines.reduce((acc,cur)=>Object.assign(acc,{[cur.carrier]:cur}),{}))
    airlines = airlines.sort((a, b) => +a.price - +b.price );

    const airlinesItems = airlines.map(({carrier, price}, index) => {
      return (
        <div key={index} className="airlines__row">
          <input type="checkbox" name="" id={`airlines__row_${index}`} value={carrier} onChange={onChangeAirlinesFilter} />
          <label htmlFor={`airlines__row_${index}`}> - {carrier.length > 22 ? `${carrier.slice(0, 21)}...` : carrier} </label>
          <span className="airlines__row__price"> от {price} р.</span>
        </div>
      )
    })
    return airlinesItems;
  }

  const transferFilterItems = _getTransferFilters();
  const airlinesFilterItems = _getAirlinesFilters();

  return (
    <div className="setting-panel">
      <div className="setting-panel__wrapper">
        <div className="sort">
          <div className="setting__titles sort__title">Сортировать</div>

          <div>
            <input type="radio" id="sortChoice1" defaultChecked
            name="sort" value="max-price" onChange={onChangeSort} />
            <label htmlFor="sortChoice1"> - по возрастанию цены</label>
          </div>

          <div>
            <input type="radio" id="sortChoice2"
            name="sort" value="min-price" onChange={onChangeSort} />
            <label htmlFor="sortChoice2"> - по убыванию цены</label>
          </div>

          <div>
            <input type="radio" id="sortChoice3"
            name="sort" value="time" onChange={onChangeSort} />
            <label htmlFor="sortChoice3"> - по времени в пути</label>
          </div>
        </div>

        <div className="filter">
          <div className="setting__titles filter__title">Фильтровать</div>
          {transferFilterItems}
        </div>

        <div className="price">
          <div className="setting__titles price__title">Цена</div>

          <div>
            <label htmlFor="from">От </label>
            <input type="number"id="from" placeholder='0'
            name="price" value={amountFrom} onChange={onChangeAmountFrom} />
          </div>

          <div>
            <label htmlFor="to">До </label>
            <input type="number" id="to" placeholder='1000000'
            name="price" value={amountTo} onChange={onChangeAmountTo} />
          </div>
        </div>

        <div className="airlines">
          <div className="setting__titles airlines__title">Авиакомпании</div>
          {airlinesFilterItems}
        </div>
      </div>
    </div>
  )
};

export default SettingPanel;