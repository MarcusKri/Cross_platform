<script setup lang="ts">
import { INewRetroAdvertisement } from '@/models/RetroAdvertisementModels';
import { directus } from '@/services/directus.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { IonButton, IonButtons, IonChip, IonSelect, IonSelectOption, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, IonSpinner, IonTextarea, IonTitle, IonToolbar, toastController } from '@ionic/vue';
import { arrowBackOutline, add, trashOutline, navigate } from 'ionicons/icons';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Geolocation } from '@capacitor/geolocation';
import { GoogleMap } from '@capacitor/google-maps';


const router = useRouter();

// Track of the input field for new hashtags
const newHashtagText = ref("");
const isUploadingRetroAdvertisement = ref(false);

// Track of all data input from the user towards adding a new retro advertisement
const newRetroAdvertisement = ref<INewRetroAdvertisement>({
    heading: "",
    description: "",
    price: 0,
    hashtags: [],
    image: "",
    map: "",
    category: "",
});

// Add whats is in the hashtag input field to the retro advertisement's array of hashtags
const addNewHashtag = () => {
    if (newHashtagText.value) {
        newRetroAdvertisement.value.hashtags.push(newHashtagText.value);
        newHashtagText.value = "";
        // Else for avoiding adding empty hashtags
    } else {
        toastController.create({
            message: "Empty hashtag",
            duration: 2000,
            color: "danger",
        }).then((toast) => toast.present());
    }
}

// Handle data POSTing
const postNewRetroAdvertisement = async () => {
    if (!newRetroAdvertisement.value.image || !newRetroAdvertisement.value.heading ||
        !newRetroAdvertisement.value.description || !newRetroAdvertisement.value.category) {
        alert("Du må fylle inn alle felter");
        return;
    }

    if (newRetroAdvertisement.value.price <= 0) {
        alert("Du må legge til en pris høyere enn 0")
        return;
    }

    if (newRetroAdvertisement.value.price > 1000000) {
        alert("Prisen kan ikke være høyere enn 1 000 000")
        return;
    }

    try {
        isUploadingRetroAdvertisement.value = true;
        const response = await fetch(newRetroAdvertisement.value.image);
        const imageBlob = await response.blob();

        const formData = new FormData();
        formData.append('file', imageBlob);
        const fileUpload = await directus.files.createOne(formData);

        if (fileUpload) {
            await directus.items('retro_advertisements').createOne({
                heading: newRetroAdvertisement.value.heading,
                description: newRetroAdvertisement.value.description,
                price: newRetroAdvertisement.value.price,
                hashtags: newRetroAdvertisement.value.hashtags,
                comments: [],
                image: fileUpload.id,
                map: newRetroAdvertisement.value.map,
                category: newRetroAdvertisement.value.category
            });

            const successToast = await toastController.create({
                message: 'Annonsen ble lastet opp!',
                duration: 2000,
                position: 'bottom',
                color: 'success'
            });

            await successToast.present();
            await router.replace('/home');
        }

        isUploadingRetroAdvertisement.value = false;

    } catch (error) {
        const errorToast = await toastController.create({
            message: 'Noe gikk galt ved opplasting av annonsen!',
            duration: 2500,
            position: 'bottom',
            color: 'danger'
        });

        await errorToast.present();
        console.error(error);
        isUploadingRetroAdvertisement.value = false;
    }
}

// Open the device's camera and/or file picker UI
const triggerCamera = async () => {
    const photo = await Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.Uri
    });

    if (photo.webPath) {
        newRetroAdvertisement.value.image = photo.webPath;
    }
}

// Handle (preview) image removal
const removeImagePreview = () => {
    newRetroAdvertisement.value.image = '';
}

//Google Maps with marker
const createMap = async () => {
    const mapRef = document.getElementById('map');
    const coordinates = await Geolocation.getCurrentPosition();

    newRetroAdvertisement.value.map = `${coordinates.coords.latitude}, ${coordinates.coords.longitude}`;


    const newMap = await GoogleMap.create({
        id: 'retroselg-map', // Unique identifier for this map instance
        element: mapRef, // Reference to the capacitor-google-map element
        apiKey: 'AIzaSyDDwnPI53SUHSkOjdVqYy2q2xz9ATxgiP8', // Google Maps API Key
        config: {
            center: {
                // The initial position to be rendered by the map
                lat: coordinates.coords.latitude,
                lng: coordinates.coords.longitude,
            },
            zoom: 14, // The initial zoom level to be rendered by the map
        },
    });
    //Add a marker to the map
    const markerId = await newMap.addMarker({
        coordinate: {
            lat: coordinates.coords.latitude,
            lng: coordinates.coords.longitude,
        }
    });
};

</script>

<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar class="toolbar-component">
                <ion-buttons slot="start">
                    <ion-button router-link="/home" id="back-button">
                        <ion-icon :icon="arrowBackOutline"></ion-icon>
                    </ion-button>
                </ion-buttons>
                <ion-title class="ion-text-center">RetroSelg</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-toolbar>
            <ion-title slot="end">LEGG TIL ANNONSE</ion-title>
        </ion-toolbar>

        <ion-content :fullscreen="true">
            <ion-list>

                <!-- Logic for file picking / using camera will be added later -->
                <ion-button @click="triggerCamera" class="image-picker" color="light">
                    Velg fil eller ta bilde 📸
                </ion-button>

                <!-- Remove image-->
                <section v-if="newRetroAdvertisement.image" class="remove-image-section">
                    <ion-button @click="removeImagePreview" fill="default" class="remove-image-preview">
                        <ion-icon slot="icon-only" :icon="trashOutline" color="danger"></ion-icon>
                    </ion-button>
                    <img :src="newRetroAdvertisement.image" class="new-advertisement-image" />
                </section>

                <!-- Category -->
                <ion-input v-model="newRetroAdvertisement.category" class="category-input" :readonly="true">
                    <ion-list>
                        <ion-item>
                            <ion-select placeholder="Velg kategori" interface="action-sheet" cancelText="Lukk">
                                <ion-select-option value="Spill">Spill</ion-select-option>
                                <ion-select-option value="Spillkonsoll">Spillkonsoll</ion-select-option>
                                <ion-select-option value="Spillkontroll">Spillkontroll</ion-select-option>
                                <ion-select-option value="Annet">Annet</ion-select-option>
                            </ion-select>
                        </ion-item>
                    </ion-list>
                </ion-input>

                <!-- Heading -->
                <ion-item counter>
                    <ion-label class="label-mild" position="floating">Overskrift</ion-label>
                    <ion-input type="text" v-model="newRetroAdvertisement.heading" maxLength="80"
                        placeholder="Maks 80 tegn"></ion-input>
                </ion-item>

                <!-- Description -->
                <ion-item counter>
                    <ion-label class="label-mild" position="floating">Beskrivelse</ion-label>
                    <ion-textarea type="password" v-model="newRetroAdvertisement.description" maxLength="1000"
                        placeholder="Maks 1000 tegn"></ion-textarea>
                </ion-item>



                <!-- Price -->
                <ion-item>
                    <ion-label class="label-mild" position="floating">Pris</ion-label>
                    <ion-input type="number" v-model="newRetroAdvertisement.price"></ion-input>
                </ion-item>

                <!-- Hashtags -->
                <ion-item>
                    <ion-label class="label-mild" position="floating">Hashtag (valgfritt)</ion-label>
                    <ion-input type="text" v-model="newHashtagText"></ion-input>

                    <ion-button slot="end" color="dark" size="default" @click="addNewHashtag">
                        <ion-icon :icon="add"></ion-icon>
                    </ion-button>
                </ion-item>

                <ion-item lines="none">
                    <ion-chip color="primary" v-for="tag in newRetroAdvertisement.hashtags" :key="tag">{{ tag }}
                    </ion-chip>
                </ion-item>

                <!-- Map -->
                <ion-item>
                    <ion-label class="label-mild" position="floating">Nåværende posisjon (valgfritt)</ion-label>
                    <ion-input type="text" v-model="newRetroAdvertisement.map" :readonly="true"
                        placeholder="Trykk på knappen for å få posisjon"></ion-input>
                    <capacitor-google-map id="map"></capacitor-google-map>
                    <ion-button @click="createMap()" slot="end" class="button-auth" fill="solid" color="primary"
                        size="default">
                        <ion-icon :icon="navigate"></ion-icon>
                    </ion-button>
                </ion-item>

                <!-- Submit button -->
                <ion-button @click="postNewRetroAdvertisement" :disabled="isUploadingRetroAdvertisement"
                    class="button-add" fill="solid" color="dark" size="default">
                    <ion-spinner v-if="isUploadingRetroAdvertisement" name="dots"></ion-spinner>
                    <span v-else>Publiser</span>
                </ion-button>
            </ion-list>
        </ion-content>
    </ion-page>
</template>
    
<style scoped>
ion-list {
    display: flex;
    flex-direction: column;
}

capacitor-google-map {
    display: inline-block;
    width: 100%;
    height: 250px;
}

.label-mild {
    --color: #8a8a8a !important;
}

.image-picker {
    height: 10vh;
    margin: 10px;
    border-radius: 8px;
    font-size: medium;
}

.remove-image-preview {
    position: absolute;
    right: 0;
}

.remove-image-section {
    align-self: center;
}

.button-add {
    margin-top: 50px;
    margin-left: 10px;
    margin-right: 10px;
}

.toolbar-component {
    --background: linear-gradient(0.25turn, #3f87a6, #ebf8e1, #f69d3c);
    --color: #000;
    --border-color: #000;
}

.new-advertisement-image {
    width: auto;
    height: 35vh;
    border-radius: 50px;
}

/*  Button stays black in every os.*/
#back-button {
    --color: black;
}
</style>