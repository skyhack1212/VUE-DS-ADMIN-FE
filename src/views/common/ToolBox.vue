<template>
  <div class="page-wrapper">
    <!--导航区-->
    <div class="page-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }"><span class="fa fa-home"><b>  首页</b></span></span></el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/common/toolbox' }">常用工具</el-breadcrumb-item>
        <el-breadcrumb-item>工具箱</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--主内容区-->
    <div class="page-main">
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item title="内部常用系统一览（新人必备）" name="1">
          <el-table
            :data="tableData"
            stripe
            style="width: 100%">
            <el-table-column
              prop="innersys_name"
              label="系统名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="used"
              label="用途"
              width="180">
            </el-table-column>
            <el-table-column
              prop="howtouse"
              label="一些没必要的描述">
            </el-table-column>
            <el-table-column width="100xp"
              prop="whocharge"
              label="找TA开通">
            </el-table-column>
            <el-table-column
              prop="address"
              label="系统地址">
            </el-table-column>
          </el-table>
        </el-collapse-item>
        <el-collapse-item title="外部常用工具一览（懒人必备）" name="2">
          <el-table
            :data="tableToolData"
            stripe
            style="width: 100%">
            <el-table-column
              prop="outersys_name"
              label="工具名称"
              width="220">
            </el-table-column>
            <el-table-column
              prop="howtouse"
              label="一些没必要的描述">
            </el-table-column>
            <el-table-column
              prop="address"
              label="工具地址">
            </el-table-column>
          </el-table>
        </el-collapse-item>
        <el-collapse-item title="其他工具一览" name="3">
          <div>1、待补充</div>
          <div>...</div>
        </el-collapse-item>
      </el-collapse>
    </div>

  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import TYPE from '@/store/mutation-types'

  export default{
    data () {
      return {
        activeName: '1',
        tableData: [
        {
          innersys_name: '企业微信',
          used: '工作沟通',
          howtouse: 'xxxxxxxx',
          whocharge: 'xxx',
          address: '拿出你的手机装个app'
        },
        {
          innersys_name: 'confucius',
          used: '考勤系统',
          howtouse: '自行注册即可----->',
          whocharge: 'xxxxxxxxx',
          address: <a href="http://XXXXXXXXXX.xxxxxx.cn/" target="_blank">http://xxxxxxx.xxxxxxxxx.cn/</a>
        }],
        tableToolData: [
          {
            outersys_name: 'uicode转中文',
            howtouse: 'uicode转中文',
            address: <a href="http://tool.chinaz.com/tools/unicode.aspx" target="_blank">http://tool.chinaz.com/tools/unicode.aspx</a>
          },
          {
            outersys_name: 'unix时间戳',
            howtouse: 'unix时间戳',
            address: <a href="http://tool.chinaz.com/tools/unixtime.aspx" target="_blank">http://tool.chinaz.com/tools/unixtime.aspx</a>
          },
          {
            outersys_name: 'UrlEncode',
            howtouse: 'UrlEncode',
            address: <a href="http://tool.chinaz.com/tools/urlencode.aspx" target="_blank">http://tool.chinaz.com/tools/urlencode.aspx</a>
          },
          {
            outersys_name: 'Json在线解析',
            howtouse: 'Json在线解析',
            address: <a href="http://www.kjson.com/" target="_blank">http://www.kjson.com/</a>
          }
        ]
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
