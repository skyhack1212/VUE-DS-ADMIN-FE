<template>
  <div class="page-wrapper page-wrapper--dashboard">
    <!-- <div class="page-main">
      <h1>欢迎光临! </h1>
    </div> -->
    <!--导航区-->
    <div class="page-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }"><span class="fa fa-home"><b>  首页</b></span></span></el-breadcrumb-item>
        <!-- <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item> -->
        <el-breadcrumb-item><b>懒人工具箱</b></el-breadcrumb-item>
      </el-breadcrumb>
      <!--返回按钮-->
      <!-- <div class="button-back">
        <router-link :to="{ path:'/project/list'}">
          <el-button type="default" size="mini">返回</el-button>
        </router-link>
      </div> -->
    </div>
    <hr style="height:10px;border:none;border-top:10px groove skyblue;" />
    <!-- <div class="app-container documentation-container">
      <el-row :gutter="20" style="margin-top:50px;">
        <el-col :span="4">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>招聘</span>
            </div>
            <div class="component-item" style="height:450px;">
              <dropdown-menu style="margin:0 auto;" title='算法工具集' :items='zpToolList'></dropdown-menu>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>会员</span>
            </div>
            <div class="component-item" style="height:450px;">
              <dropdown-menu style="margin:0 auto;" title='会员工具集' :items='zpToolList'></dropdown-menu>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>Vue</span>
            </div>
            <div class="component-item" style="height:450px;">
              <dropdown-menu style="margin:0 auto;" title='Vue学习与实践' :items='VueStudyList'></dropdown-menu>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>日常</span>
            </div>
            <div class="component-item" style="height:450px;">
              <dropdown-menu style="margin:0 auto;" title='日常常用系统汇总' :items='workSystemList'></dropdown-menu>
            </div>
          </el-card>
        </el-col>
      </el-row>

    </div> -->

    <!--主内容区-->
    <div class="page-main">
      <!-- <el-row :gutter="8">
        <el-col :xs="{span: 60}" :sm="{span: 60}" :md="{span: 60}" :lg="{span: 32}" :xl="{span: 24}">
          <panel-group @handleSetLineChartData="handleSetLineChartData"></panel-group>
        </el-col>
      </el-row> -->
      <!-- <el-collapse v-model="activeNames" @change="handleChange"> -->
      <el-row :gutter="20" style="margin-top:0px;">
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>XXXX</span>
            </div>
            <div class="component-item" style="height:450px;">
              <dropdown-menu style="margin:0 auto;" title='算法工具集' :items='jobsToolList'></dropdown-menu>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>常用工具</span>
            </div>
            <div class="component-item" style="height:450px;">
              <dropdown-menu style="margin:0 auto;" title='常用工具集' :items='commonToolList'></dropdown-menu>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>学习</span>
            </div>
            <div class="component-item" style="height:450px;">
              <dropdown-menu style="margin:0 auto;" title='学习与实践' :items='StudyList'></dropdown-menu>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>日常</span>
            </div>
            <div class="component-item" style="height:450px;">
              <dropdown-menu style="margin:0 auto;" title='日常常用系统汇总' :items='workSystemList'></dropdown-menu>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <line-chart :chart-data="lineChartData"></line-chart>
      </el-row>

      <!-- <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <raddar-chart></raddar-chart>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <pie-chart></pie-chart>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <bar-chart></bar-chart>
          </div>
        </el-col>
        <el-col :xs="{span: 12}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 5}">
          <todo-list></todo-list>
        </el-col>
      </el-row> -->
    </div>
    <hr style="height:10px;border:none;border-top:10px groove skyblue;" />
  </div>
</template>

<script>
  import echarts from 'echarts'
  import DropdownMenu from '@/components/Share/dropdownMenu'
  import PanelGroup from '@/components/DashboardGroup/PanelGroup'
  import LineChart from '@/components/DashboardGroup/LineChart'
  import RaddarChart from '@/components/DashboardGroup/RaddarChart'
  import PieChart from '@/components/DashboardGroup/PieChart'
  import BarChart from '@/components/DashboardGroup/BarChart'
  import TodoList from '@/components/DashboardGroup/TodoList'
  import BoxCard from '@/components/DashboardGroup/BoxCard'
  import PanThumb from '@/components/PanThumb'

  const lineChartData = {
      newVisitis: {
        expectedData: [100, 120, 161, 134, 105, 160, 165],
        actualData: [120, 82, 91, 154, 162, 140, 145]
      },
      messages: {
        expectedData: [200, 192, 120, 144, 160, 130, 140],
        actualData: [180, 160, 151, 106, 145, 150, 130]
      },
      purchases: {
        expectedData: [80, 100, 121, 104, 105, 90, 100],
        actualData: [120, 90, 100, 138, 142, 130, 130]
      },
      shoppings: {
        expectedData: [130, 140, 141, 142, 145, 150, 160],
        actualData: [120, 82, 91, 154, 162, 140, 130]
      }
  }

  export default {
    components: {
      PanelGroup,
      LineChart,
      RaddarChart,
      PieChart,
      BarChart,
      TodoList,
      BoxCard,
      PanThumb,
      DropdownMenu
    },
    data() {
      return {
        jobsToolList: [
          // { title: '9.1 171zk_kafka_web', href: 'http://10.xxx.xx.152:8097' },
          // { title: '9.2 88zk_kafka_web', href: 'http://10.xxx.xx.152:8098' },
          // { title: '9.3 232zk_kafka_web', href: 'http://10.xxx.xx.152:8099' },
          // { title: '10 encode和decode,unix时间转换等', href: 'http://xxxxx.qcadmin.xxxxx/encodeAndDecode/index.php' },
          // { title: '11 字符互转(unicode<->汉字)', href: 'http://xxxxx.qcadmin.xxxxx/reconvert.html' },
          // { title: '12 Jupyter notebook', href: 'http://10.xxx.xx.152:9527/tree' }
        ],
        StudyList: [
          { title: '0 vue官网', href: 'https://cn.vuejs.org/' },
          { title: '1 vue社区', href: 'https://www.vue-js.com/' },
          { title: '3 Jenkins_CICD_demo', href: 'http://10.xxx.xx.152:8088' },
          { title: '4 数据工厂接口docker容器发布', href: 'http://10.xxx.xx.152:32738' },
          { title: '5 数据工厂接口-mysql_docker', href: 'http://10.xxx.xx.152:3306' },
          { title: '6 数据工厂接口-redis_docker', href: 'http://10.xxx.xx.152:6379' },
          { title: '7 maimai_jobs接口docker发布尝试', href: 'http://10.xxx.xx.152:32738' },
          { title: '8 接口自动化和性能测试研究', href: 'http://10.xxx.xx.152:8089/' },
          // { title: '8 shipyard镜像容器管理平台研究', href: '' },
          // { title: '9--[git_hug]帮你快速学习git命令', href: '' },
          // { title: '待更新。。。', href: '' }
        ],
        commonToolList: [
          { title: '1 uicode转中文', href: 'http://tool.chinaz.com/tools/unicode.aspx' },
          { title: '2 unix时间戳', href: 'http://tool.chinaz.com/tools/unicode.aspx' },
          { title: '3 UrlEncode', href: 'http://tool.chinaz.com/tools/urlencode.aspx' },
          { title: '4 Json在线解析', href: 'http://www.kjson.com/' }
        ],
        workSystemList: [
          { title: '1 docs', href: 'http://10.xxx.xx.152' }
        ],
        lineChartData: lineChartData.newVisitis
      }
    }
  }
</script>

<style scoped lang="less">
  .page-wrapper--dashboard {
    .page-main {
      padding-top: 100px;
      text-align: center;

      h1 {
        font-size: 30px;
      }
    }
  }
  .dashboard-editor-container {
      padding: 32px;
      background-color: rgb(240, 242, 245);
      .chart-wrapper {
        background: #fff;
        padding: 16px 16px 0;
        margin-bottom: 32px;
      }
    }
  .documentation-container {
    margin: 50px;
    .document-btn {
      float: left;
      margin-left: 50px;
      vertical-align: middle;
      display: block;
      cursor: pointer;
      background: black;
      color: white;
      height: 60px;
      width: 200px;
      line-height: 60px;
      font-size: 20px;
      text-align: center;
    }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 10;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
  }
</style>
