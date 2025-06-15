<template>
  
  <MainGuide/>
  <!-- <GamStats/> -->
   <AboutView/>
   <ConfidentialAgreement/>
   <RiskAgreement/>
</template>

<script>
// import MainGuide from './components/MainGuide.vue';
// import GamStats from './components/GamStats.vue';
import AboutView from './components/AboutView.vue';
import ConfidentialAgreement from './components/ConfidentialAgreement.vue';
import RiskAgreement from './components/RiskAgreement.vue';
export default {
  name: 'App',
  components: {
    // MainGuide,
    // GamStats,
    AboutView,
    ConfidentialAgreement,
    RiskAgreement
  }
}
</script>

<style>
@import 'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css'

</style>
