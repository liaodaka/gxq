<template>
  <Carousel dots='none' :arrow='arrowTypes' style="background-color: #fff;">
    <CarouselItem v-for="(item,index) in data" :key="index">
      <Col
        span="3"
        class="colItem"
        v-for="(con, idx) in item"
        :key="idx"
        style="width:12%;">
        <!--<div class="item-card" :class="{active: con.link}" @click="jumpTo(con.link, con.introText)">-->
        <div class="item-card" :class="{active: con.link}">
          <Card class="radioMod" :padding="0">
            <Row type="flex" align="middle" justify="center" class="radioTxt">
              <count-up
                class="infor-card-count user-created-count" 
                :id-name="con.idName"
                :end-val="con.count"
                :color="con.color"
                :countSize="con.countSize"
                :countWeight="700">
                <p class="infor-intro-text" slot="intro">{{con.introText}}</p>
              </count-up>
            </Row>
          </Card>
        </div>
      </Col>
    </CarouselItem>
  </Carousel>
</template>

<script>
import countUp from '@/components/hengyun/countUp.vue'

export default {
  components: {
    countUp,
  },
  props:{
      data: {
          type: Array,
          default: []
      },
      arrowType: {
          type: String,
          default: 'never'
      },
  },
  data(){
      return{
          arrowTypes:this.arrowType
      }
  },
  updated(){
    if(this.data.length>1){//根据数据长度修改类型（是否显示左右键按钮）
      this.arrowTypes='always';
    }
  },
  methods: {
    jumpTo (link, app) {
      if (link) {
        this.$router.push({
          path: link,
          query: {
            app: app
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.radioMod{
    width:100%;
    height:100%;
    padding:10px 0;
    border:none;
    border-right:1px solid #ccc;
    // border-radius: 50%;
    margin: 30px auto;
    :hover{
        border:none;
    }
}
.colItem:last-child .radioMod{
    border:none;
}
.infor-intro-text{
    color:#333;
}
.mf{
    margin-left:2%;
}
.radioTxt{
    width:100px;
    height:100px;
    margin:35px auto;
    font-size:20px;
    text-align: center
}
.card-title{
    text-align: center;
    background-color: #888;
}
/*.item-card{
  cursor: not-allowed;
}
.active{
  cursor: pointer;
}*/
</style>
