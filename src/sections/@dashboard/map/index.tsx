import React, { useEffect, useRef, useState } from 'react';
import { Feature, Map as OlMap, View } from 'ol';
import OSM from 'ol/source/OSM';
import * as control from 'ol/control';
import 'ol/ol.css';
import TileLayer from 'ol/layer/Tile';
import Overlay from 'src/pages/dashboard/area/actuation/components/overlay';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Draw from 'ol/interaction/Draw';
import GeoJSON from 'ol/format/GeoJSON';
import { useGlobalContext } from 'src/hooks/useGlobalContext';
import Geocode from 'react-geocode';
import { HOST_GOOGLE_API_KEY } from 'src/config-global';
import { fromLonLat } from 'ol/proj';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Point from 'ol/geom/Point';
import { Geometry } from 'ol/geom';
import * as S from './styles';
import store from './store.png';

const iconStyle = new Style({
  image: new Icon({
    anchor: [0.5, 32],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    // size: [50, 50],
    src: store.src,
  }),
});

interface Props {
  onDrawn: any;
  isDrawend: any;
}

const Map: React.FC<Props> = ({ onDrawn, isDrawend }) => {
  const [map, setMap] = useState<OlMap>();
  const [draw, setDraw] = useState<Draw>();
  const [isLoading, setIsLoading] = useState(false);
  const [isClear, setIsClear] = useState(false);
  const [isDraw, setIsDraw] = useState<boolean>(false);

  const { setCoords, branchData } = useGlobalContext();

  const geoJson = new GeoJSON();
  Geocode.enableDebug();
  const refMap = useRef();
  const vectorSourceRef = useRef<VectorSource>();
  const vectorLayerRef = useRef<VectorLayer<VectorSource<Geometry>>>();
  const polygonFeatureRef = useRef<Feature<Geometry>>();
  const areaSourceRef = useRef<VectorSource>();

  const createArea = () => {
    const areaSource = new VectorSource({
      wrapX: true,
    });
    areaSourceRef.current = areaSource;
    const areaLayer = new VectorLayer({
      source: areaSource,
    });
    const areaDrawer = new Draw({
      source: areaSource,
      type: 'Polygon',
    });
    setDraw(areaDrawer);
    map?.addInteraction(areaDrawer);
    map?.addLayer(areaLayer);

    areaDrawer.on('drawend', (event) => {
      const polygonFeature = event.feature;
      const generatedGeoJson = JSON.parse(geoJson.writeFeatures([polygonFeature]));
      setCoords(generatedGeoJson);
      map?.removeInteraction(areaDrawer);
      polygonFeatureRef.current = polygonFeature;
      setIsClear(true);

      onDrawn();
      isDrawend(true);
    });
    if (draw) {
      map?.removeInteraction(draw);
      setIsDraw(true);
    }
  };

  const getAddressCoords = async () => {
    setIsLoading(true);
    const newAddress = `
      ${branchData?.address.street},
      ${branchData?.address.city},
      ${branchData?.address.zip_code},
      ${branchData?.address.district},
      ${branchData?.address.number},
    `;
    try {
      const response = await Geocode.fromAddress(newAddress, HOST_GOOGLE_API_KEY, 'pt', 'br');
      const { lat, lng } = response.results[0].geometry.location;
      const initialMap = new OlMap({
        target: refMap.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: fromLonLat([lng, lat]),
          zoom: 15,
        }),
        controls: control.defaults({
          zoom: true,
        }),
      });

      vectorSourceRef.current = new VectorSource();
      vectorLayerRef.current = new VectorLayer({ source: vectorSourceRef.current });
      const iconFeature = new Feature({
        geometry: new Point(fromLonLat([lng, lat])),
      });
      iconFeature.setStyle(iconStyle);
      vectorSourceRef.current.addFeature(iconFeature);

      initialMap?.once('postrender', () => {
        if (vectorLayerRef.current) {
          initialMap?.addLayer(vectorLayerRef.current);
          setMap(initialMap);
          createArea();
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const removeArea = () => {
    if (areaSourceRef.current) {
      areaSourceRef.current.clear();
      setIsDraw(false);
      isDrawend(false);
    }

    // setIsClear(true);
  };

  useEffect(() => {
    getAddressCoords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <S.Container ref={refMap} />
      {isLoading && (
        <Overlay
          map={map}
          createArea={createArea}
          isClear={isClear}
          isDraw={isDraw}
          handleClearArea={removeArea}
        />
      )}
    </>
  );
};

export default Map;

// const address = `${data.city}, ${data.state}, ${data.zip_code}, ${data.street}, ${data.district}, ${data.number}`;
// if (data.complement) address += `, ${data.complement}.`;
