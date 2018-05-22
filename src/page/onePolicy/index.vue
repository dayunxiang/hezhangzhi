<template>
  <div id="main">

    <Row>
      <Col span="7">
        <Row>
          <Col span="12">
            <Tree :data="basetreeData"   id="rivertreelist" @on-select-change="treelistclick"></Tree>
          </Col>
          <Col span="12">
            <Upload
            multiple
            :before-upload="beforeUpload"
            :on-success="UploadSuccess"
            :data ="{ connectriverId : connectriverId }"
            :format="['pfd','doc']"
            :on-format-error="FormatError"
            type="drag"
            :action=" baseUrl + 'uploadFile'">
            <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>请先选择河道，再点击或者拖拽文件到此处上传</p>
            </div>
          </Upload>
          </Col>
        </Row>
      </Col>
      <Col span="17">
       </Col>
    </Row>
  </div>
</template>
<script>
  import {baseUrl} from '@/config/env';
  export default {
    data() {
      return {
        baseUrl:baseUrl,
        basetreeData: [],
        connectriverId:'',

      }
    },
    created() {
      this.post('/riverTree', {}).then(resp => {
        this.getTree(resp.data.data)
      })
    },
    methods: {
      beforeUpload () {
      if(!this.connectriverId){
        this.$Message.info('请选择河道')
        return false;
      }else {
        return true
      }
      },
      UploadSuccess (res, file,fileList) {
        // 因为上传过程为实例，这里模拟添加 url
        console.log(fileList);
        this.$Message.info('上传成功')
      },
      FormatError () {
        this.$Message.warning('文件类型错误，请选择pdf或者word文件.')
      },
      getTree(tree = []) {
        let authTree = [];
        // 一层
        tree.map((item) => {
          item.title = `${item.riverName}（区级）`;
          item.attr = item.connectriverId;
          // 二层
          item.child.map((e) => {
            e.title = `${e.riverName} （街道级）`;
            e.attr = e.connectriverId;
            // 三层
            e.child.map((b) => {
              b.title = `${b.riverName}（社区级）`;
              b.attr = b.connectriverId;
            });
            e.children = e.child;
          });
          item.children = item.child;
          authTree.push(item);
        });
        authTree[0].expand = true;
        authTree[0].children[0].expand = true;
        return this.basetreeData = authTree;
      },
      treelistclick(row) {
        console.log(row[0].attr);
        this.connectriverId=row[0].attr
        // this.post('/OneRiverMes', {
        //   connectriverId: row[0].attr
        // }).then(resp => {
        //   console.log(resp.data.data)
        // })
      },
    },
    mounted() {
      document.getElementById('rivertreelist').style.height = (document.documentElement.clientHeight - 70) + 'px'
    }
  }
</script>
<style>
  .ivu-tree > .ivu-tree-children > li {
    list-style: none;
    margin: 8px 0;
    padding: 0;
    white-space: nowrap;
    outline: 0;
    text-align: left !important;
  }
</style>
<style lang="scss" scoped>
  #main {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    position: relative;
    overflow: hidden;

    #rivertreelist {
      /*height: 300px;*/
      padding: 5px;
      overflow: scroll;
    }
    .demo-upload-list {
      display: inline-block;
      width: 60px;
      height: 60px;
      line-height: 60px;
      border: 1px solid transparent;
      border-radius: 4px;
      overflow: hidden;
      background: #fff;
      position: relative;
      box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
      margin-right: 4px;
    }

    .demo-upload-list img {
      width: 100%;
      height: 100%;
    }

    .demo-upload-list-cover {
      display: none;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, .6);
    }
    .demo-upload-list:hover .demo-upload-list-cover {
      display: block;
    }
    .demo-upload-list-cover i {
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      margin: 0 2px;
    }
  }
</style>
