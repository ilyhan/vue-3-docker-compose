<template>
  <div
    class="flask"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
    @click="() => handleClick()"
    :class="{
      'flask--dragging': isDragging,
      'flask--drag-over': isDragOver
    }"
  >
    <div class="flask__layers">
      <div
        v-for="(layer, index) in layers"
        :key="index"
        :style="{ backgroundColor: layer }"
        class="flask__block"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Flask",
  props: {
    layersCount: {
      type: Number,
      required: true
    },
    layers: {
      type: Array,
      required: true
    },
    isSelected: {
      type: Boolean,
      required: true
    },
    isDisabled: {
      type: Boolean,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    dragIndex: {
      type: Number,
      required: false
    }
  },
  emits: ["onSelect", "onReorder", "onSelectDragIndex"],
  data() {
    return {
      isDragging: false,
      isDragOver: false
    }
  },
  methods: {
    handleClick() {
      this.$emit("onSelect")
    },
    handleDragStart() {
      this.isDragging = true
      this.$emit("onSelectDragIndex", this.index)
    },
    handleDragEnd() {
      this.isDragging = false
      this.isDragOver = false
    },
    handleDragOver(event) {
      event.preventDefault()
      this.isDragOver = true
    },
    handleDragLeave() {
      this.isDragOver = false
    },
    handleDrop(event) {
      event.preventDefault()

      const fromIndex = this.dragIndex
      if (fromIndex === null || this.isDisabled) {
        return
      }

      const toIndex = this.index
      if (fromIndex !== toIndex) {
        this.$emit("onReorder", toIndex)
      }

      this.isDragOver = false
    }
  }
}
</script>
<style scoped lang="scss">
.flask {
  position: relative;
  height: 250px;
  width: 50px;
  border: 3px solid white;
  border-top: none;
  border-bottom-left-radius: 50px;
  border-bottom-right-radius: 50px;
  cursor: v-bind('isDisabled ? "default" : "pointer"');
  opacity: v-bind('isDisabled ? "0.4" : "1"');
  overflow: hidden;
  transition: 0.3s;
  transform: v-bind('isSelected && !isDisabled? "translateY(-20px)" : "none"');

  &:active {
    cursor: grabbing;
  }

  &--dragging {
    opacity: 0;
  }

  &--drag-over {
    scale: 0.95;
  }

  &__layers {
    position: absolute;
    bottom: 0;
    display: grid;
    height: 90%;
    width: 100%;
    rotate: 180deg;
    grid-template-rows: v-bind("`repeat(${layersCount}, 1fr)`");
  }

  &__block {
    height: 100%;
    width: 100%;
  }
}
</style>
