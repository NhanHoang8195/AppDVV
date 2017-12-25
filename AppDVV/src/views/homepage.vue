<template>
<div>
  <gmap-map :center="center" :zoom="7" style="width: 500px; height: 300px">
    <gmap-marker v-for="marker in markers" :position="marker.geometry.location" :clickable="true" :draggable="true" @click="center=marker.geometry.location"></gmap-marker>
  </gmap-map>
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
      markers: [],
      appdtvResponse: []
    }
  },
  methods: {

  },
  created() {
    this.$http.get('http://localhost:8080/appdtvapi').then(response => {
      this.appdtvResponse = response.body;
      var index;
      for (index = 0; index < this.appdtvResponse.length; index++) {
        this.$http.get('https://maps.googleapis.com/maps/api/geocode/json', {
          params: {
            address: this.appdtvResponse[index].address
          }
        }).then(
          responseGoogle => {

            //   console.log(response.body.results[0].geometry);
            //   console.log(response.body.results[0].geometry.location.lat);
            //this.markers = responseGoogle.body.results;

            this.markers.push(responseGoogle.body.results);
            console.log(this.markers);
            // this.center.lat = responseGoogle.body.results.geometry.location.lat;
            // this.center.lng = responseGoogle.body.results[0].geometry.location.lng;


          }, responseGoogle => (console.log(responseGoogle))
        )
      }
    }, response => {
      console.log(response);
    })

  }
}
</script>
