<template>
  <div class="main">
    <div id="content">
      <Row class="search" type="flex" justify="start">
        <Col>
          <Form inline :model="search">

            <FormItem label="">
              <Select v-model="search.layer" style="width:200px" placeholder="请选择区划">
                <Option :value="1" :key="1">区级</Option>
                <Option :value="2" :key="2">街道级</Option>
                <Option :value="3" :key="3">社区级</Option>
              </Select>
            </FormItem>
            <FormItem label="" prop="streetID" v-show="search.layer==3">

              <Select v-model="search.streetID" style="width:200px" placeholder="请选择街道" filterable>
                <Option v-for="item in streetList" :value="item.id" :key="item.id">{{ item.streetName }}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="">
              <DatePicker split-panels v-model="search.date" format="yyyy-MM-dd" type="daterange" :options="options2"
                          placement="bottom-end" placeholder="请选择时间" style="width: 200px"></DatePicker>
            </FormItem>
            <FormItem>
              <Button type="error" icon="android-refresh" @click="reset()">重置</Button>
              <Button type="primary" icon="ios-download-outline" @click="exportData(1)">导出原始数据</Button>
              <Button type="primary" icon="ios-download-outline" @click="exportData(2)">导出排序后数据</Button>
            </FormItem>
          </Form>
        </Col>
      </Row>
      <Row type="flex" justify="start">
        <Tabs :value="search.name" v-model="search.name">
          <TabPane label="巡查排行" name="name1">
            <Row justify="center" class="notifice">
              <Col>
                <Table ref="table1" border :columns="column1" :data="tableData1" @on-row-click="rowclick"></Table>
              </Col>
            </Row>
          </TabPane>
          <TabPane label="问题处理率排行" name="name2">
            <Row justify="center" class="notifice">
              <Col>
                <Table ref="table2" border :columns="column2" :data="tableData2"></Table>
              </Col>
            </Row>
          </TabPane>

        </Tabs>
      </Row>
    </div>
  </div>
</template>

<script>
  import {dateFormat} from '@/config/mUtils';


  export default {
    data() {
      return {

        search: {
          date: [],
          layer: 1,
          name: 'name1',
          streetID: ''
        },
        options2: {
          shortcuts: [
            {
              text: '近 1 星期',
              value() {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                return [start, end];
              }
            },
            {
              text: '近 1个月',
              value() {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                return [start, end];
              }
            }, {
              text: '近 3个月',
              value() {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                return [start, end];
              }
            },
            {
              text: '近 1   年',
              value() {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
                return [start, end];
              }
            }
          ]
        },
        column1: [
          {
            type: 'index',
            title: '序号',
            width: 80,
            align: 'center'
          },
          {
            title: '巡查人员',
            key: 'userName',
            align: 'center',
            sortable: true,
          },
          {
            title: '职务',
            key: 'duty',
            align: 'center',
            sortable: true,
          },
          {
            title: '管辖区域',
            key: 'manage',
            align: 'center',
            sortable: true,
          },
          {
            title: '电话',
            key: 'tel',
            align: 'center',
            sortable: true,
          },

          {
            title: '巡查次数',
            key: 'count',
            align: 'center',
            className: 'canclick',
            sortable: true
          },
          {
            title: '巡查距离(千米)',
            key: 'walkExtent',

            align: 'center',
            sortable: true,

          },
        ],
        column2: [
          // {
          //   type: 'expand',
          //   width: 40,
          //   render: (h, params) => {
          //     return h(rankingexpand, {
          //       props: {
          //         row: params.row
          //       },
          //     })
          //   }
          // },
          {
            type: 'index',
            title: '序号',
            width: 80,
            align: 'center'
          },
          {
            title: '河长名字',
            key: 'userName',
            align: 'center',
            sortable: true,
          },
          {
            title: '职务',
            key: 'duty',
            align: 'center',
            sortable: true,
          },
          {
            title: '管辖区域',
            key: 'manage',
            align: 'center',
            sortable: true,
          },
          {
            title: '河流名字',
            key: 'riverName',
            align: 'center',
            sortable: true
          },
          {
            title: '总问题数',
            key: 'allcount',
            align: 'center',
            sortable: true
          },
          {
            title: '处理中',
            key: 'processing',
            align: 'center',
            sortable: true,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error' ,
                    icon: 'log-in' ,

                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.jumpto(params.row.riverID,params.row.userID,0)
                    }
                  }
                }, '未处理')
              ]);
            }
          },{
            title: '已处理',
            key: 'processed',
            align: 'center',
            sortable: true,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type:  'success',
                    icon: 'checkmark-round',
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.jumpto(params.row.riverID,params.row.userID,2)
                    }
                  }

                }, '已处理')
              ]);
            }
          },
          {
            title: '处理问题率(%)',
            key: 'disposecount',
            className: 'userSelectText',
            align: 'center',
            sortable: true,

          },
        ],
        total1: 0,
        total2: 0,
        page: 1,
        pageSize: 10,
        tableData1: [],
        tableData2: [],
        streetList: []
      }
    },
    // computed: mapState({
    //   // 箭头函数可使代码更简练
    //   ranklist: state => state.ranklist
    // }),
    components: {},
    watch: {
      search: {
        handler: function (val, oldval) {
          this.querySearch()
        },
        deep: true,//对象内部的属性监听，也叫深度监听
        // immediate: true  //表示创建组件时立马执行一次。(立即以表达式的当前值触发回调)
      },
    },
    methods: {
      dateFormat,
      jumpto(riverID,userID,flag){
       this.$router.push({name:'problemHandling',query: { riverID: riverID,userID: userID,flag: flag }})
      },
      rowclick(row, index) {
        // 命名的路由 另外打开
        const {href} = this.$router.resolve({
          name: 'inspectionList',
          query: {userId: row.oneUserId}
        })
        window.open(href, '_blank')
        // this.$router.push({ name: 'inspectionList', params: { userId: row.oneUserId }})
      },
      querySearch() {
        var params = {};
        if (this.search.date[0]) {  //有时间
          if (this.search.layer != 3) {  //不是社区不选街道
            params = {
              begin: this.dateFormat(this.search.date[0], 'yyyy-MM-dd'),
              end: this.dateFormat(this.search.date[1], 'yyyy-MM-dd'),
              type: this.search.layer,
            }
          } else {
            params = {
              begin: this.dateFormat(this.search.date[0], 'yyyy-MM-dd'),
              end: this.dateFormat(this.search.date[1], 'yyyy-MM-dd'),
              type: this.search.layer,
              streetID: this.search.streetID
            }
          }

        } else {
          if (this.search.layer != 3) {  //不是社区不选街道
            params = {
              type: this.search.layer,
            }
          } else {
            params = {
              type: this.search.layer,
              streetID: this.search.streetID
            }
          }
        }
        ;
        var url = this.search.name == 'name1' ? 'topByHZByWeb' : 'disposePercent'
        // 河长巡查排行榜
        if (params) {
          this.post(url, {
            ...params
          }).then(resp => {
            if (this.search.name == 'name1') {
              this.tableData1 = resp.data.data;
              this.total1 = this.tableData1.length
            } else {
              this.tableData2 = resp.data.data;
              this.total2 = this.tableData1.length
            }
          })
        }

      },
      reset() {
        this.search.date = [];
        this.search.layer = 1
      },
      exportData(type) {  // 导出
        if (this.search.name == 'name1') {
          if (type === 1) {
            this.$refs.table1.exportCsv({
              filename: '巡查排行榜'
            });
          } else if (type === 2) {
            this.$refs.table1.exportCsv({
              filename: '巡查排行榜(排序后)',
              original: false
            });
          }
        } else if (this.search.name == 'name2') {
          if (type === 1) {
            this.$refs.table2.exportCsv({
              filename: '问题处理率排行榜'
            });
          } else if (type === 2) {
            this.$refs.table2.exportCsv({
              filename: '问题处理率排行榜(排序后)',
              original: false
            });
          }
        }
      },
    },
    created() {
      // 河长巡查排行榜
      this.post('/topByHZByWeb', {
        type: 1
      }).then(resp => {
        this.tableData1 = resp.data.data || '';
        this.total1 = this.tableData1.length
      })
      // 河长问题处理率排行榜
      this.post('/disposePercent', {
        type: 1
      }).then(resp => {
        this.tableData2 = resp.data.data;
        this.total2 = this.tableData2.length
      })
    },
    mounted() {
      //街道选择框
      this.post('getAllinfo?infoId=1', {}
      ).then(resp => {
        this.streetList = resp.data.data;
        this.search.streetID = resp.data.data[0].id
      })
    }
  }
</script>
<style>
  .canclick {
    cursor: pointer;
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
