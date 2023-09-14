<script setup lang="ts">
import RetroAdvertisementCard from '@/components/RetroAdvertisementCard.vue';
import { IRetroAdvertisement, IRetroAdvertisementsResponse } from '@/models/RetroAdvertisementModels';
import { directus } from '@/services/directus.service';
import ToolbarComponent from '@/components/ToolbarComponent.vue';
import { IonContent, IonPage, IonSegment, IonSegmentButton, IonTitle, IonRefresher, IonRefresherContent, onIonViewDidEnter, RefresherCustomEvent, IonToolbar, IonButton, IonIcon } from '@ionic/vue';
import { searchOutline, calendarOutline, cardOutline, newspaperOutline } from "ionicons/icons";
import { ref } from 'vue';

const retroAdvertisements = ref<IRetroAdvertisement[]>([]);

//Accessing the current user
const userAccessToken = localStorage.getItem("auth_token");

//Track of the input field for searchText
const searchText = ref("");


const initializeSearch = async () => {
  searchAdvertisements();
}

onIonViewDidEnter(() => {
  fetchRetroAdvertisements();
})

const refreshRetroAdvertisementsView = async (event: RefresherCustomEvent) => {
  await fetchRetroAdvertisements();
  event.target.complete();
}

//sort: [ "-date_created"] -> sorts the data by most recently added
const fetchRetroAdvertisements = async () => {
  const response = await directus.graphql.items<IRetroAdvertisementsResponse>(`
    query {
      retro_advertisements (
        sort: [ "-date_created" ]) 
      {
        id,
        heading,
        description,
        price,
        hashtags,
        category,
        image {
          id
        },
        user_created {
          first_name
          email
        }
      }
    }
  `);

  if (response.status === 200 && response.data) {
    retroAdvertisements.value = [...response.data.retro_advertisements];
  }
}

//SEARCH
const searchAdvertisements = async () => {
  const response = await directus.graphql.items<IRetroAdvertisementsResponse>(`
    query {
      retro_advertisements(
        search: "${searchText.value}"
        sort: [ "-date_created" ]) 
      {
        id,
        heading,
        price,
        category,
        image {
          id
        },
      }
    }
  `);

  if (response.status === 200 && response.data) {
    retroAdvertisements.value = [...response.data.retro_advertisements];
  }
}

const filterPrice = async () => {
  const response = await directus.graphql.items<IRetroAdvertisementsResponse>(`
    query {
      retro_advertisements(sort: "price"){
        id,
        heading,
        price,
        category,
        image {
          id
        },
      }
    }
  `);

  if (response.status === 200 && response.data) {
    retroAdvertisements.value = [...response.data.retro_advertisements];
  }
}

const filterAlphabetical = async () => {
  const response = await directus.graphql.items<IRetroAdvertisementsResponse>(`
    query {
      retro_advertisements(sort: "heading")  {
        id,
        heading,
        price,
        category,
        image {
          id
        },
      }
    }
  `);

  if (response.status === 200 && response.data) {
    retroAdvertisements.value = [...response.data.retro_advertisements];
  }
}

</script>

<template>
  <ion-page>
    <toolbar-component />

    <ion-toolbar>
      <!-- Search-->
      <div class="filteringParent">
        <input v-model="searchText" placeholder="Søk..." @change="initializeSearch()" class="inputSearch" />
        <ion-button @click="initializeSearch()" class="searchBtn">
          <ion-icon :icon="searchOutline"></ion-icon>
        </ion-button>

        <!-- Sort -->
        <ion-segment value="date">

          <ion-segment-button @click="fetchRetroAdvertisements()" value="date">
            <ion-icon :icon="calendarOutline"></ion-icon>
            Dato
          </ion-segment-button>

          <ion-segment-button @click="filterPrice()">
            <ion-icon :icon="cardOutline"></ion-icon>
            Pris
          </ion-segment-button>

          <ion-segment-button @click="filterAlphabetical()">
            <ion-icon :icon="newspaperOutline"></ion-icon>
            Navn
          </ion-segment-button>
        </ion-segment>
      </div>
    </ion-toolbar>

    <ion-toolbar>
      <ion-title v-if="userAccessToken" class="user-access-token-message" slot="start" color="success">Innlogget
      </ion-title>
      <ion-title v-else slot="start" class="user-access-token-message" color="danger">Ikke innlogget</ion-title>

      <ion-title slot="end" class="toolbar-headline">ANNONSER</ion-title>
    </ion-toolbar>


    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="refreshRetroAdvertisementsView($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <div id="retro-advertisement-card-parent">
        <retro-advertisement-card v-for="advertisement in retroAdvertisements" :key="advertisement.id"
          :advertisement="advertisement" />
      </div>

    </ion-content>
  </ion-page>
</template>

<style scoped>
ion-content {
  text-align: -webkit-center;
}



#retro-advertisement-card-parent {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.filteringParent {
  display: flex;
  align-items: center;
}

.inputSearch {
  height: 40px;
  width: 48%;
}

.searchBtn {
  --background: rgb(165, 165, 165);
  height: 40px;
}

.searchBtn:active {
  --background: rgb(46, 198, 84);
}

.searchBtn:hover {
  --background: rgb(46, 198, 84);
}

/* iOS puts title in the middle, instead of in the start/end */
.user-access-token-message.ios {
  margin-left: -120px;
}

/* Segment Button */
ion-segment-button {
  --indicator-color: rgb(46, 198, 84);
}

/* Material Design styles */
ion-segment-button.md {
  --color-checked: rgb(46, 198, 84);
  --indicator-height: 4px;
}

/* iOS styles */
ion-segment-button.ios {
  --color: rgb(46, 198, 84);
  --color-checked: #fff;
  --border-radius: 20px;
}
</style>