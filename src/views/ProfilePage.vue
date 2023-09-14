<script setup lang="ts">
import { IRetroAdvertisement, IRetroAdvertisementsResponse } from '@/models/RetroAdvertisementModels';
import { directus } from '@/services/directus.service';
import ToolbarComponent from '@/components/ToolbarComponent.vue';
import { IonIcon, IonContent, IonPage, IonLabel, IonAvatar, IonToolbar, IonTitle, onIonViewDidEnter } from '@ionic/vue';
import { accessibilityOutline, mailOutline } from "ionicons/icons";
import { ref } from 'vue';

const profileRetroAdvertisements = ref<IRetroAdvertisement[]>([]);

onIonViewDidEnter(() => {
    fetchRetroAdvertisements();
})

const fetchRetroAdvertisements = async () => {
    const response = await directus.graphql.system<IRetroAdvertisementsResponse>(`
    query {
        users_me {
            first_name
            email
	    }
    }
  `);

    if (response.status === 200 && response.data) {
        profileRetroAdvertisements.value = response.data.users_me;

    }
}

</script>
  

<template>
    <ion-page>
        <toolbar-component />
        <ion-toolbar>
            <ion-title slot="end">PROFIL</ion-title>
        </ion-toolbar>

        <ion-content :fullscreen="true">

            <div class="profile-card-parent">
                <div class="profile-card">
                    <ion-label>
                        <h1 class="welcome-message">Velkommen til din bruker</h1>
                    </ion-label>
                    <ion-label>
                        <ion-avatar>
                            <img alt="Silhouette of a person's head"
                                src="https://ionicframework.com/docs/img/demos/avatar.svg" />
                        </ion-avatar>
                    </ion-label>

                    <ion-label>
                        <ion-icon :icon="accessibilityOutline"></ion-icon>
                        Brukernavn: {{ profileRetroAdvertisements.first_name }}
                    </ion-label>

                    <ion-label>
                        <ion-icon :icon="mailOutline"></ion-icon>
                        Email: {{ profileRetroAdvertisements.email }}
                    </ion-label>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<style scoped>
ion-content {
    text-align: -webkit-center;
}

ion-content {
    --ion-background-color: #f4f4f4;
    display: flex;
}

ion-item {
    color: black;
}

ion-list {
    display: flex;
    flex-direction: row;
}

@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap');

.profile-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.profile-card-parent {
    color: rgb(55, 55, 55);
    min-height: 70vh;
    width: 70vw;
    min-width: 300px;
    max-height: 600px;
    background: rgba(255, 255, 255, 0.29);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10.4px);
    -webkit-backdrop-filter: blur(10.4px);
    border: 1px solid rgba(255, 255, 255, 0.26);
    display: flex;
    overflow: hidden;
}

ion-label {
    padding-top: 10px;
}

.welcome-message {
    padding-bottom: 50px;
}

ion-item {
    --background: transparent;
}
</style>