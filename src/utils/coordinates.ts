import proj4 from 'proj4';
import { IGeoJSON } from 'src/@types/area';

export const parseCoordinatesTo4326 = (geojson?: IGeoJSON<any>) => {
  if (geojson) {
    const coordinates = geojson.features[0].geometry.coordinates[0].map((value: Array<number>) =>
      proj4('EPSG:3857', 'EPSG:4326', [value[0], value[1]])
    );
    geojson.features[0].geometry.coordinates[0] = coordinates;
    return geojson;
  }
  return undefined;
};
