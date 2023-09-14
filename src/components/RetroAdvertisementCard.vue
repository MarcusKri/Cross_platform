<script setup lang="ts">
import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle } from "@ionic/vue";

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
</script>

<template>
	<ion-card :router-link="'/detail/' + advertisement.id" color="light" id="retro-card">

		<img :src="`https://f46qrzje.directus.app/assets/${advertisement.image.id}`" />

		<ion-card-header>
			<ion-card-title>{{ advertisement.heading }}</ion-card-title>
			<ion-card-subtitle>{{ advertisement.price }}kr</ion-card-subtitle>
			<ion-card-subtitle>{{ advertisement.category }}</ion-card-subtitle>
		</ion-card-header>
	</ion-card>
</template>

<style scoped>
ion-card {
	border: solid 1px #ffffff40;
	border-radius: 0.5em;
	text-align: center;
	justify-content: center;
	width: 80%;
	margin: 1rem;
	cursor: pointer;
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