<script setup lang="ts">
import { IRetroAdvertisement, IRetroAdvertisementResponse } from "@/models/RetroAdvertisementModels";
import { directus } from "@/services/directus.service";
import { IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardTitle, IonCardSubtitle, IonChip, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonModal, IonPage, IonSpinner, IonTextarea, IonTitle, IonToolbar, onIonViewDidEnter } from "@ionic/vue";
import { chatboxOutline } from 'ionicons/icons';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

/* Using the route object, we can get data for the user's current route */
const route = useRoute();

/* Retrieve the id parameter from the current route's query string (/detail/:id) */
const { id } = route.params;

/* State */
const isModalOpen = ref(false);
const newCommentText = ref('');
const isLoadingRetroAdvertisement = ref(true);

/* "Dummy data" for displaying in the UI until we connect the app to an API */
const retroAdvertisement = ref<IRetroAdvertisement | null>(null);

onIonViewDidEnter(() => {
  fetchRetroAdvertisement();
})

/* Fetch data for the specified retro advertisement from Directus by ID. Cancel the loading spinner when the data has been fetched successfully. */
const fetchRetroAdvertisement = async () => {
  const response = await directus.graphql.items<IRetroAdvertisementResponse>(`
    query {
      retro_advertisements_by_id(id: ${id}) {
        id,
        heading,
        description,
        price,
        hashtags,
        map,
        category,
        date_created_func {
          day
          month
          year 
        },
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
    retroAdvertisement.value = response.data.retro_advertisements_by_id;
    isLoadingRetroAdvertisement.value = false;
  }
}

const addNewComment = () => {
  /* Coming soon */
  alert ("Kommentarseksjon under påbygging!");
}

</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar class="toolbar-component">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" id="back-button"></ion-back-button>
        </ion-buttons>
        <ion-title v-if="isLoadingRetroAdvertisement">
          <ion-spinner></ion-spinner>
        </ion-title>
        <ion-title v-if="retroAdvertisement">{{ retroAdvertisement.heading }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="isModalOpen = true" id="chat-button">
            <ion-icon :icon="chatboxOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" v-if="retroAdvertisement && !isLoadingRetroAdvertisement" padding
      class="background">

      <div class="detail-wrapper">
        <div class="detail-content">
          <ion-card class="detail-main-card">

            <!-- First name and map coordinates -->
            <ion-card-title>{{ retroAdvertisement.user_created.first_name }}</ion-card-title>
            <ion-card-subtitle>{{ retroAdvertisement.map }}</ion-card-subtitle>

            <!-- hr for thematic break-->
            <hr />

            <!-- Image section -->
            <img :src="`https://f46qrzje.directus.app/assets/${retroAdvertisement.image.id}`" />

            <!-- hr for thematic break -->
            <hr />

            <!-- Hashtag section -->
            <ion-chip v-for="hashtag in retroAdvertisement.hashtags" :key="hashtag" color="tertiary">#{{ hashtag }}
            </ion-chip>

            <!-- Heading, price and category section -->
            <ion-card-content>
              <ion-card-title>{{ retroAdvertisement.heading }}</ion-card-title>
              <ion-card-subtitle>{{ retroAdvertisement.price }}kr</ion-card-subtitle>
              <ion-card-subtitle>{{ retroAdvertisement.category }}</ion-card-subtitle>
            </ion-card-content>

            <!-- Description section -->
            <ion-card-content>
              <ion-card-subtitle>Beskrivelse</ion-card-subtitle>
              {{ retroAdvertisement.description }}
            </ion-card-content>


            <!--User section-->
            <ion-card-content>
              <ion-card-subtitle>Kontakt <br /></ion-card-subtitle>
              {{ retroAdvertisement.user_created.email }}
              <hr />
              Dato lagt til {{ retroAdvertisement.date_created_func.day }}.{{ retroAdvertisement.date_created_func.month
              }}.{{ retroAdvertisement.date_created_func.year }}
            </ion-card-content>

            <!-- Comment section -->
            <ion-card>
              <ion-list>
                <ion-list-header>
                  <ion-label>
                    Kommentarfelt
                    <ion-icon :icon="chatboxOutline"></ion-icon>
                  </ion-label>
                </ion-list-header>
              </ion-list>
            </ion-card>
          </ion-card>

          <ion-modal :is-open="isModalOpen" :initial-breakpoint="0.25" :breakpoints="[0, 0.25, 0.5, 0.75]"
            @did-dismiss="isModalOpen = false">
            <ion-content>
              <ion-item lines="none">
                <ion-label position="floating">Ny kommentar</ion-label>
                <ion-textarea v-model="newCommentText"></ion-textarea>
                <ion-button @click="addNewComment">Legg til kommentar</ion-button>
              </ion-item>
            </ion-content>
          </ion-modal>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
img {
  text-align: center;
  height: 20rem;
  width: auto;
  object-fit: scale-down;
}

.detail-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.detail-content {
  display: flex;
  width: 95%;
  max-width: 600px;
  min-width: 200px;
  flex-direction: column;
  justify-content: center;
}

.detail-main-card {
  border: solid 1px #ffffff40;
  border-radius: 0.5em;
}

ion-card-title {
  font-size: 20px;
}

ion-card-subtitle {
  font-size: 16px;
}

.toolbar-component {
  --background: linear-gradient(0.25turn, #3f87a6, #ebf8e1, #f69d3c);
  --color: #000;
  --border-color: #000;
}

/*  Button stays black in every os.*/
#back-button {
  --color: black;
}

#chat-button {
  --color: black;
}
</style>