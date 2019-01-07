<template>
  <div class="page-wrapper page-wrapper--book" v-loading="loading" element-loading-text="数据请求中">
    <!--导航区-->
    <div class="page-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }"><span class="fa fa-home"><b>  首页</b></span></span></el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/data_mobiles/list' }">数据查询</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/data_mobiles/list' }">测试设备管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{id ? '编辑测试设备' : '新增测试设备'}}</el-breadcrumb-item>
      </el-breadcrumb>
      <!--返回按钮-->
      <div class="button-back">
        <router-link :to="{ path:'/data_mobiles/list'}">
          <el-button type="default" size="mini">返回</el-button>
        </router-link>
      </div>
    </div>

    <!--主内容区-->
    <div class="page-main">
      <div class="content-wrap">
        <el-form class="form-book--info" ref="dataForm" :model="dataForm" :rules="dataRule" label-width="150px">
          <el-form-item label="机型" prop="mobile_name">
            <el-input v-model="dataForm.mobile_name" placeholder="机型" style="width:500px"></el-input>
          </el-form-item>
          <el-form-item label="操作系统" prop="mobile_os">
            <el-input v-model="dataForm.mobile_os" placeholder="操作系统" style="width:500px"></el-input>
            <!-- <el-select v-model="dataForm.mobile_os" placeholder="操作系统" style="width:500px">
              <el-option
                v-for="item in os_options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item label="主屏尺寸" prop="mobile_size">
            <el-input v-model="dataForm.mobile_size" placeholder="主屏尺寸" style="width:500px"></el-input>
            <!-- <el-select v-model="dataForm.mobile_size" placeholder="主屏尺寸" style="width:500px">
              <el-option
                v-for="item in size_options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item label="分辨率" prop="mobile_resolution">
            <el-input v-model="dataForm.mobile_resolution" placeholder="分辨率" style="width:500px"></el-input>
          </el-form-item>
          <el-form-item label="IMEI" prop="mobile_imei">
            <el-input v-model="dataForm.mobile_imei" placeholder="IMEI" style="width:500px"></el-input>
          </el-form-item>
          <el-form-item label="设备状态" prop="mobile_status">
            <!-- <el-input v-model="dataForm.mobile_status" placeholder="设备状态" style="width:500px"></el-input> -->
            <el-select v-model="dataForm.mobile_status" placeholder="设备状态" style="width:500px">
              <el-option
                v-for="item in status_options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="持有者" prop="mobile_owner">
            <el-input v-model="dataForm.mobile_owner" placeholder="持有者。即设备领取人或归属人。" style="width:500px"></el-input>
          </el-form-item>
         <!--  <el-form-item label="采购状态" prop="mobile_buy_status">
            <el-select v-model="dataForm.mobile_buy_status" placeholder="采购状态" style="width:500px">
              <el-option
                v-for="item in buy_status_options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="采购人" prop="mobile_buyer">
            <el-input v-model="dataForm.mobile_buyer" placeholder="采购人" style="width:500px"></el-input>
          </el-form-item> -->
          <el-form-item label="领取日期" prop="mobile_receive_date">
            <!-- <el-input v-model="dataForm.mobile_receive_date" placeholder="领取日期。如：2017-01-01" style="width:500px"></el-input> -->
            <el-date-picker
              v-model="dataForm.mobile_receive_date"
              type="datetime"
              placeholder="选择领取日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="">
            <el-button type="main" @click="handleSubmit" :disabled="btnSubmitDisabled" class="btn-long">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import TYPE from '@/store/mutation-types'

  export default{
    data () {
      return {
        btnSubmitDisabled: false,
        id: '',
        status_options: [
          {
            "value": 1,
            "label": "工作中"
          },
          {
            "value": 0,
            "label": "已领取"
          },
          {
            "value": 2,
            "label": "闲置"
          }
        ],
        buy_status_options: [
          {
            "value": 1,
            "label": "已采购"
          },
          {
            "value": 0,
            "label": "未采购"
          },
          {
            "value": 2,
            "label": "未知"
          }
        ],
        dataForm: {
          mobile_name: '',
          mobile_os: '',
          mobile_size: '',
          mobile_resolution: '',
          mobile_imei: '',
          mobile_status: 1,
          mobile_owner: '',
          mobile_buy_status: 1,
          mobile_buyer: '',
          mobile_receive_date: ''
        },
        dataRule: {
          mobile_name: [
            {required: true, message: '机型必填', trigger: 'blur'}
          ],
          mobile_os: [
            {required: true, message: '操作系统必填', trigger: 'blur'}
          ],
          mobile_size: [
            {required: true, message: '屏幕尺寸必填', trigger: 'blur'}
          ],
          mobile_resolution: [
            {required: true, message: '分辨率必填', trigger: 'blur'}
          ],
          mobile_imei: [
            {required: true, message: 'IMEI必填', trigger: 'blur'}
          ],
          mobile_status: [
            {required: true, message: '设备状态必填', trigger: 'blur'}
          ],
          mobile_owner: [
            {required: true, message: '设备持有者必填', trigger: 'blur'}
          ],
          mobile_buy_status: [
            {required: true, message: '采购状态必填', trigger: 'blur'}
          ],
          mobile_buyer: [
            {required: true, message: '采购人必填', trigger: 'blur'}
          ],
          mobile_receive_date: [
            {required: true, message: '领取日期必填', trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      ...mapState(['loading']),
    },
    methods: {
      ...mapActions('data_mobiles',
        ['findById', 'findMoreById', 'add', 'update']
      ),
      checkValid: async function () {
        let valid = false
        try {
          valid = await this.$refs.dataForm.validate()
        } catch (error) {
        }
        return valid
      },
      GMTToStr (time) {
        let date = new Date(time)
        let Str=date.getFullYear() + '-' +
        (date.getMonth() + 1) + '-' + 
        date.getDate() + ' ' + 
        date.getHours() + ':' + 
        date.getMinutes() + ':' + 
        date.getSeconds()
        return Str
      },
      handleSubmit: async function () {
        if (this.loading) {
          return
        }
        let valid = await this.checkValid()
        if (!valid) {
          return
        }
        try {
          // 修改
          if (this.id) {
            let params = _.clone(this.dataForm)
            params.id = Number(this.id)
            // DateTimePicker选择器返回值是GMT格式的，但向后端发送的时间格式是标准时间格式，需要转成string时间
            params.mobile_receive_date = this.GMTToStr(params.mobile_receive_date)
            console.log(params.mobile_receive_date)
            this.$store.commit(TYPE.setLoading, true)
            let result = await this.update(params)
            this.$store.commit(TYPE.setLoading, false)
            if (result && result.errcode === 0) {
              this.$alert('操作成功！', '系统提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.$store.commit('data_mobiles/updateItem', {dataList: []})
                  this.$router.push({path: '/data_mobiles/list'})
                }
              })
            } else {
              this.$msgError(result.errmsg)
            }
          }
          // 新增
          else {
            let params = this.dataForm
            // DateTimePicker选择器返回值是GMT格式的，但向后端发送的时间格式是标准时间格式，需要转成string时间
            params.mobile_receive_date = this.GMTToStr(params.mobile_receive_date)
            // console.log(params)
            this.$store.commit(TYPE.setLoading, true)
            let result = await this.add(params)
            this.$store.commit(TYPE.setLoading, false)
            if (result && result.errcode === 0) {
              this.$confirm('操作成功！ 是否继续?', '提示', {
                confirmButtonText: '继续新增',
                cancelButtonText: '返回列表',
                type: 'warning'
              }).then(() => {
                this.id = ''
                this.$refs['dataForm'].resetFields()
              }).catch(() => {
                this.$router.push({path: '/data_mobiles/list'})
              })
            } else {
              this.$msgError(result.errmsg)
            }
          }
        } catch (error) {
          console.log(error)
          this.$store.commit(TYPE.setLoading, false)
          this.$msgError('请求出现异常')
        }
      }
    },
    created: async function () {
      let id = this.$route.params.id
      if (id) {
        this.id = id
        try {
          let result = await this.findMoreById(id)
          if (result.errcode === 0 && result.data) {
            this.dataForm.mobile_name = result.data.mobile_name
            this.dataForm.mobile_os = result.data.mobile_os
            this.dataForm.mobile_size = result.data.mobile_size
            this.dataForm.mobile_resolution = result.data.mobile_resolution
            this.dataForm.mobile_imei = result.data.mobile_imei
            this.dataForm.mobile_status = result.data.mobile_status
            this.dataForm.mobile_owner = result.data.mobile_owner
            this.dataForm.mobile_buy_status = result.data.mobile_buy_status
            this.dataForm.mobile_buyer = result.data.mobile_buyer
            this.dataForm.mobile_receive_date = result.data.mobile_receive_date
          } else {
            this.btnSubmitDisabled = true
            this.$msgError('获取数据失败')
          }
        } catch (error) {
          this.$msgError(error.toString())
        }
      }
    }
  }
</script>
