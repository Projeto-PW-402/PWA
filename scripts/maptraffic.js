// Função para inicializar o mapa
    function initMap() {
      // Centro do mapa - Lisboa
      const braga = { lat: 41.5518, lng: -8.4229 };

      // Criar mapa centrado em Lisboa
      const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: braga,
      });

      // Criar layer de trânsito
      const trafficLayer = new google.maps.TrafficLayer();

      // Mostrar layer de trânsito no mapa
      trafficLayer.setMap(map);
    }