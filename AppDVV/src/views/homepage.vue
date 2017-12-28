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
          <th>Điều xe</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(marker, index) in markers">
          <td>{{marker.phone}}</td>
          <td>{{marker.address}}</td>
          <td>{{marker.status}}</td>
          <td><center><button @click.prevent="sadfasdfasdf(marker)"  class="btn btn-primary btn-sm"  data-toggle="modal" data-target="#myModal" ><span class="glyphicon glyphicon-cog glyphicon"></span></button></center></td>
          <td><button class="btn btn-primary" >Điều xe</button></td>
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
                      <button @click="search" class="btn btn-default" type="button" style="border-left:0px"><span class="glyphicon glyphicon-search"></span></button>
                    </span>
                  </div>
                  <div>
                    <label>Ý bạn là: {{index}}</label>
                    <p v-if="newAddress">{{newAddress.formatted_address}}</p>
                    <p v-else style="color:red">Không tìm thấy kết quả</p>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                  <button type="button" :disabled="disabled" class="btn btn-primary" @click="saveChange(obj)" data-dismiss="modal">Save changes</button>
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
      disabled:true,
      agreechange: false // click button save change;
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
    search: function() {  // click search button => find address
      this.$http.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: this.searchValue
        }
      }).then(responseGoogle => {
        return responseGoogle;

      }, {}).then(success => {
        this.newAddress = success.body.results[0];
        if(this.newAddress.geometry ==='undefined') {
          this.disabled = true;
        } else {
          this.disabled = false;
        }
      }, exception => {
        this.disabled=true;
      }).catch( ()=>{
        this.disabled = true;
      });

    },
    saveChange: function(obj) {
      var path = 'user-info' + '/' + obj['.key'];
      console.log(obj);
       var newModel = db.ref(path);
      let newDataModel= {
        address: this.newAddress.formatted_address,
        phone: obj.phone,
        typeCar: obj.typeCar,
        note: obj.note,
        location:this.newAddress.geometry.location,
        status: "DA-DINH-VI"
      };
      newModel.set(newDataModel);
    },
    sadfasdfasdf: function(obj){
      this.obj = obj;
    }

  },
  created() {
    //  this.label=
  }
}
</script>
