import Layout from "../components/Layout/Layout";
import "../styles/globals.css";

import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "../reducer";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

export const store = createStore(rootReducer, composeWithDevTools());
function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Toaster />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}
export default App;
