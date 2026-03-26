<template>
  <div class="game-page">
    <div class="game-page__header">
      <RouterLink :to="{ name: $routes.MENU }" class="game-page__back">
        Назад
      </RouterLink>
      <div>{{ formattedTimer }}с</div>
    </div>
    <div class="game-page__flasks">
      <Flask
        v-for="(flask, index) in flasks"
        :key="index"
        :layersCount="MAX_LAYERS"
        :layers="flask.layers"
        :isSelected="selectedFlaskIndex === index"
        :isDisabled="disabledFlaskIndex === index"
        :index="index"
        :dragIndex="dragIndex"
        @onSelect="() => handleFlaskSelect(index)"
        @onReorder="(toIndex) => handleReorder(toIndex)"
        @onSelectDragIndex="(dragIndex) => handleSetDragIndex(dragIndex)"
      />
    </div>
    <button
      class="game-page__button"
      @click="() => resetGame()"
      v-if="isGameFinished"
    >
      Новая игра
    </button>
  </div>
</template>

<script>
import Flask from "../ui/Flask.vue"
import { mapGetters, mapActions } from "vuex"

const MAX_LAYERS = 4
const FLASKS_COUNT = 4
const COLORS = ["red", "blue", "green", "yellow"]

export default {
  name: "GamePage",
  components: {
    Flask
  },
  data() {
    return {
      flasks: [],
      selectedFlaskIndex: null,
      disabledFlaskIndex: null,
      MAX_LAYERS: MAX_LAYERS,
      timer: 0,
      isRunning: false,
      intervalId: null,
      dragIndex: null
    }
  },
  computed: {
    ...mapGetters("game", ["getDifficulty"]),

    formattedTimer() {
      return this.timer.toFixed(1, "0")
    },
    isGameFinished() {
      const isFinish = this.flasks.every((flask) => {
        if (flask.layers.length === 0) {
          return true
        }

        const firstColor = flask.layers[0]
        const oneColor = flask.layers.every((color) => color === firstColor)

        if (flask.layers.length === MAX_LAYERS && oneColor) {
          return true
        }

        return false
      })

      if (isFinish) {
        this.stopGame()
        return true
      }
      return false
    }
  },
  methods: {
    ...mapActions("game", ["addRecord"]),

    handleReorder(toIndex) {
      const newFlasks = [...this.flasks]
      const movedFlask = newFlasks.splice(this.dragIndex, 1)
      newFlasks.splice(toIndex, 0, ...movedFlask)
      this.flasks = newFlasks
    },
    handleSetDragIndex(index) {
      if (this.disabledFlaskIndex !== index) {
        this.dragIndex = index
      } else {
        this.dragIndex = null
      }
    },
    startGame() {
      const colorsArray = []
      const newFlasks = []

      for (let i = 0; i < MAX_LAYERS; i++) {
        for (let j = 0; j < FLASKS_COUNT; j++) {
          colorsArray.push(COLORS[j % COLORS.length])
        }
      }

      for (let i = colorsArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = colorsArray[i]
        colorsArray[i] = colorsArray[j]
        colorsArray[j] = temp
      }

      for (let i = 0; i < FLASKS_COUNT; i++) {
        const startIndex = i * MAX_LAYERS
        const flaskLayers = colorsArray.slice(
          startIndex,
          startIndex + MAX_LAYERS
        )
        newFlasks.push({
          layers: flaskLayers
        })
      }

      const emptyFlask = { layers: [] }
      newFlasks.push(emptyFlask)
      newFlasks.push(emptyFlask)

      this.flasks = newFlasks
      this.selectedFlaskIndex = null
      this.shuffleDisabledIndex()
      this.startTimer()
    },
    resetGame() {
      this.resetTimer()
      this.startGame()
    },
    stopGame() {
      this.stopTimer()
      this.addRecord(this.timer)
    },
    handleFlaskSelect(index) {
      if (this.isGameFinished) {
        return
      }

      if (this.selectedFlaskIndex === null) {
        if (this.flasks[index].layers.length > 0) {
          this.selectedFlaskIndex = index
        }
        return
      }

      if (this.selectedFlaskIndex === index) {
        this.selectedFlaskIndex = null
        return
      }

      if (
        this.selectedFlaskIndex !== null &&
        (this.disabledFlaskIndex === index ||
          this.selectedFlaskIndex === this.disabledFlaskIndex)
      ) {
        this.selectedFlaskIndex = null
        return
      }

      this.shuffleDisabledIndex()
      this.transfusion(this.selectedFlaskIndex, index)
      this.selectedFlaskIndex = null
    },
    shuffleDisabledIndex() {
      if (this.getDifficulty === "hard") {
        const disabledIndex =
          Math.floor(Math.random() * 100) % this.flasks.length
        this.disabledFlaskIndex = disabledIndex
      }
    },
    transfusion(fromIndex, toIndex) {
      const fromFlask = this.flasks[fromIndex]
      const toFlask = this.flasks[toIndex]

      if (
        fromFlask.layers.length === 0 ||
        toFlask.layers.length === MAX_LAYERS
      ) {
        return
      }

      const fromLayerLen = fromFlask.layers.length
      const toLayerLen = toFlask.layers.length

      let sameLayerCount = 0
      const topColor = fromFlask.layers[fromLayerLen - 1]
      for (let i = fromLayerLen - 1; i >= 0; i--) {
        if (fromFlask.layers[i] === topColor) {
          sameLayerCount++
        } else {
          break
        }
      }

      const availableSpace = MAX_LAYERS - toLayerLen
      if (toLayerLen > 0) {
        const toTopColor = toFlask.layers[toLayerLen - 1]
        if (toTopColor !== topColor) {
          return
        }
      }

      const actualPour = Math.min(sameLayerCount, availableSpace)
      if (actualPour === 0) {
        return
      }

      const newFromLayers = [...fromFlask.layers]
      const newToLayers = [...toFlask.layers]

      for (let i = 0; i < actualPour; i++) {
        newFromLayers.pop()
        newToLayers.push(topColor)
      }

      const newFlasks = [...this.flasks]
      newFlasks[fromIndex] = {
        layers: newFromLayers
      }
      newFlasks[toIndex] = {
        layers: newToLayers
      }

      this.flasks = newFlasks
    },
    startTimer() {
      if (this.isRunning) {
        return
      }

      this.isRunning = true
      this.intervalId = setInterval(() => {
        this.timer += 0.1
      }, 100)
    },
    stopTimer() {
      clearInterval(this.intervalId)
      this.isRunning = false
    },
    resetTimer() {
      this.stopTimer()
      this.timer = 0
    }
  },
  created() {
    this.startGame()
  },
  unmounted() {
    this.resetTimer()
  }
}
</script>

<style scoped lang="scss">
.game-page {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 20px;
  }

  &__back {
    color: white;
    transition: 0.3s;
    background: none;

    &:hover {
      translate: -3px 0;
      opacity: 0.8;
    }
  }

  &__flasks {
    display: flex;
    gap: 40px;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 40px;
  }

  &__button {
    font-size: 20px;
    padding: 15px 40px;
    background-color: white;
    border: none;
    border-radius: 50px;
  }
}
</style>
