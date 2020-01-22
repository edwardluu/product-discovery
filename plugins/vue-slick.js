import Vue from 'vue';
import VueSlickCarousel from 'vue-slick-carousel'
 
// import style
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
// optional style for arrows & dots
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

Vue.use(VueSlickCarousel);

if (process.client) {
    require('vue-slick-carousel');
}
