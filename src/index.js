import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import ApolloClient from 'apollo-boost';
import gql from "graphql-tag";

const client = new ApolloClient({
    uri: 'http://localhost:5000/<YOUR_TOKEN>'
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

client
  .query({
    query: gql`
      {
        event(id: <EVENT_ID>) {
          name {
              text
              html
          }
        }
      }
    `
  })
  .then(result => console.log(result));
