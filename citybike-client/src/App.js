import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import 'leaflet/dist/leaflet.css';
import SimpleMap from './simpleMap';

class App extends Component {
  constructor() {
    super();

    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:4001",
      lat: 25.790654,
      lng: -80.1300455,
      zoom: 13,
      historicalData: [],
      responseData: [],
      mapType: 'realtime'
    };

  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on('FromAPI', response => this.setData(response.network));
   
  }

  setData(dataResponse) {
    if (dataResponse != null) {
      this.setState({
        responseData: dataResponse.stations,
        lat: dataResponse.location.latitude,
        lng: dataResponse.location.longitude,
      });
      this.addToHistorical(dataResponse);
    }
  }

  addToHistorical(dataResponse) {
    const { historicalData } = this.state;
    historicalData.push(dataResponse);
    this.setState(
      {historicalData: historicalData}
      );
  }

  getStationsSnapshot() {

  }

  changeType() {
    const currentState = this.state.mapType === 'realtime' ? 'playback' : 'realtime';
    this.setState({
      mapType: currentState
    });
  }

  getState() {
    return this.state;
  }

  render() {
    const position = [this.state.lat, this.state.lng]
    return (

      <div className="map">
        <h1> City Bikes in Miami </h1>
        <button onClick={() => this.changeType()}>{this.state.mapType}</button>
        <SimpleMap customData={this.getState()} />
      </div>
    );
  }
}
export default App;
