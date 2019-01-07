/**
 * Created by ds_sky on 2018/10/11.
 * 自动化测试对应的项目和测试报告相关api
 */
import * as API from './'

export default {

  //获取项目列表(通过page分页)
  findProjectList: params => {
    return API.QC_POST(`http://xx.x.xx.xxx:32783/get_allproject`, params)
  },
  //获取测试报告列表
  findTestList: params => {
    return API.QC_POST(`http://xx.x.xx.xxx:32783/get_alltest`, params)
  }

}
