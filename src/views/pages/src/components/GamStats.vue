<template>
    <div class="gamstat-container">
        <div class="gamstat-navbar">
            <div class="gamestat-navbar-fixed">
                <div class="gamstat-navbar-content">
                    <div class="gamstat-content-left">
                        <i class='bx bx-chevron-left'></i>
                    </div>
                    <div class="gamstat-content-center">Game statistics</div>
                    <div class="gamstat-content-right"></div>
                </div>
            </div>
        </div>
        <div class="gamstat-header">
            <div class="gamstat-tab">
                <div class="gamstat-tab-wrap">
                    <div class="gamstat-tablist">
                        <a href="">Today</a>
                        <a href="">Yesterday</a>
                        <a href="">This week</a>
                        <a href="">This month</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="gamstat-banner">
            <h1><i class='bx bx-rupee'></i>0.00</h1>
            <span>Total bet</span>
        </div>
        <div class="gamstat-list-wrapper">
            <div class="gamstat-emptycontainer">
                <svg data-v-f84b843f="" class="svg-icon icon-empty">
                    <use xlink:href="#icon-empty"></use>
                </svg>
                No data
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'GameStats',
    props: {
        msg: String
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>