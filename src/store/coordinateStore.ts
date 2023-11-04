import { defineStore } from 'pinia';
import { LatLngTuple, LeafletEvent, marker, LatLngExpression} from 'leaflet';
import { GeoJsonObject } from 'geojson';

export const useCoordinateStore = defineStore({
  id: 'coordinate',
  
  state: () => ({
    sourceLocation:  null as LatLngTuple | null,
    destinyLocation: null as LatLngTuple | null,
    shouldInsertToMap: false,
    buttonStateToInsert: '', 
    modelResult: {
      type: "FeatureCollection",
      features: []
    } as  GeoJsonObject
  }),

  actions: {
    setCoordinate(location: 'sourceLocation' | 'destinyLocation', coordinate: LatLngTuple) {
      this[location] = coordinate;
    },
    toggleInsertState() {
      this.shouldInsertToMap = !this.shouldInsertToMap;
    },
    changeInsertState(location:'sourceLocation' | 'destinyLocation' ){
      if(this.buttonStateToInsert == location){
        this.buttonStateToInsert = ''
      }
      else this.buttonStateToInsert = location
    }, 
    emptyCoordinates(){
      if(!this.sourceLocation || !this.destinyLocation)
        return true
      return false
    },
    setEmptyResult(){
      this.modelResult = {
        type: "FeatureCollection",
        features: []
      } as GeoJsonObject
    },
    changeTuple(){
      let temp = this.sourceLocation
      this.sourceLocation = this.destinyLocation
      this.destinyLocation = temp
    }
  }
});