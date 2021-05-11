<template>
  <div id="app">
    <h1>News Aggregator</h1>
    <br/>
    <input placeholder="Start your search" v-model="query"/>
    <button @click="origin_search">accurate_search</button>
    <button @click="search">associative_search</button>
    <br/>
    <br/>
    <br/>
    <label v-if="error" style="color:salmon;">{{error}}</label>
    <br/>
    <label style="color:grey;">Search took {{timetotal}} seconds from {{from}}</label>

    <br/>
    
    <div v-for="item in res" :key="item._id" style="box-shadow: 0px 1px;margin: 85px;text-align:left; line-height:37.8px;">
      <a :href="item._source.link" target="_blank">{{item._source.title}}</a>
      <p>{{item._source.short}}</p>

      <label v-if="res.length==0" style="color:grey;">Search result empty</label>

      <label 
        v-for="keyword in item._source.ner_shorts" 
        :key="keyword.id" 
        :data-val="keyword[0]"
        @click="search_keyword" 
        style="font-size: 12px;color:#0AC2FF;margin-right:10px;">
            {{keyword[0]}}
      </label>

    </div>
  </div>
</template>

<script>

const API_ENDPOINT = "https://anu.jkl.io/api";
const ERR_MSGS = {
  EXCEEDED_RATE_LIMIT: "Seems like you've been sending requests too fast, slow down a bit.",
  UNKNOWN_ERR: "Oh no! Something unexpected happened. Please try your search again."
};

function queryApi(query_value, _this, origin) {
  _this.error = undefined;
  const s = Date.now();
  _this.$http.get(`${API_ENDPOINT}/${origin ? "origin_" : ""}search`, {params: {query: query_value}}).then(response => {
    const d = Date.now();
    _this.timetotal=(d-s)/1000;
    var data = response.body.result;
    for (var i = 0; i < data.result.length; i++) {
      var result_src = data.result[i]._source;
      data.result[i]._source['short'] = (result_src.summary ? result_src.summary : result_src.art).substring(0, 200).concat("...");
      if (origin) {
        continue;
      }
      data.result[i]._source['ner_shorts'] = data.result[i]._source['ner_list'].filter(e => 
        (e[1] !== 'CARDINAL' && e[1] !== 'ORDINAL' && e[1] !== 'TIME' && e[1] !== 'DATE')
      );
    }
    _this.res = data.result;
    _this.keyword = query_value;
    _this.from = data.from;
  }, error => {
    _this.error = error.status === 429 ? ERR_MSGS.EXCEEDED_RATE_LIMIT : ERR_MSGS.UNKNOWN_ERR;
  });
}

export default {
  name: 'App',
  data: function() {
    return {
      query: '',
      res: [],
      keyword: '',
      timetotal:0,
      error: undefined,
      from: '',
    }
  },
  methods: {
    search: function() {
      queryApi(this.query, this, false);
    },
    search_keyword: function(e) {
      var keyword = e.target.dataset["val"];
      this.query = keyword;
      queryApi(keyword, this, false);
    },
    origin_search: function() {
      queryApi(this.query, this, true);
    }
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

a {
    text-decoration:none;
    font-size:25px;
    outline:none;
    text-align:center;
    width:50px;
    line-height:35px;
    cursor: pointer;
}

el-button {
  color:cyan;
  cursor:pointer;
  font-weight:870;
}
</style>









