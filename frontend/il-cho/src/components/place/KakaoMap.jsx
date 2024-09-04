import { Map, MapMarker } from "react-kakao-maps-sdk";
import { getMarkerImage } from "../../util/get-marker-image";
import { useEffect, useRef } from "react";

const KakaoMap = ({ marker, centerPos, selectedPlaceList }) => {
  const kakaoMap = useRef(null);
  return (
    <div>
      <Map
        id="map"
        center={{
          lat: centerPos.y,
          lng: centerPos.x,
        }}
        style={{
          width: "100%",
          height: "220px",
        }}
        level={3}
        ref={kakaoMap}
      >
        {
          <MapMarker
            position={marker.latlng}
            image={{
              src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
              size: {
                width: 24,
                height: 35,
              },
            }}
          />
        }
        {selectedPlaceList.map((selectedPlace) => (
          <MapMarker
            key={selectedPlace.id}
            position={{
              lat: selectedPlace.y,
              lng: selectedPlace.x,
            }}
            image={{
              src: getMarkerImage(selectedPlace.placeType),
              size: {
                width: 24,
                height: 35,
              },
            }}
          />
        ))}
      </Map>
    </div>
  );
};

export default KakaoMap;
