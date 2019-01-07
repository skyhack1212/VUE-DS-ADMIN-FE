<template>
  <div class="page-wrapper">
    <!--导航区-->
    <div class="page-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }"><span class="fa fa-home"><b>  首页</b></span></span></el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/data_mobiles/list' }">数据查询</el-breadcrumb-item>
        <el-breadcrumb-item>测试设备管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!--搜索栏-->
    <div class="page-search">
      <el-form :inline="true" label-width="0px">
        <el-form-item label="" label-width="0px">
          <el-input v-model="sname"
                    placeholder="请输入机型"
                    :trigger-on-focus="false"
                    @keydown.enter.stop.native="handleSearch($event)">
            <el-button type="warn" slot="append" icon="el-icon-search" @click="handleSearch">搜索</el-button>
          </el-input>
        </el-form-item>
        <el-form-item class="pull-right" v-if="AuthDataMobilesAdd">
          <router-link :to="{ path: '/data_mobiles/add' }">
            <el-button type="default" icon="el-icon-plus">新增测试设备</el-button>
          </router-link>
        </el-form-item>
      </el-form>
    </div>

    <!--主内容区-->
    <div class="page-main">
      <el-table :data="dataList" highlight-current-row v-loading="loading" element-loading-text="数据请求中"
                style="width: 100%;">
        <!-- <el-table-column type="expand">
          <template slot-scope="props">
            <p class="summary">[ 简介 ] {{ props.row.summary }}</p>
          </template>
        </el-table-column> -->
        <el-table-column label="ID" prop="id" width="60px" sortable></el-table-column>
        <el-table-column label="机型" prop="mobile_name" width="200px" sortable></el-table-column>
        <el-table-column label="操作系统" prop="mobile_os" min-width="150px" sortable></el-table-column>
        <el-table-column label="主屏尺寸" prop="mobile_size" sortable></el-table-column>
        <el-table-column label="分辨率" prop="mobile_resolution" sortable></el-table-column>
        <el-table-column label="IMEI"  prop="mobile_imei" min-width="116px" sortable></el-table-column>
        <el-table-column label="设备状态" prop="mobile_status" :formatter="formatStatus"></el-table-column>
        <el-table-column label="持有者" prop="mobile_owner" sortable></el-table-column>
        <!-- <el-table-column label="采购状态" prop="mobile_buy_status" :formatter="formatStatus_buy"></el-table-column>
        <el-table-column label="采购人" prop="mobile_buyer" sortable></el-table-column> -->
        <el-table-column label="领取日期" prop="mobile_receive_date" min-width="100px" :formatter="formatDate" sortable></el-table-column>
        <!-- <el-table-column label="领取日期" prop="mobile_receive_date" min-width="100px" sortable></el-table-column> -->
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <router-link :to="{ path: '/data_mobiles/edit/'+scope.row.id}" v-if="AuthDataMobilesEdit">
              <el-button type="warning" plain size="mini">编辑</el-button>
            </router-link>
            <!-- <el-button type="danger" plain size="mini" v-if="scope.row.role!==1" @click="handleDelete(scope.row.id)">
              <span>删除</span>
            </el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination layout="total,prev, pager, next"
                     :current-page="page"
                     :page-size="limit"
                     :total="total"
                     @current-change="handleCurrentChange"
                     class="pull-right">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import TYPE from '@/store/mutation-types'

  export default{
    data () {
      return {}
    },
    computed: {
      ...mapState(['loading']),
      ...mapState({
        dataList: state => state.data_mobiles.dataList,
        total: state => state.data_mobiles.total,
        page: state => state.data_mobiles.page,
        limit: state => state.data_mobiles.limit
      }),
      sname: {
        get () {
          return this.$store.state.data_mobiles.sname
        },
        set (val) {
          this.$store.commit('data_mobiles/updateItem', {sname: val})
        }
      },
      AuthDataMobilesAdd: function () {
        return this.isPermission('AuthDataMobilesAdd')
      },
      AuthDataMobilesEdit: function () {
        return this.isPermission('AuthDataMobilesEdit')
      }
    },
    methods: {
      ...mapActions('data_mobiles', ['findList']),
      //状态显示转换
      formatStatus: function (row, column) {
        return row.mobile_status == 1 ? '工作中' : row.mobile_status == 0 ? '报修' : '闲置';
      },
      formatStatus_buy: function (row, column) {
        return row.mobile_buy_status == 1 ? '已采购' : row.mobile_buy_status == 0 ? '未采购' : '未知';
      },
      //日期显示转换
      formatDate: function (row, column) {
        return row.mobile_receive_date ? row.mobile_receive_date.split(" ")[0] : row.mobile_receive_date
      },
      handleSearch (ev) {
        this.$store.commit('data_mobiles/resetSearchStatus')
        this.search()
        if (ev) {
          ev.preventDefault()
          ev.stopPropagation()
        }
      },
      handleCurrentChange (val) {
        this.$store.commit('data_mobiles/updateItem', {page: val})
        this.search()
      },
      search: async function () {
        try {
          this.$store.commit(TYPE.setLoading, true)
          let result = await this.findList()
          // console.log(result)
          this.$store.commit(TYPE.setLoading, false)
          if (!(result && result.errcode === 0)) {
            this.$msgError(result.errmsg)
          }
        } catch (error) {
          console.log(error)
          this.$store.commit(TYPE.setLoading, false)
          this.$msgError('请求出现异常')
        }
      },
      handleDelete: async function (id) {
        try {
          await this.$confirm('确定删除该条数据吗？', '系统提示', {type: 'warning'})
        } catch (cancel) {
          return // 取消就不继续处理
        }
        try {
          // 确认后继续
          this.$store.commit(TYPE.setLoading, true)
          let result = await this.delete(id)
          this.$store.commit(TYPE.setLoading, false)
          if (result.errcode === 0) {
            this.$msgSuccess('删除成功')
          } else {
            this.$msgError(result.errmsg)
          }
        } catch (error) {
          console.log(error)
          this.$store.commit(TYPE.setLoading, false)
          this.$msgError('请求出现异常')
        }
      }
    },
    mounted () {
      if (!this.$store.state.data_mobiles.dataList || this.$store.state.data_mobiles.dataList.length === 0) {
        this.search()
      }
    }
  }
</script>
<style scoped>
  .summary {
    margin: 0px;
  }
</style>
