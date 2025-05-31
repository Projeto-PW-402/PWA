
    function initMap() {
   
      const braga = { lat: 41.5518, lng: -8.4229 };

      // Criar mapa centrado em Lisboa
      const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: braga,
      });

     
      const trafficLayer = new google.maps.TrafficLayer();

   
      trafficLayer.setMap(map);
    }