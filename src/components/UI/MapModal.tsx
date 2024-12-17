import React, { Fragment, useCallback, useMemo, useState } from 'react';
import L, { LatLngExpression, MarkerCluster } from 'leaflet';
import { MapContainer, Marker, TileLayer, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import { useReduxDispatch } from '../../store/Store';
import { tableActions } from '../../store/appSlices/TableSlice';
import { Spinner } from './Spinner';
import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Slide, Stack, Switch, Typography, Zoom } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TransitionProps } from '@mui/material/transitions';
import MarkerClusterGroup from 'react-leaflet-cluster';
import '../../components/scss/mapModal.scss';
import 'leaflet/dist/leaflet.css';
import markerIconRed from '../../static/markeIconRed.png';
import useTextToSpeech from '../../logics/useTextToSpeech';

type HandleClickProps = {
  handleMapClick: any;
};

type MapDataType = {
  addressPoints: number[];
  city: string;
  revenue: number;
  sales?: number;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" mountOnEnter unmountOnExit ref={ref} {...props} onExited={() => {}} />;
});

export const MapModal: React.FC = () => {
  const { t } = useTranslation(['home']);
  const storesTitle = t('MapModalTitleStores', { ns: ['home'] });
  const onlineTitle = t('MapModalTitleOnline', { ns: ['home'] });
  const dispatch = useReduxDispatch();
  const [title, setTitle] = useState(onlineTitle);
  const [dataType, setDataType] = useState(1);
  const [open, setOpen] = useState(true);

  const { handlePlay, handleStop } = useTextToSpeech();

  const handleClose = () => {
    dispatch(tableActions.setIsMapModalOpen(false));
  };

  const handleCloseModal: DialogProps['onClose'] = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    handleClose();
  };

  const mapDataStore = useMemo(
    () => [
      { addressPoints: [47.49, 19], city: 'Budapest', revenue: 5000, sales: 100 },
      { addressPoints: [47.7791435, 18.7495739], city: 'Esztergom', revenue: 1000, sales: 20 },
      { addressPoints: [47.9058, 20.3709], city: 'Eger', revenue: 700, sales: 10 },
      { addressPoints: [47.15914, 20.19535], city: 'Szolnok', revenue: 100, sales: 3 },
    ],
    [],
  );

  const mapDataOnline = useMemo(
    () => [
      { addressPoints: [47.49, 19], city: 'Budapest', revenue: 50, sales: 10 },
      { addressPoints: [47.9557802, 21.7167982], city: 'Nyíregyháza', revenue: 10, sales: 1 },
      { addressPoints: [46.7785372, 17.6553331], city: 'Balatonboglár', revenue: 10, sales: 1 },
      { addressPoints: [48.1516988, 17.1093063], city: 'Bratislava', revenue: 10, sales: 1 },
    ],
    [],
  );

  const mapData = useMemo(() => (dataType === 0 ? mapDataStore : mapDataOnline), [dataType, mapDataOnline, mapDataStore]) as MapDataType[];
  const position: LatLngExpression = [47.49, 19];
  const initZoom = 7;
  const maxZoom = 15;
  const minZoom = 5;

  const iconBlue = L.icon({
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
    iconUrl: 'https://unpkg.com/leaflet@1.8.0/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.8.0/dist/images/marker-shadow.png',
  });

  const iconRed = L.icon({
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
    iconUrl: markerIconRed,
    shadowUrl: 'https://unpkg.com/leaflet@1.8.0/dist/images/marker-shadow.png',
  });

  const createClusterCustomIcon = useCallback(
    (cluster: MarkerCluster) => {
      //     const markers = cluster.getAllChildMarkers();
      //     let sum = 0;
      //     for (let i = 0; i < markers.length; i++) {
      //       sum += Number(markers[i].value);
      //     }
      //     const size = sum / 10000;
      //     const formatted_number = Math.round(sum)
      //       .toString()
      //       .replace(/\\B(?=(\\d{3})+(?!\\d))/g, ' ');

      return L.divIcon({
        html: `<span>${cluster.getChildCount()}</span>`,
        //  html: `<span>${formatted_number}</span>`,
        className: `flex bg-white border-[5px] border-solid rounded-full text-black h-[33px] w-[33px] leading[37px] text-center items-center ${dataType === 0 ? 'border-sky-600' : 'border-red-500'}`,
        iconSize: L.point(33, 33, true),
      });
    },
    [dataType],
  );

  const ResizeMap = () => {
    const map = useMap();
    map.invalidateSize();
    map.setView(position, initZoom);
    return null;
  };

  const onSwitch = useCallback(() => {
    if (dataType === 0) {
      setTitle(onlineTitle);
      setDataType(1);
    } else {
      setTitle(storesTitle);
      setDataType(0);
    }
  }, [onlineTitle, dataType, storesTitle]);

  const handleMapClick = (e: any) => {
    const { lat, lng } = e.latlng;
    alert(`Clicked at: ${lat}, ${lng}`);
  };

  const MapEventsHandler: React.FC<HandleClickProps> = ({ handleMapClick }) => {
    useMapEvents({
      click: (e) => handleMapClick(e),
    });
    return null;
  };

  return (
    <Fragment>
      <Dialog fullWidth={true} maxWidth={'lg'} open={open} onClose={handleCloseModal} TransitionComponent={Transition} keepMounted>
        <DialogTitle className="flex items-center justify-center text-2xl py-5" onMouseEnter={() => handlePlay(title)} onMouseLeave={() => handleStop()}>
          {title}
        </DialogTitle>
        <Stack direction="row" component="label" alignItems="center" justifyContent="center">
          <Typography onMouseEnter={() => handlePlay(t('online', { ns: ['home'] }))} onMouseLeave={() => handleStop()}>
            {t('online', { ns: ['home'] })}
          </Typography>
          <Switch onChange={onSwitch} value={title} />
          <Typography onMouseEnter={() => handlePlay(t('stores', { ns: ['home'] }))} onMouseLeave={() => handleStop()}>
            {t('stores', { ns: ['home'] })}
          </Typography>
        </Stack>
        <DialogContent dividers={true}>
          {!mapData ? (
            <Spinner text={'Loading ...'} color={'primary'} />
          ) : (
            <Zoom in={true} style={{ transitionDelay: open ? '100ms' : '0ms' }} timeout={700}>
              <div className="bg-transparent mb-7 pb-1 px-4 border border-sky-600">
                {mapData.length === 0 ? (
                  <span>{`${t('noData', { ns: ['table'] })} 😳`}</span>
                ) : (
                  <div>
                    <MapContainer style={{ height: '100vh', width: '100wh' }} center={position} zoom={initZoom} maxZoom={maxZoom} minZoom={minZoom} doubleClickZoom={true} scrollWheelZoom={false}>
                      <ResizeMap />
                      <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      {
                        <MarkerClusterGroup
                          key={Date.now()}
                          onClick={(e) => {
                            e.layerPoint;
                          }}
                          iconCreateFunction={createClusterCustomIcon}
                          maxClusterRadius={100}
                          spiderfyOnMaxZoom={true}
                          showCoverageOnHover={true}
                          chunkedLoading
                        >
                          {mapData.map((item: MapDataType, index) => (
                            <Marker key={index} position={[item.addressPoints[0], item.addressPoints[1]]} icon={dataType === 0 ? iconBlue : iconRed}>
                              <Tooltip direction="bottom" opacity={1} permanent={dataType === 0 ? false : true}>
                                {item.city && <h6> {`${t('city', { ns: ['home'] })}: ${item.city}`}</h6>}
                                {dataType === 0 && <h6> {`${t('revenue', { ns: ['home'] })}: ${item.revenue} Ft`}</h6>}
                                {item.sales && <h6> {`${t('sales', { ns: ['home'] })}: ${item.sales} db`}</h6>}
                              </Tooltip>
                            </Marker>
                          ))}
                        </MarkerClusterGroup>
                      }
                      <MapEventsHandler handleMapClick={handleMapClick} />
                    </MapContainer>
                  </div>
                )}
              </div>
            </Zoom>
          )}
        </DialogContent>
        <DialogActions>
          <div className="flex gap-9 mr-7 mb-7">
            <Button onClick={handleClose} onMouseEnter={() => handlePlay(t('cancel', { ns: ['home'] }))} onMouseLeave={() => handleStop()}>
              <span className="bg-transparent text-red-500 px-4 border border-red-500 hover:bg-red-500 hover:text-white hover:border-transparent py-0 hover:scale-125 rounded-full">
                {t('cancel', { ns: ['home'] })}
              </span>
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
