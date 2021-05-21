import { reactive } from 'vue'

const flags = reactive({
    menuEnabled: true,
    stageLoaded: false,
    sidebarEnabled: false,
    legendEnabled: false, 
    zoomWindowEnabled: false, 
    customEnabled: false,
    isShared: false,
    responsive: false,
    navigationMode: false,
    labelPositionMode: false
})

export default function useFlags() {

  const setFlagStatus = function (label, status) {
    flags[label] = status
  }

  return { flags, setFlagStatus }

}