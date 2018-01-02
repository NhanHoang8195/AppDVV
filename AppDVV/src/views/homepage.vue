<template>
<div>
  <div class="col-sm-5">
    <gmap-map :center="center" :zoom="4" style="height: 300px">
      <gmap-marker :key="marker.date" v-for="(marker, index) in markers" v-if="marker.status!=='DA-CO-XE'" :position="marker.location" :clickable="true" :draggable="true" @click="clickMarker($event,marker)" @dragend="dragMarker($event, marker)" :label="'K'"
        :icon="'./src/assets/images/khach.png'"></gmap-marker>
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
          <td>{{marker.phone}}</td>
          <td>{{marker.address}}</td>
          <td>{{marker.status}}</td>
          <td>{{marker.note}}</td>
          <td>
            <center><button @click.prevent="sendMarker(marker)" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#myModal"><span class="glyphicon glyphicon-cog glyphicon"></span></button></center>
          </td>
          <td>
            <button class="btn btn-primary btn-sm" v-if="marker.status==='DA-DINH-VI'" @click="dieuxe(marker)"> Điều xe</button>
            <button v-else-if="marker.status==='DANG-TIM-XE'" class="btn btn-primary btn-sm" :disabled="true" @click="">Đang tìm xe</button>
            <button v-else-if="marker.status==='DA-CO-XE'" :disabled="true">Đã có xe</button>
            <button v-else-if="marker.status==='KHONG-CO-XE'" @click="dieuxe(marker)">Tìm lại</button>
          </td>
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
      reverseAddress: [],
      dieuxeStatus: false
    }
  },
  methods: {
    dragMarker: function(event, obj) { // keo tha vi tri hien tai
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
      if (this.newAddress.hasOwnProperty('formatted_address')) {
        let newDataModel = {
          address: obj.address,
          phone: obj.phone,
          typeCar: obj.typeCar,
          date: obj.date,
          note: obj.note,
          location: this.newAddress.geometry.location,
          status: "DA-DINH-VI"
        };
        newModel.set(newDataModel);
        this.newAddress = {};
      } else {
        delete obj['.key'];
        newModel.set(obj);

      }



    },
    sendMarker: function(obj) {
      if (typeof obj.formatted_address === 'undefined') { // drag send object
        this.obj = obj;
      } else {
        this.obj.location = obj.geometry.location;
      }
    },
    dieuxe: function(obj) {
      //this.dieuxeStatus = true;
      let source = new google.maps.LatLng(obj.location.lat, obj.location.lng);
      let radius = 6378137; // ban kinh tim kiem
      console.log(this.taixe.length);
      for (let i = 0; i < this.taixe.length; i++) {
        let temp = new google.maps.LatLng(this.taixe[i].location.lat, this.taixe[i].location.lng);
        let distance = google.maps.geometry.spherical.computeDistanceBetween(source, temp);
        console.log(obj['.key']);
        if (distance < radius) { // gui thong bao co khach toi tai xe trong ban kinh radius
          var path = 'taixe-info' + '/' + this.taixe[i]['.key'];
          var updateTaixe = db.ref(path);
          this.taixe[i].keyUser = obj['.key'];
          this.taixe[i].status = 'WAITING-CONFIRM';
          delete this.taixe[i]['.key'];
          updateTaixe.set(this.taixe[i]);
          console.log(this.taixe[i]);
        }
      }
      let pathUser = 'user-info/' + obj['.key'];
      delete obj['.key'];
      let updateUser = db.ref(pathUser);

      obj.status = 'DANG-TIM-XE';
      updateUser.set(obj);
      //user['.key'] = pathUser.slice(pathUser.indexOf('/') + 1);

      //  tai xe chac chan khong co hanh khach trong hang doi
      // if (typeof taixeMin !== 'undefined') {
      //   var path = 'taixe-info' + '/' + taixeMin['.key'];
      //   console.log(path);
      //   var updateTaixe = db.ref(path);
      //   taixeMin.keyUser = obj['.key'];
      //   taixeMin.status = 'CHO-CONFIRM';
      //   delete taixeMin['.key'];
      //   updateTaixe.set(taixeMin);
      //   //  this.dieuxeStatus = true;
      //   //  window.setTimeOut(5000);
      //   //    console.log(taixeMin);
      // } else {
      //   this.dieuxeStatus = false;
      //   //taixeMin.status='DANG-CHO-KHACH'
      //
      //   console.log('ko co xe');
      // }
    }
  },
  created() {
    //  this.label=
  }
}
</script>
