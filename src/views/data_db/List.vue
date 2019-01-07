<template>
  <div class="page-wrapper">
    <!--导航区-->
    <div class="page-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }"><span class="fa fa-home"><b>  首页</b></span></span></el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/data_db/list' }">数据查询</el-breadcrumb-item>
        <el-breadcrumb-item>测试DB查询</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!--搜索栏-->
    <div class="page-search">
      <el-form :inline="true" label-width="0px">
        <el-form-item label="" label-width="0px">
          <el-tooltip class="item" effect="dark" content="测试DB用户名密码：easy_ro/easy" placement="right">
            <el-input v-model="sname"
                      placeholder="请输入DB名"
                      :trigger-on-focus="false"
                      @keydown.enter.stop.native="handleSearch($event)">
                <el-button type="warn" slot="append" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item class="pull-right" v-if="AuthDataDBAdd">
          <router-link :to="{ path: '/data_db/add' }">
            <el-button type="default" icon="el-icon-plus">新增测试DB</el-button>
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
        <el-table-column label="ID" prop="id" sortable></el-table-column>
        <el-table-column label="线上DB名" prop="online_dbname" sortable></el-table-column>
        <el-table-column label="线上主/从" prop="online_leader" :formatter="formatStatus"></el-table-column>
        <el-table-column label="线上版本" prop="online_version" sortable></el-table-column>
        <el-table-column label="测试DB名" prop="offline_dbname" sortable></el-table-column>
        <el-table-column label="测试主/从"  prop="offline_leader" :formatter="formatStatus_offline"></el-table-column>
        <el-table-column label="IP+PORT" prop="offline_ip_port" sortable></el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <router-link :to="{ path: '/data_db/edit/'+scope.row.id}" v-if="AuthDataDBEdit">
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
        dataList: state => state.data_db.dataList,
        total: state => state.data_db.total,
        page: state => state.data_db.page,
        limit: state => state.data_db.limit
      }),
      sname: {
        get () {
          return this.$store.state.data_db.sname
        },
        set (val) {
          this.$store.commit('data_db/updateItem', {sname: val})
        }
      },
      AuthDataDBAdd: function () {
        return this.isPermission('AuthDataDBAdd')
      },
      AuthDataDBEdit: function () {
        return this.isPermission('AuthDataDBEdit')
      }
    },
    methods: {
      ...mapActions('data_db', ['findList']),
      //状态显示转换
      formatStatus: function (row, column) {
        return row.online_leader == 1 ? '主' : row.online_leader == 0 ? '从' : '单';
      },
      formatStatus_offline: function (row, column) {
        return row.offline_leader == 1 ? '主' : row.offline_leader == 0 ? '从' : '单';
      },

      handleSearch (ev) {
        this.$store.commit('data_db/resetSearchStatus')
        this.search()
        if (ev) {
          ev.preventDefault()
          ev.stopPropagation()
        }
      },
      handleCurrentChange (val) {
        this.$store.commit('data_db/updateItem', {page: val})
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
      if (!this.$store.state.data_db.dataList || this.$store.state.data_db.dataList.length === 0) {
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
