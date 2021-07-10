/* global document */
import React from "react";
import ReactDOM from "react-dom";
import DeckGL from "@deck.gl/react";
import { ScenegraphLayer } from "@deck.gl/mesh-layers";
import { EditableGeoJsonLayer } from "@nebula.gl/layers";
import { GLTFScenegraphLoader } from "@luma.gl/addons";
import { registerLoaders } from "@loaders.gl/core";
import { StaticMap } from "react-map-gl";

// ScenegraphLayer will automatically pick the right
// loader for the file type from the registered loaders.
registerLoaders([GLTFScenegraphLoader]);

// Change this to your model
const GLTF_URL =
  "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb";

// Change this to your access token
const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiZ2Vvcmdpb3MtdWJlciIsImEiOiJjanZidTZzczAwajMxNGVwOGZrd2E5NG90In0.gdsRu_UeU_uPi9IulBruXA";

const initialViewState = {
  longitude: -73.9667,
  latitude: 40.7634,
  zoom: 14,
  pitch: 60
};

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      geojson: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Point",
              coordinates: [-73.967666, 40.762894]
            }
          }
        ]
      }
    };
  }
  render() {
    // This layer provides the editable functionality
    const editableLayer = new EditableGeoJsonLayer({
      id: "geojson",
      data: this.state.geojson,
      mode: "drawPoint",
      onEdit: ({ updatedData }) => {
        this.setState({ geojson: updatedData });
      }
    });

    // This layer renders the glTF objects
    const scenegraphLayer = new ScenegraphLayer({
      id: "scene",
      scenegraph: GLTF_URL,
      data: this.state.geojson.features,
      getPosition: f => f.geometry.coordinates,
      sizeScale: 4000,
      getOrientation: [0, 180, 90],
      getTranslation: [0, 0, 100],
      getScale: [1, 1, 1]
    });
    return (
      <DeckGL
        initialViewState={initialViewState}
        controller={true}
        layers={[editableLayer, scenegraphLayer]}
        getCursor={() => "cell"}
      >
        <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
      </DeckGL>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
