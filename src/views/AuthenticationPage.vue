<script setup lang="ts">
import { authService} from '@/services/directus.service';
import { IonButton, IonContent, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonToggle } from '@ionic/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// User toggle between login and register mode
const inRegisterMode = ref(false);

// Provides two-way data binding between Vue and the input fields in the form
const userDetails = ref({
    userName: '',
    email: '',
    password: ''
});

//Try to login, if successful, redirect to home page, otherwise shows error message
//setTimeout to refresh the page
const login = async () => {
    try {
        await authService.login(userDetails.value.email, userDetails.value.password);
        router.replace('/home');
        setTimeout(window.location.reload.bind(window.location));

    } catch (error) {
        if (error instanceof Error) {
            document.getElementById("errorMessage")!.innerHTML = error.message;
        }
    }
};

//Try to register, if successful, redirect to home page, otherwise shows error message
//setTimeout to refresh the router page
const register = async () => {
    try {
        await authService.register(userDetails.value.userName, userDetails.value.email, userDetails.value.password);
        await login();
        setTimeout(window.location.reload.bind(window.location));
    } catch (error) {
        if (error instanceof Error) {
            document.getElementById("errorMessage")!.innerHTML = error.message;
        }
    }
}


const homeButton = () => {
    router.replace('/home');
    setTimeout(window.location.reload.bind(window.location), 630);
}

</script>
    
<template>
    <ion-page>
        <ion-content>
            <ion-list class="login-main item">

                <div class="login-card">
                    <div class="login-img-parent">
                        <img src="../../public/assets/login-img.jpeg" alt="login-img" class="login-img">
                    </div>
                    <div class="login-content-parent">
                        <ion-list-header class="header">
                            <ion-label v-if="inRegisterMode">Lag ny bruker</ion-label>
                            <ion-label v-else>Logg inn</ion-label>
                        </ion-list-header>

                        <!-- hr for thematic break -->
                        <hr />

                        <ion-item v-if="inRegisterMode">
                            <ion-label position="floating" color="dark" class="input-field">Brukernavn</ion-label>
                            <ion-input v-model="userDetails.userName"></ion-input>
                        </ion-item>

                        <ion-item>
                            <ion-label position="floating" color="dark" class="input-field">Email</ion-label>
                            <ion-input type="email" v-model="userDetails.email"></ion-input>
                        </ion-item>

                        <ion-item>
                            <ion-label position="floating" color="dark" class="input-field">Passord</ion-label>
                            <ion-input type="password" v-model="userDetails.password"></ion-input>
                        </ion-item>

                        <!-- Error message for login and register -->
                        <ion-label id="errorMessage" color="danger"></ion-label>

                        <ion-button v-if="inRegisterMode" @click="register" fill="solid" color="dark" size="default"
                            class="authBtn">
                            Registrer deg
                        </ion-button>


                        <ion-button v-else @click="login" fill="solid" color="dark" size="default" class="authBtn">
                            Logg inn
                        </ion-button>

                        <ion-item lines="none" class="item">
                            <ion-label>Har du ikke bruker?</ion-label>
                            <ion-toggle color="secondary" @ion-change="inRegisterMode = !inRegisterMode"></ion-toggle>
                        </ion-item>

                        <ion-item lines="none" class="item">
                            <ion-label>Se annonser uten bruker?</ion-label>
                            <ion-button @click="homeButton" color="light">Annonser</ion-button>
                        </ion-item>
                    </div>
                </div>
            </ion-list>
        </ion-content>
    </ion-page>
</template>
    
<style scoped>
ion-content {
    --ion-background-color: #f4f4f4;
    display: flex;
}

#errorMessage {
    margin-top: 10px;
    margin-bottom: 10px;
}

.input-field {
    color: rgb(55, 55, 55);
}

ion-item {
    color: black;
}

ion-list {
    display: flex;
    flex-direction: column;
}

@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap');

.header {
    font-size: 4rem;
    text-align: center;
    color: rgb(55, 55, 55);
    font-family: 'Roboto Mono', monospace;
}

.authBtn {
    width: 100%;
    margin: 10px;
}

.login-img-parent {
    display: flex;
    justify-content: start;
    align-items: center;
    width: 40%;
}

.login-img-parent>img {
    height: 100%;
    overflow: hidden;
}

.login-content-parent {
    padding: 10px 5%;
    width: 60%;
}

.login-main {
    height: 100vh;
    background: linear-gradient(0.25turn, #3f87a6, #ebf8e1, #f69d3c);
    display: flex;
    justify-content: center;
    align-items: center;
}

.login-card {
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

.item .item-content {
    background-color: transparent !important;
}

ion-item {
    --background: transparent;
}

@media only screen and (max-width: 600px) {
    .header {
        font-size: 1.5rem;
    }

    .login-card {
        width: 95vw;
        padding: 40px 3%;
    }
}

@media only screen and (max-width: 1000px) {
    .login-img-parent {
        display: none;
    }

    .login-content-parent {
        width: 100%;
    }
}
</style>