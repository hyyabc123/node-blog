<template>
    <div class="view-index">
        <header>
            <ul class="tags">
                <li @click="gotoPage('index')">首页</li>
                <li @click="gotoPage('about')">关于</li>
            </ul>
        </header>
        <section class="main">
            <div class="content">
                <keep-alive>
                    <router-view
                        :articlesData="articlesData"
                        :pageIndex="pageIndex"
                        :pageSize="pageSize"
                        :totalArticles="totalArticles"
                        @change="pageChange"
                    ></router-view>
                </keep-alive>
            </div>
            <div class="sidebar">
                <div class="introduction">
                    <div class="avator">
                        <img src="../../assets/person.jpg" alt="我的照片">
                    </div>
                    <p>郝赟赟</p>
                    <div class="my-link">
                          <img src="../../assets/zhihu.jpg" alt="知乎">
                    </div>
                    <p>博客访问次数：{{ visits }}</p>
                </div>
                <div class="tag-header" v-if="sidebarData.length">
                    我的标签
                </div>
                <ul @click="toggleTag">
                    <li v-for="(item, index) in sidebarData" :key="index" class="sidebar-li">
                        {{ item.tag }}（{{ item.nums }}）
                    </li>
                </ul>
            </div>
        </section>
        <footer>
            <p @click="gotoLogin">Copyright ©{{ new Date().getFullYear() }} 郝赟赟</p>
        </footer>
    </div>
</template>

<script>
import { mapState } from 'vuex'

let fetchArticles
export default {
    data() {
        return {
            pageIndex: 1,
            pageSize: 20,
            tags: []
        }
    },
    computed: {
        ...mapState([
            'sidebarData',
            'visits',
            'articlesData',
            'totalArticles',
        ]),
    },
    asyncData({ store, route }) {
        if (route.path == '/index') {
            return Promise.all([
                store.dispatch('getTagsArtilesData'),
                store.dispatch('getArticles', {
                    tags: [],
                    pageSize: 20,
                    pageIndex: 1,
                })
            ])
        }

        return Promise.resolve()
    },
    mounted() {
        fetchArticles = require('@/api/client').fetchArticles
    },
    methods: {
        gotoPage(name) {
            this.$router.push(name)
            if (name == 'index') {
                this.pageIndex = 1
                this.tags = []
                this.getAppointArticles()
            }
        },

        toggleTag(e) {
            this.pageIndex = 1
            this.tags = e.target.innerHTML.trim().split('（')[0]
            this.getAppointArticles()
        },
        
        pageChange(index) {
            this.pageIndex = index
            this.getAppointArticles()
        },

        getAppointArticles() {
            fetchArticles({
                tags: this.tags,
                pageSize: this.pageSize,
                pageIndex: this.pageIndex,
            })
            .then(res => {
                this.$store.commit('setArticles', res)
            })
        },
        
        gotoLogin() {
            this.$router.push('manage')
        },
    }
}
</script>

<style scoped>
.view-index {
    background: #eee;
}
header,
footer {
    background: #333;
    text-align: center;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    font-size: 18px;
}
.main {
    width: 1200px;
    margin: 20px auto;
    min-height: 707px;
    display: flex;
    justify-content: space-between;
}
.tags {
    display: flex;
    margin: auto;
    width: 1200px;
}
.tags li {
    width: 100px;
    cursor: pointer;
}
li {
    font-size: 20px;
}

.content {
    width: 890px;
}
.sidebar {
    width: 290px;
    color: #7d8b8d;
}


.sidebar-li {
    padding: 15px;
    background: #fff;
    border: 1px solid #dedede;
    border-top: 0;
    cursor: pointer;
    font-size: 16px;
}
.sidebar-li:hover {
    background: #dedede;
    color: #fff;
}
.tag-header {
    background: #333;
    border: 1px solid #dedede;
    border-bottom: 0;
    color: #fff;
    padding: 15px;
    font-size: 16px;
}
.introduction {
    margin-bottom: 10px;
    font-size: 16px;
}
.introduction a {
    display: inline-block;
}
.my-link {
    display: flex;
    align-items: center;
    margin: 20px 0;
}
.my-link a {
    width: 34px;
    height: 34px;
    margin-right: 20px;
}
.my-link img {
    width: 40px;
    height: 40px;
}
.avator{
  width: 280px;
  height: 200px;
  overflow: hidden;
}
.avator img{
  width: 100%;
  height: 100%;
}
</style>
