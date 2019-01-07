<template>
  <div class="page-wrapper">
    <!--导航区-->
    <div class="page-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }"><span class="fa fa-home"><b>  首页</b></span></span></el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/data_mock/factory' }">数据Mock</el-breadcrumb-item>
        <el-breadcrumb-item>Mock详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--主内容区-->
    <div class="page-main">
      <div class="table-wrapper">
        <ul>
          <li>
            <span class="label">分组：</span> {{groupName}}
          </li>
          <li>
            <span class="label">API Name：</span> {{singleMock.api_name}}
          </li>
          <li>
            <span class="label">Mock 服务名称：</span> {{singleMock.mock_detail_name}}
          </li>
          <li>
            <span class="label">创建人：</span> {{singleMock.author}}
          </li>
          <li>
            <span class="label">归属：</span> {{singleMock.type === 0 ? '公开' : '私有'}}
          </li>
          <li>
            <span class="label">请求方法：</span> {{singleMock.method}}
          </li>
          <li>
            <span class="label">请求协议：</span> {{singleMock.protocol}}
          </li>
          <li>
            <span class="label response-title">返回结果：</span>
            <el-tabs class="form-gap" type="border-card" v-model="activeTab">
              <el-tab-pane name="tab1" label="response">
                <span slot="label"><i class="el-icon-star-on"></i> response</span>
                <div class="editor-container">
                  <json-editor ref="jsonEditor" v-model="singleMock.response" />
                </div>
              </el-tab-pane>
            </el-tabs>
          </li>
          <li>
            <span class="label">延迟时间：</span>{{singleMock.delayTime}}s
          </li>
          <li>
            <span class="label">重定向：</span>{{singleMock.redirectUrl || '无'}}
          </li>
          <li>
            <span class="label">mock调用地址：</span><a :href='singleMock.mock_url' target="_blank">{{singleMock.mock_url}}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import JsonEditor from '@/components/JsonEditor';


  export default{
    name: 'mockDetail',
    components: { JsonEditor },
    data () {
      return {
        activeTab: 'tab1',
      }
    },
    computed: {
      ...mapState({
        singleMock: state => state.mock.singleMock,
        groupList: state => state.mock.mockGroupList,
      }),
      groupName() {
        let name = '';
        const find = this.groupList.findIndex(v => {
          return v.id === this.singleMock.group_id;
        });
        if (find > -1) {
          name = this.groupList[find].name;
        }
        return name;
      },
    },
  }
</script>
<style scoped>
  .table-wrapper ul {
    margin: 10px 20px;
  }
  .table-wrapper ul li {
    margin: 15px;
    color: #606266;
  }
  .table-wrapper ul li span {
    font-weight: bold;
  }
  .response-title {
    display: inline-block;
    margin-bottom: 10px;
  }
</style>
