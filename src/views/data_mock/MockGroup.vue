<template>
  <div class="page-wrapper">
    <!--导航区-->
    <div class="page-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }"><span class="fa fa-home"><b>  首页</b></span></span></el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/data_mock/factory' }">数据Mock</el-breadcrumb-item>
        <el-breadcrumb-item>分组管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--主内容区-->
    <div class="page-main">
      <el-button type="success" class="fr mb20" @click="toggleGroupModal(true, 'add')">新建分组</el-button>
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中..."
        :data="groupList"
        stripe
        @row-click="showDetails"
        style="width: 100%"
        :row-style="rowStyle"
      >
        <el-table-column
          prop="id"
          label="ID"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="分组名称"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="description"
          label="分组描述"
          sortable
        >
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click.stop="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click.stop="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="modalTitle"
      :visible.sync="ifShowGroup"
      center
    >
      <el-form :model="formData" :rules="rules" ref="groupForm">
        <el-form-item label="分组名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model.trim="formData.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="分组描述" :label-width="formLabelWidth" prop="description">
          <el-input v-model.trim="formData.description" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ifShowGroup = false">取 消</el-button>
        <el-button type="primary" @click="confirmGroup">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="查看分组详情"
      :visible.sync="ifShowDetail"
      center
    >
      <el-table
        :data="childGroup"
        stripe
        style="width: 100%"
      >
        <el-table-column
          prop="name"
          label="名称"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="protocol"
          label="协议"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="port"
          label="端口号"
          sortable
        >
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="ifShowDetail = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

  import {mapState, mapMutations, mapActions} from 'vuex'

  export default{
    data () {
      return {
        modalType: '',
        loading: true,
        ifShowGroup: false,
        ifShowDetail: false,
        formLabelWidth: '120px',
        childGroup: [],
        formData: {
          id: null,
          name: '',
          description: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入分组名称', trigger: 'blur' }
          ]
        },
      }
    },
    computed: {
      ...mapState({
        groupList: state => state.mock.mockGroupList
      }),
      modalTitle () {
        return this.modalType === 'edit' ? '编辑分组' : '新建分组';
      }
    },
    mounted () {
      this.init();
    },
    methods: {
      ...mapMutations('mock', [
        'modifyGroup',
        'removeGroup'
      ]),
      ...mapActions('mock',
        [
          'getGroupList',
          'addGroup',
          'delGroup',
          'updateGroup',
        ]
      ),
      init() {
        this.getGroupList().then(() => {
          this.loading = false;
        });
      },
      rowStyle () {
        return {
          cursor: 'pointer',
        }
      },
      showDetails (row) {
        this.ifShowDetail = true;
        this.childGroup = row.items || [];
      },
      toggleGroupModal (flag, type) {
        this.ifShowGroup = !!flag;
        this.modalType = type || '';
        if (!flag) {
          this.resetForm('groupForm');
        }
      },
      confirmGroup () {
        this.$refs['groupForm'].validate((valid) => {
          if (!valid) {
            return false;
          }
          if (this.modalType === 'add') {
            this.addApi();
          } else {
            this.editApi();
          }
        });
      },
      addApi () {
        this.addGroup(this.formData).then(v => {
          if (v.errcode === 0) {
            this.showMessage('success', '分组创建成功');
            this.toggleGroupModal();
            this.getGroupList();
          } else {
            this.showMessage('error', v.errmsg);
          }
        });
      },
      editApi () {
        this.updateGroup(this.formData).then(v => {
          if (v.errcode === 0) {
            this.showMessage('success', '分组修改成功');
            this.modifyGroup(this.formData);
            this.toggleGroupModal();
          } else {
            this.showMessage('error', v.errmsg);
          }
        });
      },
      showMessage(type, msg) {
        this.$message({
          message: msg,
          type
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      handleEdit(idx, item) {
        this.formData.name = item.name;
        this.formData.description = item.description;
        this.formData.id = item.id;
        this.toggleGroupModal(true, 'edit');
      },
      handleDelete(idx, item) {
        this.$confirm('确定要删除该分组吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delGroup({
            id: item.id
          }).then(v => {
            if (v.errcode === 0) {
              this.removeGroup(item);
              this.showMessage('success', '分组删除成功！')
            } else {
              this.showMessage('error', v.errmsg);
            }
          });
        }).catch(() => {
          this.showMessage('info', '已取消删除！')
        });
      },
    }
  }
</script>
<style scoped>
  .page-main{
    margin: 20px;
  }
  .fr {
    float: right;
  }
  .mb20 {
    margin-bottom: 20px;
  }
</style>
