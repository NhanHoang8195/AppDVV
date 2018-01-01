<template>
<div>
  <div class="col-sm-5">
    <gmap-map :center="center" :zoom="4" style="height: 300px">
      <gmap-marker :key="marker.date" v-for="(marker, index) in markers" :position="marker.location" :clickable="true" :draggable="true" @click="clickMarker($event,marker)" @dragend="dragMarker($event, marker)" :label="'K'" :icon="'./src/assets/images/khach.png'"></gmap-marker>
      <template v-for="(marker, i) in taixe">
        <gmap-marker :key="i" v-if="marker.status==='DANG-SAN-SANG'"  :position="marker.location" :clickable="true" :draggable="true" @click="clickMarker($event,marker)" @dragend="dragMarker($event, marker)" :label="'T'" :icon="'./src/assets/images/taixe.png'" ></gmap-marker>
      </template>


    </gmap-map>
    <template v-if="displayInfo">
      <div>
      <table class="table table-hover table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Thông tin</th>
          </tr>
        </thead>
        <tbody >
          <tr>
            <th>Số điện thoại</th>
            <td>{{obj.phone}}</td>
          </tr>
          <tr>
            <th>Địa điểm đón</th>
            <td>{{obj.address}}</td>
          </tr>
          <tr>
            <td :rowspan="reverseAddress.length +1">Kết quả Reverse Geocoding</td>
              <tr v-for="reverse in reverseAddress" >
                <td>{{reverse.formatted_address}} <button class="btn btn-primary btn-sm" data-toggle="modal" data-target="#myModal2" @click.prevent="sendMarker(reverse)">Chọn</button></td>
                <div class="modal fade" id="myModal2" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title" id="myModalLabel">Bạn muốn chọn {{obj.address}} làm địa chỉ mới?</h4>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" @click="saveChange(obj)" data-dismiss="modal">Save Changes</button>
                      </div>
                    </div>
                  </div>
                </div>
              </tr>

          </tr>
        </tbody>
      </table>
      </div>
    </template>
  </div>
  <div class="col-sm-7">
    <center>Danh sách khách hàng</center>
    <table class="table table-hover table-bordered">
      <thead>
        <tr>
          <th>Số điện thoại</th>
          <th>Địa điểm đón</th>
          <th>Status</th>
          <th>Ghi chú</th>
          <th>Định vị lại</th>
          <th>Điều xe</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(marker, index) in markers">
          <template>
          </template>
          <td>{{marker.phone}}</td>
          <td>{{marker.address}}</td>
          <td>{{marker.status}}</td>
          <td>{{marker.note}}</td>
          <td>
            <center><button @click.prevent="sendMarker(marker)" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#myModal"><span class="glyphicon glyphicon-cog glyphicon"></span></button></center>
          </td>
          <td><button class="btn btn-primary" @click="dieuxe(marker)">Điều xe</button></td>
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
                    <label>Ý bạn là: </label>
                    <p v-if="newAddress">{{newAddress.formatted_address}}</p>
                    <p v-if="disabled" style="color:red">Không tìm thấy kết quả</p>
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
let taixeInfoRef = db.ref('taixe-info');
export default {
  firebase: {
    markers: userInfoRef,
    taixe: taixeInfoRef
  },
  data() {
    return {
      searchValue: '',
      center: {
        lat: 14.058324,
        lng: 108.277199
      },
      displayInfo: false,
      displayDialog: false,
      obj: {},
      newAddress: {},
      disabled: true,
      reverseAddress: []
    }
  },
  methods: {
    dragMarker: function(event, obj) { // keo tha vi tri hien tai
      // console.log(event.latLng.lat());
      // console.log(event.latLng.lng());
      this.displayInfo = true;
      this.obj = obj;

      this.$http.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          latlng: event.latLng.lat().toString() + ',' + event.latLng.lng().toString()
        }
      }).then(responseGoogle => {
        this.reverseAddress = responseGoogle.body.results;

      }, {}).catch(() => {
        alert('error');
      });
      //this.displayDialog = true;
    },
    clickMarker: function(event, obj) { // click vao 1 marker hien len info cua maker do
      this.displayInfo = true;
      this.obj = obj;
      this.dragMarker(event, obj);
    },
    search: function() { // click search button => find address
      this.$http.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: this.searchValue
        }
      }).then(responseGoogle => {
        return responseGoogle;

      }, {}).then(success => {
        this.newAddress = success.body.results[0];
        if (typeof this.newAddress.geometry === 'undefined') {
          this.disabled = true;
        } else {
          this.disabled = false;
        }
      }, exception => {
        this.disabled = true;
      }).catch(() => {
        this.disabled = true;
      });

    },
    saveChange: function(obj) {
      var path = 'user-info' + '/' + obj['.key'];
      var newModel = db.ref(path);
      console.log(path);
      if (this.newAddress.hasOwnProperty('formatted_address')) {
        let newDataModel = {
          address:obj.address,
          phone: obj.phone,
          typeCar: obj.typeCar,
          date: obj.date,
          note: obj.note,
          location: this.newAddress.geometry.location,
          status: "DA-DINH-VI"
        };
        newModel.set(newDataModel);
        this.newAddress = {};
        console.log('newDataModel');
      } else {
        delete obj['.key'];
        newModel.set(obj);
        console.log('Object');

      }



    },
    sendMarker: function(obj) {
      if (typeof obj.formatted_address === 'undefined') { // drag send object
        this.obj = obj;
        console.log('xxx');
      } else {
        console.log('yyy');
        console.log(this.obj);
        this.obj.location = obj.geometry.location;
      }
    },
    dieuxe: function(obj) {
    //  let path = db.ref('taixe-info');
    //.spherical.computeDistanceBetween((10.7340344,106.7215787), (10.787273, 106.74981));

    let source  = new google.maps.LatLng(obj.location.lat, obj.location.lng);
      let min = 6378137;
      let taixeMin = {}

      for(let i = 0; i < this.taixe.length; i++) {
        let temp = new google.maps.LatLng(this.taixe[i].location.lat, this.taixe[i].location.lng);
        let distance  =  google.maps.geometry.spherical.computeDistanceBetween(source, temp);
        if(distance < min && typeof this.taixe[i].khachhang ==='undefined') {  // tai xe khong co danh sach khach trong hang doi
          min = distance;
          taixeMin = this.taixe[i];
        }
      }
      // tai xe chac chan khong co hanh khach trong hang doi
    if(!taixeMin.hasOwnProperty('khachhang')){
      var path = 'taixe-info' + '/' + taixeMin['.key'];
      var updateTaixe = db.ref(path);
      console.log(path);
      delete obj['.key'];
      taixeMin.khachhang = obj;
      delete taixeMin['.key'];
      updateTaixe.set(taixeMin);

    } else {
       console.log('Khong tim thay xe');
    }
  }
  },
  created() {
    //  this.label=
  }
}
</script>
