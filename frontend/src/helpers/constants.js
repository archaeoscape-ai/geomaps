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
  [BASEMAPS.ESRI]:
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
}

export const LEFT_PANELS = {
  CREATE: 'create',
  IDENTIFY: 'identify',
  LIST: 'sites',
}

export const LAYER_TYPE = {
  VECTOR: 'vector_tile_layers',
  WMS: 'wms_layers',
  XYZ: 'xyz_layers',
}

export const LAYER_TYPE_LABEL = {
  [LAYER_TYPE.VECTOR]: 'Vector Layers',
  [LAYER_TYPE.WMS]: 'WMS Layers',
  [LAYER_TYPE.XYZ]: 'XYZ Layers',
}
