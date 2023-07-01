import Layout from "../components/Layout/Layout";
import "../styles/globals.css";

import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "../reducer";
import { Provider } from "react-redux";

const store = createStore(rootReducer, composeWithDevTools());
function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}
export default App;
