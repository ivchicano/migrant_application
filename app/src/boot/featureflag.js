import Vue from 'vue'
import {featureFlippingDirective, featureFlippingGuard, isEnabled, setEnabledFeatures} from '../directive/FeatureFlip'

// We globally register our directive with Vue;
// Remember that all directives in Vue will start with 'v-'
// but that should not be part of your directive name
// https://vuejs.org/v2/guide/custom-directive.html
// 'my-directive' will be used as 'v-my-directive'
setEnabledFeatures(['FF1', 'FF2', 'FF3'])
//console.log(isEnabled('FF1'))
//Vue.directive('feature-flag', featureFlippingDirective)

Vue.directive('feature-flipping', featureFlippingDirective)
Vue.mixin({beforeRouteEnter: featureFlippingGuard})


console.log(Vue)
