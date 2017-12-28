<template>
  <div>
    <div class="col-sm-5">
    <gmap-map :center="center" :zoom="4" style="height: 300px">
      <gmap-marker :key="index" v-for="(marker, index) in markers" :position="marker.location" :clickable="true" :draggable="true" @click="clickMarker(marker)" @dragend="dragMarker" :label="index.toString()"></gmap-marker>
    </gmap-map>
    <div>
      <div class="input-group" style="margin-top:5px">
        <input type="text" class="form-control" placeholder="Geocoding" onfocus="this.placeholder=''" onblur="this.placeholder='Geocoding'">
        <span class="input-group-btn">
          <button class="btn btn-default" type="button" style="border-left:0px"><span class="glyphicon glyphicon-search"></span></button>
        </span>
      </div>
    </div>
    <template v-if="displayInfo">
      <div id="canvas">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Số điện thoại</th>
            <th>Địa điểm đón</th>
          </tr>
        </thead>
        <tbody >
            <td>{{obj.phone}}</td>
            <td>{{obj.address}}</td>
        </tbody>
      </table>
      </div>
    </template>
    </div>
      <div class="col-sm-6">
        fsadfasdfsad
      </div>


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
      },
      displayInfo: false,
      obj: {}
    }
  },
  methods: {
    dragMarker: function(event) {
      console.log(event.latLng.lat());
      console.log(event.latLng.lng());
    },
    clickMarker: function(obj) {
      this.displayInfo=true;
      this.obj = obj;
    }

  },
  created() {
  //  this.label=
}
}
</script>
