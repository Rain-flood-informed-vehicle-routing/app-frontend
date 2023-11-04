<template>
    <v-card>
        <v-layout>
            <v-navigation-drawer v-model="drawer" temporary style="width: 400px">
                <div class="flex-container">
                    <div class="align-right close">
                        <v-btn
                        
                        icon="$close"
                        density="comfortable"
                        variant="plain"
                        @click="drawer = !drawer"
                        ></v-btn>
                    </div>
                </div>
                <v-list>
                    <v-item-group>
                        <v-list-item>
                            <v-list-item-content>
                            <v-list-item-title>Página Inicial</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        
                        <v-list-item>
                            <v-list-item-content>
                            <v-list-item-title>Sobre</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-item-group>
                </v-list>
            </v-navigation-drawer>
        
            <v-main style="height: 100vh">
                <v-btn
                rounded
                fab large
                class="ma-2 circular-btn"
                color="white"
                style="position: absolute; z-index: 500;"
                @click.stop="drawer = !drawer"
                > 
                <v-icon>mdi-menu</v-icon>
                </v-btn>
                <LeafletMap></LeafletMap>
                <MapMenu></MapMenu>
        
            </v-main>
        </v-layout>
    </v-card>
</template>



<script>
import { ref, computed } from 'vue';
import { defineComponent } from 'vue';
import LeafletMap from '../LeafletMap.vue';
import MapMenu from '../MapMenu.vue';


export default defineComponent({
    name: "NavigationBar",
    components: {
        LeafletMap,
        MapMenu
    },
    data () {
        return {
            drawer: null,
        }
    },
})

</script>



<style scoped>
.sidenav{
    position: absolute;
    z-index: 10000;
}

.flex-container {
  display: flex;
  width: 100%;
}

.align-right {
  margin-left: auto;
}

.close{
    padding: 10px 20px 0px 0px;
}
</style>
