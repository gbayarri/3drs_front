<template>

    <Tools v-if="stageLoaded" :isDraft="isDraft" :showPlayer="showPlayer" />

    <PlayerShared v-if="stageLoaded && showPlayer" :isDraft="isDraft" />

    <Fork v-if="stageLoaded && hasFork && !disableComponents" :isDraft="isDraft" :project_id="project_id" />

    <Legend v-if="stageLoaded" />

    <Caption v-if="stageLoaded" />

    <Viewport v-if="loadViewport" :project_id="project_id" :hasBg="true" />

    <ModalEmbed v-if="stageLoaded" :project_id="project_id" />
    <ModalQR v-if="stageLoaded" :project_id="project_id" />

</template>

<script>
import { computed, ref, inject } from 'vue'
import useFlags from '@/modules/common/useFlags'
import useAPI from '@/modules/api/useAPI'
import useMessages from '@/modules/common/useMessages'
import useModals from '@/modules/common/useModals'
import useTrajectories from '@/modules/ngl/useTrajectories'
import Tools from '@/components/representation/Tools'
import Fork from '@/components/representation/Fork'
import Legend from '@/components/representation/Legend'
import Caption from '@/components/representation/Caption'
import PlayerShared from '@/components/representation/PlayerShared'
import Viewport from '@/components/representation/Viewport'
import ModalEmbed from '@/components/representation/modals/ModalEmbed'
import ModalQR from '@/components/representation/modals/ModalQR'
export default {
    components: { 
        Tools,
        Fork, Legend, Caption, PlayerShared,
        Viewport,
        ModalEmbed, ModalQR
    },
    props: ['id', 'hasFork', 'isDraft'],
    setup(props) {

        const $router = inject('$router')

        const { flags, setFlagStatus } = useFlags()
        const { apiData, fetchProject } = useAPI()
        const { setMessage } = useMessages()
        const { closeModal } = useModals()
        const { getNumberOfTrajectories } = useTrajectories()
        

        // activate tools, sidebar and so on
        const stageLoaded = computed(() => flags.stageLoaded)
        const width = ref(window.innerWidth)
        //const ratio = ref(window.devicePixelRatio)
        const disableComponents = computed(() => width.value < 768 )
        const loadViewport = ref(false)
        
        setFlagStatus('menuEnabled', false)
        setFlagStatus('stageLoaded', false)
        setFlagStatus('sidebarEnabled', false)
        setFlagStatus('legendEnabled', false)
        setFlagStatus('isShared', true)

        const project_id = props.id
        const isDraft = props.isDraft

        let showPlayer = ref(false)

        fetchProject(project_id)
        .then(() => {
          //  project doesn't exist, redirect to launch and show warning
          if(apiData.value.code === 404) {
            const msg = {
                severity: 'warn',
                content: 'You tried to access to an unexisting project, please check your project id or create a new one',
                show: true
            }
            setMessage('launch', msg)
            closeModal('block')
            $router.push({ name: 'Launch' }) 
            setFlagStatus('menuEnabled', true)
            return false
          }
          // project exists, but is read only (not representation)
         if(apiData.value.projectSettings.status !== 'rs' && !isDraft) {
              const msg = {
                severity: 'warn',
                content: 'You tried to access to an unexisting project, please check your project id or create a new one',
                show: true
            }
            setMessage('launch', msg)
            closeModal('block')
            $router.push({ name: 'Launch' }) 
            return false
          }

          showPlayer.value = getNumberOfTrajectories(apiData.value.files) > 0
          loadViewport.value = true
        })


        //let maxW = ratio.value > 1 ? Math.floor(600 / ratio.value) : 600
        setFlagStatus('responsive600', width.value < 600)
        setFlagStatus('responsive768', width.value < 768)
        //console.log(maxW)

        window.addEventListener("resize", () => {
            width.value = window.innerWidth
            //ratio.value = window.devicePixelRatio
            
            /*maxW = ratio.value > 1 ? Math.floor(600 / ratio.value) : 600
            console.log(maxW)*/

            setFlagStatus('responsive600', width.value < 600)
            setFlagStatus('responsive768', width.value < 768)
        })

        return { stageLoaded, project_id, disableComponents, loadViewport, showPlayer }
    }
}
</script>

<style>

</style>