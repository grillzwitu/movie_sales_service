// app/client-wrapper.js
'use client'

import { Provider } from 'react-redux';
import store from '@store';

function ClientWrapper({ children }) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}

export default ClientWrapper;
