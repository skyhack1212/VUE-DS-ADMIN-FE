<template>
  <div class="page-wrapper" v-loading="loading" element-loading-text="数据请求中">
    <!--导航区-->
    <div class="page-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/menu/list' }">
          <b>菜单设置</b>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <b>{{id ? "编辑菜单设置" : "新增菜单设置"}}</b>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <!--返回按钮-->
      <div class="button-back">
        <router-link :to="{ path:'/menu/list'}">
          <el-button type="default" size="mini">返回</el-button>
        </router-link>
      </div>
    </div>

    <!--主内容区-->
    <div class="page-main">
      <div class="content-wrap">
        <!--表单-->
        <el-form :model="menuForm" :rules="rules" ref="menuForm" label-width="80px">
          <el-form-item label="一级菜单" prop="parent_id">
            <!-- <el-input v-model="menuForm.parent_id"></el-input> -->
            <!-- <el-select v-model="menuForm.parent_id" :disabled="canEditCode" placeholder="请选择" @change="changed"> -->
            <el-select v-model="menuForm.parent_id" placeholder="请选择" @change="changed">
              <el-option
                v-for="item in menu_one_options"
                :key="item.id"
                :label="item.name"
                :value="item.id" name="parent_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="二级名称" prop="name">
            <el-input v-model="menuForm.name" placeholder="请输入二级菜单名称"></el-input>
          </el-form-item>
          <el-form-item label="二级编码" prop="code">
            <el-input v-model="menuForm.code" placeholder="请输入二级菜单编码，如：AuthCategoryView、AuthCategoryAdd、AuthCategoryEdit、AuthCategoryDelete"></el-input>
          </el-form-item>
          <!-- <el-form-item label="二级菜单路由" prop="backendAuth"> -->
          <el-form-item label="二级路由" prop="path">
            <el-input v-model="menuForm.path" placeholder="请输入二级路由，如：/menu/view 即菜单列表"></el-input>
          </el-form-item>
          <el-form-item label="说明" prop="description">
            <el-input type="textarea" v-model="menuForm.description" :autosize="{ minRows: 2}"></el-input>
          </el-form-item>
          <!-- 提交按钮 -->
          <el-form-item>
            <router-link :to="{ path:'/menu/list'}">
              <!-- <el-button type="main" @click="handleSubmit" :disabled="btnSubmitDisabled" class="btn-long">提交</el-button> -->
              <el-button type="main" @click="handleSubmit" class="btn-long">提交</el-button>
            </router-link>
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
    // props:['categoryAllData'],
    data () {
      return {
        btnSubmitDisabled: false,
        id: 0,
        menuForm: {
          name: '',
          code: '',
          parent_id: '',
          path: '',
          description: ''
        },
        rules: {
          code: [{required: true, message: '请输入二级菜单编码', trigger: 'blur'}],
          name: [{required: true, message: '请输入二级菜单名称', trigger: 'blur'}],
          parent_id: [{required: true, message: '请选择一级菜单', trigger: 'blur'}],
          path: [
            {required: true, message: '请输入二级路由', trigger: 'blur'}
          ]
        },
        menu_one_options: [],
        // menu_two_options: [{
        //   value: 'userinfo',
        //   label: '用户信息'
        // }, {
        //   value: 'userrelation',
        //   label: '用户关系链'
        // }],
        ifShow: true
      }
    },
    // watch: {
    //     categoryAllData(val) {
    //         this.menu_one_options = val;//新增categoryAllData的watch，监听变更并同步到menu_one_options上
    //     }
    // },
    computed: {
      ...mapState(['loading']),
      canEditCode () {
        return !!this.id
      }
    },
    methods: {
      ...mapActions('menu',
        ['findCategoryAll', 'findById', 'add', 'update']
      ),
      // 下拉框选择方法
      changed() {
        let that = this;
        console.log(that.menu_one_options);
        // that.ifShow = (that.menuForm.code==1) ? false : true;
      },
      // handleToGetCategoryAll: async function () {
      //   try {
      //     this.$store.commit(TYPE.setLoading, true)
      //     let result_all = await this.findCategoryAll()
      //     // console.log(result)
      //     this.menu_one_options = result_all["data"]
      //     console.log(this.menu_one_options)
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
      checkValid: async function () {
        let valid = false
        try {
          valid = await this.$refs['menuForm'].validate()
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
            let params = _.clone(this.menuForm)
            // 需要把id强转为int，否则后端接口无法处理
            params.id = Number(this.id)
            this.$store.commit(TYPE.setLoading, true)
            let result = await this.update(params)
            this.$store.commit(TYPE.setLoading, false)
            if (result && result.errcode === 0) {
              this.$msgSuccess('修改成功')
            } else {
              this.$msgError(result.errmsg)
            }
          }
          // 新增
          else {
            this.$store.commit(TYPE.setLoading, true)
            let result = await this.add(this.menuForm)
            this.$store.commit(TYPE.setLoading, false)
            if (result && result.errcode === 0) {
              this.$msgSuccess('新增成功')
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
      // update
      let id = this.$route.params.id
      if (id) {
        this.id = id
        try {
          let result = await this.findById(id)
          console.log(result)
          if (result.errcode === 0 && result.data) {
            this.menuForm.name = result.data.name
            this.menuForm.code = result.data.code
            this.menuForm.parent_id = result.data.parent_id
            this.menuForm.path = result.data.path
            this.menuForm.description = result.data.description
          } else {
            this.btnSubmitDisabled = true
            this.$msgError('获取数据失败')
          }
        } catch (error) {
          this.btnSubmitDisabled = true
          this.$msgError(error.toString())
        }
      }

      // add
      let result_all = await this.findCategoryAll()
      // console.log(result)
      if (result_all.errcode === 0 && result_all.data) {
        this.menu_one_options = result_all["data"]
        // console.log(this.menu_one_options)
      } else {
        this.$msgError('获取全部菜单出现异常')
      }
    }
  }
</script>
