<template>
  <div class="page-wrapper page-wrapper--book" v-loading="loading" element-loading-text="数据请求中">
    <!--导航区-->
    <div class="page-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }"><span class="fa fa-home"><b>  首页</b></span></span></el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/data_db/list' }">数据查询</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/data_db/list' }">测试DB查询</el-breadcrumb-item>
        <el-breadcrumb-item>{{id ? '编辑测试DB' : '新增测试DB'}}</el-breadcrumb-item>
      </el-breadcrumb>
      <!--返回按钮-->
      <div class="button-back">
        <router-link :to="{ path:'/data_db/list'}">
          <el-button type="default" size="mini">返回</el-button>
        </router-link>
      </div>
    </div>

    <!--主内容区-->
    <div class="page-main">
      <div class="content-wrap">
        <el-form class="form-book--info" ref="dataForm" :model="dataForm" :rules="dataRule" label-width="150px">
          <el-form-item label="线上DB名" prop="online_dbname">
            <el-input v-model="dataForm.online_dbname" placeholder="同线上即可，如：mstdb1" style="width:500px"></el-input>
          </el-form-item>
          <el-form-item label="线上主/从" prop="online_leader">
            <el-select v-model="dataForm.online_leader" placeholder="线上主从，如：1--表示主，0-表示从" style="width:500px">
              <el-option
                v-for="item in leader_options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="线上数据库版本" prop="online_version">
            <el-select v-model="dataForm.online_version" placeholder="同线上即可，如：mysql 5.7.17-13" style="width:500px">
              <el-option
                v-for="item in version_options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="测试DB名" prop="offline_dbname">
            <el-input v-model="dataForm.offline_dbname" placeholder="同线上DB名即可" style="width:500px"></el-input>
          </el-form-item>
          <el-form-item label="测试主/从" prop="offline_leader">
            <el-select v-model="dataForm.offline_leader" placeholder="测试主从，与线上主从保持一致即可" style="width:500px">
              <el-option
                v-for="item in leader_options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="测试ip和port" prop="offline_ip_port">
            <el-input v-model="dataForm.offline_ip_port" placeholder="测试DB映射的测试机器ip和port" style="width:500px"></el-input>
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
        leader_options: [
          {
            "value": 1,
            "label": "主"
          },
          {
            "value": 0,
            "label": "从"
          },
          {
            "value": 2,
            "label": "单"
          }
        ],
        version_options: [
          {
            "value": "mysql 5.7.17-13",
            "label": "mysql 5.7.17-13"
          },
          {
            "value": "mysql 5.6.37-82.2",
            "label": "mysql 5.6.37-82.2"
          },
          {
            "value": "mysql 5.6.35-81.0",
            "label": "mysql 5.6.35-81.0"
          },
          {
            "value": "mysql 5.6.32-78.1",
            "label": "mysql 5.6.32-78.1"
          },
          {
            "value": "mysql 5.6.36-82.1",
            "label": "mysql 5.6.36-82.1"
          }
        ],
        dataForm: {
          online_dbname: '',
          online_leader: 1,
          online_version: '',
          offline_dbname: '',
          offline_leader: 1,
          offline_ip_port: ''
        },
        dataRule: {
          online_dbname: [
            {required: true, message: '线上DB名必填', trigger: 'blur'}
          ],
          online_leader: [
            {required: true, message: '主从必选', trigger: 'blur'}
          ],
          online_version: [
            {required: true, message: '线上数据库版本必填', trigger: 'blur'}
          ],
          offline_dbname: [
            {required: true, message: '测试DB名必填', trigger: 'blur'}
          ],
          offline_leader: [
            {required: true, message: '主从必选', trigger: 'blur'}
          ],
          offline_ip_port: [
            {required: true, message: '测试ip和port必填', trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      ...mapState(['loading']),
    },
    methods: {
      ...mapActions('data_db',
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
            this.$store.commit(TYPE.setLoading, true)
            let result = await this.update(params)
            this.$store.commit(TYPE.setLoading, false)
            if (result && result.errcode === 0) {
              this.$alert('操作成功！', '系统提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.$store.commit('data_db/updateItem', {dataList: []})
                  this.$router.push({path: '/data_db/list'})
                }
              })
            } else {
              this.$msgError(result.errmsg)
            }
          }
          // 新增
          else {
            this.$store.commit(TYPE.setLoading, true)
            // console.log(this.dataForm)
            let result = await this.add(this.dataForm)
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
                this.$router.push({path: '/data_db/list'})
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
            this.dataForm.online_dbname = result.data.online_dbname
            this.dataForm.online_leader = result.data.online_leader
            this.dataForm.online_version = result.data.online_version
            this.dataForm.offline_dbname = result.data.offline_dbname
            this.dataForm.offline_leader = result.data.offline_leader
            this.dataForm.offline_ip_port = result.data.offline_ip_port
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
