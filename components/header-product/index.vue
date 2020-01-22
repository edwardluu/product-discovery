<template>
  <div class="product-details-header">
    <button class="btn-previous" @click="onPrevious">
      <img src="~/static/img/arrow-back-icon.png" alt="icon-arrow-back" />
    </button>
    <div class="wrap-title-detail">
      <h3 class="title-detail">{{ name }}</h3>
      <div class="product-item-detail__finalprice tomato">
        {{ price }}
        <span class="product-item-detail__currency">đ</span>
      </div>
    </div>
    <a class="product-details__cart">
      <img src="~/static/img/cart-icon.png" alt="icon-arrow-back" />
      <span class="product-details__count" v-if="getCart > 0">{{
        getCart
      }}</span>
    </a>
  </div>
</template>

<script>
export default {
  name: "HeaderProduct",
  props: {
    name: {
      type: String,
      default: ""
    },
    price: {
      type: [Number, String],
      default: 0
    }
  },
  computed: {
    getCart() {
      return this.$store.state.cart.store.quantity;
    }
  },
  methods: {
    onPrevious() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="postcss" scoped>
.product-details-header {
  @apply bg-white flex items-center justify-between fixed z-50 top-0  w-full;
  height: 48pt;
  box-shadow: inset 0pt -1pt 0pt 0pt rgb(238 241 243);
  -moz-box-shadow: inset 0pt -1pt 0pt 0pt rgb(238 241 243);
  -webkit-box-shadow: inset 0pt -1pt 0pt 0pt rgb(238 241 243);
  padding: 5pt 12pt;
}
.btn-previous {
  height: 24pt;
  width: 24pt;
}
.wrap-title-detail {
  @apply text-center;
}
.wrap-title-detail .title-detail {
  @apply truncate font-bold;
  font-size: 13pt;
  line-height: 18pt;
  letter-spacing: -0.2pt;
  width: 156pt;
}
.product-item-detail__finalprice {
  @apply font-bold relative;
  font-size: 13pt;
  line-height: 19pt;
  letter-spacing: -0.14pt;
}
.product-details__count {
  @apply rounded-full text-white absolute flex items-center justify-center font-bold;
  width: 16pt;
  height: 16pt;
  background: rgb(245, 132, 0);
  top: -7px;
  right: -10px;
  font-size: 10pt;
  letter-spacing: -0.24pt;
}
.product-details__cart {
  @apply relative;
  height: 24pt;
  width: 24pt;
}
</style>
