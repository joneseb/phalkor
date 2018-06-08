import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import moment from 'moment';
import gql from "graphql-tag";
import { ApolloProvider, Query } from "react-apollo";
import ApolloClient from 'apollo-boost';
import './App.css'

const client = new ApolloClient({
    uri: 'http://localhost:5000/OWDQ2AIMGX6LDXIMH7SY'
});

const Loader = ({location}) => (
  <div>
    <h2 className="events-title">Finding shows in {location}</h2>
    <div class="sk-folding-cube">
      <div class="sk-cube1 sk-cube"></div>
      <div class="sk-cube2 sk-cube"></div>
      <div class="sk-cube4 sk-cube"></div>
      <div class="sk-cube3 sk-cube"></div>
    </div>
  </div>
);

const Events = ({location}) => {
  return (
    <Query
        query={gql`
        {
          events(filters: {
            categories: "103"
            location: "${location}"
          }) {
            id
            url
            description {
              text
              html
            }
            is_free
            name {
              text
            },
            logo {
              url
            },
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
            },
            ticket_classes {
              cost {
                display,
                currency,
                value
              }
            }
          }
        }
    `}
    >
        {({ loading, error, data }) => {
            if (loading) return <Loader location={location} />;
            if (error) return <p>Error :(</p>;

            const eventItems = data.events.map(({id, url, name, venue, category, start, logo, is_free, ticket_classes}, i) => {
              let momentObj = moment(new Date(start.local));
              let momentString = momentObj.format('MMM D');
              let eventCost = 'Free'

              if(!is_free) {
                let orderedTickets = _.orderBy(ticket_classes, ['value'], 'asc');
                if(orderedTickets[0].cost) {
                  eventCost = orderedTickets[0].cost.display;
                }
                if(orderedTickets.length > 1 && orderedTickets[orderedTickets.length-1].cost) {
                  eventCost += ` - ${orderedTickets[orderedTickets.length-1].cost.display}`;
                }
              }

              return (
                <li key={id}>
                  <div className="event-image">
                    <a href={url}><img src={logo && logo.url} alt={name.text} /></a>
                    <div className="event-cost">{eventCost}</div>
                  </div>
                  <h4>{name.text}</h4>
                  <p>{momentString} - {venue && venue.name} </p>
                </li>
              )
            });
            return (
              <section className="events">
                <h2 className="events-title">Found {data.events.length} shows in {location}</h2>
                <ul>
                  {eventItems}
                </ul>
              </section>
            )
        }}
    </Query>
  )
};

class App extends Component {

  constructor(props) {
    super(props);
    this.cityNameRef = React.createRef();
  }

  state =
   {
     location: 'San Francisco',
     loc: 'San Francisco'
  }

  updateLocation = () => {
    let location = this.cityNameRef.current.value;
    if(location && location.length > 0) {
      this.setState({
        location
      });
    }
  }

  updateValue = (e) => {
    let loc = e && e.target ? e.target.value : this.cityNameRef.current.value;
    this.setState({
      loc
    });
  }

  updateInput = (loc) => {
    this.setState({
      loc,
      location: loc
    });
  }

  performSearch = (e) => {
    if(e && e.keyCode === 13) {
      this.updateLocation();
    }
  }

  render() {
    let {location, loc} = this.state;

    return (
      <ApolloProvider client={client}>
          <div>
              <section className="header">
                <ul className="city-list">
                  <li><button className={location === 'San Francisco' ? 'selected' : ''} onClick={() => this.updateInput('San Francisco')}>San Francisco</button></li>
                  <li><button className={location === 'New York' ? 'selected' : ''} onClick={() => this.updateInput('New York')}>New York</button></li>
                  <li><button className={location === 'Miami' ? 'selected' : ''} onClick={() => this.updateInput('Miami')}>Miami</button></li>
                  <li><button className={location === 'Seattle' ? 'selected' : ''} onClick={() => this.updateInput('Seattle')}>Seattle</button></li>
                </ul>
                <h1 className="title">Find shows around the world.</h1>
                <div className="search">
                  <input className="search-city"
                    value={loc}
                    onChange={this.updateValue}
                    onKeyDown={this.performSearch}
                    placeholder="Enter city"
                    type="text"
                    ref={this.cityNameRef}
                  />
                  <button
                    className="search-btn"
                    onClick={this.updateLocation}>
                      Search
                  </button>
                </div>
              </section>
              <Events location={location} />
              <footer className="page-footer">
              <br />
              Team Phalkor ~ MBU Hackathon ~ June 2018<br />
              GraphQL and Apollo powered search sitting over Eventbrite Restful API<br />
              Members: Joe Seifi, Justin Jones, Jeff McKenzie, Ross Chapman, Honorable Mention: Barrett Cook
              </footer>
          </div>
      </ApolloProvider>
    )
  }
};

ReactDOM.render(<App />, document.getElementById("root"));

