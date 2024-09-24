export const RIGHT_PANELS = {
  LAYER: 'layer-panel',
  NOTE: 'note-panel',
}

export const RIGHT_PANEL_MAPPING = {
  [RIGHT_PANELS.LAYER]: {
    id: RIGHT_PANELS.LAYER,
    name: 'Layer',
  },
  [RIGHT_PANELS.NOTE]: {
    id: RIGHT_PANELS.NOTE,
    name: 'Note',
  },
}

export const BASEMAPS = {
  OSM: 'osm',
  ESRI: 'esri',
}

export const BASEMAP_URLS = {
  [BASEMAPS.OSM]: 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
  [BASEMAPS.ESRI]: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
}
