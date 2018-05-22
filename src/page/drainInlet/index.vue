<template>
  <div class="index">
    <Row class="mainHeader">
      <Col :sm="{ span:2}" :md="{ span:2}" :lg="{ span:2}">
        <div class="mainLogo">
          <img src="../../assets/images/zhihuihezhang.jpg" height="45"/>
        </div>
      </Col>
      <Col :sm="{ span:18}" :md="{ span:18}" :lg="{ span:18}">

      </Col>
      <Col :sm="{ span:4}" :md="{ span:4}" :lg="{ span:4}">

        <Dropdown class="mainUser" trigger="click" placement="bottom-end">

          <a href="javascript:void(0)">
            <span>{{userMes?userMes:'admin'}}</span>
            <Icon type="arrow-down-b"></Icon>
          </a>
          <Dropdown-menu slot="list">
            <router-link to="/login">
              <Dropdown-item @click.native="signOut">退出</Dropdown-item>
            </router-link>

          </Dropdown-menu>
        </Dropdown>
      </Col>
    </Row>
    <div class="mainContent" :sm="{ span:18}" :md="{ span:18}" :lg="{ span:18}">

      <div class="main">
        <div id="content">
          <Row class="search" type="flex" justify="start">
            <Col>
              <Form inline>
                <FormItem>
                  <Button type="success" icon="ios-cloud-upload-outline" @click="add()">上传文件</Button>
                  <Button type="success" icon="plus" @click="addlabel()">添加标签</Button>

                </FormItem>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col>
              <Table ref="table1" border :columns="column1" :data="tableData1"></Table>
              <Page :total="total" placement="top" :current="page" @on-change="changePageNumber" show-total></Page>
            </Col>
          </Row>
        </div>
        <Modal v-model="showmodflag" :styles="{top: atuomodeltop}" >
          <p slot="header" style="color:#f60;text-align:center">
            <span>请选择上传文件</span>
          </p>
          <Upload ref="Upload"
                  :before-upload="beforeUpload"
                  :on-success="UploadSuccess"
                  :on-error="Uploaderror"
                  :format="['xlsx']"
                  :on-format-error="FormatError"
                  type="drag"
                  :action=" baseUrl + 'upload'">
            <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>请点击或者拖拽文件到此处上传</p>
            </div>
          </Upload>
          <div slot="footer">
          </div>
        </Modal>
        <Modal v-model="showinfoflag" :styles="{top: atuomodeltop}" width="98%">
          <p slot="header" style="color:#f60;text-align:center">
            <span>{{clicktitle}}详情</span>
          </p>
          <Table ref="table2" height="600"  border :columns="column2" :data="tableData2"></Table>
          <div slot="footer">
          </div>
        </Modal>
        <Modal v-model="showaddlabelflag" @on-ok="ok" :styles="{top: atuomodeltop}" >
          <p slot="header" style="color:#f60;text-align:center">
            <span>添加标签</span>
          </p>
          <Form ref="pointCustom2" :model="pointCustom2" :label-width="80">
            <FormItem label="请添加标签"  prop="label">
              <Input v-model="pointCustom2.label" type="text"
                     placeholder="请输入新的标签"></Input>
            </FormItem>
          </Form>
          <h3>已有标签列表</h3>
          <template>
            <Tag v-for="item in labelList"  :key="item.id">{{ item.labelName }}</Tag>
          </template>
        </Modal>
      </div>

    </div>
    ]
  </div>

</template>

<script>
  import {baseImgpath, baseUrl} from '@/config/env';
  import Cookies from 'js-cookie';
  export default {
    data() {
      return {
        showaddlabelflag: false,
        showmodflag: false,
        showinfoflag: false,
        baseUrl: baseUrl,
        baseImgpath: baseImgpath,
        userMes: null,
        search: {
          label: '',
        },
        pointCustom2: {
          label: '',
        },
        labelList:[],
        column1: [
          {
            type: 'index',
            title: '序号',
            width: 80,
            align: 'center'
          },

          {
            title: '标题',
            key: 'title',
            align: 'center',
            sortable: true,
            render: (h, params) => {

              return [h('span', {

                style: {
                  marginRight: '5px'
                },

              }, params.row.title),
              ]
            }
          },
          {
            title: '上传时间',
            key: 'time',
            align: 'center',

          },{
            title: '审核状态',
            key: 'isAudit',
            align: 'center',
            render: (h, params) => {

              return [h('span', {

                style: {
                  marginRight: '5px'
                },

              }, params.row.isAudit ? '审核通过' : '未审核'),
              ]
            }
          },
          {
            title: '操作',
            key: '',
            width:225,
            align: 'center',
            render: (h, params) => {

              return [h('Button', {
                props: {
                  type: 'info',
                  // size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.notice(params.row)
                  }
                }
              }, '查看详情'),
                h('Button', {
                props: {
                  type: 'success',
                  // size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.audit(params.row)
                  }
                }
              }, '审核通过'),
              ]
            }
          },
        ],
        column2: [
          {
            type: 'index',
            title: '序号',
            width: 80,
            align: 'center'
          },

          {
            title: '监测点',
            key: 'inMpName',
            align: 'center',
          },
          {
            title: '河流',
            key: 'inRiverName',
            align: 'center',

          },{
            title: '时间',
            key: 'time',
            align: 'center',

          },
          {
            title: '溶解氧(mg/L)',
            key: '溶解氧',
            width: 130,
            align: 'center',
            sortable: true
          },
          {
            title: '氨氮(mg/L)',
            key: '氨氮',
            align: 'center',
            sortable: true,
          },
          {
            title: '透明度(cm)',
            key: '透明度',
            align: 'center',
            sortable: true,
          },
          {
            title: '氧化还原电位(mv)',
            key: '氧化还原电位',
            width: 160,
            align: 'center',
            sortable: true,
          },
          {
            title: '水温(℃)',
            key: '水温',
            align: 'center',
            sortable: true,
          },
          {
            title: '水深 (cm)',
            key: '水深',
            align: 'center',
            sortable: true,
          },
          {
            title: 'pH值',
            key: 'pH值',
            align: 'center',
            sortable: true,
          },


        ],
        total: 0,
        page: 1,
        pageSize: 10,
        tableData1:[],
        tableData2:[],
        clicktitle:''
      }
    },

    watch: {
      search: {
        handler: function (val, oldval) {
          this.changePageNumber(false)
        },
        deep: true,//对象内部的属性监听，也叫深度监听
        immediate: true  //表示创建组件时立马执行一次。(立即以表达式的当前值触发回调)
      },

    },
    methods: {
      signOut() {
        Cookies.remove('user');
        Cookies.remove('password');
        Cookies.remove('userid');
        this.$router.push({name: 'login'});
      },
      notice(row) {
        this.clicktitle = row.title;
        this.post('listMPNbyID', {  //查看详情
         mvID:row.id
        }).then(resp => {

          this.tableData2= resp.data.data;
          this.showinfoflag = true ;
        })
      },
      add() {
        this.$refs.Upload.clearFiles()
        this.showmodflag = true;
      },
      audit(row){
        this.post('upMPV', { //审核
          Id:row.id,
          isAudit:1
        }).then(resp => {
          this.changePageNumber(false);
          this.$Message.success('审核通过!');

        })

      },
      ok() {
        this.post('addlabel', {  //增加新的标签
          labelName: this.pointCustom2.label,

        }).then(resp => {
          this.$Message.success('Success!');
        })


      },

      changePageNumber(page) {

        this.post('mpv', {
            page: this.page = page ? page : 1,
          }
        ).then(resp => {
          this.tableData1 = resp.data.data;
          this.total = resp.data.count
        })

      },
      addlabel(){  //已有标签列表
        this.post('labels', {
          }
        ).then(resp => {
          this.labelList = resp.data.list;
          this.showaddlabelflag=true
        })
      },
      beforeUpload() {

      },
      UploadSuccess(res, file, fileList) {
        // 因为上传过程为实例，这里模拟添加 url
        // console.log(fileList);
        if(res.code==0){
          this.$Notice.error({
            title: '上传文件错误',
            desc: res.mes,
            duration: 0
          });
          this.showmodflag = false ;
        }else {
          this.$Notice.success({
            title: '上传文件结果',
            desc: res.mes,
          });
        }

        this.changePageNumber(false)
      },
      Uploaderror(res, file, fileList){
        this.$Notice.open({
          title: '上传文件结果',
          desc: res.mes,
          duration: 0
        });
        this.changePageNumber(false)
      },
      FormatError() {
        this.$Message.warning('文件类型错误，请选择.xlsx文件.')
      },
    },
    created() {
        this.userMes = Cookies.get('user') ? Cookies.get('user') : {};
        if (!this.userMes) {
          this.$router.push({name: 'login'});
        }
    },
    computed: {
      atuomodeltop() {
        return document.documentElement.clientHeight > 660 ? '120px' : '2px'
      }
    },
    mounted() {
      //

    }
  }
</script>
<style lang="scss">
  .ivu-menu-horizontal .ivu-menu-item, .ivu-menu-horizontal .ivu-menu-submenu {
    padding: 0 12px;
  }

  ::-webkit-scrollbar { /*滚动条整体样式*/
    width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }

  ::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #535353;
  }

  ::-webkit-scrollbar-track { /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #EDEDED;
  }

  .index {
    height: 100%;
    .mainHeader {
      position: fixed;
      top: 0;
      width: 100%;
      background: #41b18b;
      z-index: 10;
      .message-con {
        display: inline-block;
        width: 30px;
        padding: 18px 0;
        text-align: center;
        cursor: pointer;
      }
      &.ivu-row {
        .ivu-col {
          height: 60px !important;

        }
      }
      .mainLogo {
        // width: 100px;
        position: relative;
        height: 100%;
        img {
          display: block;
          position: absolute;
          top: 0;
          left: 20px;
          bottom: 0;
          margin: auto;
        }
      }
      .mainNav {
        background: #41b18b;
        .ivu-menu-item {

          .router {
            text-align: center;
            display: inline-block;
            transition: all 0.2s;
            color: #fff;
            &.fade-enter-active {
              opacity: 0;
            }
            &.fade-leave-active {
              opacity: 0;
            }
          }
          .router-link-exact-active {
            color: red;
          }
        }
      }
      .mainUser {
        height: 100%;
        float: right;
        margin-right: 30px;
        .ivu-dropdown-rel {
          height: 100%;
          & > i {
            display: inline-block;
            position: relative;
            float: left;
            width: 60px;
            height: 100%;
            img {
              position: absolute;
              top: 0;
              bottom: 0;
              margin: auto;
            }
          }
          a {
            display: inline-block;
            position: relative;
            top: 0;
            height: 100%;
            line-height: 60px;
            color: #fff;
            font-size: 18px;
            img {
              position: absolute;
              display: inline-block;
              top: 0;
              bottom: 0;
              margin: auto;
            }
          }
        }
      }
    }
    .mainContent {
      position: absolute;
      top: 60px;
      bottom: 0;
      width: 100%;
    }
  }
</style>
<style lang="scss" scoped>
  .main {
    height: 100%;
    width: 100%;
    position: relative;
    #content {
      width:95%;
      margin: 50px auto;
    }
  }
</style>

