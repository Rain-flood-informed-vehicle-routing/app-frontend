<template>
    
    <v-row class="content">
        <v-col cols="5">
            <v-text-field
            v-model="latitudeCoordinate"
            :rules="coordinateLatitudeRules"
            label="Digite a latitude"
            type="number"
            variant="outlined"
            required
            @input="updateStore"
            ></v-text-field>
        </v-col>
        <v-col cols="5">
            <v-text-field
            type="number"
            v-model="longitudeCoordinate"
            :rules="coordinateLongitudeRules"
            label="Digite a longitude"
            variant="outlined"
            required
            @input="updateStore"
            ></v-text-field>
        </v-col>
        <v-col cols="2">
            <v-btn @click="insertPoint" flat icon :color="isAtivo" >
              <v-icon size="auto">mdi-crosshairs-gps</v-icon>
            </v-btn>    
        </v-col>
    </v-row> 
</template>

<script lang="ts">
    import { defineComponent, ref, computed} from 'vue';
    import { useCoordinateStore } from '@/store/coordinateStore';
    import { watch } from 'vue';
    import { LatLngTuple} from 'leaflet';

    type LocationType = 'sourceLocation' | 'destinyLocation';

    export default defineComponent({
        name: 'CoordinateInput',
        props: {
                location: {
                type: String as () => LocationType,
                required: true
            }
        },
        setup(props) {

            const latitudeCoordinate = ref('');
            const longitudeCoordinate = ref('');
            const store = useCoordinateStore();


            watch(() => store[props.location], (newValue, oldValue) => {

                    if(!newValue) return

                    latitudeCoordinate.value = String(newValue[0])
                    longitudeCoordinate.value = String(newValue[1])
                }
            );

            const isValidNumber = (value: string) => !isNaN(parseFloat(value)) || 'Por favor, insira um número válido.';
            const isValidLatitude = (value: string) => {
                const num = parseFloat(value);
                return (num >= -90 && num <= 90) || 'A latitude deve estar entre -90 e 90.';
            };
            const isValidLongitude = (value: string) => {
                const num = parseFloat(value);
                return (num >= -180 && num <= 180) || 'A longitude deve estar entre -180 e 180.';
            };

            const coordinateLongitudeRules = [
                isValidNumber,
                isValidLongitude
            ];

            const coordinateLatitudeRules = [ 
                isValidNumber,
                isValidLatitude,
            ]

            const updateStore = () => {
                const coordinates = [parseFloat(latitudeCoordinate.value), parseFloat(longitudeCoordinate.value)] as LatLngTuple
                store.setCoordinate(props.location, coordinates); 
            };

            const insertPoint = () => {
                
                store.changeInsertState(props.location)
                console.log(store.buttonStateToInsert==props.location)
            }

            const isAtivo = computed(() => store.buttonStateToInsert == props.location? 'indigo': 'grey'); 

            return {
                latitudeCoordinate,
                longitudeCoordinate,
                coordinateLongitudeRules,
                coordinateLatitudeRules,
                updateStore,
                insertPoint,
                isAtivo
            };
    }
})

</script>

<style>
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
    }

    /* Firefox */
    input[type="number"] {
    -moz-appearance: textfield;
    }

    @media (max-width: 700px) {

        .content .v-col{
            padding: 5px !important;
        }
        
    }

    
</style>