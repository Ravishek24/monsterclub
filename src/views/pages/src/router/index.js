import { createRouter, createWebHistory } from 'vue-router';

// import MainGuide from '@/components/MainGuide.vue';
import AboutView from '@/components/AboutView.vue';
import RiskAgreement from '@/components/RiskAgreement.vue';
import ConfidentialAgreement from '@/components/ConfidentialAgreement.vue';
const routes = [
  {
    path: '/AboutView',
    name: 'AboutView',
    component: AboutView,
  },
  {
    path: '/ConfidentialAgreement',
    name: 'ConfidentialAgreement',
    component:ConfidentialAgreement,
  },
  {
    path: '/RiskAgreement',
    name: 'RiskAgreement',
    component:RiskAgreement,
  },
];

const router = createRouter({
  history: createWebHistory(),  // Use history mode
  routes,  // Add the defined routes
});

export default router;
