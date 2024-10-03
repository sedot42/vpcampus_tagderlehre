const levels_short: string[] = [
  "U2",
  "U1",
  "EG",
  "GA",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "TG",
  "DA",
];
const levels_map: string[] = [
  "Map_u2.jpg",
  "Map_u1.jpg",
  "Map_eg.jpg",
  "Map_ga.jpg",
  "Map_1.jpg",
  "Map_2.jpg",
  "Map_3.jpg",
  "Map_4.jpg",
  "Map_5.jpg",
  "Map_6.jpg",
  "Map_7.jpg",
  "Map_8.jpg",
  "Map_9.jpg",
  "Map_10.jpg",
  "Map_11.jpg",
  "Map_12.jpg",
  "Map_TG.jpg",
  "Map_DA.jpg",
];
const levels_toExtent = [2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const extent_ortho = [-16719, -13174, 19085, 11901];
const extent_levels = [
  [0, 0, 1388, 1250],
  [0, 0, 1704, 1250],
  [0, 0, 1955, 1250],
];
/*
const ol_vector_layer = new VectorLayer({ source: new VectorSource(), opacity: 0 });
const layers = [ol_vector_layer];

// Basemap
layers.push(
  new ImageLayer({
    properties: { title: "Orthophoto" },
    visible: true,
    source: new ImageStatic({
      attributions: "p",
      url: "assets/maps/basemap.jpg",
      imageExtent: extent_ortho,
    }),
  })
);
// Levels
for (let i = 0; i < levels_map.length; i++) {
  // prefetch URL so it is cached
  layers.push(
    new ImageLayer({
      properties: { title: levels_short[i] },
      visible: false,
      source: new ImageStatic({
        attributions: "p",
        url: "./rastermaps/" + levels_map[i],
        imageExtent: extent_levels[levels_toExtent[i]],
      }),
    })
  );
}

// create Projection
projection = new Projection({
  code: "floorplan-image",
  units: "pixels",
  extent: extent_ortho,
});

// create Map instance
// NOTE: Map is a reserved word in TypeScript and is a bad choice for an import name
const ol_map = new Map({
  layers: layers,
  target: "map",
  controls: defaultControls({ attribution: false }),
  view: new View({
    projection: projection,
    center: getCenter(extent_levels[0]),
    zoom: 5,
    maxZoom: 7,
    minZoom: 2,
    extent: [-10000, -10000, 10000, 10000],
  }),
});

// add room feature
const feature = new WKT().readFeature(room_wkt_string_from_json);
ol_vector_layer.getSource().addFeature(feature);
*/
