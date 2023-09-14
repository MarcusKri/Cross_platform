<script setup lang="ts">
import { IonButton, IonIcon, IonMenuButton, IonButtons, IonHeader, IonTitle, IonToolbar } from '@ionic/vue';
import { addOutline } from "ionicons/icons";
</script>

<template>
    <ion-header :translucent="true">
        <ion-toolbar class="toolbar-component">
            <ion-buttons slot="start">
                <ion-menu-button id="menu-button"></ion-menu-button>
            </ion-buttons>
            <ion-title class="ion-text-center">RetroSelg</ion-title>
            <ion-buttons slot="end">
                <ion-button router-link="/new-advertisement" id="add-button">
                    <ion-icon :icon="addOutline"></ion-icon>
                </ion-button>
            </ion-buttons>
        </ion-toolbar>
    </ion-header>
</template>

<style scpoed>
.toolbar-component {
    --background: linear-gradient(0.25turn, #3f87a6, #ebf8e1, #f69d3c);
    --color: #000;
    --border-color: #000;
}


/*  Button stays black in every os.*/
#menu-button {
    --color: black;
}

#add-button {
    --color: black;
}
</style>