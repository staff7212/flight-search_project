
import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";

import { useHttp } from './hooks/http.hook';
import { _transformFlights } from './services/services';

const flightsAdapter = createEntityAdapter({
  selectId: (flight) => flight.flightToken
});

const initialState = flightsAdapter.getInitialState({
  flightsLoadingStatus: 'idle',
  addedFlights: [],
  visibleFlights: [],
  sortFilter: 'max-price',
  transferFilter: [],
  airlinesFilter: [],
  filteredByTransfers: [],
  filteredByAirlines: [],
  amount: {},
})

export const fetchFlights = createAsyncThunk(
  'flights/fetchFlights',
  () => {
    const {request} = useHttp();
    return request(`http://localhost:3001/result`);
  }
);

const flightsSlice = createSlice({
  name: 'flights',
  initialState,
  reducers: {
    addFlights: (state, action) => {
      state.visibleFlights = action.payload;
      state.addedFlights = action.payload;
    },
    setSortFilter: (state, action) => {
      state.sortFilter = action.payload;

      switch (action.payload) {
        case "max-price":
          state.visibleFlights.sort((a, b) => +a.price - +b.price);
          break;
        case "min-price":
          state.visibleFlights.sort((a, b) => +b.price - +a.price);
          break;
        case "time":
          state.visibleFlights.sort((a, b) => a.totalDuration - b.totalDuration);
          break;
        default:;
      }
    },
    onFilters: (state, action) => {
      if (action.payload?.amountFrom || action.payload?.amountTo) {
        state.amount = action.payload;
      }

      if (action.payload.a === 'air') {
        
        action.payload.checked ? state.airlinesFilter.push(action.payload.value)
        : state.airlinesFilter = state.airlinesFilter.filter(elem => elem !== action.payload.value)
        
        state.airlinesFilter.length === 0 ? state.visibleFlights = state.filteredByTransfers
        : state.visibleFlights = state.visibleFlights.filter(elem => {
          return (state.airlinesFilter.includes(elem.carrier));
        })
        state.filteredByAirlines = state.visibleFlights;
      } 

      if (action.payload.a === 'trans') {

        action.payload.checked ? state.transferFilter.push(+action.payload.value)
        : state.transferFilter = state.transferFilter.filter(elem => elem !== +action.payload.value)
        
        state.transferFilter.length === 0 ? state.visibleFlights = state.filteredByAirlines
        : state.visibleFlights = state.visibleFlights.filter(elem => {
          return (state.transferFilter.includes(elem.legOne.transfer) || state.transferFilter.includes(elem.legTwo.transfer));
        })
        state.filteredByTransfers = state.visibleFlights;
      }

      if (state.transferFilter.length === 0 && state.airlinesFilter.length === 0)  {
        state.visibleFlights = state.addedFlights;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlights.pending, state => {
        state.flightsLoadingStatus = 'loading';
      })
      .addCase(fetchFlights.fulfilled, (state, action) => {
        state.flightsLoadingStatus = 'idle';

        state.addedFlights = action.payload.flights.map(_transformFlights).slice(0, 2);
        state.visibleFlights = state.addedFlights;

        flightsAdapter.setMany(state, action.payload.flights.map(_transformFlights))
      })
      .addCase(fetchFlights.rejected, state => {
        state.flightsLoadingStatus = 'error';
      })
      .addDefaultCase(() => {})
  }
});

const { actions, reducer} = flightsSlice;

export default reducer;

export const { addFlights, setSortFilter, onFilters} = actions;

export const {selectAll} = flightsAdapter.getSelectors(state => state.flights);

