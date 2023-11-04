<template>
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        persistent
        width="auto"
      >
        <v-card>
          <v-card-title class="text-h5">
            Erro
          </v-card-title>
         <v-card-text>
            Pontos de origem e destino não foram inseridos.
         </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green-darken-1"
              variant="text"
              @click="close"
            >
              Fechar
            </v-btn>
    
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </template>

<script lang="ts">
    import { computed } from 'vue';
    import { useModalStore } from '@/store/modalStore';

    export default {
        data () {
        },
        setup() {

            const store = useModalStore()
            const dialog = computed(() => store.modal); 

            const close = () => {
                store.closeModal()
            }

            return { dialog, close}
          
        },
    }
</script>

