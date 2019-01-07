<template>
  <div class="page-wrapper">

    <!--搜索栏-->
    <div class="page-search">
      <el-form :inline="true" label-width="0px">
        <el-form-item label="" label-width="0px">
          <el-input v-model="sname"
                    placeholder="请输入二级菜单名称或编码"
                    :trigger-on-focus="false"
                    @keydown.enter.stop.native="handleSearch($event)">
            <el-button type="warn" slot="append" icon="el-icon-search" @click="handleSearch">搜索</el-button>
          </el-input>
        </el-form-item>
        <el-form-item class="pull-right" v-if="AuthMenuPermissionAdd">
          <router-link :to="{ path: '/menu/add', props: categoryAllData }">
            <el-button type="default" icon="el-icon-plus" v-bind:categoryAllData="categoryAllData">新增菜单设置</el-button>
          </router-link>
        </el-form-item>
      </el-form>
    </div>

    <!--主内容区-->
    <div class="page-main">
      <el-table :data="dataList" highlight-current-row v-loading="loading" element-loading-text="数据请求中"
                style="width: 100%;">
        <!-- <el-table-column type="index" label="序号"></el-table-column> -->
        <el-table-column label="序号" width="80">
          <template slot-scope="scope">
            <span>{{parseInt(scope.$index + 1) + parseInt(limit * (page - 1))}}</span>
          </template>
        </el-table-column>
        <el-table-column label="一级菜单" prop="parent_name" sortable width="160"></el-table-column>
        <el-table-column label="二级菜单" prop="name" sortable width="150"></el-table-column>
        <el-table-column label="二级菜单编码" prop="code" sortable min-width="100"></el-table-column>
        <el-table-column label="二级菜单路由" prop="path" min-width="200"></el-table-column>
        <el-table-column label="操作" width="170">
          <template slot-scope="scope">
            <el-button type="warning" plain size="mini" v-if="AuthMenuPermissionEdit" @click="handleToEdit(scope.row)">
              <span>编辑</span>
            </el-button>
            <el-button type="danger" plain size="mini" v-if="AuthMenuPermissionDelete" @click="handleDelete(scope.row.id)">
              <span>删除</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <el-pagination layout="total,prev, pager, next"
                   :current-page="page"
                   :page-size="limit"
                   :total="total"
                   @current-change="handleCurrentChange"
                   class="pull-right">
    </el-pagination>

  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import TYPE from '@/store/mutation-types'

  export default{
    data () {
      return {
        categoryAllData:[]
      }
    },
    computed: {
      ...mapState(['loading']),
      ...mapState({
        dataList: state => state.menu.dataList,
        total: state => state.menu.total,
        page: state => state.menu.page,
        limit: state => state.menu.limit
      }),
      sname: {
        get () {
          return this.$store.state.menu.sname
        },
        set (value) {
          this.$store.commit('menu/updateItem', {sname: value})
        }
      },
      AuthMenuPermissionAdd: function () {
        return this.isPermission('AuthMenuPermissionAdd')
      },
      AuthMenuPermissionEdit: function () {
        return this.isPermission('AuthMenuPermissionEdit')
      },
      AuthMenuPermissionDelete: function () {
        return this.isPermission('AuthMenuPermissionDelete')
      }
    },
    methods: {
      ...mapActions('menu', ['findList', 'findCategoryAll', 'delete']),
      handleSearch (ev) {
        this.$store.commit('menu/resetSearchStatus')
        this.search()
        if (ev) {
          ev.preventDefault()
          ev.stopPropagation()
        }
      },
      handleCurrentChange (val) {
        this.$store.commit('menu/updateItem', {page: val})
        this.search()
      },
      search: async function () {
        try {
          this.$store.commit(TYPE.setLoading, true)
          let result = await this.findList()
          console.log(result)
          // let result_all = await this.findCategoryAll()
          // this.categoryAllData = result_all["data"]
          // console.log(this.categoryAllData)
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
      // handleToGetCategoryAll: async function () {
      //   try {
      //     this.$store.commit(TYPE.setLoading, true)
      //     let result_all = await this.findCategoryAll()
      //     // console.log(result)
      //     this.categoryAllData = result["data"]
      //     console.log(this.categoryAllData)
      //     this.$store.commit(TYPE.setLoading, false)
      //     if (!(result && result.errcode === 0)) {
      //       this.$msgError(result.errmsg)
      //     }
      //   } catch (error) {
      //     console.log(error)
      //     this.$store.commit(TYPE.setLoading, false)
      //     this.$msgError('获取全部菜单出现异常')
      //   }
      // },
      handleDelete: async function (id) {
        try {
          await this.$confirm('确定删除该菜单设置吗？', '系统提示', {type: 'warning'})
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
      },
      handleToEdit (row) {
        this.$router.push({path: '/menu/edit/' + row.id})
      }
    },
    mounted () {
      if (this.$store.state.permission.dataList.length === 0) {
        this.handleSearch()
      }
    }
  }
</script>
<style scoped>
  .summary {
    margin: 0px;
  }
</style>
