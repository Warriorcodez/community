import axios from 'axios';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card } from 'material-ui';
import { addEvents, setCurrentEvent, toggleEventDetails, setCurrentEventParticipants, disableButton } from '../actions';
import Header from '../components/Header';
import ProfileGrid from '../components/ProfileGrid';
import EventDetails from '../components/EventDetails';
import React, { Component } from 'react';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pastEvents: [],
      upcomingEvents: [],
    };
  }

  componentWillMount() {
    axios.get('/api/retrieveUserEvents')
    .then((res) => {
      let parsed = res.data.map(entry => entry.event);
      let now = new Date();
      let upcoming = [];
      let past = [];
      parsed.forEach(entry => {
        let eventTime = new Date(entry.time);
        if (eventTime.getTime() > now.getTime()) {
          upcoming.push(entry);
        } else { past.push(entry); }
      });
      this.setState({
        pastEvents: past,
        upcomingEvents: upcoming,
      });
    });
  }

  render() {
    return (
      <div>
        <Header header={this.props.header}/>
        <Card style={styles.container} >
          <div style={styles.welcome} >Welcome, {JSON.parse(window.user).first}</div>
          <h3 style={styles.heading} >Upcoming Events:</h3>
          <ProfileGrid events={this.state.upcomingEvents}
            setCurrentEvent={this.props.setCurrentEvent}
            eventDetails={this.props.eventDetails}
            toggleEventDetails={this.props.toggleEventDetails}
            disableButton={this.props.disableButton}
            setCurrentEventParticipants={this.props.setCurrentEventParticipants}
          />
          <br />
          <h3 style={styles.heading} >Past Events:</h3>
          <ProfileGrid events={this.state.pastEvents}
            setCurrentEvent={this.props.setCurrentEvent}
            eventDetails={this.props.eventDetails}
            toggleEventDetails={this.props.toggleEventDetails}
            disableButton={this.props.disableButton}
            setCurrentEventParticipants={this.props.setCurrentEventParticipants}
          />
        </Card>
        <EventDetails
          toggleEventDetails={this.props.toggleEventDetails}
          eventDetails={this.props.eventDetails}
          disableButton={this.props.disableButton}
          events={this.props.events}
        />
      </div>
    );
  }
}

const styles = {
  container: {
    margin: 10,
    padding: 10
  },
  welcome: {
    fontSize: 20,
    fontFamily: 'Vibur',
    align: 'center'
  },
  heading: {
    fontSize: 20,
    fontFamily: 'Vibur'
  }
};


const mapStateToProps = (state) => {
  return {
    header: state.header,
    events: state.events.allEvents,
    eventDetails: state.eventDetails,
  };
};

const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
    addEvents: addEvents,
    toggleEventDetails: toggleEventDetails,
    setCurrentEvent: setCurrentEvent,
    setCurrentEventParticipants: setCurrentEventParticipants,
    disableButton: disableButton
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(Profile);
