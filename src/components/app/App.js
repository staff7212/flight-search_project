
import FlightsList from '../flightsList/FlightsList';
import SettingPanel from '../settingPanel/SettingPanel';
import './app.scss';

const App = () => {


  return (
    <div className="app">
      <SettingPanel />
      <FlightsList />
    </div>
  )
};

export default App;