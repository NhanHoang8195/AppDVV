<template>
<div>

  <gmap-map :center="center" :zoom="4" style="width: 500px; height: 300px">
    <gmap-marker :key="index" v-for="(marker, index) in markers" :position="marker.location" :clickable="true" :draggable="true" @click="center=marker.location"></gmap-marker>
    <div>
      fasdfasf
    </div>
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
      markers: [], // display markers
      appdtvResponse: [] // receive response from localhost:8008.
    }
  },
  methods: {

  },
  created() {
    this.$http.get('https://app-ddv.firebaseio.com/user-info.json').then(response => {
      return response.json();
    }, response => {}).then(function(data) {
      var arrayUserInfo = [];
      for (let key in data) {
        arrayUserInfo.push(data[key]);
      }
      var index;
      for (index = 0; index < arrayUserInfo.length; index++) {
        this.$http.get('https://maps.googleapis.com/maps/api/geocode/json', {
          params: {
            address: arrayUserInfo[index].address
          }
        }).then(
          responseGoogle => {
            this.markers.push(responseGoogle.body.results[0].geometry);
            //console.log(responseGoogle);
          }, responseGoogle => {
            (console.log(responseGoogle))
          }
        )
      }
      //  console.log(data);
    })

  }
}
</script>
