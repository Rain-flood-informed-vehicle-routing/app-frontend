<template>
        
        <v-autocomplete
            
            @input.native="debouncedSearch"
            :items="results"
            ref="autocomplete"
            append-inner-icon="mdi-map-marker"
            auto-select-first
            class="flex-full-width"
         
            density="comfortable"
            item-props
            menu-icon=""
            :placeholder=label
            prepend-inner-icon="mdi-magnify"
            rounded
            theme="light"
            variant="solo"
        >
        <template v-slot:no-data>
        <v-list-item>
            <v-list-item-content>
                <v-list-item-title>
                    {{ noDataMessage }}
                </v-list-item-title>
            </v-list-item-content>
        </v-list-item>
        </template>
      
    </v-autocomplete>
</template>

<script>
import _ from 'lodash'; // Certifique-se de que esta linha esteja no topo do seu script
export default {
    props: {
        label: {
            type: String,
            default: ''
        }
        // id: {
        // type: String,
        // required: true
        // },
        // label: {
        // type: String,
        // default: ''
        // },
        // value: {
        // type: String,
        // default: ''
        // }
    },
    data() {
        return {
            noDataMessage: "Digite pelo menos 3 caracteres para buscar.",
            searchQuery: "",
            results: []
        };
    },
    watch: {
        searchQuery: _.debounce(function (newVal) {
            this.searchStreet(newVal);
        }, 1000)
    }, 
    mounted(){
       
    },
    created(){
        this.debouncedSearch = _.debounce(this.updateSearchQuery, 500);
    },
    methods:  {
        concatObjectValues(obj) {
            let result = '';
            
            // Obter todas as chaves do objeto
            const keys = Object.keys(obj);
            
            // Iterar através das chaves para obter os valores e concatená-los
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const value = obj[key];
                
                // Se este não é o primeiro item, adiciona uma vírgula para separação
                if (i > 0) {
                result += ', ';
                }
                
                result += value;
            }
            
            return result;
        },

        updateSearchQuery(event) {
            this.searchQuery = event.target.value;
            this.searchStreet();
        },

        async searchStreet() {
            if (!this.searchQuery || this.searchQuery.length <= 3) {
                this.results = [];
                this.noDataMessage = "Digite pelo menos 3 caracteres para buscar."
                return;
            }

            const baseUrl = "https://nominatim.openstreetmap.org/search";
            const params = new URLSearchParams({
                q: `${this.searchQuery}`,
                format: "json",
                addressdetails: 1,
                limit: 5,
                languages: "pt-br",
                countrycodes: "br"
            });

            const url = `${baseUrl}?${params.toString()}`;

            try {
                const response = await fetch(url, {
                method: "GET",
                headers: {
                    "User-Agent": "YourAppName/1.0 (your@email.com)"
                }
                });

                if (response.ok) {
                    const data = await response.json();
                    this.results = data.map(el => this.concatObjectValues(el.address));
                    if(this.results.length <= 0){
                        this.noDataMessage = "Nenhum endereço encontrado"
                    }

                    
                } else {
                    console.error("Erro na resposta da API", response);
                }
            } catch (error) {
                console.error("Erro na busca", error);
            }
        }
    }
};
</script>

<style>

</style>