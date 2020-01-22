<template>
  <div class="product-list">
    <div class="product-list-header">
      <div class="wrap-input-search">
        <button class="button-search" @click="onSearchProductList($event)">
          <img src="~/static/img/search.png" alt="icon-search" />
        </button>
        <input
          class="input-search dark-grey"
          placeholder="Nhập tên, mã sản phẩm"
          v-model="querySearch"
        />
      </div>
    </div>
    <div class="product-list-body">
      <nuxt-link
        :to="{ path: `/product/${item.sku}` }"
        class="product-item"
        v-for="(item, index) in listProduct"
        :key="index"
      >
        <div class="product-item-img w-1/4">
          <img :src="getImage(item.images)" :alt="item.name" />
        </div>
        <div class="product-item-detail w-3/4">
          <h3 class="product-item-detail__title dark-grey">
            {{ item.displayName | truncate }}
          </h3>
          <div class="product-item-detail__finalprice tomato">
            {{ getFinalPrice(item.promotionPrices) }}
            <span class="product-item-detail__currency">đ</span>
          </div>
          <div
            v-if="!hasPromo(item.promotionPrices)"
            class="product-item-detail__sell cool-grey"
          >
            <span class="product-item-detail__bestprice cool-grey"
              >{{ getBestPrice(item.promotionPrices) }}
            </span>
            <span class="product-item-detail__tag"
              >-{{ getPercentSell(item.promotionPrices) }}%</span
            >
          </div>
        </div>
      </nuxt-link>
      <infinite-loading
        @infinite="infiniteHandler"
        spinner="spiral"
      ></infinite-loading>
    </div>
  </div>
</template>

<script>
export default {
  layout: "products",
  name: "ProductList",
  data() {
    return {
      API_URL:
        "search/?saleCategories=540&channel=pv_online&terminal=phongvu&saleStatuses=hang_ban,hang_dat_truoc,hang_sap_het,hang_moi,hang_trung_bay,hang_thanh_ly&_sort=saleStatuses%7C%7Chang_ban%7Chang_dat_truoc%7Chang_sap_het%7Chang_moi%7C%7Chang_trung_bay%7Chang_thanh_ly%7C%7Cngung_kinh_doanh&publishStatus=true",
      API_URL_SEACH:
        "search/?responses=products,keywords&channel=pv_online&terminal=phongvu&saleStatuses=hang_ban,hang_sap_het,hang_moi,hang_trung_bay,hang_thanh_ly,ngung_kinh_doanh&publishStatus=true",
      listProduct: [],
      querySearch: "",
      pages: {
        _order: "asc",
        _page: 1,
        _limit: 20
      }
    };
  },
  filters: {
    truncate: function(value) {
      return value.length > 70
        ? value.substring(0, 70).trim() + "..."
        : value.trim();
    }
  },
  methods: {
    onSearchProductList(event) {
      event.preventDefault();
      this.searchProductList();
    },
    async searchProductList() {
      this.API_URL = this.API_URL_SEACH.concat(`&q=${this.querySearch}`);
      this.pages._page = 1;
      const data = await this.$axios.$get(this.API_URL, {
        params: {
          ...this.pages
        }
      });
      this.listProduct = data.result.products;
      this.pages._page = this.pages._page + 1;
    },
    checkLengthValue(value) {
      return value.length > 0;
    },
    hasPromo(value) {
      return this.checkLengthValue(value)
        ? value[0].bestPrice === value[0].finalPrice
        : false;
    },
    getImage(value) {
      return this.checkLengthValue(value)
        ? value[0].url
        : require("~/static/img/default-img.png");
    },
    getFinalPrice(value) {
      return this.checkLengthValue(value) ? this.priceWithDot(value[0].bestPrice) : 0;
    },
    getBestPrice(value) {
      return this.checkLengthValue(value)
        ? this.priceWithDot(value[0].finalPrice)
        : 0;
    },
    getPercentSell(value) {
      return this.checkLengthValue(value)
        ? Math.floor(100 - (value[0].bestPrice / value[0].finalPrice) * 100)
        : 0;
    },
    priceWithDot(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    infiniteHandler($state) {
      this.$axios
        .$get(this.API_URL, {
          params: {
            ...this.pages,
            _page: this.pages._page
          }
        })
        .then(({ result }) => {
          if (result.products.length) {
            this.pages._page += 1;
            this.listProduct.push(...result.products);
            $state.loaded();
          } else {
            $state.complete();
          }
        });
    }
  }
};
</script>

<style lang="postcss" scoped>
.product-list-header {
  @apply w-full;
  height: 48pt;
  background: linear-gradient(108deg, rgb(223, 32, 32), rgb(245, 71, 30));
  padding: 8pt 11pt;
}
.wrap-input-search {
  @apply relative bg-white w-full flex items-center;
  height: 32pt;
  border-radius: 8pt;
  z-index: 10;
  box-shadow: 0pt 2pt 4pt 0pt rgba(0, 0, 0, 0.3);
  -moz-box-shadow: 0pt 2pt 4pt 0pt rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0pt 2pt 4pt 0pt rgba(0, 0, 0, 0.3);
}
.input-search {
  @apply h-full w-full;
  border-radius: 0pt 8pt 8pt 0;
  font-size: 14pt;
  line-height: 19pt;
  letter-spacing: -0.15pt;
}
.button-search {
  @apply h-full;
  z-index: 20;
  width: 30pt;
  margin: 0 8pt;
}
.button-search img {
  height: 24pt;
  width: 24pt;
}
.product-list-body {
  @apply w-full;
}
.product-item {
  @apply w-full bg-white flex;
  height: 104pt;
  padding: 12pt;
  box-shadow: 0pt -1pt 0pt 0pt rgb(238 241 243);
  -moz-box-shadow: 0pt -1pt 0pt 0pt rgb(238 241 243);
  -webkit-box-shadow: 0pt -1pt 0pt 0pt rgb(238 241 243);
}
.product-item:not(:first-child) {
  margin-top: 4pt;
}
.product-item .product-item-img {
  height: 80pt;
  width: 80pt;
}
.product-item .product-item-detail {
  padding-left: 12pt;
}
.product-item-detail__title {
  word-break: break-all;
  font-size: 14pt;
  line-height: 19pt;
  letter-spacing: -0.15pt;
}
.product-item-detail__finalprice {
  @apply font-bold relative;
  font-size: 15pt;
  line-height: 20pt;
  letter-spacing: -0.4pt;
}
.product-item-detail__currency {
  @apply absolute;
  font-size: 12pt;
  top: -3px;
  margin-left: 3px;
}
.product-item-detail__sell {
  @apply flex;
}
.product-item-detail__bestprice {
  @apply line-through flex;
  font-size: 12pt;
  line-height: 16pt;
  letter-spacing: -0.1pt;
  margin-right: 10pt;
}
.product-item-detail__tag {
  @apply relative text-white flex items-center justify-start no-underline;
  width: 26pt;
  height: 15pt;
  font-size: 10pt;
  letter-spacing: -0.24pt;
  background: rgb(245, 71, 30);
  border-radius: 1pt 2pt 2pt 1pt;
}
.product-item-detail__tag::before {
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
</style>
