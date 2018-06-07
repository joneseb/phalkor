import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import gql from "graphql-tag";
import { ApolloProvider, Query } from "react-apollo";
import ApolloClient from 'apollo-boost';
import './App.css'

const client = new ApolloClient({
    uri: 'http://localhost:5000/OWDQ2AIMGX6LDXIMH7SY'
});

const Events = () => (
  <Query
      query={gql`
      {
        events {
          id
          name {
            html
          },
          logo {
            url
          }
          start {
            timezone
            local
            utc
          },
          venue {
            id
            name
          },
          category {
            id
            name
          }
        }
      }
  `}
  >
      {({ loading, error, data }) => {
          if (loading) return <p>Falcor is loding stuff...</p>;
          if (error) return <p>Error :(</p>;
          console.log(data.events);
          const eventItems = data.events.map(({id, name, venue, category, start, logo}, i) => {
            var dateObj = new Date(start.local);
            var momentObj = moment(dateObj);
            var momentString = momentObj.format('DD/MM/YYYY');
            return (
              <li key={id}>
              <h4>{name.html}</h4>
              <img src={logo.url} />
              <p>{venue && venue.name}</p>
              <em>{momentString} - {category && category.name}</em>
              </li>
            )
          });
          return (
            <section className="events">
              <h2 className="events-title">Listing {data.events.length} events</h2>
              <ul>
                {eventItems}
              </ul>
            </section>
          )
      }}
  </Query>
);

const App = () => (
  <ApolloProvider client={client}>
      <div>
          <h1>Falcor - Events list</h1>
          <Events />
      </div>
  </ApolloProvider>
);

ReactDOM.render(<App />, document.getElementById("root"));

