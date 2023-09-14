<script setup lang="ts">
import ToolbarComponent from '@/components/ToolbarComponent.vue';
import { IRetroAdvertisement, IRetroAdvertisementsResponse } from '@/models/RetroAdvertisementModels';
import { directus } from '@/services/directus.service';
import { IonCard, IonCardHeader, IonCardTitle, IonTitle, IonCardSubtitle, IonButton, IonContent, IonToolbar, IonPage, IonRefresher, IonRefresherContent, onIonViewDidEnter, RefresherCustomEvent, toastController } from '@ionic/vue';
import { ref } from 'vue';

interface Props {
    advertisement: {
        id: number;
        heading: string;
        price: number;
        category: string;
        image: {
            id: string;
        },
    }
}

defineProps<Props>();

const profileAdvertisements = ref<IRetroAdvertisement[]>([]);

onIonViewDidEnter(() => {
    fetchProfileAdvertisements();
})

const refreshProfileAdvertisementsView = async (event: RefresherCustomEvent) => {
    await fetchProfileAdvertisements();
    event.target.complete();
}

//Filter on ID that equals current user
//sort: [ "-date_created"] -> sorts the data by most recently added
const fetchProfileAdvertisements = async () => {
    const response = await directus.graphql.items<IRetroAdvertisementsResponse>(`
    query {
        retro_advertisements(
            filter: {user_created: {id: {_eq: "$CURRENT_USER"}}}
            sort:  [ "-date_created" ]
        )
        {
            id,
            heading,
            price,
            category,
            description,
            image {
                id
            },
        }
    }
`);

    if (response.status === 200 && response.data) {
        profileAdvertisements.value = [...response.data.retro_advertisements];
    }
}

//Delete advertisement
async function deleteProfileAdvertisement(profileAdvertisementId: any) {
    const response = await directus.graphql.items<IRetroAdvertisementsResponse>(`
    mutation MyMutation {
        delete_retro_advertisements_item(id: ${profileAdvertisementId}) {
            id
        }
    }
`);
    const deleteProfileAdvertisementToast = await toastController.create({
        message: 'Annonsen ble slettet!',
        duration: 4000,
        position: 'bottom',
        color: 'success'
    });

    if (response.status === 200 && response.data) {
        await deleteProfileAdvertisementToast.present();
        setTimeout(window.location.reload.bind(window.location));
    }
}

//Edit advertisement
const deleteProfileAdvertisementToast = async (profileAdvertisementId: any) => {
    const alert = await toastController.create({
        header: 'Du er i ferd med å slette annonsen!',
        message: 'Er du sikker på at du vil slette denne annonsen?',
        buttons: [
            {
                text: 'Avbryt',
                role: 'cancel',
                cssClass: 'secondary',
                handler: () => {
                    fetchProfileAdvertisements();
                }
            }, {
                text: 'Ja, slett',
                handler: () => {
                    deleteProfileAdvertisement(profileAdvertisementId);
                }
            }
        ]
    });
    await alert.present();
}



//Edit advertisement
//Track of the input field for edit
const headingText = ref("");
const descriptionText = ref("");

const initializeEdit = async () => {
    editProfileAdvertisement(profileAdvertisements.value);

}


async function editProfileAdvertisement(profileAdvertisementId: any) {
    const response = await directus.graphql.items<IRetroAdvertisementsResponse>(`
    mutation MyMutation {
        update_retro_advertisements_item(
        data: {heading: "${headingText.value}", description: "${descriptionText.value}"}
        id: "${profileAdvertisementId}"){
            id,
            description,
        }
    }
`);

    if (!headingText.value || !descriptionText.value) {
        const editProfileAdvertisementToast = await toastController.create({
            message: 'Du må fylle ut feltene!',
            duration: 3000,
            position: 'bottom',
            color: 'danger'
        });
        await editProfileAdvertisementToast.present();
    }
    else {
        const editProfileAdvertisementToast = await toastController.create({
            message: 'Annonsen ble endret!',
            duration: 4000,
            position: 'bottom',
            color: 'success'
        });
        await editProfileAdvertisementToast.present();
        setTimeout(window.location.reload.bind(window.location));
    }
}


</script>
  

<template>
    <ion-page>
        <toolbar-component />
        <ion-toolbar>
            <ion-title slot="end">MINE ANNONSER</ion-title>
        </ion-toolbar>

        <ion-content :fullscreen="true">

            <ion-refresher slot="fixed" @ionRefresh="refreshProfileAdvertisementsView($event)">
                <ion-refresher-content></ion-refresher-content>
            </ion-refresher>

            <div id="filter-card-parent">
                <ion-card v-for="advertisement in profileAdvertisements" :key="advertisement.id"
                    :advertisement="advertisement" color="light" id="retro-card">


                    <img :src="`https://f46qrzje.directus.app/assets/${advertisement.image.id}`" />

                    <ion-card-header>
                        <ion-card-title>{{ advertisement.heading }}</ion-card-title>
                        <ion-card-subtitle>{{ advertisement.price }}kr</ion-card-subtitle>
                        <ion-card-subtitle>{{ advertisement.category }}</ion-card-subtitle>
                        <ion-card-subtitle>{{ advertisement.description }}</ion-card-subtitle>
                    </ion-card-header>

                    <div class="profile-change-announcments">
                        <!-- Edit announcment -->
                        <input v-model="headingText" placeholder="Endre overskrift" v-on:change="initializeEdit()"
                            maxLength="80" />
                        <textarea v-model="descriptionText" placeholder="Endre beskrivelse"
                            v-on:change="initializeEdit()" maxLength="1000"></textarea>
                        <ion-button v-on:click="editProfileAdvertisement(advertisement.id)" color="success">
                            Endre annonse
                        </ion-button>

                        <hr/>

                        <!--Delete announcment-->
                        <ion-button v-on:click="deleteProfileAdvertisementToast(advertisement.id)" color="danger">
                            Slett Annonse
                        </ion-button>
                        
                    </div>
                </ion-card>
            </div>

        </ion-content>
    </ion-page>
</template>

<style scoped>
#filter-card-parent {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}

.profile-change-announcments {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    flex-direction: column;
}

ion-card {
    border: solid 1px #ffffff40;
    border-radius: 0.5em;
    text-align: center;
    justify-content: center;
    width: 80%;
    margin: 1rem;
}

ion-card-content {
    font-size: large;
}

#retro-card {
    max-width: 400px;
}

img {
    text-align: center;
    height: 15rem;
    width: auto;
    object-fit: scale-down;
}
</style>