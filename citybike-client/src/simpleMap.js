// @flow

import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup, ZoomControl, ScaleControl, Playback  } from "react-leaflet";
import L, { point } from 'leaflet';
import { dataConstants } from './constants';
import * as _ from 'lodash';

export default class SimpleMap extends Component<any, any>{

  snap;
  map = null;
  constructor() {
    super();
    this.state = {
      lat: 25.790654,
      lng: -80.1300455,
      zoom: 13,
      historicalData: [],
      responseData: {},
      snapshot: {},
      mapType: 'realtime'
    }
  }

  scriptLoaded() {
    const position = [this.state.lat, this.state.lng]
    if (this.map === null) {
      this.map = new L.Map('map1');
      var basemapLayer = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
      this.map.setView(position, this.state.zoom);
      this.map.addLayer(basemapLayer);
  
      // Playback options
      var playbackOptions = {
        playControl: true,
        dateControl: true,
        sliderControl: true,
        tickLen: 50
      };
  
      const jsonData = this.getGeoJsonData();
      var playback = new window.L.Playback(this.map, jsonData, (timestamp) => {
        const d1_ = jsonData.properties.time.findIndex(el => timestamp === el)
        if (d1_ > -1) {
          const current_coord = jsonData.geometry.coordinates[d1_];
          const myIcon = jsonData.properties.statusData[d1_];
          new L.Marker(current_coord, {icon: myIcon }).addTo(this.map);
        }
      }, playbackOptions); 
    }
  }

  componentDidMount() {
    this.setState({
      lat: this.props.customData.lat,
      lng: this.props.customData.lng,
      zoom: this.props.customData.zoom,
      historicalData: this.props.customData.historicalData,
      responseData: this.props.customData.responseData,
      snapshot: {},
      mapType: this.props.customData.mapType || 'realtime'
    });
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if (prevProps !== this.props) {
      this.setState({
        lat: this.props.customData.lat,
        lng: this.props.customData.lng,
        zoom: this.props.customData.zoom,
        historicalData: this.props.customData.historicalData,
        responseData: this.props.customData.responseData,
        snapshot: {},
        mapType: this.props.customData.mapType || 'realtime'
      });
    }
    const container = document.getElementById('map1')
    if(container) {
      this.renderReplayView();
    }
  }

  renderReplayView() {

    const script = document.createElement("script");
    script.async = true;
    script.src = "http://leafletplayback.theoutpost.io/dist/LeafletPlayback.js";
    script.onload = () => this.scriptLoaded();

    document.body.appendChild(script);
        
  }

  renderIcon(data) {
    if (data.free_bikes === 0) {
      return dataConstants.divIconDanger;
    }
    if (data.free_bikes >= 1 && data.free_bikes <= 5) {
      return dataConstants.divIconWarning;
    }
    if (data.empty_slots === 0) {
      return dataConstants.divIconWarning;
    }
    
    return dataConstants.divIconSuccess;
  }

  renderRealTimeView() {
    const position = [this.state.lat, this.state.lng]
    return (
      <Map center={position} zoom={this.state.zoom} style={{width: '100%'}}>
          <ZoomControl position="bottomright" />
          <ScaleControl position="topright" />
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {this.renderMapMarkers()}
        </Map>
    )
  }

  getGeoJsonData() {
    return {
      "type": "Feature",
      "geometry": {
        "type": "MultiPoint",
        "coordinates": this.getArrayPoints()
      },
      "properties": {
        "time": this.getArrayTimes(),
        "statusData": this.getArryIcons()
      }
    };
  }

  getArryIcons() {
    let data_a = []
    this.props.customData.historicalData.forEach((data) => {
      data_a = [...data_a, ...this.getIcons(data)]
    });
    return _.compact(data_a);
  }

  getIcons(responseData) {
    return responseData.stations.map((data, idx) => {
      if (!this.getForwardFloat(data.latitude) && !this.getForwardFloat(data.longitude) ) {
        return this.renderIcon(data);
      }
      return null;
    });
  }

  getArrayTimes() {
    let data_a = []
    this.props.customData.historicalData.forEach((data) => {
      data_a = [...data_a, ...this.getTime(data)]
    });
    return _.compact(data_a);
  }

  getTime(responseData) {
    return responseData.stations.map((data, idx) => {
      if (!this.getForwardFloat(data.latitude) && !this.getForwardFloat(data.longitude) ) {
        return new Date(data.timestamp).valueOf() * 1000
      }
      return null;
    });
  }

  getArrayPoints() {
    let data_a = []
    this.props.customData.historicalData.forEach((data) => {
      data_a = [...data_a, ...this.getPoints(data)];
    });
    return _.compact(data_a);
  }

  getForwardFloat(forward) {
    return (0 === forward || 0.0 === forward || forward === undefined || isNaN(parseFloat(`${forward}`)) || `${forward}`.includes('NaN') );
  }

  getPoints(responseData) {
    return responseData.stations.map((data, idx) => {
      if (!this.getForwardFloat(data.latitude) && !this.getForwardFloat(data.longitude) ) {
        return [data.latitude, data.longitude];
      }
      return null;
    });
  }

  renderMapMarkers() {
    return this.props.customData.responseData.map((data, idx) => <Marker
            icon={this.renderIcon(data)}
            zIndexOffset={500} title={data.extra.address} key={`marker-${idx}`} position={[ data.latitude, data.longitude ]}>
                <Popup>
                  <span>
                    <b>{data.extra.address}</b>. 
                    <hr/> 
                    Free Bikes: <b>{data.free_bikes}</b><br/>
                    Empty Slots: <b>{data.empty_slots}</b>
                  </span>
                </Popup>
              </Marker>)
  }

  render() {
    if (this.state.mapType === 'realtime') {
      return this.renderRealTimeView();
    } else {
      return <div id='map1'></div>
    }
  }
}