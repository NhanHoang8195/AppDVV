<template>
<div>
  <gmap-map :center="center" :zoom="7" style="width: 500px; height: 300px">
    <gmap-marker :key="index" v-for="(marker, index) in markers" :position="marker.location" :clickable="true" :draggable="true" @click="center=marker.location"></gmap-marker>
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
            this.markers.push(responseGoogle.body.results[0].geometry);
          }, responseGoogle => {
            (console.log(responseGoogle))
          }
        )
      }
    }, response => {
      console.log(response);
    })

  }
}
</script>
