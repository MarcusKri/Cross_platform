<script setup lang="ts">
import { IonMenu, IonButton, IonIcon, IonButtons, IonMenuToggle, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { authService } from '@/services/directus.service';
import { homeOutline, personOutline, libraryOutline, addOutline, logOutOutline, logInOutline } from "ionicons/icons";

const router = useRouter();

//Checks if user is logged in
const userAccessToken = localStorage.getItem("auth_token");

/* Log out the user and redirect to the login page */
const logout = async () => {
    try {
        await authService.logout();
        router.push('/authentication');
    } catch (error) {
        console.log(error);
    }
}
</script>

<template>
    <ion-menu content-id="main-content" menu-id="app-menu">

        <!-- Menu header -->
        <ion-header>
            <ion-toolbar class="toolbar-component">
                <ion-title router-link="/home" class="company-title">
                    <img src="/assets/company-logo.png" alt="company-logo" class="company-logo-image" />
                    <div>RetroSelg</div>
                </ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content class="menu-content">
            <!-- Menu items (Menu Toggle component used to toggle a menu open or closed) -->
            <ion-menu-toggle>
                <!-- Home -->
                <ion-buttons>
                    <ion-button router-link="/home">
                        <ion-icon :icon="homeOutline" class="icon-margin"></ion-icon>
                        Hjem
                    </ion-button>
                </ion-buttons>
                <!-- Profile -->
                <ion-buttons>
                    <ion-button router-link="/profile">
                        <ion-icon :icon="personOutline" class="icon-margin"></ion-icon>
                        Profil
                    </ion-button>
                </ion-buttons>
                <!-- My announcments -->
                <ion-buttons>
                    <ion-button router-link="/profile-advertisements">
                        <ion-icon :icon="libraryOutline" class="icon-margin"></ion-icon>
                        Mine annonser
                    </ion-button>
                </ion-buttons>
                <!-- New announcment -->
                <ion-buttons>
                    <ion-button router-link="/new-advertisement">
                        <ion-icon :icon="addOutline" class="icon-margin"></ion-icon>
                        Ny annonse
                    </ion-button>
                </ion-buttons>
                <!-- Log out -->
                <ion-buttons v-if="userAccessToken">
                    <ion-button @click="logout" color="primary" fill="solid">
                        <ion-icon :icon="logOutOutline" class="icon-margin"></ion-icon>
                        Logg ut
                    </ion-button>
                </ion-buttons>
                <!-- Log in -->
                <ion-buttons v-else>
                    <ion-button router-link="/authentication" color="primary" fill="solid">
                        <ion-icon :icon="logInOutline" class="icon-margin"></ion-icon>
                        Logg inn
                    </ion-button>
                </ion-buttons>
            </ion-menu-toggle>
        </ion-content>
    </ion-menu>
</template>

<style scoped>
.menu-content {
    margin-top: 500px;
}

.company-logo-image {
    border-radius: 60%;
    border: 1px solid black;
    height: 90px;
}

.company-title {
    cursor: pointer;
    height: 120px;
}

.icon-margin {
    margin: 0px 10px 0px 0px;
}

.toolbar-component {
    --background: linear-gradient(0.25turn, #3f87a6, #ebf8e1, #f69d3c);
    --color: #000;
    --border-color: #000;
}

#shadow-root.div.toolbar-container {
    height: 120px;
}

div.toolbar-container {
    height: 120px;
}

.company-title {
    z-index: -1;
    position: relative;
}
</style>