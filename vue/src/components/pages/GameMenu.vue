<template>
  <h1 class="menu__title">Переливатор</h1>
  <div class="menu__wrapper">
    <h2>Рекорды</h2>
    <div class="menu__records">
      <div class="menu__content menu__content--normal">
        Простой
        <p v-for="record in normalRecords">
          {{ record.time.toFixed(1, "0") }} сек.
        </p>
      </div>
      <div class="menu__content menu__content--hard">
        Сложный
        <p v-for="record in hardRecords">
          {{ record.time.toFixed(1, "0") }} сек.
        </p>
      </div>
    </div>
    <div>
      <p>Уровень сложности:</p>
      <div class="menu__difficulty">
        <button
          :class="[
            'menu__level',
            { 'menu__level--selected': getDifficulty === 'normal' }
          ]"
          @click="() => setDifficulty('normal')"
        >
          Простой
        </button>
        <button
          :class="[
            'menu__level',
            { 'menu__level--selected': getDifficulty === 'hard' }
          ]"
          @click="() => setDifficulty('hard')"
        >
          Сложный
        </button>
      </div>
    </div>
    <RouterLink :to="{ name: $routes.GAME }" class="menu__start">
      Старт
    </RouterLink>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

export default {
  name: "GameMenu",
  computed: {
    ...mapGetters("game", ["getRecords", "getDifficulty"]),

    normalRecords() {
      return this.getRecords("normal")
    },
    hardRecords() {
      return this.getRecords("hard")
    }
  },
  methods: {
    ...mapActions("game", ["setDifficulty"])
  }
}
</script>

<style scoped lang="scss">
.menu {
  &__wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 20px;
  }
  &__title {
    font-size: 40px;
    margin-bottom: 20px;
  }
  &__start {
    font-size: 20px;
    padding: 5px 40px;
    background-color: white;
    color: black;
    border: none;
    border-radius: 50px;
  }
  &__records {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  &__content {
    flex: 1;
    padding: 10px;
    width: 100px;
    min-height: 100px;
    border: 3px solid;
    border-radius: 10px;

    &--normal {
      border-color: whitesmoke;
    }

    &--hard {
      border-color: rgb(225, 93, 93);
    }
  }
  &__difficulty {
    display: flex;
    gap: 10px;
  }
  &__level {
    border: none;
    background-color: white;
    padding: 10px 20px;
    border-radius: 20px;
    transition: 0.3s;
    cursor: pointer;

    &--selected {
      background-color: rgb(172, 172, 172);
    }
  }
}
</style>
