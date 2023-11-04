<template>
  <div class="map-menu">
    <v-card class="inputs"> 
      <v-card-text>
        
        <v-row no-gutters >
          <v-col>
            <v-row no-gutters class="title">
              <v-col>
                <h2>Definir ponto de partida</h2>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col>
                <LatLngInput :location="'sourceLocation'"></LatLngInput>
              </v-col>
            </v-row>
            <v-row>
             <v-col style="
    /* display: flex; */
    /* align-items: center; */
    /* justify-content: center; */
    /* float: right; */
    /* float: right; */
    text-align: -webkit-right; margin-top: -20px;">
            
              <v-btn flat icon @click="changeCoordinates()" >
                <v-icon size="xxx-large">mdi-swap-vertical </v-icon>
              </v-btn>  
             
                
             </v-col>
            </v-row>

            <v-row no-gutters class="title">
              <v-col>
                <h2>Definir ponto de destino</h2>
              </v-col>
            </v-row>
            <v-row no-gutters >
              <v-col>
                <LatLngInput :location="'destinyLocation'"></LatLngInput>
              </v-col>
            </v-row>
            
            
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col>
            <v-row no-gutters class="title">
              <v-col>
                <h2>Data de partida</h2>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col> 
              <VueDatePicker v-model="date" :teleport="true" :format="format" />

              </v-col>
              
            </v-row>
          </v-col>
        </v-row>

        <v-row >
          <v-col>
            <v-row no-gutters class="title">
              <v-col>
                <h2>Horário de partida</h2>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col> 
                <VueDatePicker v-model="time" :teleport="true" time-picker mode-height="120" >
                  <template #input-icon>
                    <img class="input-slot-image" src="../assets/query_builder_black_24dp.svg"/>
                  </template>
                </VueDatePicker>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h2 style="margin-bottom:15px;">Modelo para cálculo</h2>
            <div class="checkbox">

              <v-checkbox v-model="proposed" color="blue" label="Proposto"></v-checkbox>
              <v-checkbox v-model="length" color="blue" label="Distância sem chuva"></v-checkbox>
              <v-checkbox v-model="time_no_rain" color="blue" label="Tempo sem chuva"></v-checkbox>
              
            </div>
          </v-col>
        </v-row>
        <v-row >
          <v-col>
            <v-btn variant="outlined" @click="sendRequest()">Enviar</v-btn>
            
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
 
</template>

<script lang="ts">
  
  import SearchBar from '../components/commom/SearchBar.vue';
  import LatLngInput from './commom/LatLngInput.vue';
  import { useCoordinateStore } from '@/store/coordinateStore';
  import { useModalStore } from '@/store/modalStore';
  import { ref } from 'vue';
  
  import VueDatePicker from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css';
  import axios from 'axios'

  export default {
    components: {
      SearchBar,
      LatLngInput,
      VueDatePicker
    },
    setup(){

      const date = ref(new Date());
      const time = ref(new Date());
      
      const format = (date: Date) => {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
      }

      return {
        date,
        format,
        time
      }
    },
    data() {
      return {
        searchQuery: '',
        startDate: null,
        endDate: null,
        proposed: true,
        time_no_rain: false,
        length: false
      };
    },
    methods: {
      createGeoJSONWithTwoPoints() {
        const store = useCoordinateStore();
        let point1 = store.sourceLocation
        let point2 = store.destinyLocation

        if (!point1 || !point2 || point1.length !== 2 || point2.length !== 2) {
            throw new Error('Os pontos fornecidos são inválidos.');
        }

        let geoj = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": point1
                    },
                    "properties": {
                      "role": "origin",
                      "date": this.date,
                      "time": this.time,
                      "models": [] as string[] 
                    }
                },
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": point2
                    },
                    "properties": {}
                }
            ]
        };

        geoj.features[0].properties.models = []
        if(this.proposed)
          geoj.features[0].properties.models.push("proposed")

        if(this.time_no_rain)
          geoj.features[0].properties.models.push("time_no_rain")

        if(this.length)
          geoj.features[0].properties.models.push("length_no_rain")

        return geoj
      },
      changeCoordinates(){
        const store = useCoordinateStore();
        store.changeTuple()

      },
      sendRequest(){

        const store = useCoordinateStore();
        const modal = useModalStore();

        

        if(store.emptyCoordinates()){
          modal.showModal()
          return
        }

        modal.loadingMap = true;
        // store.setEmptyResult()

        const geojson = this.createGeoJSONWithTwoPoints()
        const url = 'https://back-end-projeto-alagamentos-upfpc35ezq-uc.a.run.app/api/v1/modelo_previsao/geojson';
        
        

        console.log(geojson)

        const headers = {
          'Access-Control-Allow-Origin' : '*',
          'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        }
        axios.post(url, geojson,  {headers: headers})
          .then(response => {
            console.log('Dados recebidos:', response.data);
            store.modelResult = response.data
            setTimeout(() => {
              modal.loadingMap = false
            }, 1000);
        })
        .catch(error => {
          console.error('Erro:', error);
        });

        
       
   
      }
    }
  };
</script>

<style>

  .map-menu {
    position: absolute;
    top: 30px;
    z-index: 900;
    /* left: 10px; */
    margin-top: 20px;
    /*  background-color: black; */
    padding: 0px 50px 0px 50px;
    /* width: 100%; */
    overflow: visible;
  }

  .inputs{
    max-width: 450px;
    background-color: rgb(35, 110, 175);
    padding: 10px;
    border-radius: 10px;
    overflow: visible;

  }

  .vue-datepicker-class {
    position: absolute;
  }

  .title{
    padding-bottom: 15px;
    /* border: 1px solid black ; */
  }


  .v-date-picker-table { height: 100%; height: 300px; position: relative; }


  .v-checkbox .v-selection-control {
    /* min-height: var(--v-input-control-height); */
    min-height: 0px;
  }
   
  .checkbox .v-input__details{
    display: none;
  }

  .input-slot-image {
        height: 19px;
        width: auto;
        margin-left: 9px;
        margin-top: 4px;
        color: #959595 !important;
    }

  @media (max-width: 700px) {

    .inputs{
        max-width: 100%;
        background-color: rgb(35, 110, 175);
        padding: 10px;
        border-radius: 10px;
    }

    .map-menu{
      left: 0px;
      width: 100%;
      padding: 5px;
    }
    
  }

</style>
