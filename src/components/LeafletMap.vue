<template>
  <div style="height:100%;">
    <div v-if="isLoading" class="loading-overlay">
      <v-progress-circular
        indeterminate
        color="primary"
      ></v-progress-circular>
    </div>
    <l-map @click="onMapClick"   :useGlobalLeaflet="false" ref="map" v-model:zoom="zoom"  :options="{zoomControl: false}" :center="[-23.550520, -46.633308]">
      <l-marker v-if="markerSourcePosition" :icon="markerIcon" draggable :lat-lng="markerSourcePosition" @moveend="event => handleMoveEnd(event, 'sourceLocation')">
      </l-marker>
      <l-marker  v-if="markerDestinyPosition" draggable :lat-lng="markerDestinyPosition" @moveend="event => handleMoveEnd(event, 'destinyLocation')"></l-marker>
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>
      <!-- <l-geo-json v-for="(feature, index) in features"
                   
                  :="{color: feature.properties.color}"  
                  :geojson="feature"></l-geo-json> -->

       
      <l-geo-json v-if="visibleLines[0]" :options-style="{color: '#b51212'}" :geojson="proposed"></l-geo-json> 
      <l-geo-json v-if="visibleLines[1]" :options-style="{color: '#12b551'}" :geojson="time_no_rain"></l-geo-json> 
      <l-geo-json v-if="visibleLines[2]" :options-style="{color: '#1234b5'}" :geojson="length_no_rain"></l-geo-json> 
      <l-control-zoom position="bottomright"  ></l-control-zoom>
    </l-map>
  </div>

  <div v-if="geojson.features.length != 0" class="legend">
    <div v-for="(feature, index) in geojson.features" :key="feature.properties.id" class="legend-item">
      <div @click="toggleLineVisibility(index)" :style="{cursor:'pointer', backgroundColor: visibleLines[index] ? colors2[feature.properties.name]: 'gray', width: '20px', height: '20px' }"></div>
      <span>{{ feature.properties.name }}</span>
    </div> 
  </div>
</template>

<script lang="ts">

  import "leaflet/dist/leaflet.css";
  import { LMap, LTileLayer, LControlZoom, LMarker, LIcon, LGeoJson} from "@vue-leaflet/vue-leaflet";
  import { useCoordinateStore } from '@/store/coordinateStore';
  import { watch, ref, computed, onMounted} from "vue";
  import { LatLngTuple, LeafletEvent, LeafletMouseEvent, icon} from 'leaflet';
  import blackLogo from '../assets/marker-icons/marker-icon-2x-black.png'
  import shadowLogo from '../assets/marker-icons/marker-shadow.png'
  import { useModalStore } from "@/store/modalStore";
  import { GeoJsonObject, GeoJsonProperties, Feature} from 'geojson';
  // import "leaflet-html-legend/dist/L.Control.HtmlLegend.css"
  // import {HtmlLegend} from "leaflet-html-legend/dist/L.Control.HtmlLegend.js"


export default {
  components: {
    LMap,
    LTileLayer,
    LControlZoom,
    LMarker,
    LIcon, 
    LGeoJson
  },
  data() {
    return {
      zoom: 14,
    };
  },
  setup(){

    const store = useCoordinateStore();
    const modal = useModalStore();

    const markerSourcePosition = computed(() => store.sourceLocation); 
    const markerDestinyPosition = computed(() => store.destinyLocation); 
    const isLoading = computed(() => modal.loadingMap)
    const geojson = computed(() => { return store.modelResult })
    const colors = ['#b51212', '#12b551', '#1234b5']
    let visibleLines = ref([true, true, true])

    const colors2 = {
      "proposed": "#b51212",
      "time_no_rain":"#12b551",
      "length_no_rain":"#1234b5"
    }
    

    const features = computed(() => { 
        let final =  [];
      
        store.modelResult.features.forEach(function(valor, indice:number) { 
          if(visibleLines.value[Object.keys(colors2).indexOf(valor.properties.name)]){
            valor.properties.color = colors2[valor.properties.name]
            final.push(valor)
            console.log(valor)
          }
              console.log(visibleLines.value)
        });
        return final;
    })

    const proposed = computed( () =>{

      if(store.modelResult.features.length >= 0){
        return store.modelResult.features[0]
      }

    })

    const time_no_rain = computed( () =>{

      if(store.modelResult.features.length >= 1){
        return store.modelResult.features[1]
      }

    })

    const length_no_rain = computed( () =>{

      if(store.modelResult.features.length >= 2){
        return store.modelResult.features[2]
      }

    })
   

    watch(() => store.sourceLocation, () => {
      store.modelResult = {
          type: "FeatureCollection",
          features: []
        } as GeoJsonObject
    });

    watch(() => store.destinyLocation, () => {
      store.modelResult = {
          type: "FeatureCollection",
          features: []
        } as GeoJsonObject
    });

    const markerIcon = icon({
        iconUrl: blackLogo,
        shadowUrl: shadowLogo,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
    })

    const getColor=(index:number) => {
     
      return colors[index % colors.length]
    }

    const toggleLineVisibility = (index:number)  => {
      console.log(visibleLines)
      visibleLines.value[index] = !visibleLines.value[index]
    }



    const handleMoveEnd = (event: LeafletEvent, state: 'sourceLocation' | 'destinyLocation') => {
        const newPosition = event.target.getLatLng();
        const coordinate = [newPosition.lat, newPosition.lng] as LatLngTuple
        store[state] = coordinate
    }

    const onMapClick = (event: LeafletMouseEvent) => {
      const newPosition = event.latlng;
      const { buttonStateToInsert } = store;

      if (buttonStateToInsert === 'sourceLocation' || buttonStateToInsert === 'destinyLocation') {
          store[buttonStateToInsert] = [newPosition.lat, newPosition.lng];
          store.buttonStateToInsert = '';
      }
    }
    
    return {
      handleMoveEnd,
      onMapClick,
      markerSourcePosition,
      markerDestinyPosition,
      markerIcon,
      geojson, 
      isLoading,
      getColor,
      toggleLineVisibility,
      visibleLines,
      features,
      colors2,
      proposed,
      time_no_rain,
      length_no_rain
    }
  }
};
</script>

<style>

.loading-overlay {
  position: absolute; /* posiciona o loading em relação à div .relative-container */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7); /* background branco com um pouco de transparência */
  display: flex;
  justify-content: center;
  align-items: center; /* centra o conteúdo do loading na vertical e horizontal */
  z-index: 450; /* coloca o loading acima do conteúdo */
}

  .legend {
    position: absolute;
    top: 50px;
    right: 15px;
    background: white;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    z-index: 99999999999999999999
  }
  .legend-item {
    display: flex;
    align-items: center;
  }
  .legend-item div {
    margin-right: 5px;
  }

</style>