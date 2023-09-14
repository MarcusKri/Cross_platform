import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import HomePage from "../views/HomePage.vue";
import DetailPage from "@/views/DetailPage.vue";
import AuthenticationPage from "@/views/AuthenticationPage.vue";
import NewRetroAdvertisementPage from "@/views/NewRetroAdvertisementPage.vue";
import ProfilePage from "@/views/ProfilePage.vue";
import ProfileAdvertisementsPage from "@/views/ProfileAdvertisementsPage.vue";
import { authService } from "@/services/directus.service";
import { toastController } from "@ionic/vue";

const authRequiredRouteGuard = async () => {
  const userAccessToken = localStorage.getItem("auth_token");

  if (!userAccessToken) {
    return { name: "Login" }
  }

  const userAccessTokenExpiresAt = localStorage.getItem("auth_expires_at") as unknown as number;

  if (userAccessTokenExpiresAt < new Date().getTime()) {

    const errorToast = await toastController.create({
      message: "Brukersesjon er utløpt – logg inn på nytt",
      duration: 3000,
      color: "warning"
    });

    await errorToast.present();
    
    await authService.logout();
    return { name: "Login" }
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/authentication",
    name: "Login",
    component: AuthenticationPage,
  },
  {
    path: "/home",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/profile",
    name: "Profile",
    component: ProfilePage,
    beforeEnter: [authRequiredRouteGuard]
  },
  {
    path: "/profile-advertisements",
    name: "ProfileAdvertisements",
    component: ProfileAdvertisementsPage,
    beforeEnter: [authRequiredRouteGuard]
  },
  {
    path: "/new-advertisement",
    name: "NewRetroAdvertisement",
    component: NewRetroAdvertisementPage,
    beforeEnter: [authRequiredRouteGuard]
  },
  {
    path: "/detail/:id",
    name: "Detail",
    component: DetailPage,
    beforeEnter: [authRequiredRouteGuard]
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
