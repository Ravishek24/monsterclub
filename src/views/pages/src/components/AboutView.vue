<template>
  <div class="aboutus">

   <div class="gamstat-navbar aboutus-navbar">
      <div class="gamestat-navbar-fixed aboutus-fixednavbar">
        <div class="gamstat-navbar-content aboutus-navcontent">
          <div class="gamstat-content-left aboutus">
            <i class='bx bx-chevron-left aboutus'></i>
          </div>
          <div class="gamstat-content-center aboutus">About us</div>
          <div class="gamstat-content-right aboutus"></div>
        </div>
      </div>
    </div>
    <div class="aboutus-content">
      <img src="../assets/about1.png" alt="">
    </div>
    <div class="about-container">
      <div class="about-container-text">
        <router-link to="/ConfidentialAgreement"><i class='bx bxs-notepad icon'></i></router-link>
        <p>Confidentiality Agreement</p>
      </div>
      <i class='bx bx-chevron-right'></i>
    </div>
    <div class="about-container">
      <div class="about-container-text">
        <router-link to="/RiskAgreement"> <i class='bx bxs-bookmark-alt icon'></i></router-link>
        <p>Risk Disclosure Agreement</p>
      </div>
      <i class='bx bx-chevron-right'></i>
    </div>
    <router-view></router-view>
  </div>
   </template>
   
   <script>
   export default {
     name: 'AboutView',
     props: {
       msg: String
     }
   }
   </script>
   
   <!-- Add "scoped" attribute to limit CSS to this component only -->
   <style scoped>
   
   </style>
   