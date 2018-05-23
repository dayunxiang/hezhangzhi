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
          <p slot="header" style="color:#f60;text-align:center;height: 30px;">
            <Button type="success"   v-show="!isauditflag"  style="float: left;" @click="audit">审核通过</Button>  <span>{{clicktitle}}详情</span>
          </p>
          <Table ref="table2" height="600"  border :columns="column2" :data="tableData2"></Table>
          <div slot="footer">
          </div>
        </Modal>
        <Modal v-model="showaddlabelflag" @on-ok="ok" :styles="{top: atuomodeltop}" >
          <p slot="header" style="color:#f60;text-align:center">
            <span>添加标签</span>
          </p>
          <Form ref="pointCustom3" :model="pointCustom3" :label-width="80">
            <FormItem label="请添加标签"  prop="label">
              <Input v-model="pointCustom3.label" type="text"
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
    <Spin fix v-if="spinShow">上传的文件正在处理中...请稍等一会儿再操作</Spin>
    <Modal v-model="showmatchpointflag" :styles="{top: atuomodeltop}" @on-ok="pointCustomSubmit('pointCustom')">
      <p slot="header" style="color:#f60;text-align:center">
        <span> 匹配监测点位</span>
      </p>
      <div style="padding: 10px;color: #2db7f5;font-size: 16px;"> {{inMpName}}
        <Button style="margin-left: 30px;" type="primary" icon="plus" @click="setnewpoint">设为新监测点</Button>
      </div>

      <Form ref="pointCustom" :model="pointCustom" :label-width="80">
        <FormItem label="选择监测点">
          <Select v-model="pointCustom.point" placeholder="请选择监测点" filterable>
            <Option v-for="item in pointList" :value="item.id" :key="item.id">{{ item.mpName }}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="showmatchriverflag" :styles="{top: atuomodeltop}" @on-ok="pointCustomSubmit('pointCustom2')">
      <p slot="header" style="color:#f60;text-align:center">
        <span> 匹配水体</span>
      </p>
      <div style="padding: 10px;color: #2db7f5;font-size: 16px;"> {{inriverName}}

      </div>

      <Form ref="pointCustom2" :model="pointCustom2" :label-width="80">
        <FormItem label="选择水体">
          <Select v-model="pointCustom2.river" placeholder="请选择水体" filterable>
            <Option v-for="item in riverList" :value="item.riverId" :key="item.id">{{ item.riverName }}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
  </div>

</template>

<script>
  import {baseImgpath, baseUrl} from '@/config/env';
  import Cookies from 'js-cookie';
  export default {
    data() {
      return {
        spinShow:false,
        showmatchpointflag: false, //匹配监测点
        showmatchriverflag: false, //匹配水体
        inMpName: '', //新监测点
        inriverName: '',//新水体
        riverID: '',//
        id: '',
        mvID:'',   //那个文件id
        isauditflag:'',   //是否已经审核
        pointCustom: {
          point: '',
        },
        pointCustom2: {
          river: '',
        },
        pointList: [],
        riverList: [],
        showaddlabelflag: false,
        showmodflag: false,
        showinfoflag: false,
        baseUrl: baseUrl,
        baseImgpath: baseImgpath,
        userMes: null,
        search: {
          label: '',
        },
        pointCustom3: {
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

              return [h('Button', {
                props: {
                  type:  params.row.isAudit ? 'success' : 'error',
                  size: 'small'
                },
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
            width:140,
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
              }, '查看详情')
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
            title: '水体',
            key: 'inRiverName',
            align: 'center',
            width: 200,
            render: (h, params) => {
              return [
                h('span', {
                  style: {
                    marginRight: '5px'
                  },
                }, params.row.inRiverName),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    display: params.row.riverID ? 'none' : 'inline-block',
                    float: 'right'
                  },
                  on: {
                    click: () => {
                      this.matchriver(params.row.id, params.row.riverID, params.row.inRiverName)
                    }
                  }
                }, params.row.riverID ? '' : '匹配水体'),

              ]
            }
          },
          {
            title: '监测点位名称',
            key: 'inMpName',
            align: 'center',
            width: 250,
            render: (h, params) => {
              return [
                h('span', {
                  style: {
                    marginRight: '5px'
                  },
                }, params.row.inMpName),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    display: (params.row.riverID && params.row.mpID) ? 'none' : 'inline-block',
                    float: 'right'
                  },
                  on: {
                    click: () => {
                      this.matchpoint(params.row.id, params.row.riverID, params.row.inMpName)
                    }
                  }
                }, (params.row.riverID && params.row.mpID) ? '' : '匹配监测点位'),

              ]
            }
          },

          {
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
      matchpoint(rowid, id, inMpName) {
        if (id) {
          this.id = rowid;
          this.inMpName = inMpName;
          this.riverID = id;
          this.showmatchpointflag = true;
          //查询监测点名字
          this.post('/listMonitorPointDetail', {
            riverId: id,
          })
            .then(resp => {
              this.pointList = resp.data.data;
              this.pointCustom.point = resp.data.data[0].id;
            })
        } else {
          this.$Message.error('请先匹配水体!');
        }

      },
      matchriver(rowid, id, inriverName) {
        this.inriverName = inriverName;
        this.id = rowid;
        //查询匹配水体
        this.post('/mpRiver', {})
          .then(resp => {
            this.riverList = resp.data.data;
            this.pointCustom2.river = resp.data.data[0].riverId;
          });
        this.showmatchriverflag = true;
      },
      //更新新监测点
      setnewpoint() {
        this.post('/addMPdata', {
          mpName: this.inMpName,
          riverID: this.riverID,
          id: this.id,
        })
          .then(resp => {

            if(resp.data.code==1){
              this.showmatchpointflag = false;
              this.$Message.success('更新新监测点成功!');
              this.post('listMPNbyID', {  //查看详情
                mvID: this.mvID
              }).then(resp => {
                this.tableData2= resp.data.data;
                this.showinfoflag = true ;
              })
            }
          })

      },
      pointCustomSubmit(name) {
        // 提交
        let params = {};
        if (name == 'pointCustom2') {  //水体
          params = {
            id: this.id,
            inRiverName: this.inriverName,
            riverID: this.pointCustom2.river,
          }
        } else {
          params = { //监测点
            id: this.id,
            inMpName: this.inMpName,
            mpID: this.pointCustom.point,
          }
        }

        this.post('/mpManage', {
          ...params
        })
          .then(resp => {
            if(resp.data.code==1){
              this.post('listMPNbyID', {  //查看详情
                mvID: this.mvID
              }).then(resp => {
                this.$Message.success('匹配成功!');
                this.tableData2= resp.data.data;
                this.showinfoflag = true ;
              })
            }

          });
      },
      signOut() {
        Cookies.remove('user');
        Cookies.remove('password');
        Cookies.remove('userid');
        this.$router.push({name: 'login'});
      },
      notice(row) {
        this.clicktitle = row.title;
        this.mvID=row.id
        this.isauditflag=row.isAudit
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
      audit(){
        this.post('upMPV', { //审核
          id:this.mvID,
          isAudit:1
        }).then(resp => {
          this.changePageNumber(false);
          this.$Message.success('审核通过!');

        })

      },
      ok() {
        this.post('addlabel', {  //增加新的标签
          labelName: this.pointCustom3.label,

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
      addlabel(){
        this.pointCustom3.label='';
        //已有标签列表
        this.post('labels', {
          }
        ).then(resp => {
          this.labelList = resp.data.list;
          this.showaddlabelflag=true
        })
      },
      beforeUpload() {
        this.spinShow=true
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
          this.showmodflag = false;
          console.log(file);
          this.clicktitle = file.name;
          this.post('listMPNbyID', {  //查看详情
            mvID:res.mvID
          }).then(resp => {
            this.tableData2= resp.data.data;
            this.showinfoflag = true ;
          })
        }
        this.spinShow=false
        this.changePageNumber(false)
      },
      Uploaderror(res, file, fileList){
        this.$Notice.open({
          title: '上传文件结果',
          desc: res.mes,
          duration: 0
        });
        this.spinShow=false
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
      },

    },
    mounted() {
      //

    }
  }
</script>
<style lang="scss">
  .ivu-spin-fix{
    z-index: 100000000001;
  }

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

