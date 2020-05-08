<template lang="html">
  <div class="stitchings"
       :class="{
         '_planing' : planing,
         '_materials' : materials
         }">
    <div class="stitchings-inner" v-if="currentFrame">
      <div class="stitchings-frame">
        <svg class="frame" v-if="planing">
          <use xlink:href="#frame_planing"></use>
        </svg>
        <svg class="frame" v-else>
          <use xlink:href="#frame"></use>
        </svg>
        <div class="stitchings-mask">
          <svg :class="`p_${stitching}`" v-if="planing">
            <defs class="mask">
              <mask v-for="(material, index) in currentMaterial"
                    :id="`mask_${index + 1}`"
                    :key="`${material}_${index}`">
                <svg :class="`pm${index + 1}_${stitching}`">
                  <use :xlink:href="`#pm${index + 1}_${stitching}`"></use>
                </svg>
                <svg :class="`pmv_${stitching}`" v-if="index + 1 === currentMaterial.length">
                  <use :xlink:href="`#pmv_${stitching}`"></use>
                </svg>
              </mask>
            </defs>
            <g v-for="(material, index) in currentMaterial" :key="'m_' + index">
              <g v-for="(color, ind) in currentColor" :key="'с_' + ind">
                <image  v-if="(material && color) && (index === ind)"
                        :mask="`url(#mask_${index + 1})`"
                        height="100%"
                        width="100%"
                        @load="onLoaded"
                        @error="onError"
                        :class="{'image-error': imageError}"
                        :href="`${imgHref}/images/material/${material}${color}.jpg`"></image>
              </g>
            </g>
            <svg class="mask" :class="`p_${stitching}`">
              <use :xlink:href="`#p_${stitching}`"></use>
            </svg>
          </svg>

          <svg v-else>
            <defs class="mask">
              <mask v-for="(material, index) in currentMaterial"
                    :id="`mask_${index + 1}`"
                    :key="`${material}_${index}`">
                <svg :class="`sm${index + 1}_${stitching}`">
                  <use :xlink:href="`#sm${index + 1}_${stitching}`"></use>
                </svg>
              </mask>
            </defs>
            <g v-for="(material, index) in currentMaterial" :key="'m_' + index">
              <g v-for="(color, ind) in currentColor" :key="'с_' + ind">
                <image  v-if="(material && color) && (index === ind)"
                        :mask="`url(#mask_${index + 1})`"
                        height="100%"
                        width="100%"
                        @load="onLoaded"
                        @error="onError"
                        :class="{'image-error': imageError}"
                        :href="`${imgHref}/images/material/${material}${color}.jpg`"></image>
              </g>
            </g>
            <svg class="mask" :class="`s_${stitching}`">
              <use :xlink:href="`#s_${stitching}`"></use>
            </svg>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/stitchings.js'
import { isProduction } from '@/constants'
export default {
  props: ['arrBlocks', 'getStitchingsFrame'],
  data () {
    return {
      stitchings: {},
      innerMaterial: [],
      innerMaterialColors: {},
      innerMaterialColor: [],
      arrMaterialsStitching: [],
      arrColorsStitching: [],
      block: 0,
      cover: 0,
      stitching: 0,
      material: 0,
      materialsStitching: 0,
      colorsStitching: 0,

      // test
      isProduction,
      planing: false,
      materials: false,
      materialsSize: 0,
      imageError: false,
      imgHref: isProduction ? '' : '/static'
    }
  },
  computed: {
    currentFrame () {
      if (this.arrBlocks.length) {
        let block = String(this.getStitchingsFrame.block)
        let result = this.$_.find(this.arrBlocks, {'id': block})
        return result ? result.idIzd : this.arrBlocks[0].idIzd
      }
    },
    currentMaterial () {
      let arrMaterialsStitching = []
      for (let value of Object.values(this.materialsStitching)) {
        value = String(value)
        let material = this.$_.find(this.arrMaterialsStitching, {'id': value})
        if (material) {
          arrMaterialsStitching.push(material.name.split(' ')[0])
        }
      }
      if (this.arrMaterialsStitching.length && this.innerMaterial) {
        let str = String(this.innerMaterial)
        let innerMaterial = this.$_.find(this.arrMaterialsStitching, {'id': str})
        let material = innerMaterial.name.split(' ')[0]
        arrMaterialsStitching.splice(this.materialsSize, 1, material)
      }
      return arrMaterialsStitching
    },
    currentColor () {
      let arrColorsStitching = []
      let key = 1
      for (let value of Object.values(this.colorsStitching)) {
        value = String(value)
        let color = this.$_.find(this.arrColorsStitching[key], {'id': value})
        if (color) {
          arrColorsStitching.push(color.name.split(' ')[0])
        }
        key++
      }
      if (this.innerMaterialColors.length) {
        let str = String(this.innerMaterialColor)
        let innerMaterialColor = this.$_.find(this.innerMaterialColors, {'id': str})
        let color = innerMaterialColor.name.split(' ')[0]
        arrColorsStitching.splice(this.materialsSize, 1, color)
      }
      return arrColorsStitching
    }
  },
  watch: {
    getStitchingsFrame (newVal, oldVal) {
      this.stitchings = newVal
      this.block = this.stitchings.block
      this.innerMaterial = this.stitchings.innerMaterial
      this.innerMaterialColors = this.stitchings.innerMaterialColors
      this.innerMaterialColor = this.stitchings.innerMaterialColor
      this.arrMaterialsStitching = this.stitchings.arrMaterialsStitching
      this.arrColorsStitching = this.stitchings.arrColorsStitching
      this.stitching = this.stitchings.stitching
      this.material = this.stitchings.material
      this.materialsStitching = this.stitchings.materialsStitching
      this.block = this.stitchings.block
      this.colorsStitching = this.stitchings.colorsStitching
    },
    currentFrame (newVal, oldVal) {
      this.planing = newVal === '3' ? 1 : 0
    },
    materialsStitching (newVal, oldVal) {
      this.materialsSize = this.$_.size(this.materialsStitching)
      this.materials = this.stitching && this.materialsSize > 1 ? 1 : 0
      console.log('Test')
    }
  },
  methods: {
    onLoaded (e) {
      this.imageError = false
    },
    onError (e) {
      this.imageError = true
    }
  }
}
</script>

<style lang="scss" scoped>
.stitchings {
  transform: scale(1.5) translate(0, 23%);
  transition:  all .2s ease;
  height: 270px;

  &._planing,
  &._planing._materials {
    transform: scale(1.5) translate(0, 9%);
    height: 180px;
  }

  &-inner {
    text-align: center;
    height: 100%;
  }
  &-frame {
    width: 100%;
    height: 100%;
    position: relative;
    .frame {
      position: relative;
      z-index: 8;
    }
  }
  &-mask {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    .mask {
      position: relative;
      z-index: 10;
    }
  }
  .image-error {
    display: none;
  }
}
.item {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  // clip-path: url(#mask);
}
@media all and (min-width: getBreakpointVal(sm)) {
  .stitchings {
    position: absolute;
    transform: scale(2);
    height: auto;
    transition:  all .2s ease;

    &._planing,
    &._planing._materials {
      transform: scale(2);
      margin-top: 10px;
    }
    &._materials {
      transform: scale(2) translate(0, 23%);
      transition:  all .2s ease;
    }
  }
}
</style>
