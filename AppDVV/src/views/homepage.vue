<template>
<div>
  <div class="col-sm-5">
    <gmap-map :center="center" :zoom="4" style="height: 300px">
      <gmap-marker :key="index" v-for="(marker, index) in markers" :position="marker.location" :clickable="true" :draggable="true" @click="clickMarker(marker)" @dragend="dragMarker" :label="index.toString()"></gmap-marker>
    </gmap-map>
    <!-- <div>
      <div class="input-group" style="margin-top:5px">
        <input type="text" class="form-control" placeholder="Geocoding" onfocus="this.placeholder=''" onblur="this.placeholder='Geocoding'">
        <span class="input-group-btn">
          <button class="btn btn-default" type="button" style="border-left:0px"><span class="glyphicon glyphicon-search"></span></button>
        </span>
      </div>
    </div> -->
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
    <center>Danh sách khách hàng</center>
    <table class="table table-hover table-bordered">
      <thead>
        <tr>
          <th>Số điện thoại</th>
          <th>Địa điểm đón</th>
          <th>Status</th>
          <th>Định vị lại</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="marker in markers">
          <template>
          <td>{{marker.phone}}</td>
          <td>{{marker.address}}</td>
          <td>{{marker.status}}</td>
          <td><center><button class="btn btn-primary btn-sm"  data-toggle="modal" data-target="#myModal" ><span class="glyphicon glyphicon-cog glyphicon"></span></button></center></td>
          </template>
          <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  <h4 class="modal-title" id="myModalLabel">Geocoding</h4>
                </div>
                <div class="modal-body">
                  <div class="input-group">
                    <input v-model="searchValue" type="text" class="form-control" placeholder="Nhập địa chỉ cần Geocoding" onfocus="this.placeholder=''" onblur="this.placeholder='Nhập địa chỉ cần Geocoding'">
                    <span class="input-group-btn">
                      <button class="btn btn-default" type="button" style="border-left:0px"><span class="glyphicon glyphicon-search"></span></button>
                    </span>
                  </div>
                  <div>
                    <label>Kết quả Geocoding:</label> {{}}
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                  <button type="button" class="btn btn-primary" @click.prevent="changeStatus(marker)" data-dismiss="modal">Save changes</button>
                </div>
              </div>
            </div>
          </div>
        </tr>

      </tbody>
    </table>
  </div>

  <!-- Modal -->


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
    markers: userInfoRef
  },
  data() {
    return {
      searchValue: '',
      center: {
        lat: 14.058324,
        lng: 108.277199
      },
      displayInfo: false,
      obj: {},
      newAddress: {},

    }
  },
  methods: {
    dragMarker: function(event) { // keo tha vi tri hien tai
      console.log(event.latLng.lat());
      console.log(event.latLng.lng());
    },
    clickMarker: function(obj) { // click vao 1 marker hien len info cua maker do
      this.displayInfo = true;
      this.obj = obj;
    },
    changeStatus: function(obj) {
      this.$http.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: this.searchValue
        }
      }).then(responseGoogle => {

      }, {})
    }

  },
  created() {
    //  this.label=
  }
}
</script>
