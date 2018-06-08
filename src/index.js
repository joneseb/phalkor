import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import gql from "graphql-tag";
import { ApolloProvider, Query } from "react-apollo";
import ApolloClient from 'apollo-boost';
import './App.css'

const client = new ApolloClient({
    uri: 'http://localhost:5000/OWDQ2AIMGX6LDXIMH7SY'
});

const Events = ({location}) => {
  return (
    <Query
        query={gql`
        {
          events(filters:{
            categories: "103"
            location: "${location}"
          }) {
            id
            url
            name {
              text
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
            if (loading) return <h2 className="events-title">Finding shows in {location} ...</h2>;
            if (error) return <p>Error :(</p>;

            const eventItems = data.events.map(({id, url, name, venue, category, start, logo}, i) => {
              var dateObj = new Date(start.local);
              var momentObj = moment(dateObj);
              var momentString = momentObj.format('MMM D');
              return (
                <li key={id}>
                  <a href={url}><img src={logo && logo.url} /></a>
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
              <footer>
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

