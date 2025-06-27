<script setup>
import { LineString } from 'ol/geom'
import { onMounted, ref, watch } from 'vue'
import { getLength } from 'ol/sphere'
import { unByKey } from 'ol/Observable'
import { useMapStore } from '@/stores/MapStore'
import { storeToRefs } from 'pinia'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-vue-next'

const mapStore = useMapStore()
const { mapRef, measuringDistance } = storeToRefs(mapStore)

const drawType = ref('LineString')
const sketch = ref(null)

const tooltipCoord = ref(null)
const tooltipText = ref('')

const helpTooltipCoord = ref(null)
const helpTooltipText = ref('')

const measureRef = ref()

const measureResultTooltip = ref([])

const continueLineMsg = 'Click to continue drawing the line'

let listener

function drawstart(evt) {
  sketch.value = evt.feature
  const geom = sketch.value.getGeometry()
  if (geom instanceof LineString) {
    tooltipCoord.value = geom.getLastCoordinate()

    listener = geom.on('change', function (evt) {
      const geom = evt.target
      if (geom instanceof LineString) {
        tooltipText.value = formatLength(geom)
        tooltipCoord.value = geom.getLastCoordinate()
      }
    })
  }
}

function drawend() {
  sketch.value.setId(measureResultTooltip.value.length)
  measureRef.value.source.addFeature(sketch.value)
  // remove drawn sketch
  sketch.value = null
  // unset tooltip so that a new one can be created
  measureResultTooltip.value.push({
    id: measureResultTooltip.value.length,
    coord: tooltipCoord.value,
    text: tooltipText.value,
  })
  tooltipCoord.value = null
  tooltipText.value = ''
  measuringDistance.value = false
  // cleanup listeners
  unByKey(listener)
}

function formatLength(line) {
  const length = getLength(line)
  let output = ''
  let m
  let km
  let ft
  let miles

  if (length > 100) {
    km = Math.round((length / 1000) * 100) / 100
    miles = Math.round(((length * 0.621371) / 1000) * 100) / 100
    output = `${km} km (${miles} miles)`
  } else {
    m = Math.round(length * 100) / 100
    ft = Math.round(length * 3.28084 * 100) / 100
    output = `${m} m (${ft} ft)`
  }
  return output
}

function showHelpInfoOnPointermove(evt) {
  if (evt.dragging) {
    return
  }
  let helpMsg = 'Click to start drawing'
  const geom = sketch.value?.getGeometry()
  if (geom instanceof LineString) {
    helpMsg = continueLineMsg
  }

  helpTooltipText.value = helpMsg
  helpTooltipCoord.value = evt.coordinate
}

function removeTooltip(id) {
  measureResultTooltip.value = measureResultTooltip.value.filter(t => t.id !== id)
  const feature = measureRef.value.source.getFeatureById(id)
  measureRef.value.source.removeFeature(feature)
}

onMounted(() => {
  mapRef.value?.map.getViewport().addEventListener('mouseout', function () {
    helpTooltipCoord.value = null
    helpTooltipText.value = ''
  })
})

watch(measuringDistance, (value) => {
  if (value) {
    mapRef.value?.map.on('pointermove', showHelpInfoOnPointermove)
  } else {
    mapRef.value?.map.un('pointermove', showHelpInfoOnPointermove)
  }
})
</script>

<template>
  <ol-overlay
    v-if="tooltipCoord"
    :position="tooltipCoord"
    :offset="[0, -15]"
    positioning="bottom-center"
    :stopEvent="false"
    :insertFirst="false"
  >
    <div class="tooltip tooltip-measure">
      {{ tooltipText }}
    </div>
  </ol-overlay>

  <ol-overlay
    v-for="tooltip in measureResultTooltip"
    :key="tooltip.id"
    :position="tooltip.coord"
    :offset="[0, -15]"
    positioning="bottom-center"
    :stopEvent="false"
    :insertFirst="false"
  >
    <div class="tooltip tooltip-static">
      <div class="flex gap-2">
        <div>{{ tooltip.text }}</div>
        <Button variant="icon" size="16" @click="removeTooltip(tooltip.id)"><X size="12" /></Button>
      </div>
    </div>
  </ol-overlay>

  <ol-overlay
    v-if="helpTooltipCoord"
    :position="helpTooltipCoord"
    :offset="[0, 15]"
    positioning="top-center"
  >
    <div class="tooltip tooltip-info">
      {{ helpTooltipText }}
    </div>
  </ol-overlay>

  <ol-vector-layer v-if="measuringDistance" zIndex="1000">
    <ol-source-vector>
      <ol-interaction-draw :type="drawType" @drawend="drawend" @drawstart="drawstart" />
    </ol-source-vector>

    <ol-style>
      <ol-style-stroke color="black" :width="2" />
      <ol-style-fill color="rgba(255, 255, 255, 0.2)" />
      <ol-style-circle :radius="7">
        <ol-style-fill color="black" />
      </ol-style-circle>
    </ol-style>
  </ol-vector-layer>

  <ol-vector-layer zIndex="1000">
    <ol-source-vector ref="measureRef"> </ol-source-vector>
    <ol-style>
      <ol-style-stroke color="black" :width="2" />
      <ol-style-fill color="rgba(255, 255, 255, 0.2)" />
      <ol-style-circle :radius="7">
        <ol-style-fill color="black" />
      </ol-style-circle>
    </ol-style>
  </ol-vector-layer>
</template>

<style lang="postcss" scoped>
.tooltip {
  position: relative;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  color: white;
  padding: 4px 8px;
  opacity: 0.7;
  white-space: nowrap;
  font-size: 12px;
  cursor: default;
  user-select: none;
}
.tooltip-measure {
  opacity: 1;
  font-weight: bold;
}
.tooltip-static {
  background-color: black;
  color: white;
  border: 1px solid white;
}
.tooltip-measure:before,
.tooltip-static:before {
  border-top: 6px solid rgba(0, 0, 0, 0.5);
  border-right: 6px solid transparent;
  border-left: 6px solid transparent;
  content: '';
  position: absolute;
  bottom: -6px;
  margin-left: -7px;
  left: 50%;
}
.tooltip-static:before {
  border-top-color: black;
}
</style>
