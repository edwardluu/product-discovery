<template>
  <div class="product-details">
    <HeaderProduct
      :name="product.displayName"
      :price="getFinalPrice(product.promotionPrices)"
    />
    <div
      class="product-details-carousel"
      v-if="checkLengthValue(product.images)"
    >
      <VueSlickCarousel class="slick-slider-details h-full" v-bind="settings">
        <img
          v-for="(image, index) in images"
          :key="index"
          :src="getImage(image.url)"
          :alt="image.url"
        />
      </VueSlickCarousel>
    </div>
    <div class="product-detail-information">
      <h3 class="product-detail-information__title dark-grey ">
        {{ product.displayName }}
      </h3>
      <p class="product-detail-information__code">
        <span class="cool-grey">Mã SP:</span>
        <span class="sky-blue ">{{ product.sku }}</span>
      </p>
      <div
        class="product-detail-information__status pale-grey cool-grey"
        v-if="hasStatus(product.status)"
      >
        Tạm hết hàng
      </div>
      <div
        class="product-detail-information__price"
        v-if="!hasStatus(product.status)"
      >
        <span class="product-detail-information__finalprice tomato">
          {{ getFinalPrice(product.promotionPrices) }}
          <span class="product-detail-information__currency tomato">đ</span>
        </span>
        <span
          class="product-detail-information__bestprice cool-grey"
          v-if="hasPromo(product.promotionPrices)"
        >
          {{ getBestPrice(product.promotionPrices) }}
        </span>
        <span
          class="product-detail-information__tag"
          v-if="hasPromo(product.promotionPrices)"
          >-{{ getPercentSell(product.promotionPrices) }}%
        </span>
      </div>
    </div>
    <div class="product-detail-description">
      <el-tabs v-model="activeName">
        <el-tab-pane
          label="Mô tả sản phẩm"
          name="first"
          class="product-detail-description__tab"
          :style="{ height: getHeight }"
          :class="{ 'show-more': getShow }"
        >
          <div class="product-detail-description__wrap ">
            <span
              v-if="product.seoInfo"
              v-html="product.seoInfo.description"
            ></span>
          </div>
          <div class="wrap-readmore">
            <button @click="onReadMore" class="show-more-btn sky-blue">
              {{ getStatusTitle }}
              <img
                src="~/static/img/arrow-down-icon.png"
                alt="arrow-down-icon"
              />
            </button>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="Thông số kỹ thuật"
          name="second"
          class="product-detail-description__tab"
        >
          <div class="product-detail-description__wrap">Thông số kỹ thuật</div>
        </el-tab-pane>
        <el-tab-pane
          label="So sánh giá"
          name="third"
          class="product-detail-description__tab"
        >
          <div class="product-detail-description__wrap">So sánh giá</div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="product-detail-payment">
      <div class="product-detail-payment__quantity">
        <button class="product-detail-payment__btn" @click="onMinusItem">
          <img
            class="product-detail-icon"
            src="~/static/img/remove-icon.png"
            alt="remove-icon"
          />
        </button>
        <span class="product-detail-payment__btn dark-grey">
          {{ quantity }}
        </span>
        <button class="product-detail-payment__btn" @click="onAddItem">
          <img
            class="product-detail-icon"
            src="~/static/img/add-icon.png"
            alt="add-icon"
          />
        </button>
      </div>
      <button
        class="product-detail-payment__addcart"
        @click="onAddToCart"
        :disabled="hasStatus(product.status)"
      >
        <img
          class="product-detail-icon"
          src="~/static/img/add-to-cart.png"
          alt="add-to-cart"
        />
        <span> {{ getPrice }} đ</span>
      </button>
    </div>
  </div>
</template>

<script>
import VueSlickCarousel from "vue-slick-carousel";
import HeaderProduct from "@/components/header-product";
export default {
  components: { VueSlickCarousel, HeaderProduct },
  data() {
    return {
      settings: {
        arrows: false,
        dots: true,
        lazyLoad: "ondemand"
      },
      activeName: "first",
      showMore: false,
      product: {},
      images: [],
      quantity: 1,
      price: 0
    };
  },
  computed: {
    getHeight() {
      return this.showMore ? "auto" : "250pt";
    },
    getPrice() {
      return this.convertPriceWithDot(this.price * this.quantity);
    },
    getShow() {
      return !this.showMore;
    },
    getStatusTitle() {
      return this.showMore ? "Thu Gọn" : "Hiển thị nhiều hơn";
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start();
      this.getProduct();
    });
  },
  methods: {
    checkLengthValue(value) {
      return value && value.length > 0;
    },
    getImage(value) {
      return value !== "" ? value : require("~/static/img/default-img.png");
    },
    getFinalPrice(value) {
      return this.checkLengthValue(value)
        ? this.convertPriceWithDot(value[0].bestPrice)
        : 0;
    },
    getBestPrice(value) {
      return this.checkLengthValue(value)
        ? this.convertPriceWithDot(value[0].finalPrice)
        : 0;
    },
    getPercentSell(value) {
      this.checkLengthValue(value)
        ? Math.floor(100 - (value[0].bestPrice / value[0].finalPrice) * 100)
        : null;
    },
    hasStatus(value) {
      return value && value.sale === "ngung_kinh_doanh";
    },
    hasPromo(value) {
      return (
        this.checkLengthValue(value) &&
        value[0].bestPrice === value[0].finalPrice
      );
    },
    onAddToCart() {
      this.$store.commit("cart/add", this.quantity);
    },
    onMinusItem() {
      this.quantity > 1 ? (this.quantity -= 1) : (this.quantity = 1);
    },
    onAddItem() {
      this.quantity += 1;
    },
    convertPriceWithDot(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    onReadMore() {
      this.showMore = !this.showMore;
    },
    async getProduct() {
      const API_URL = `/products/${this.$route.params.id}`;
      const data = await this.$axios.$get(API_URL, {
        params: {
          channel: "pv_online",
          terminal: "phongvu"
        }
      });
      this.product = { ...data.result.product };
      this.images = data.result.product.images;
      this.price = this.checkLengthValue(data.result.product.promotionPrices)
        ? data.result.product.promotionPrices[0].bestPrice
        : 0;
      this.$nuxt.$loading.finish();
    }
  }
};
</script>

<style lang="postcss" scoped>
.product-details-carousel {
  @apply bg-white w-full;
  height: 327pt;
  padding: 24pt;
}
.product-details-carousel /deep/.slick-dots li button:before {
  font-size: 11px !important;
}
.product-details-carousel /deep/ .slick-list {
  height: 100%;
}
.product-details-carousel /deep/ .slick-track {
  height: 100%;
}
.product-detail-information {
  @apply bg-white w-full;
  height: auto;
  padding: 12pt;
  box-shadow: inset 0pt 1pt 0pt 0pt rgb(238 241 243);
  -moz-box-shadow: inset 0pt 1pt 0pt 0pt rgb(238 241 243);
  -webkit-box-shadow: inset 0pt 1pt 0pt 0pt rgb(238 241 243);
}
.product-detail-information__title {
  @apply font-semibold;
  font-size: 17pt;
  line-height: 22pt;
  letter-spacing: -0.4pt;
}
.product-detail-information__code {
  font-size: 12pt;
  line-height: 16pt;
  letter-spacing: -0.1pt;
  margin-top: 4pt;
}
.product-detail-information__status {
  font-size: 12pt;
  line-height: 16pt;
  padding: 3pt 8pt;
  letter-spacing: -0.1pt;
  border-radius: 8pt;
  width: 92pt;
  height: 22pt;
  margin: 8pt 0;
}
.product-detail-information__finalprice {
  @apply relative font-semibold;
  font-size: 17pt;
  line-height: 22pt;
  letter-spacing: -0.41pt;
}
.product-detail-information__currency {
  @apply absolute;
  font-size: 14pt;
  top: -3px;
  margin-left: 3px;
  line-height: 22pt;
  letter-spacing: -0.41pt;
}
.product-detail-information__bestprice {
  @apply line-through flex;
  font-size: 12pt;
  line-height: 16pt;
  letter-spacing: -0.1pt;
  margin-left: 16pt;
}
.product-detail-information__price {
  @apply flex items-center justify-start;
}
.product-detail-information__tag {
  @apply relative text-white flex items-center justify-start no-underline;
  width: 26pt;
  height: 15pt;
  font-size: 10pt;
  letter-spacing: -0.24pt;
  background: rgb(245, 71, 30);
  border-radius: 1pt 2pt 2pt 1pt;
  margin-left: 10pt;
}
.product-detail-information__tag::before {
  content: "";
  position: absolute;
  top: 0px;
  left: -10px;
  width: 0;
  height: 0;
  border-color: transparent rgb(245, 71, 30) transparent transparent;
  border-style: solid;
  border-width: 10px 10px 10px 0;
}
.product-detail-description {
  @apply bg-white w-full;
  margin: 8pt 0;
  height: auto;
}
.product-detail-description /deep/ .el-tabs__item.is-active {
  color: rgb(223, 32, 32);
}
.product-detail-description /deep/ .el-tabs__active-bar {
  background-color: rgb(223, 32, 32);
}
.product-detail-description /deep/ .el-tabs__item {
  font-size: 13pt;
}
.product-detail-description /deep/ .el-tabs__nav {
  margin-left: 12pt;
  display: flex;
  align-items: center;
  height: 42pt;
}
.product-detail-description__tab {
  @apply bg-white relative;
  height: 250pt;
}
.show-more::before {
  content: "";
  background-image: linear-gradient(
    to top,
    rgb(255, 255, 255),
    rgba(255, 255, 255, 0)
  );
  position: absolute;
  height: 160px;
  right: 0px;
  bottom: 44px;
  left: 0px;
}
.product-detail-description__wrap {
  padding: 0 12pt 12pt;
}
.wrap-readmore {
  @apply absolute bg-white  bottom-0 w-full z-30 flex items-center justify-center;
}
.show-more-btn {
  @apply flex items-center justify-center;
  font-size: 13pt;
  line-height: 18pt;
  letter-spacing: -0.2pt;
  height: 42pt;
}
.show-more-btn img {
  width: 16pt;
  height: 16pt;
}
.product-detail-payment {
  @apply bg-white flex items-center justify-between sticky z-50 bottom-0 w-full;
  height: 64pt;
  padding: 8pt;
  box-shadow: inset 0pt 1pt 0pt 0pt rgb(238 241 243);
  -moz-box-shadow: inset 0pt 1pt 0pt 0pt rgb(238 241 243);
  -webkit-box-shadow: inset 0pt 1pt 0pt 0pt rgb(238 241 243);
}
.product-detail-payment__quantity {
  @apply flex items-center justify-center;
}
.product-detail-payment__btn {
  @apply bg-white flex items-center justify-center;
  width: 40pt;
  height: 48pt;
  padding: 12pt 8pt;
}
.product-detail-icon {
  height: 24pt;
  width: 24pt;
}
.product-detail-payment__addcart {
  @apply text-white flex items-center justify-between;
  height: 48pt;
  width: 231pt;
  border-radius: 8pt;
  padding: 14pt 16pt;
  background: linear-gradient(108deg, rgb(223, 32, 32), rgb(245, 71, 30));
}
.product-detail-payment__addcart span {
  @apply text-white font-semibold;
  font-size: 15pt;
  line-height: 20pt;
  letter-spacing: -0.4pt;
}
</style>
