import { h, useEffect } from "../h";

let globI = 0;
const Map = ({ lat, lng, defaultZoom, onClick }) => {
  let i = globI++;
  useEffect(() => {
    const mapEle = document.getElementById("map-" + i);
    mapEle.__map = L.map(mapEle, {
      center: [lat, lng],
      zoom: defaultZoom,
    });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(mapEle.__map);
    if (onClick) mapEle.__map.on("click", onClick);
    mapEle.__marker = L.marker([lat, lng]);
    mapEle.__marker.addTo(mapEle.__map);
    return () => mapEle.__map.remove();
  }, [lat, lng, defaultZoom, onClick]);

  return h("div", { id: "map-" + i, style: { height: "24rem" } });
};

export default Map;
