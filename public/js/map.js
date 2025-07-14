console.log(coordinates);

const map = new maplibregl.Map({
  container: "map",
  style:
    "https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL",
  center: coordinates,
  zoom: 9,
  rollEnabled: true,
});

map.addControl(
  new maplibregl.NavigationControl({
    visualizePitch: true,
    visualizeRoll: true,
    showZoom: true,
    showCompass: true,
  })
);

const marker = new maplibregl.Marker({ color: "red" })
  .setLngLat(coordinates)
  .setPopup(
    new maplibregl.Popup({ offset: 25 }).setHTML(
      `<p>Exact Location will be provide after booking.</p>`
    )
  )
  .addTo(map);
