<template>
  <ion-app>
    <ion-router-outlet id="main-content" />
  </ion-app>
  <menu-components />
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { defineComponent } from 'vue';
import MenuComponents from './components/MenuComponents.vue';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet,
    MenuComponents
  }
});
</script>