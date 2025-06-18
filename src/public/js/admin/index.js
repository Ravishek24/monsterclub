var socket = io();
let typeid = $('html').attr('data-change');
let game = '';
if (typeid == '1') game = 'wingo';
if (typeid == '2') game = 'wingo3';
if (typeid == '3') game = 'wingo5';
if (typeid == '4') game = 'wingo10';
$(`.container-fluid:eq(1) .row:eq(0) .info-box-content:eq(${Number(typeid) - 1}) .info-box-text`).css('color', '#e67e22');

// Socket.IO connection monitoring
socket.on('connect', () => {
    console.log('Connected to Socket.IO server');
    // Load initial data when connected
    loadInitialStats();
});

socket.on('disconnect', () => {
    console.log('Disconnected from Socket.IO server');
});

socket.on('error', (error) => {
    console.error('Socket.IO error:', error);
});

// Load initial betting statistics
function loadInitialStats() {
    $.ajax({
        url: '/api/webapi/GameStatis',
        method: 'POST',
        data: { type: 'today' },
        success: function(response) {
            if (response.status) {
                const data = response.data;
                // Update statistics display
                if (data.gameStatis) {
                    $('.orderNumbers').text(formatMoney(data.sumBetAmount || 0, ','));
                    $('.orderNumbers').attr('totalmoney', data.sumBetAmount || 0);
                }
            }
        },
        error: function(error) {
            console.error('Error loading initial stats:', error);
        }
    });
}

function formatMoney(amount, separator = ',') {
    if (typeof amount !== 'number') {
        amount = parseFloat(amount) || 0;
    }
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

function formateT(params) {
    let result = (params < 10) ? "0" + params : params;
    return result;
}

function timerJoin(params = '', addHours = 0) {
    let date = '';
        if (params) {
            date = new Date(Number(params));
        } else {
            date = new Date();
        }
    
        date.setHours(date.getHours() + addHours);
    
        let years = formateT(date.getFullYear());
        let months = formateT(date.getMonth() + 1);
        let days = formateT(date.getDate());
    
        let hours = date.getHours() % 12;
        hours = hours === 0 ? 12 : hours;
        let ampm = date.getHours() < 12 ? "AM" : "PM";
    
        let minutes = formateT(date.getMinutes());
        let seconds = formateT(date.getSeconds());
    
        return years + '-' + months + '-' + days + ' ' + hours + ':' + minutes + ':' + seconds + ' ' + ampm;
}
const isNumber = (params) => {
    let pattern = /^[0-9]*\d$/;
    return pattern.test(params);
}

function showJoinMember(data) {
    let phone = data.phone;
    let bet = data.bet;
    let money = formatMoney(data.money + data.fee, ',');
    let name = data.bet;
    let time = timerJoin(data.time);
    let result = '';
    result += `
      <div class="direct-chat-infos clearfix">
        <span class="direct-chat-name float-left"></span>
        <span class="direct-chat-timestamp float-right text-primary">${time}</span>
      </div>
      <img class="direct-chat-img" src="/images/myimg.png" alt="message user image">
      <div class="direct-chat-text" style="background-color: ${(isNumber(bet)) ? '#007acc' : (bet == 'x') ? '#1eb93d' : (bet == 'd') ? '#f52828' : (bet == 't') ? '#ea3af0' : (bet == 'l') ? '#ffc511' : '#5cba47'}">
        Join ${((isNumber(bet)) ? bet : (bet == 'd') ? 'Red' : (bet == 'x') ? 'Green' : (bet == 't') ? 'Violet' : (bet == 'l') ? 'Big' : 'Small')} ${money}
      </div>`;
    $('.direct-chat-msg').append(result);
}

function showJoinMember2(data) {
    if (data.change == 1) return;
    let bet = data.join;
    let money = formatMoney(data.money, ',');
    let name = data.bet;
    let time = timerJoin(data.time);
    let result = '';
    result += `
      <div class="direct-chat-infos clearfix">
        <span class="direct-chat-name float-left"></span>
        <span class="direct-chat-timestamp float-right text-primary">${time}</span>
      </div>
      <img class="direct-chat-img" src="/images/myimg.png" alt="message user image">
      <div class="direct-chat-text" style="background-color: ${(isNumber(bet)) ? '#007acc' : (bet == 'x') ? '#1eb93d' : (bet == 'd') ? '#f52828' : (bet == 't') ? '#ea3af0' : (bet == 'l') ? '#ffc511' : '#5cba47'}">
        Join ${((isNumber(bet)) ? bet : (bet == 'd') ? 'Red' : (bet == 'x') ? 'Green' : (bet == 't') ? 'Violet' : (bet == 'l') ? 'Big' : 'Small')} ${money}
      </div>`;
    $('.direct-chat-msg').append(result);
}

// Original handler for bet placements
socket.on('data-server_2', function (msg) {
    try {
        // Log the incoming message for debugging
        console.log('Received data-server_2 message:', msg);

        // Handle both string and object message formats
        const data = typeof msg === 'string' ? JSON.parse(msg) : msg;
        if (!data || !data.gameStats) {
            console.log('Invalid betting stats message format:', msg);
            return;
        }

        const stats = data.gameStats;
        console.log('Processing stats:', stats);

        // Reset all values to 0 first
        $('.orderRed, .orderViolet, .orderGreen, .orderNumber, .orderNumbers').text('0');
        $('.orderRed, .orderViolet, .orderGreen, .orderNumber, .orderNumbers').attr('totalmoney', '0');

        // Process each game's statistics
        Object.entries(stats).forEach(([game, gameStats]) => {
            console.log(`Processing game ${game}:`, gameStats);
            
            // Update total betting amount
            const totalAmount = gameStats.totalBetAmount || 0;
            $('.orderNumbers').text(formatMoney(totalAmount, ','));
            $('.orderNumbers').attr('totalmoney', totalAmount);

            // Update category-specific statistics
            if (gameStats.categories) {
                Object.entries(gameStats.categories).forEach(([betType, categoryStats]) => {
                    console.log(`Processing bet type ${betType}:`, categoryStats);
                    const amount = categoryStats.betAmount || 0;

                    // Update red/green/violet bets
                    if (betType === 'd') { // Red
                        $('.orderRed').text(formatMoney(amount, ','));
                        $('.orderRed').attr('totalmoney', amount);
                    } else if (betType === 'x') { // Green
                        $('.orderGreen').text(formatMoney(amount, ','));
                        $('.orderGreen').attr('totalmoney', amount);
                    } else if (betType === 't') { // Violet
                        $('.orderViolet').text(formatMoney(amount, ','));
                        $('.orderViolet').attr('totalmoney', amount);
                    } else if (/^[0-9]$/.test(betType)) { // Numbers 0-9
                        $(`.orderNumber:eq(${betType})`).text(formatMoney(amount, ','));
                        $(`.orderNumber:eq(${betType})`).attr('totalmoney', amount);
                    } else if (betType === 'l') { // Big
                        $('.orderNumber:eq(10)').text(formatMoney(amount, ','));
                        $('.orderNumber:eq(10)').attr('totalmoney', amount);
                    } else if (betType === 'n') { // Small
                        $('.orderNumber:eq(11)').text(formatMoney(amount, ','));
                        $('.orderNumber:eq(11)').attr('totalmoney', amount);
                    }
                });
            }
        });

        // Update total amount
        const totalAmount = Object.values(stats).reduce((sum, game) => sum + (game.totalBetAmount || 0), 0);
        $('.orderNumbers').text(formatMoney(totalAmount, ','));
        $('.orderNumbers').attr('totalmoney', totalAmount);

    } catch (error) {
        console.error('Error in data-server_2 handler:', error);
        console.error('Error details:', error.message);
        console.error('Stack trace:', error.stack);
    }
});

// New handler for betting statistics
socket.on('betting-stats', function (msg) {
    try {
        // Log the incoming message for debugging
        console.log('Received betting-stats message:', msg);

        // Handle both string and object message formats
        const data = typeof msg === 'string' ? JSON.parse(msg) : msg;
        if (!data || !data.gameStats) {
            console.log('Invalid betting stats message format:', msg);
            return;
        }

        const stats = data.gameStats;
        console.log('Processing stats:', stats);

        // Reset all values to 0 first
        $('.orderRed, .orderViolet, .orderGreen, .orderNumber, .orderNumbers').text('0');
        $('.orderRed, .orderViolet, .orderGreen, .orderNumber, .orderNumbers').attr('totalmoney', '0');

        // Process each game's statistics
        Object.entries(stats).forEach(([game, gameStats]) => {
            console.log(`Processing game ${game}:`, gameStats);
            
            // Update total betting amount
            const totalAmount = gameStats.totalBetAmount || 0;
            $('.orderNumbers').text(formatMoney(totalAmount, ','));
            $('.orderNumbers').attr('totalmoney', totalAmount);

            // Update category-specific statistics
            if (gameStats.categories) {
                Object.entries(gameStats.categories).forEach(([betType, categoryStats]) => {
                    console.log(`Processing bet type ${betType}:`, categoryStats);
                    const amount = categoryStats.betAmount || 0;

                    // Update red/green/violet bets
                    if (betType === 'd') { // Red
                        $('.orderRed').text(formatMoney(amount, ','));
                        $('.orderRed').attr('totalmoney', amount);
                    } else if (betType === 'x') { // Green
                        $('.orderGreen').text(formatMoney(amount, ','));
                        $('.orderGreen').attr('totalmoney', amount);
                    } else if (betType === 't') { // Violet
                        $('.orderViolet').text(formatMoney(amount, ','));
                        $('.orderViolet').attr('totalmoney', amount);
                    } else if (/^[0-9]$/.test(betType)) { // Numbers 0-9
                        $(`.orderNumber:eq(${betType})`).text(formatMoney(amount, ','));
                        $(`.orderNumber:eq(${betType})`).attr('totalmoney', amount);
                    } else if (betType === 'l') { // Big
                        $('.orderNumber:eq(10)').text(formatMoney(amount, ','));
                        $('.orderNumber:eq(10)').attr('totalmoney', amount);
                    } else if (betType === 'n') { // Small
                        $('.orderNumber:eq(11)').text(formatMoney(amount, ','));
                        $('.orderNumber:eq(11)').attr('totalmoney', amount);
                    }
                });
            }
        });

        // Update total amount
        const totalAmount = Object.values(stats).reduce((sum, game) => sum + (game.totalBetAmount || 0), 0);
        $('.orderNumbers').text(formatMoney(totalAmount, ','));
        $('.orderNumbers').attr('totalmoney', totalAmount);

    } catch (error) {
        console.error('Error in betting-stats handler:', error);
        console.error('Error details:', error.message);
        console.error('Stack trace:', error.stack);
    }
});

function showListOrder4(list_orders, x) {
    let htmls = "";
    let result = list_orders.map((list_orders) => {
        return (htmls += `
                    <div data-v-a9660e98="" class="c-tc item van-row">
                        <div data-v-a9660e98="" class="van-col van-col--8">
                            <div data-v-a9660e98="" class="c-tc goItem">${list_orders.period}</div>
                        </div>
                        <div data-v-a9660e98="" class="van-col van-col--5">
                            <div data-v-a9660e98="" class="c-tc goItem">
                                <!---->
                                <span data-v-a9660e98="" class="${list_orders.amount % 2 == 0 ? "red" : "green"}"> ${list_orders.amount} </span>
                            </div>
                        </div>
                        <div data-v-a9660e98="" class="van-col van-col--5">
                            <div data-v-a9660e98="" class="c-tc goItem">
                                <span data-v-a9660e98=""> ${list_orders.amount < 5 ? "Small" : "Big"} </span>
                                <!---->
                            </div>
                        </div>
                        <div data-v-a9660e98="" class="van-col van-col--6">
                            <div data-v-a9660e98="" class="goItem c-row c-tc c-row-center">
                                <div data-v-a9660e98="" class="c-tc c-row box c-row-center">
                                    <span data-v-a9660e98="" class="li ${list_orders.amount % 2 == 0 ? "red" : "green"}"></span>
                                    ${list_orders.amount == 0 || list_orders.amount == 5 ? '<span data-v-a9660e98="" class="li violet"></span>' : ""}
                                </div>
                            </div>
                        </div>
                    </div>
                    `);
    });
    $(`#list-orders`).html(htmls);
}


socket.on("data-server", function (msg) {
    if (msg.data[0].game != game) return;
    $(".direct-chat-msg").html('');
    $('.info-box-number').text('0');
    let data1 = msg.data[0]; // lấy ra cầu mới nhất
    $(".reservation-chunk-sub-num").text(data1.period);
    let data2 = []; // lấy ra cầu cũ
    let data3 = data2.push(msg.data[1]);
    $(".direct-chat-warning .direct-chat-messages").animate({
        scrollTop: $(".direct-chat-msg").prop("scrollHeight")
    }, 750);
    $.ajax({
        type: "POST",
        url: "/api/webapi/admin/totalJoin",
        data: {
            typeid: typeid,
        },
        dataType: "json",
        success: function (response) {
            var red = 0;
            var green = 0;
            var violet = 0;
            var n0 = 0;
            var n1 = 0;
            var n2 = 0;
            var n3 = 0;
            var n4 = 0;
            var n5 = 0;
            var n6 = 0;
            var n7 = 0;
            var n8 = 0;
            var n9 = 0;
            var n = 0;
            var l = 0;
            var ns = 0;
            var length = response.datas.length;
            var datas = response.datas;
            for (let i = 0; i < length; i++) {
                if (datas[i].bet == '0') n0 += datas[i].money;
                if (datas[i].bet == '1') n1 += datas[i].money;
                if (datas[i].bet == '2') n2 += datas[i].money;
                if (datas[i].bet == '3') n3 += datas[i].money;
                if (datas[i].bet == '4') n4 += datas[i].money;
                if (datas[i].bet == '5') n5 += datas[i].money;
                if (datas[i].bet == '6') n6 += datas[i].money;
                if (datas[i].bet == '7') n7 += datas[i].money;
                if (datas[i].bet == '8') n8 += datas[i].money;
                if (datas[i].bet == '9') n9 += datas[i].money;
                if (datas[i].bet == 'x') green += datas[i].money;
                if (datas[i].bet == 't') violet += datas[i].money;
                if (datas[i].bet == 'd') red += datas[i].money;
                if (datas[i].bet == 'l') l += datas[i].money;
                if (datas[i].bet == 'n') n += datas[i].money;
            }
            ns = n0 + n1 + n2 + n3 + n4 + n5 + n6 + n7 + n8 + n9;
            $('.orderRed').text(formatMoney(red, ','));
            $('.orderViolet').text(formatMoney(violet, ','));
            $('.orderGreen').text(formatMoney(green, ','));
            $('.orderNumber:eq(0)').text(formatMoney(n0, ','));
            $('.orderNumber:eq(1)').text(formatMoney(n1, ','));
            $('.orderNumber:eq(2)').text(formatMoney(n2, ','));
            $('.orderNumber:eq(3)').text(formatMoney(n3, ','));
            $('.orderNumber:eq(4)').text(formatMoney(n4, ','));
            $('.orderNumber:eq(5)').text(formatMoney(n5, ','));
            $('.orderNumber:eq(6)').text(formatMoney(n6, ','));
            $('.orderNumber:eq(7)').text(formatMoney(n7, ','));
            $('.orderNumber:eq(8)').text(formatMoney(n8, ','));
            $('.orderNumber:eq(9)').text(formatMoney(n9, ','));
            $('.orderNumber:eq(10)').text(formatMoney(l, ','));
            $('.orderNumber:eq(11)').text(formatMoney(n, ','));
            $('.orderNumbers').text(formatMoney(ns, ','));

            $('.orderRed').attr('totalmoney', red);
            $('.orderViolet').attr('totalmoney', violet);
            $('.orderGreen').attr('totalmoney', green);
            $('.orderNumber:eq(0)').attr('totalmoney', n0);
            $('.orderNumber:eq(1)').attr('totalmoney', n1);
            $('.orderNumber:eq(2)').attr('totalmoney', n2);
            $('.orderNumber:eq(3)').attr('totalmoney', n3);
            $('.orderNumber:eq(4)').attr('totalmoney', n4);
            $('.orderNumber:eq(5)').attr('totalmoney', n5);
            $('.orderNumber:eq(6)').attr('totalmoney', n6);
            $('.orderNumber:eq(7)').attr('totalmoney', n7);
            $('.orderNumber:eq(8)').attr('totalmoney', n8);
            $('.orderNumber:eq(9)').attr('totalmoney', n9);
            $('.orderNumber:eq(10)').attr('totalmoney', l);
            $('.orderNumber:eq(11)').attr('totalmoney', n);
            $('.orderNumbers').attr('totalmoney', ns);

            response.datas.map((data) => {
                showJoinMember(data);
            });
            showListOrder3(response.list_orders);
            $(".direct-chat-warning .direct-chat-messages").animate({
                scrollTop: $(".direct-chat-msg").prop("scrollHeight")
            }, 750);
            $('.reservation-chunk-sub-num').text(response.lotterys[0].period);
            let is = ''
            if (typeid == '1') is = $('#ketQua').text(`Next Result: ${(response.setting[0].wingo1 == '-1') ? 'Random' : response.setting[0].wingo1}`);
            if (typeid == '2') is = $('#ketQua').text(`Next Result: ${(response.setting[0].wingo3 == '-1') ? 'Random' : response.setting[0].wingo3}`);
            if (typeid == '3') is = $('#ketQua').text(`Next Result: ${(response.setting[0].wingo5 == '-1') ? 'Random' : response.setting[0].wingo5}`);
            if (typeid == '4') is = $('#ketQua').text(`Next Result: ${(response.setting[0].wingo10 == '-1') ? 'Random' : response.setting[0].wingo10}`);
            
            if (typeid == '1') $('#winrate').text(`Next Result: ${(response.setting[0].bs1 == '-1') ? 'Random' : response.setting[0].bs1}`);
            if (typeid == '2') $('#winrate').text(`Next Result: ${(response.setting[0].bs3 == '-1') ? 'Random' : response.setting[0].bs3}`);
            if (typeid == '3') $('#winrate').text(`Next Result: ${(response.setting[0].bs5 == '-1') ? 'Random' : response.setting[0].bs5}`);
            if (typeid == '4') $('#winrate').text(`Next Result: ${(response.setting[0].bs10 == '-1') ? 'Random' : response.setting[0].bs10}`);
        }
    });
});
function showListOrder3(list_orders, x) {
    let htmls = "";
    let result = list_orders.map((list_orders) => {
        return (htmls += `
                    <div data-v-a9660e98="" class="c-tc item van-row">
                        <div data-v-a9660e98="" class="van-col van-col--8">
                            <div data-v-a9660e98="" class="c-tc goItem">${list_orders.period}</div>
                        </div>
                        <div data-v-a9660e98="" class="van-col van-col--5">
                            <div data-v-a9660e98="" class="c-tc goItem">
                                <!---->
                                <span data-v-a9660e98="" class="${list_orders.amount % 2 == 0 ? "red" : "green"}"> ${list_orders.amount} </span>
                            </div>
                        </div>
                        <div data-v-a9660e98="" class="van-col van-col--5">
                            <div data-v-a9660e98="" class="c-tc goItem">
                                <span data-v-a9660e98=""> ${list_orders.amount < 5 ? "Small" : "Big"} </span>
                                <!---->
                            </div>
                        </div>
                        <div data-v-a9660e98="" class="van-col van-col--6">
                            <div data-v-a9660e98="" class="goItem c-row c-tc c-row-center">
                                <div data-v-a9660e98="" class="c-tc c-row box c-row-center">
                                    <span data-v-a9660e98="" class="li ${list_orders.amount % 2 == 0 ? "red" : "green"}"></span>
                                    ${list_orders.amount == 0 || list_orders.amount == 5 ? '<span data-v-a9660e98="" class="li violet"></span>' : ""}
                                </div>
                            </div>
                        </div>
                    </div>
                    `);
    });
    $(`#list-orders`).html(htmls);
    // $(`.game-list .con-box:eq(${x}) .hb .c-tc`).last().remove();
}


$.ajax({
    type: "POST",
    url: "/api/webapi/admin/totalJoin",
    data: {
        typeid: typeid,
    },
    dataType: "json",
    success: function (response) {
        var red = 0;
        var green = 0;
        var violet = 0;
        var n0 = 0;
        var n1 = 0;
        var n2 = 0;
        var n3 = 0;
        var n4 = 0;
        var n5 = 0;
        var n6 = 0;
        var n7 = 0;
        var n8 = 0;
        var n9 = 0;
        var n = 0;
        var l = 0;
        var ns = 0;
        var length = response.datas.length;
        var datas = response.datas;
        for (let i = 0; i < length; i++) {
            if (datas[i].bet == '0') n0 += datas[i].money;
            if (datas[i].bet == '1') n1 += datas[i].money;
            if (datas[i].bet == '2') n2 += datas[i].money;
            if (datas[i].bet == '3') n3 += datas[i].money;
            if (datas[i].bet == '4') n4 += datas[i].money;
            if (datas[i].bet == '5') n5 += datas[i].money;
            if (datas[i].bet == '6') n6 += datas[i].money;
            if (datas[i].bet == '7') n7 += datas[i].money;
            if (datas[i].bet == '8') n8 += datas[i].money;
            if (datas[i].bet == '9') n9 += datas[i].money;
            if (datas[i].bet == 'x') green += datas[i].money;
            if (datas[i].bet == 't') violet += datas[i].money;
            if (datas[i].bet == 'd') red += datas[i].money;
            if (datas[i].bet == 'l') l += datas[i].money;
            if (datas[i].bet == 'n') n += datas[i].money;
        }
        ns = n0 + n1 + n2 + n3 + n4 + n5 + n6 + n7 + n8 + n9;
        $('.orderRed').text(formatMoney(red, ','));
        $('.orderViolet').text(formatMoney(violet, ','));
        $('.orderGreen').text(formatMoney(green, ','));
        $('.orderNumber:eq(0)').text(formatMoney(n0, ','));
        $('.orderNumber:eq(1)').text(formatMoney(n1, ','));
        $('.orderNumber:eq(2)').text(formatMoney(n2, ','));
        $('.orderNumber:eq(3)').text(formatMoney(n3, ','));
        $('.orderNumber:eq(4)').text(formatMoney(n4, ','));
        $('.orderNumber:eq(5)').text(formatMoney(n5, ','));
        $('.orderNumber:eq(6)').text(formatMoney(n6, ','));
        $('.orderNumber:eq(7)').text(formatMoney(n7, ','));
        $('.orderNumber:eq(8)').text(formatMoney(n8, ','));
        $('.orderNumber:eq(9)').text(formatMoney(n9, ','));
        $('.orderNumber:eq(10)').text(formatMoney(l, ','));
        $('.orderNumber:eq(11)').text(formatMoney(n, ','));
        $('.orderNumbers').text(formatMoney(ns, ','));

        $('.orderRed').attr('totalmoney', red);
        $('.orderViolet').attr('totalmoney', violet);
        $('.orderGreen').attr('totalmoney', green);
        $('.orderNumber:eq(0)').attr('totalmoney', n0);
        $('.orderNumber:eq(1)').attr('totalmoney', n1);
        $('.orderNumber:eq(2)').attr('totalmoney', n2);
        $('.orderNumber:eq(3)').attr('totalmoney', n3);
        $('.orderNumber:eq(4)').attr('totalmoney', n4);
        $('.orderNumber:eq(5)').attr('totalmoney', n5);
        $('.orderNumber:eq(6)').attr('totalmoney', n6);
        $('.orderNumber:eq(7)').attr('totalmoney', n7);
        $('.orderNumber:eq(8)').attr('totalmoney', n8);
        $('.orderNumber:eq(9)').attr('totalmoney', n9);
        $('.orderNumber:eq(10)').attr('totalmoney', l);
        $('.orderNumber:eq(11)').attr('totalmoney', n);
        $('.orderNumbers').attr('totalmoney', ns);

        response.datas.map((data) => {
            showJoinMember(data);
        });
        showListOrder3(response.list_orders);
        $(".direct-chat-warning .direct-chat-messages").animate({
            scrollTop: $(".direct-chat-msg").prop("scrollHeight")
        }, 750);
        $('.reservation-chunk-sub-num').text(response.lotterys[0].period);
        let is = ''
        if (typeid == '1') is = $('#ketQua').text(`Next Result: ${(response.setting[0].wingo1 == '-1') ? 'Random' : response.setting[0].wingo1}`);
        if (typeid == '2') is = $('#ketQua').text(`Next Result: ${(response.setting[0].wingo3 == '-1') ? 'Random' : response.setting[0].wingo3}`);
        if (typeid == '3') is = $('#ketQua').text(`Next Result: ${(response.setting[0].wingo5 == '-1') ? 'Random' : response.setting[0].wingo5}`);
        if (typeid == '4') is = $('#ketQua').text(`Next Result: ${(response.setting[0].wingo10 == '-1') ? 'Random' : response.setting[0].wingo10}`);

        if (typeid == '1') $('#winrate').text(`Next Result: ${(response.setting[0].bs1 == '-1') ? 'Random' : response.setting[0].bs1}`);
        if (typeid == '2') $('#winrate').text(`Next Result: ${(response.setting[0].bs3 == '-1') ? 'Random' : response.setting[0].bs3}`);
        if (typeid == '3') $('#winrate').text(`Next Result: ${(response.setting[0].bs5 == '-1') ? 'Random' : response.setting[0].bs5}`);
        if (typeid == '4') $('#winrate').text(`Next Result: ${(response.setting[0].bs10 == '-1') ? 'Random' : response.setting[0].bs10}`);
    }
});

$('.start-order').click(function (e) {
    e.preventDefault();
    let value = $('#editResult').val(); 
    let arr = value.split('|');
    for (let i = 0; i < arr.length; i++) {
        let check = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(String(arr[i]));
        if (arr[i] == "" || arr[i].length > 1 || !check) {
            alert("Please enter the correct format (e.g., 1|4|5|1|5)");
            return false;
        }
    }
    if (value != '') {
        $.ajax({
            type: "POST",
            url: "/api/webapi/admin/change",
            data: {
                type: 'change-wingo1',
                value: value,
                typeid: typeid,
            },
            dataType: "json",
            success: function (response) {
                Swal.fire(
                    'Good job!',
                    `${response.message}`,
                    'success'
                );
                $('#ketQua').text(`Next Result: ${value}`);
            }
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
        })
    }
});

// $('.editWinRate').click(function (e) {
//     e.preventDefault();
//     let value = $('#editWinRate').val();
//     let arr = value.split('|');
//     for (let i = 0; i < arr.length; i++) {
//         if (arr[i] == "" || arr[i].length > 1 || arr[i] != 0 && arr[i] != '1') {
//             alert("Vui lòng nhập đúng định dạng (VD: 1|0|0|1|1)");
//             return false;
//         }
//     }
//     if (value != '') {
//         $.ajax({
//             type: "POST",
//             url: "/api/webapi/admin/change",
//             data: {
//                 type: 'change-win_rate',
//                 value: value,
//                 typeid: typeid,
//             },
//             dataType: "json",
//             success: function (response) {
//                 Swal.fire(
//                     'Good job!',
//                     `${response.message}`,
//                     'success'
//                 );
//                 $('#ketQua').text(`Next Result: ${value}`);
//             }
//         });
//     } else {
//         Swal.fire({
//             icon: 'error',
//             title: 'Oops...',
//             text: 'Something went wrong!',
//         })
//     }
// });