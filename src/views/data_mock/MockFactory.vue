<template>
  <div class="page-wrapper">
    <!--导航区-->
    <div class="page-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }"><span class="fa fa-home"><b>  首页</b></span></span></el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/data_mock/factory' }">数据Mock</el-breadcrumb-item>
        <el-breadcrumb-item>Mock工厂</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--主内容区-->
    <div class="page-main">
      <el-form
        ref="form"
        :rules="rules"
        :model="factoryFilter"
        label-width="100px"
        highlight-current-row
      >
        <el-form-item label="分组名称：">
          <el-select
            filterable
            clearable
            :value="factoryFilter.group_id"
            placeholder="请选择分组名称"
            :style="inputWidth"
            @change="selectGroup"
          >
            <el-option
              v-for="item in groupNameList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="接口名称：">
          <el-select
            filterable
            clearable
            :value="factoryFilter.api_id"
            placeholder="请选择接口名称"
            :style="inputWidth"
            @change="selectApi"
          >
            <el-option
              v-for="item in mockApiList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
        </el-form-item> -->
      </el-form>
      <div class="table-wrapper">
        <el-button type="primary" class="new-mock fr" @click="goNewMock">新增</el-button>
        <el-table
          :data="factoryList"
          stripe
          @row-click="goDetail"
          style="width: 100%"
          :row-style="rowStyle"
          :cell-class-name="getCellClass"
        >
          <el-table-column
            prop="id"
            label="ID"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="mock_detail_name"
            label="名称"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="author"
            label="创建人"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="type"
            label="归属"
            sortable
          >
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="+scope.row.type === 0 ? '点击变为私有' : '点击变为公开'" placement="top">
                <el-button
                  size="mini"
                  :type="+scope.row.type === 0 ? 'success' : ''"
                  :disabled="+scope.row.is_author === 0"
                  @click.stop="toggleType(scope.$index, scope.row)">{{+scope.row.type === 1 ? '私有' : '公开'}}</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="当前状态"
            sortable
          >
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="+scope.row.status === 0 ? '点击变为开启' : '点击变为关闭'" placement="top">
                <el-button
                size="mini"
                :type="+scope.row.status === 1 ? 'success' : ''"
                :disabled="+scope.row.is_author === 0"
                @click.stop="toggleStatus(scope.$index, scope.row)">{{+scope.row.status === 1 ? '开启' : '关闭'}}</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="300"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click.stop="handleCopy(scope.$index, scope.row)">复制</el-button>
              <el-button
                size="mini"
                type="primary"
                v-if="+scope.row.is_author === 1"
                @click.stop="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                v-if="+scope.row.is_author === 1"
                @click.stop="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination layout="total, prev, pager, next"
          :current-page="pagination.page"
          :page-size="pagination.limit"
          :total="pagination.total"
          @current-change="handleCurrentChange"
          class="pull-right">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState, mapMutations, mapActions} from 'vuex'

  export default{
    name: 'mockFactory',
    data () {
      return {
        inputWidth: {
          width: '500px'
        },
        rowStyle () {
          return {
            cursor: 'pointer',
          }
        },
        rules: {
          groupName: [
            { required: true, message: '请选择分组名称', trigger: 'blur' }
          ]
        }
      }
    },
    mounted () {
      this.init();
    },
    computed: {
      ...mapState({
        groupNameList: state => state.mock.mockGroupList,
        pagination: state => state.mock.mockFactoryPagination,
        factoryList: state => state.mock.factoryList,
        mockApiList: state => state.mock.mockApiList,
        factoryFilter: state => state.mock.factoryFilter,
      }),
    },
    methods: {
      ...mapMutations('mock', [
        'updateFactoryFilter',
        'updatePagination',
        'assignSingleMock',
        'resetSingleMock',
      ]),
      ...mapActions('mock',
        [
          'getGroupList',
          'getFactoryList',
          'updateType',
          'updateStatus',
          'deleteMock',
        ]
      ),
      getCellClass({ row, column, columnIndex }) {
        if (columnIndex === 1) {
          return 'underline';
        } else {
          return '';
        }
      },
      init () {
        this.getGroupList();
        this.updateFactoryList();
        setTimeout(() => {
          console.error('factoryList: ', this.factoryList);
        })
      },
      handleCurrentChange (val) {
        this.updatePagination({
          page: val
        });
        this.updateFactoryList();
      },
      toggleStatus (idx, row) {
        this.updateStatus(row);
      },
      toggleType (idx, row) {
        this.updateType(row);
      },
      selectGroup (e) {
        this.updateFactoryFilter({
          group_id: e,
          api_id: ''
        });
        this.updateFactoryList(true);
      },
      selectApi (e) {
        this.updateFactoryFilter({
          api_id: e
        });
        this.updateFactoryList(true);
      },
      updateFactoryList (start) {
        let pagination = {...this.pagination};
        if (start) {
          pagination.page = 1;
        }

        const params = {
          ...pagination,
          group_id: this.factoryFilter.group_id,
          api_id: this.factoryFilter.api_id
        }
        this.getFactoryList(params);
      },
      handleDelete (idx, row) {
        if (row.status) {
          this.showMessage('warning', '开启状态无法删除！');
          return;
        }
        this.$confirm('确定要删除该服务吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteMock(row).then(v => {
            if (v.errcode === 0) {
              const total = this.pagination.total - 1;
              let page = this.pagination.page;
              let limit = this.pagination.limit;
              if ((page - 1) * limit >= total) {
                page = page - 1;
              }
              this.updatePagination({
                page,
                total,
              });
              this.updateFactoryList();
            }
          });
        }).catch(() => {
          this.showMessage('info', '已取消删除！')
        });
      },
      showMessage(type, msg) {
        this.$message({
          message: msg,
          type
        });
      },
      goNewMock () {
        this.resetSingleMock();
        this.$router.push({ path: '/data_mock/edit', query: { subType: 'add' } });
      },
      goDetail (row) {
        this.assignSingleMock(row);
        this.$router.push({ path: '/data_mock/detail' });
      },
      handleCopy (idx, row) {
        this.assignSingleMock(row);
        this.$router.push({ path: '/data_mock/edit', query: { subType: 'add' }});
      },
      handleEdit (idx, row) {
        this.assignSingleMock(row);
        this.$router.push({ path: '/data_mock/edit', query: { subType: 'edit' }});
      }
    }
  }
</script>
<style scoped>
  .summary {
    margin: 0px;
  }
  .page-main{
    margin: 20px 20px 20px 20px;
  }
  .new-mock {
    margin-bottom: 20px;
  }
  .fr {
    float: right;
  }
</style>
<style>
.underline {
  text-decoration: underline;
}
</style>
