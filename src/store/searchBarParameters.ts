import { SearchParametersState } from '@/types/queryLocation'
import { defineStore } from 'pinia'

export const searchBarParameters = defineStore('searchBarParameters', {

  state: (): SearchParametersState => ({
    destinyLocation: '',
    sourceLocation:''
  })
})
