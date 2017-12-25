<template>
<div>
  <gmap-map :center="center" :zoom="7" style="width: 500px; height: 300px">
    <gmap-marker v-for="(marker, index) in markers" :position="marker.location" :clickable="true" :draggable="true" @click="center=marker.location" id></gmap-marker>
  </gmap-map>
  <input type="text" v-model="searchValue" />
  <button v-on:click="search">Search</button>
  <button v-on:click="newPos">NewPost</button>
</div>
</template>

<script>
export default {
  data() {
    return {
      searchValue: "",
      center: {
        lat: 14.058324,
        lng: 108.277199
      },
      markers: []
    }
  },
  methods: {
    search: function() {
      this.$http.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: this.searchValue
        }
      }).then(
        response => {
          console.log(response);
          //   console.log(response.body.results[0].geometry);
          //   console.log(response.body.results[0].geometry.location.lat);
          this.markers = response.body.results[0];
          //   this.center.lat = response.body.results[0].geometry.location.lat;
          //   this.center.lng = response.body.results[0].geometry.location.lng;\

          // }, response => {
          console.log(this.markers);
          console.log(response.body.results[0].geometry);
        }, response => (console.log(response))
      )
    },
    newPos: function() {
      console.log(this.markers);
    }
  },
  created() {
    // this.$http.get('http://localhost:8080/appdtvapi')


  }
}
</script>
