import { defineStore } from 'pinia';

export const useModalStore = defineStore({
  id: 'modal',
  
  state: () => ({

    modal: false, 
    loadingMap: false
   
  }),

  actions: {
    showModal(){
        this.modal = true
    }, 
    closeModal(){
        this.modal = false
    }
  }
});