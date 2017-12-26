<template>
<div>

  <gmap-map :center="center" :zoom="4" style="width: 500px; height: 300px">
    <gmap-marker :key="index" v-for="(marker, index) in markers" :position="marker.location" :clickable="true" :draggable="true" @click="center=marker.location"></gmap-marker>
  </gmap-map>
</div>

</template>

<script>
import Firebase from 'firebase'
 let config = {
   apiKey: "AIzaSyBdayjA3EmnHntCcCA0caJvfUQPESPassM",
   authDomain: "app-ddv.firebaseapp.com",
   databaseURL: "https://app-ddv.firebaseio.com",
   projectId: "app-ddv",
   storageBucket: "app-ddv.appspot.com",
   messagingSenderId: "966606157223"
 }
 let app = Firebase.initializeApp(config);
 let db = app.database();
 let userInfoRef = db.ref('user-info');
export default {
  firebase: {
       markers : userInfoRef
  },
  data() {
    return {
      searchValue: "",
      center: {
        lat: 14.058324,
        lng: 108.277199
      }
    }
  },
  methods: {

  },
  created() {
   }
}
</script>
