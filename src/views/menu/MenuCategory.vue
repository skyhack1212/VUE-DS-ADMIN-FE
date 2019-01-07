<template>
  <div class="page-wrapper">

    <!--搜索栏-->
    <div class="page-search">
      <el-form :inline="true" label-width="0px">
        <el-form-item label="" label-width="0px">
          <el-input v-model="sname"
                    placeholder="请输入菜单分类/名称"
                    :trigger-on-focus="false"
                    @keydown.enter.stop.native="handleSearch($event)">
            <el-button type="warn" slot="append" icon="el-icon-search" @click="handleSearch">搜索</el-button>
          </el-input>
        </el-form-item>
        <el-form-item class="pull-right" v-if="AuthCategoryAdd">
          <el-button type="default" icon="el-icon-plus" @click="handleToAdd()">新增菜单分类</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!--主内容区-->
    <div class="page-main">
      <el-table :data="dataList" highlight-current-row v-loading="loading" element-loading-text="数据请求中"
                style="width: 100%;">
        <el-table-column label="序号" width="80">
          <template slot-scope="scope">
            <span>{{parseInt(scope.$index + 1) + parseInt(limit * (page - 1))}}</span>
          </template>
        </el-table-column>
        <el-table-column label="菜单分类" prop="name" sortable width="160"></el-table-column>
        <el-table-column label="菜单级别" prop="level" min-width="160"></el-table-column>
        <el-table-column label="菜单描述" prop="description" min-width="200"></el-table-column>
        <!-- <el-table-column label="菜单描述" prop="path" min-width="200"></el-table-column> -->
        <!-- <el-table-column label="创建时间" prop="created_at" width="160"></el-table-column> -->
        <el-table-column label="操作" width="170">
          <template slot-scope="scope">
            <el-button type="warning" plain size="mini" v-if="AuthCategoryEdit" @click="handleToEdit(scope.row)">
              <span>编辑</span>
            </el-button>
            <el-button type="danger" plain size="mini" v-if="AuthCategoryDelete" @click="handleDelete(scope.row.id)">
              <span>删除</span>
            </el-button>
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

    <el-dialog :visible.sync="dialogVisible" width="500px">
      <span slot="title">{{id ? '编辑菜单分类' : '新增菜单分类'}}</span>
      <div>
        <el-form ref="categoryForm" :model="categoryForm" :rules="rules" label-width="80px">
          <el-form-item label="菜单分类" prop="name">
            <el-input v-model="categoryForm.name"></el-input>
          </el-form-item>
          <!-- <el-form-item label="菜单级别" prop="level">
            <el-select v-model="categoryForm.level" placeholder="请选择" @change="changed">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="菜单描述">
          <!-- <el-form-item label="菜单描述" v-if="ifShow"> -->
            <el-input type="textarea" v-model="categoryForm.description" placeholder="选填！可以填写菜单的一些说明信息~~~" :autosize="{ minRows: 3}"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import TYPE from '@/store/mutation-types'

  export default{
    data () {
      return {
        id: '',
        dialogVisible: false,
        categoryForm: {
          name: '',
          // index: '',
          // level: '',
          // path: '',
          description: ''
        },
        rules: {
          name: [{required: true, message: '菜单分类不能为空', trigger: 'blur'}]
        },
        options: [{
          value: '1',
          label: '一级菜单'
        }, {
          value: '2',
          label: '二级菜单'
        }],
        ifShow: false
      }
    },
    computed: {
      ...mapState(['loading']),
      ...mapState({
        dataList: state => state.category.dataList,
        total: state => state.category.total,
        page: state => state.category.page,
        limit: state => state.category.limit
      }),
      sname: {
        get () {
          return this.$store.state.category.sname
        },
        set (value) {
          this.$store.commit('category/updateItem', {sname: value})
        }
      },
      AuthCategoryAdd: function () {
        return this.isPermission('AuthCategoryAdd')
      },
      AuthCategoryEdit: function () {
        return this.isPermission('AuthCategoryEdit')
      },
      AuthCategoryDelete: function () {
        return this.isPermission('AuthCategoryDelete')
      }
    },
    methods: {
      ...mapActions('category', ['findList', 'add', 'update', 'findByParentId', 'delete']),
      // 下拉框选择方法
      changed() {
        let that = this;
        console.log(that.categoryForm.level);
        that.ifShow = (that.categoryForm.level==1) ? false : true;
      },
      // 搜索框搜索
      handleSearch (ev) {
        this.$store.commit('category/resetSearchStatus')
        this.search()
        if (ev) {
          ev.preventDefault()
          ev.stopPropagation()
        }
      },
      handleCurrentChange (val) {
        this.$store.commit('category/updateItem', {page: val})
        this.search()
      },
      search: async function () {
        try {
          this.$store.commit(TYPE.setLoading, true)
          let result = await this.findList()
          console.log(result)
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
      // openVn() {
      //   const h = this.$createElement;
      //   this.$message({
      //     message: h('p', null, [
      //       h('span', null, ''),
      //       h('i', { style: 'color: red' }, '请先删除该菜单下的所有二级菜单，再来删除该菜单。')
      //     ])
      //   });
      // },
      // 删除菜单分类
      handleDelete: async function (id) {
        try {
          let result = await this.findByParentId(id)
          console.log(result)
          if  (result.errcode === 0) {
            // this.openVn()
            this.$msgError("请先删除该菜单下的所有二级菜单，再来删除该菜单。")
            return
          } else {
            await this.$confirm('确定删除该菜单吗？', '系统提示', {type: 'warning'})
          }
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
      // setForm (id, name, level, description) {
      setForm (id, name, description) {
        this.id = id
        this.categoryForm.name = name
        // this.categoryForm.level = index
        // this.categoryForm.level = level
        // this.categoryForm.path = path
        this.categoryForm.description = description
      },
      handleToAdd () {
        this.setForm('', '', '')
        this.dialogVisible = true
      },
      handleToEdit (row) {
        // this.setForm(row.id, row.name, row.level, row.description)
        this.setForm(row.id, row.name, row.description)
        this.dialogVisible = true
      },
      checkValid: async function () {
        let valid = false
        try {
          valid = await this.$refs['categoryForm'].validate()
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
            let params = _.clone(this.categoryForm)
            params.id = this.id
            this.$store.commit(TYPE.setLoading, true)
            let result = await this.update(params)
            this.$store.commit(TYPE.setLoading, false)
            if (result && result.errcode === 0) {
              this.$msgSuccess('修改成功')
              this.$store.commit('category/updateDataList', {
                act: 'update',
                id: this.id,
                name: params.name,
                // level: params.level,
                // path: params.path,
                description: params.description
              })
              this.setForm('', '', '')
              this.dialogVisible = false
            } else {
              this.$msgError(result.errmsg)
            }
          }
          // 新增
          else {
            this.$store.commit(TYPE.setLoading, true)
            let result = await this.add(this.categoryForm)
            this.$store.commit(TYPE.setLoading, false)
            if (result && result.errcode === 0) {
              this.handleSearch()
              try {
                await this.$confirm('新增成功,要继续新增吗？', '系统提示', {type: 'warning'})
              } catch (cancel) {
                this.setForm('', '', '')
                this.dialogVisible = false
                return // 取消就不继续处理
              }
              this.setForm('', '', '')
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
    mounted () {
      if (this.$store.state.category.dataList.length === 0) {
        this.handleSearch()
      }
    }
  }
</script>
