<template>
  <div class="page-wrapper">
    <!--导航区-->
    <div class="page-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }"><span class="fa fa-home"><b>  首页</b></span></span></el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/data_mock/factory' }">数据Mock</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/data_mock/factory' }">Mock工厂</el-breadcrumb-item>
        <el-breadcrumb-item>编辑</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--主内容区-->
    <div class="page-main">
        <el-form ref="form" :rules="rules" :model="singleMock" label-width="135px" highlight-current-row>
          <el-form-item label="API name：" prop="api_name">
            <el-input :value="singleMock.api_name" @input="changeApiName" placeholder="eg: /jobs/v3/createJob" :style="inputWidth"></el-input>
          </el-form-item>
          <el-form-item label="Mock 服务名称：" prop="mock_detail_name">
            <el-input :value="singleMock.mock_detail_name" @input="changeDetailName" placeholder="请输入Mock服务名称" :style="inputWidth"></el-input>
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="是否公开：">
                <el-radio-group
                  v-model="radioObj.type"
                >
                  <el-radio label="0">公开</el-radio>
                  <el-radio label="1">私有</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="请求方法：">
                <el-radio-group v-model="radioObj.method">
                  <el-radio label="get">get</el-radio>
                  <el-radio label="post">post</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="请求类型：">
                <el-radio-group v-model="radioObj.protocol">
                  <el-radio label="http">http</el-radio>
                  <el-radio label="https">https</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="描述：">
            <el-input type="textarea" :value="singleMock.description" @input="changeDescription" placeholder="请填写描述" :style="inputWidth"></el-input>
          </el-form-item>
          <el-form-item label="分组：" prop="group_id">
            <el-select
              :value="singleMock.group_id"
              placeholder="请选择所属分组"
              @change="selectGroup"
            >
              <el-option
                v-for="item in groupList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-tabs class="form-gap" type="border-card" v-model="activeTab">
            <el-tab-pane name="tab1" label="response">
              <span slot="label"><i class="el-icon-star-on"></i> response</span>
              <div class="editor-container">
                <json-editor ref="jsonEditor" v-model="response"/>
              </div>
              <div class="json-format">
                <el-row>
                  <!-- <el-button type="primary">格式化校验</el-button> -->
                  <el-button type="primary" @click="copy">复制</el-button>
                  <el-button type="danger" @click="clear">清空</el-button>
                </el-row>
              </div>
            </el-tab-pane>
          </el-tabs>
          <el-row class="form-gap">
            <el-checkbox class="inline-block mr20" label="是否延迟返回" v-model="delay" disabled></el-checkbox>
            <div class="inline-block" v-show="delay">
              <el-input-number :value="singleMock.delayTime" controls-position="right" @change="changeDelayTime" :min="0" disabled></el-input-number>
              <span>秒</span>
            </div>
          </el-row>
          <el-row class="form-gap">
            <el-checkbox class="inline-block mr20" label="是否重定向" v-model="redirect" disabled></el-checkbox>
            <div class="inline-block" v-show="redirect">
              <el-input size="medium" :value="singleMock.redirectUrl" @change="changeRedirectUrl" placeholder="请输入重定向地址" type="url" disabled></el-input>
            </div>
          </el-row>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button type="danger" @click="onCancel" class="cancle-btn">取消</el-button>
          </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
  import {mapState, mapMutations, mapActions} from 'vuex';
  import JsonEditor from '@/components/JsonEditor';
  import handleClipboard from '@/utils/clipboard';

  export default{
    name: 'EditMock',
    components: { JsonEditor },
    data () {
      return {
        activeTab: 'tab1',
        datajson: {},
        rules: {
          api_name: [
            { required: true, message: '请输入API name', trigger: 'blur' },
            { pattern: /^\/.*[^/]$/, message: '格式不合法，首部必须为/，尾部不能有/' }
          ],
          mock_detail_name: [
            { required: true, message: '请输入Mock服务名称', trigger: 'blur' }
          ],
          group_id: [
            { required: true, message: '请选择分组', trigger: 'change' }
          ],
        },
        form: {
          datajson: {},
        },
        delay: false,
        redirect: false,
        query: {},
        radioObj: {
          type: '',
          method: '',
          protocol: '',
        },
        delayTimeStyle: {
          width: '70px'
        },
        inputWidth: {
          width: '500px'
        },
        response: {},
      }
    },
    created () {
      this.radioObj.type = String(this.singleMock.type);
      this.radioObj.method = this.singleMock.method;
      this.radioObj.protocol = this.singleMock.protocol;
      this.response = this.singleMock.response;
      this.query = this.$route.query;
      if (this.singleMock.delayTime) {
        this.delay = true;
      }
      if (this.singleMock.redirectUrl) {
        this.redirect = true;
      }
    },
    watch: {
      'radioObj.type'(val) {
        this.modifySingleMock({
          type: val
        });
      },
      'radioObj.method'(val) {
        this.modifySingleMock({
          method: val
        });
      },
      'radioObj.protocol'(val) {
        this.modifySingleMock({
          protocol: val
        });
      },
      delay(newVal) {
        if (newVal) {
          if (this.singleMock.delayTime === 0) {
            this.changeDelayTime(1);
          }
        }
      },
      response (v) {
        this.modifySingleMock({
          response: v
        });
      }
    },
    computed: {
      ...mapState({
        groupList: state => state.mock.mockGroupList,
        singleMock: state => state.mock.singleMock,
      }),
    },
    methods: {
      ...mapMutations('mock', [
        'modifySingleMock',
        'toggleDelay',
      ]),
      ...mapActions('mock', [
        'addMock',
        'editMock'
      ]),
      onSubmit() {
        this.$refs['form'].validate((valid) => {
          if (!valid) {
            return false;
          }
          if (this.delay && typeof(this.singleMock.delayTime) !== 'number') {
            this.showMessage('error', '延迟返回不能为空！');
            return false;
          }
          if (this.redirect && !this.singleMock.redirectUrl) {
            this.showMessage('error', '重定向不能为空！');
            return false;
          }
          if (this.query.subType === 'add') {
            this.addMock(this.singleMock);
          } else {
            this.editMock(this.singleMock);
          }
        });
      },
      onCancel() {
        this.$router.push({ path: '/data_mock/factory'});
      },
      changeApiName(e) {
        this.modifySingleMock({
          api_name: e
        });
      },
      changeDetailName(e) {
        this.modifySingleMock({
          mock_detail_name: e
        });
      },
      changeDescription(e) {
        this.modifySingleMock({
          description: e
        });
      },
      selectGroup(e) {
        this.modifySingleMock({
          group_id: e
        });
      },
      changeDelayTime(e) {
        this.modifySingleMock({
          delayTime: e
        });
      },
      changeRedirectUrl(e) {
        this.modifySingleMock({
          redirectUrl: e
        });
      },
      copy(e) {
        handleClipboard(JSON.stringify(this.response, null, 2), e, '复制成功!');
      },
      clear() {
        this.response = {};
      },
      showMessage(type, msg) {
        this.$message({
          message: msg,
          type
        });
      },
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
  .json-format {
    margin: 30px 0 10px;
  }
  .form-gap {
    margin-bottom: 22px;
  }
  .inline-block {
    display: inline-block;
  }
  .mr20 {
    margin-right: 20px;
  }
  .cancle-btn {
    margin-left: 30px;
  }
</style>
