<template>
  <div class="page-wrapper">
    <!--导航区-->
    <div class="page-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }"><span class="fa fa-home"><b>  首页</b></span></span></el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/data/list' }">数据查询</el-breadcrumb-item>
        <el-breadcrumb-item>用户信息查询</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--主内容区-->
    <div class="page-main">
        <el-form ref="form" :rules="rules" :model="form" label-width="80px" highlight-current-row v-loading="loading" element-loading-text="数据请求中" >
          <el-form-item label="用户菜单" prop="level">
            <el-select v-model="interface" placeholder="客官，想吃啥自选" @change="changed" style="width:500px">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item  v-for="(item, index) in interfaceparams" :prop="item.key" :label="item.key" :key="item.key">
            <el-select v-model="inputparams[index]" v-if="item.key == 'svtype'" :placeholder="item.value" style="width:500px">
              <el-option
                v-for="item in svtype_options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="inputparams[index]" v-else-if="item.key == 'ttype'" :placeholder="item.value" style="width:500px">
              <el-option
                v-for="item in ttype_options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="inputparams[index]" v-else-if="item.key == 'lv'" :placeholder="item.value" style="width:500px">
              <el-option
                v-for="item in lv_options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="inputparams[index]" v-else-if="item.key == 'status'" :placeholder="item.value" style="width:500px">
              <el-option
                v-for="item in status_options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <!-- <el-select v-model="inputparams[index]" v-else-if="item.key == 'get_only'" :placeholder="item.value" style="width:500px">
              <el-option
                v-for="item in get_only_options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select> -->
            <el-input v-model="inputparams[index]" v-else :placeholder="item.value" style="width:500px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
        <el-tabs type="border-card" v-model="activeTab">
          <el-tab-pane name="tab1" label="response">
            <span slot="label"><i class="el-icon-star-on"></i> response</span>
            <div class="editor-container">
              <json-editor ref="jsonEditor" v-model="datajson"/>
            </div>
          </el-tab-pane>
        </el-tabs>
    </div>

  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import TYPE from '@/store/mutation-types'
  import JsonEditor from '@/components/JsonEditor'

  export default{
    name: 'JsonEditorDemo',
    components: { JsonEditor },
    data () {
      return {
        activeTab: 'tab1',
        datajson: {},
        interface: '',
        form : {
        },
        activeName: '1',
        sSSSSSS_options: [
          {
            value: 'aaaaa',
            label: 'aaaaa线'
          },
          {
            value: 'bbbbb',
            label: 'bbbbb线'
          },
          {
            value: 'ccccc',
            label: 'ccccc线'
          }
        ],
        tTTTTTT_options: [
          {
            value: 1,
            label: '1-asd'
          },
          {
            value: 2,
            label: '2-123'
          },
          {
            value: 3,
            label: '3-dwww'
          }
        ],
        lLLLLL_options: [
          {
            value: 1,
            label: '1eee'
          },
          {
            value: 2,
            label: '2rrr'
          },
          {
            value: 3,
            label: '3ttt'
          }
        ],
        status_options: [
          {
            value: 1,
            label: "1-qwqwqwqw"
          },
          {
            value: 2,
            label: '2-asasasasas'
          },
          {
            value: 111,
            label: '111-dfdfdfdfdfdf'
          }
        ],
        // get_only_options: [
        //   {
        //     value: 1,
        //     label: '1-只查询'
        //   }
        // ],
        options: [
          {
            value: '/xxxxxxxx/xxxx/get_xxxxx_or_xxxxx',
            label: '1、xxxxx和ccccc相互查询: get_xxxxx_or_xxxxx'
          },
          {
            value: '/xxxxxxx/sssssss/get_contacts',
            label: '2、xxxxxxxxxxxx: get_contacts'
          }
        ],
        get_redis_listparams: [],
        get_XXXXX_XXXXXparams: [
          {
            key: 'XXXXX',
            value: 'XXXXX，必填'
          },
          {
            key: 'XXXXX',
            value: 'XXXXX，必选。'
          }
        ],
        get_XXXX_XXXXXparams: [
            {
              key: 'XXXX',
              value: 'XXXXX'
            },
            {
              key: 'CCCCC',
              value: 'CCCCCCCCCC'
            }
        ],
        inputparams: [],
        rules: {},
        interfaceparams: []
      }
    },
    computed: {
      ...mapState(['loading']),
      ...mapState({
        dataList: state => state.data.dataList
      })
    },
    methods: {
      ...mapActions('data',
                    [
                      'get_redis_list',
                      'get_XXXX_XXXXX'
                    ]
                  ),
      // 下拉框选择方法
      changed() {
        // console.log(this.form);
        // this.rules = {}
        this.datajson = {}
        this.form = {}
        if (this.interface === '/get_redis_list') {
          this.interfaceparams = this.get_redis_listparams
        } else if (this.interface === '/XXXXXX/XXXXXX/get_XXXX_XXXX') {
          this.interfaceparams = this.get_XXXX_XXXXparams
        }
        this.interfaceparams.forEach(item=>{
          this.form[item.key] = ''
        });
        // console.log(this.form)
        this.inputparams = []
      },
      // checkValid: async function () {
      //   let valid = false
      //   try {
      //     valid = await this.$refs["form"].validate()
      //     console.log(valid)
      //   } catch (error) {
      //   }
      //   return valid
      // },
      onSubmit: async function () {
        // let valid = await this.checkValid()
        // if (!valid) {
        //   return
        // }
        try {
          this.$store.commit(TYPE.setLoading, true)
          // console.log(this.interfaceparams)
          // this.interfaceparams.forEach(item=>{
          //   if (['svtype', 'ttype', 'status', 'lv'].indexOf(item.key) != -1) {
          //     this.rules[item.key] = [{required: true, message: '请选择', trigger: 'blur'}]
          //   } else {
          //     this.rules[item.key] = [{required: true, message: '请输入', trigger: 'blur'}]
          //   }
          // });
          // console.log(this.rules)

          let index = 0
          for (let key in this.form) {
            this.form[key] = this.inputparams[index]
            index += 1
          }
          let params = this.form
          this.$store.commit(TYPE.setLoading, true)

          if (this.interface === '/get_redis_list') {
            let result = await this.get_redis_list()
            this.datajson = result
          } else if (this.interface === '/XXXXXXX/XXXXXX/get_XXXX_XXXX') {
            params.get_only = 1
            let result = await this.get_XXXX_XXXX(params)
            this.datajson = result
          }
          this.$store.commit(TYPE.setLoading, false)
        } catch (error) {
          // console.log(error)
          this.$store.commit(TYPE.setLoading, false)
          this.$msgError('抱歉，后端接口报错，请稍后重试！')
        }

      }
    }
  } 
</script>
<style scoped>
  .summary {
    margin: 0px;
  }
  .page-main{
    /* background-color: white; */
    margin: 20px 20px 20px 20px;
  }
  .editor-container{
    position: relative;
    height: 100%;
  }
</style>
