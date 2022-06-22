import fetchJSON from './functions/fetchJSON';
import MLLApplication from './classes/MLLApplication';

const configFile = 'config_MultiLingualLabels.json';

const init = () => {
  fetchJSON(configFile)
    .then((data) => {
      const app = new MLLApplication(data);
      window.mllApp = app; // exposing the app to the browser console for debugging
    })
    .catch(error => console.log(error));
};

init();
