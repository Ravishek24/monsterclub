let socket = io();
var pageno = 0;
var limit = 10;
var page = 1;
socket.on("data-server-5d", function (msg) {
    console.log(msg.chane);
    if (msg) {
        let checkData = $('html').attr('data-dpr');
        if (checkData == msg.game) {
            pageno = 0;
            limit = 10;
            page = 1;
            let notResult = msg.data[0];
            let Result = msg.data[1];
            let check = $('#number_result').attr('data-select');
            if (check == 'all') {
                reload_money();
                callListOrder();
                animationNewPar(Result.result);
            } else {
                reload_money();
                showMeJoin();
                animationNewPar(Result.result);
            }

            handleMyEmerdList()
            $('#period').text(notResult.period);
            $("#previous").addClass("block-click");
            $("#previous").removeClass("action");
            $("#previous .van-icon-arrow").css("color", "#7f7f7f");
            $("#next").removeClass("block-click");
            $("#next").addClass("action");
            $("#next .van-icon-arrow").css("color", "#fff");
        }
    }
});

const issetVolume = localStorage.getItem('volume');
if (issetVolume == null) {
    localStorage.setItem('volume', 'on');
}

if (issetVolume == 'on') {
    $('.item-volume').attr('src', '/images/volume-up-line.webp');
} else if (issetVolume == 'off') {
    $('.item-volume').attr('src', '/images/volume-off-outline.webp');
} else {
    localStorage.setItem('volume', 'on');
}

function animationNewPar(data) {
    let arr = String(data).split('');
    $('.transform0, .transform1, .transform2, .transform3, .transform4, .transform5').addClass('slot-scroll');
    setTimeout(() => {
        for (let i = 0; i < 5; i++) {
            let random = Math.floor(Math.random() * 10);
            $(`.transform${i} .slot-num:eq(0)`).text(random);
            random = Math.floor(Math.random() * 10);
            $(`.transform${i} .slot-num:eq(1)`).text(random);
            $(`.transform${i} .slot-num:eq(2)`).text(arr[i]);
        }
        $('.transform0').removeClass('slot-scroll');
        setTimeout(() => {
            $('.transform1, .transform2, .transform3, .transform4, .transform5').removeClass('slot-scroll');
            showResultNow(data);
        }, 100);
    }, 2500);
}

function alertMess(text, sic) {
    $('body').append(
        `
        <div data-v-1dcba851="" class="msg">
            <div data-v-1dcba851="" class="msg-content v-enter-active v-enter-to" style=""> ${text} </div>
        </div>
        `
    );
    setTimeout(() => {
        $('.msg .msg-content').removeClass('v-enter-active v-enter-to');
        $('.msg .msg-content').addClass('v-leave-active v-leave-to');
        setTimeout(() => {
            $('.msg').remove();
        }, 100);
    }, 1000);
}

function ShowListOrder(list_orders) {
    if (list_orders.length == 0) {
        return $(`#list_order`).html(
            `
            <div data-v-a9660e98="" class="van-empty">
                <div class="van-empty__image">
                    <img src="/images/empty-image-default.png" />
                </div>
                <p class="van-empty__description">No Data</p>
            </div>
            `
        );
    }
    let htmls = "";
    let result = list_orders.map((list_orders) => {
        let arr = list_orders.result.split('');
        let resultData = ``;
        let total = 0;

        for (let i = 0; i < arr.length; i++) {
            total += Number(arr[i]);
            resultData += `
          <div data-v-42f27458="" class="li circle-black c-row c-row-middle-center c-tc">
              <div data-v-42f27458="">${arr[i]}</div>
          </div>
        `;
        }

        return (htmls += `
        <div data-v-42f27458="" class="c-tc item van-row">
          <div data-v-42f27458="" class="van-col van-col--8">
            <div data-v-42f27458="" class="c-tc goItem">${list_orders.period}</div>
          </div>
          <div data-v-42f27458="" class="van-col van-col--12">
            <div data-v-42f27458="" class="c-row">
              <div data-v-42f27458="" class="c-row qiu c-row-middle-center">
                ${resultData}
              </div>
            </div>
          </div>
          <div data-v-42f27458="" class="van-col van-col--4">
            <div data-v-42f27458="" class="c-row c-row-middle-center"><span data-v-42f27458=""
                class="li action c-row c-row-middle-center c-tc">${total}</span></div>
          </div>
        </div>
      `);
    });
    $(`#list_order`).html(htmls);
}

function showResultNow(data) {
    let arr = String(data).split('');
    let total = 0;
    for (let i = 0; i < arr.length; i++) {
        total += Number(arr[i]);
        $(`.round-num:eq(${i}) .fade-item`).text(arr[i]);
        let random = Math.floor(Math.random() * 10);
        $(`.transform${i} .slot-num:eq(0)`).text(random);
        random = Math.floor(Math.random() * 10);
        $(`.transform${i} .slot-num:eq(1)`).text(random);
        $(`.transform${i} .slot-num:eq(2)`).text(arr[i]);
    }
    $(".round-num #total_r").text(total);
}
function callListOrder() {
    $.ajax({
        type: "POST",
        url: "/api/webapi/5d/GetNoaverageEmerdList",
        data: {
            gameJoin: $('html').attr('data-dpr'),
            pageno: "0",
            pageto: "10",
        },
        dataType: "json",
        success: function (response) {
            let list_orders = response.data.gameslist;
            $("#period").text(response.period);
            $("#number_result").text("1/" + response.page);
            ShowListOrder(list_orders);
            if (list_orders.length != 0) {
                showResultNow(list_orders[0].result);
            }
            $('.Loading').fadeOut(0);

            // Check if we have a recent game result to show popup (IMMEDIATE)
            if (list_orders.length > 0) {
                // Get the user's bet history to check for recent bets
                $.ajax({
                    type: "POST",
                    url: "/api/webapi/5d/GetMyEmerdList",
                    data: {
                        gameJoin: $('html').attr('data-dpr'),
                        pageno: "0",
                        pageto: "10",
                    },
                    dataType: "json",
                    success: function (betResponse) {
                        let betData = betResponse.data.gameslist;
                        
                        if (betData && betData.length > 0) {
                            let firstGame = betData[0];
                            
                            // Check if the firstGame period matches any recent result
                            let shouldShowPopup = false;
                            let matchingResult = null;
                            
                            // Only check the MOST RECENT result to avoid multiple popups
                            if (list_orders.length > 0 && firstGame.stage == list_orders[0].period) {
                                shouldShowPopup = true;
                                matchingResult = list_orders[0];
                            }
                            
                            if (shouldShowPopup && matchingResult) {
                                // Create stable unique key for this specific game result (without timestamp)
                                let popupKey = `popup_${firstGame.stage}_${firstGame.get}_${firstGame.money}`;
                                
                                // Only show if we haven't shown this popup before
                                if (!sessionStorage.getItem(popupKey)) {
                                    console.log('5D showing IMMEDIATE popup for:', popupKey);
                                    
                                    // Mark this popup as shown
                                    sessionStorage.setItem(popupKey, 'true');
                                    
                                    // Set flag to prevent other popups
                                    popupCurrentlyShowing = true;
                                    
                                    var modal = document.getElementById("myModal");
                                    if (modal) {
                                        modal.style.display = "block";
                                        var myModalheader = document.getElementById("myModal_header");
                                        var myModal_result = document.getElementById("myModal_result");
                                        var lottery_result = document.getElementById("lottery_result");
                                        var loss_image = document.getElementById("loss-img");
                                        var myModal_result_Period = document.getElementById("myModal_result_Period");
                                        
                                        if (firstGame.get == 0) {
                                            loss_image.src="/assets/png/missningLBg-ca049a47.png";
                                            myModalheader.innerHTML = "Sorry";
                                            myModal_result.innerHTML = "LOSS ";
                                        } else {
                                            loss_image.src="/assets/png/missningBg-c1f02bcd.png";
                                            myModalheader.innerHTML = "Congratulations";
                                            myModal_result.innerHTML = "WIN :" + firstGame.get;
                                        }
                                        myModal_result_Period.innerHTML = "Period : 5D " + firstGame.stage;
                                        
                                        let color;
                                        let type;

                                        if (matchingResult.result >= 0 && matchingResult.result <= 4) {
                                            type = "Small";
                                        } else if (matchingResult.result >= 5 && matchingResult.result <= 9) {
                                            type = "Big";
                                        }

                                        if (matchingResult.result == 0) {
                                            color = "Red + Violet";
                                        } else if (matchingResult.result == 5) {
                                            color = "Green + Violet";
                                        } else if (matchingResult.result % 2 == 0) {
                                            color = "Red";
                                        } else {
                                            color = "Green";
                                        }

                                        lottery_result.innerHTML = "Lottery Result:<span class='btn-boox'>" + color + "</span><span class='btn-boox'>" + matchingResult.result + "</span><span class='btn-boox'>" + type + "</span>";
                                        
                                        // Auto-hide popup after 5 seconds and reset flag
                                        setTimeout(() => {
                                            if (modal) {
                                                modal.style.display = "none";
                                            }
                                            // Reset the flag to allow new popups
                                            popupCurrentlyShowing = false;
                                            console.log('5D immediate popup closed, flag reset');
                                        }, 5000);
                                    } else {
                                        // If modal doesn't exist, reset flag anyway
                                        popupCurrentlyShowing = false;
                                    }
                                } else {
                                    console.log('5D immediate popup already shown for this result:', popupKey);
                                }
                            }
                        }
                    }
                });
            }
        },
    });
}

callListOrder();

$('#GetNoaverageEmerdList').click(function (e) {
    e.preventDefault();
    pageno = 0;
    limit = 10;
    page = 1;
    $('.Loading').fadeIn(0);
    $('#GetMyEmerdList').removeClass('block-click');
    $('#GetMyEmerdList').find('.txt').removeClass('action');
    $(this).addClass('block-click');
    $(this).find('.txt').addClass('action');
    $("#all").fadeIn(0);
    $('#number_result').attr('data-select', 'all');
    $("#me").fadeOut(0);
    callListOrder();
    $("#previous").addClass("block-click");
    $("#previous").removeClass("action");
    $("#previous .van-icon-arrow").css("color", "#7f7f7f");
    $("#next").removeClass("block-click");
    $("#next").addClass("action");
    $("#next .van-icon-arrow").css("color", "#fff");
});

$('.van-notice-bar__wrap .van-notice-bar__content').css({
    'transition-duration': '48.34s',
    'transform': 'translateX(-3417px)',
});
setInterval(() => {
    $('.van-notice-bar__wrap .van-notice-bar__content').css({
        'transition-duration': '0s',
        'transform': 'translateX(0)',
    });
    setTimeout(() => {
        $('.van-notice-bar__wrap .van-notice-bar__content').css({
            'transition-duration': '48.34s',
            'transform': 'translateX(-3417px)',
        });
    }, 100);
}, 48000);

function downAndHidden() {
    $('.van-overlay').fadeOut();
    $('#box-join').css('transform', 'translateY(1000px)');
    $('body').removeClass('van-overflow-hidden');
    $('.0-9 .bet-num-line .bet-box-num').removeClass('active');
    $('.small-big .bet-type-btn').attr('class', 'bet-type-btn flex-row-between');
    $('#result').attr('list-join', '');
    $('#result').attr('value', '1000');
    $('#plus-minus .minus').removeClass('action');
    $('#value-join').val(1);
    $('.amount-box .li').removeClass('action');
    $('.amount-box .li:eq(0)').addClass('action');
    $('.multiple-box .li').removeClass('action');
    $('.multiple-box .li:eq(0)').addClass('action');
    $('.supportss').fadeOut();
}

function reload_money() {
    fetch("/api/webapi/GetUserInfo")
        .then((response) => response.json())
        .then((data) => {
            if (data.status === false) {
                unsetCookie();
                return false;
            }
            $(".num span").text(`₹ ${data.data.money_user}.00 `);
            $('.Loading').fadeOut(0);
        });
}
reload_money();

$('#reload_money').click(async function (e) {
    e.preventDefault();
    $('.Loading').fadeIn(0);
    $(this).addClass('block-click action');
    await reload_money();
    setTimeout(() => {
        $('#reload_money').removeClass('block-click action');
    }, 2500);
});

let checkWidth = $('#app').width();
$('html').css('font-size', `${checkWidth / 10}px`);
$(window).resize(() => {
    let checkWidth = $('#app').width();
    $('html').css('font-size', `${checkWidth / 10}px`);
});

var audio1 = new Audio("/audio/di1.da40b233.mp3");
var audio2 = new Audio("/audio/di2.317de251.mp3");

var clicked = false;

function openAudio() {
    audio1.muted = true;
    audio1.play();
    audio2.muted = true;
    audio2.play();
}

$("body").click(function (e) {
    e.preventDefault();
    if (clicked) return;
    openAudio();
    clicked = true;
});

function playAudio1() {
    audio1.muted = false;
    audio1.play();
}

function playAudio2() {
    audio2.muted = false;
    audio2.play();
}

function cownDownTimer() {
    let countDownDate = new Date("2030-07-16T23:59:59.9999999+01:00").getTime();
    setInterval(function () {
        let now = new Date().getTime();
        let distance = countDownDate - now;
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        let checkData = Number($('html').attr('data-dpr'));
        let minute = Math.ceil(minutes % checkData);
        let seconds1 = Math.floor((distance % (1000 * 60)) / 10000);
        let seconds2 = Math.floor(((distance % (1000 * 60)) / 1000) % 10);
        $(".flex-row-end .li-item:eq(1)").text(minute);
        $(".flex-row-end .li-item:eq(2)").text(seconds1);
        $(".flex-row-end .li-item:eq(3)").text(seconds2);

        if (minute == 0 && seconds1 == 0 && seconds2 <= 5) {
            $('.minH .mark-box').show();
            $('.minH .mark-box .item:eq(1)').text(seconds2);

            downAndHidden();
        }
        if (minute >= 0 && seconds1 >= 1 && seconds2 <= 9) {
            $('.minH .mark-box').hide();
        }
    }, 0);
    setInterval(function () {
        let now = new Date().getTime();
        let distance = countDownDate - now;
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let checkData = Number($('html').attr('data-dpr'));
        let minute = Math.ceil(minutes % checkData);
        let seconds1 = Math.floor((distance % (1000 * 60)) / 10000);
        let seconds2 = Math.floor(((distance % (1000 * 60)) / 1000) % 10);
        const check_volume = localStorage.getItem('volume');

        if (minute == 0 && seconds1 == 0 && seconds2 <= 5) {
            if (clicked) {
                if (check_volume == 'on') {
                    playAudio1();
                }
            }
        }

        if (minute == (checkData - 1) && seconds1 == 5 && seconds2 >= 9) {
            if (clicked) {
                if (check_volume == 'on') {
                    playAudio2();
                }
            }
        }
    }, 1000);
}

cownDownTimer();

$('.item-volume').click(function (e) {
    e.preventDefault();
    const check_volume = localStorage.getItem('volume');
    if (check_volume == 'on') {
        $(this).attr('src', '/images/volume-off-outline.webp');
        localStorage.setItem('volume', 'off');
    } else {
        $(this).attr('src', '/images/volume-up-line.webp');
        localStorage.setItem('volume', 'on');
    }
});

function result() {
    let join = $('#result').attr('list-join').split('');
    let value = $('#result').attr('value');
    let amount = $('#value-join').val();

    let result = join.length * Number(value) * Number(amount);
    if (result <= 0) {
        result = 1000;
    }
    $("#total").html(result + '.00');
}

$('.van-overlay, .canned-alert').click(function (e) {
    e.preventDefault();
    downAndHidden();
});
$('.0-9 .bet-num-line').click(function (e) {
    e.preventDefault();
    let info = $(this).attr('txt');
    let list = $('#result').attr('list-join');
    let checkClass = $(this).find('.bet-box-num').hasClass('active');

    let checkList = Number(list);
    if (isNaN(checkList)) {
        $('#result').attr('list-join', '');
        list = $('#result').attr('list-join');
    }

    if (checkClass) {
        let newList = list.replace(info, '');
        $('#result').attr('list-join', newList);
        result();
        return $(`.0-9 .bet-num-line[txt=${info}] .bet-box-num`).removeClass('active');
    }
    $(`.0-9 .bet-num-line[txt=${info}] .bet-box-num`).addClass('active');
    $('.small-big .bet-type-btn').attr('class', 'bet-type-btn flex-row-between');

    $('#result').attr('list-join', list += info);
    result();
});

$('.select-number-0-9').click(function (e) {
    e.preventDefault();
    $('.van-overlay').fadeIn();
    $('#box-join').css('transform', 'translateY(0px)');
    $('body').addClass('van-overflow-hidden');
});

$('.small-big .bet-type-btn').click(function (e) {

    e.preventDefault();
    let info = $(this).attr('data-join');
    $('.van-overlay').fadeIn();
    $('#box-join').css('transform', 'translateY(0px)');
    $('body').addClass('van-overflow-hidden');
    $(`.small-big .bet-type-btn`).attr('class', 'bet-type-btn flex-row-between');
    $(`.small-big .bet-type-btn[data-join=${info}]`).addClass(info);
    $('.0-9 .bet-num-line .bet-box-num').removeClass('active');

    let join = $(this).attr('join');
    $('#result').attr('list-join', join);
    result();
});

$('.a-b-c-d-e .d5-bet-type').click(function (e) {
    e.preventDefault();
    let info = $(this).attr('data-join');
    $(`.a-b-c-d-e .d5-bet-type`).removeClass('active');
    $(`.a-b-c-d-e .d5-bet-type[data-join=${info}]`).addClass('active');
    $('#result').attr('join', info);
    if (info == 'total') {
        $('.0-9').hide();
        let check = Number($('#result').attr('list-join'));
        if (!isNaN(check)) {
            $('#result').attr('list-join', '');
            $('.0-9 .bet-num-line .bet-box-num').removeClass('active');
        }
    } else {
        $('.0-9').show();
    }
});

$('.amount-box .li').click(function (e) {

    e.preventDefault();
    let value = $(this).attr('value');
    $('#result').attr('value', value);
    $('.amount-box .li').removeClass('action');
    $(this).addClass('action');
    result();
});

$('.multiple-box .li').click(function (e) {

    e.preventDefault();
    let value = $(this).attr('amount');
    $('#value-join').val(value);
    $('.multiple-box .li').removeClass('action');
    $(this).addClass('action');
    $('#plus-minus .minus').addClass('action');
    result();
});

$('#plus-minus .minus').click(function (e) {

    e.preventDefault();
    let value = Number($('#value-join').val());
    if (value <= 1) {
        $('.multiple-box .li:eq(0)').addClass('action');
        $('#plus-minus .minus').removeClass('action');
        result();
        return false;
    };
    $('#value-join').val(value -= 1);
    value = Number($('#value-join').val());
    if (value <= 1) {
        $('.multiple-box .li:eq(0)').addClass('action');
        $('#plus-minus .minus').removeClass('action');
        result();
        return false;
    };
    value = Number($('#value-join').val());
    if (value <= 1) {
        $('#plus-minus .minus').removeClass('action');
        return false;
    };
    $(`.multiple-box .li`).removeClass('action');
    $(`.multiple-box .li[amount=${value}]`).addClass('action');
    result();
});
$('#plus-minus .plus').click(function (e) {

    e.preventDefault();
    let value = Number($('#value-join').val());
    $('#value-join').val(value += 1);
    $(`.multiple-box .li`).removeClass('action');
    $(`.multiple-box .li[amount=${value}]`).addClass('action');

    $('#plus-minus .minus').addClass('action');
    result();
});
$('#value-join').on("input", function () {
    let value = Number($(this).val());
    if (value > 1) {
        $('#plus-minus .minus').addClass('action');
    } else {
        $('#plus-minus .minus').removeClass('action');
    }
    $(`.multiple-box .li`).removeClass('action');
    $(`.multiple-box .li[amount=${value}]`).addClass('action');
    result();
});

$('.foot .right').click(function (e) {
    e.preventDefault();
    let join = $('#result').attr('join'); // loại ? vd: abcde total
    let list_join = $('#result').attr('list-join'); // bet to
    let value = $('#result').attr('value'); // money
    let x = $('#value-join').val().trim(); // x
    let game = $('html').attr('data-dpr');

    $('.Loading').fadeIn(0);
    $('.foot .right').addClass('block-click');
    $.ajax({
        type: "POST",
        url: "/api/webapi/action/5d/join",
        data: {
            join: join,
            list_join: list_join,
            money: value,
            x: x,
            game: game,
        },
        dataType: "json",
        success: function (response) {
            $('.Loading').fadeOut(0);
            let chane = response.change;
            socket.emit('data-server-5', { chane, join, list_join, money: value, x, game });
            alertMess(response.message);
            setTimeout(() => {
                downAndHidden();
                $('.foot .right').removeClass('block-click');
            }, 500);
            if (response.status == true) {
                $('#money_show').text("₹ " + response.money + '.00');
                showMeJoin();
            }
        }
    });
});

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


function isNumber(params) {
    let pattern = /^[0-9]*\d$/;
    return pattern.test(params);
}
function GetMyEmerdList(datas) {
    if (datas.length == 0) {
        return $(`#showJoinMe`).html(
            `
        <div data-v-a9660e98="" class="van-empty">
            <div class="van-empty__image">
                <img src="/images/empty-image-default.png" />
            </div>
            <p class="van-empty__description">No Data</p>
        </div>
        `
        );
    }
    let htmls = "";
    let result = datas.map((data) => {
        let arr = data.result.split('');
        let resultData = ``;
        let total = 0;

        for (let i = 0; i < arr.length; i++) {
            total += Number(arr[i]);
            resultData += `
          <div data-v-42f27458="" class="li circle-black">${arr[i]}</div>
        `;
        }

        let join = '';
        let arr2 = data.bet.split('');
        for (let i = 0; i < arr2.length; i++) {
            let check = isNumber(data.bet);
            if (check) {
                join += `
          <div data-v-42f27458="">
              <span data-v-42f27458="" style="color: rgb(0, 0, 0);">
                <span data-v-42f27458="" class="li circle-black" style="color: rgb(0, 0, 0);">${arr2[i]}</span>  
              </span>
          </div>`;
            } else {
                join += `
          <div data-v-42f27458="">
            <span data-v-42f27458="" style="color: rgb(0, 0, 0);">${(arr2[i] == 'c') ? "Even" : (arr2[i] == 'l') ? 'Odd' : (arr2[i] == 'b') ? 'Big' : 'Small'}</span>
          </div>
          `;
            }
        }

        return (htmls += `
      <div data-v-42f27458="" issuenumber="${data.id_product}" addtime="${timerJoin(data.time)}" rowid="1" class="hb">
          <div data-v-42f27458="" class="item c-row">
              <div data-v-42f27458="" class="c-row c-row-between info">
                  <div data-v-42f27458="">
                      <div data-v-42f27458="" class="issueName">
                        ${data.stage} 
                        <span data-v-42f27458="" class="state ${(data.status == 1) ? 'green' : 'red'}"" 
                        style="display: ${(data.status == 0) ? 'none' : ''};">${(data.status == 1) ? 'Success' : 'Fail'}</span>
                          <!---->
                      </div>
                      <div data-v-42f27458="" class="tiem">${timerJoin(data.time)}</div>
                  </div>
                  <div data-v-42f27458="" class="money" style="display: ${(data.status == 0) ? 'none' : ''}">
                      <span data-v-42f27458="" class="${(data.status == 1) ? 'success' : 'fail'}"> ${(data.status == 1) ? '+' : '-'} ${(data.status == 1) ? data.get : data.price}.00 </span>
                      <!---->
                  </div>
              </div>
          </div>
          <div data-v-42f27458="" class="details display-none">
              <div data-v-42f27458="" class="tit">Details</div>
              <div data-v-42f27458="" class="detailLi c-row c-row-between c-row-middle">
                  <div data-v-42f27458="">Order Number</div>
                  <div data-v-42f27458="" class="tag-read c-row c-row-between c-row-middle">
                      ${data.id_product}
                      <img data-v-42f27458="" data-clipboard-text="${data.id_product}" width="18px" height="15px" src="/images/copy.png" class="m-l-5 copy-to-img" />
                  </div>
              </div>
              <div data-v-42f27458="" class="detailLi c-row c-row-between c-row-middle">
                  <div data-v-42f27458="">Periods</div>
                  <div data-v-42f27458="">${data.stage}</div>
              </div>
              <div data-v-42f27458="" class="detailLi c-row c-row-between c-row-middle">
                  <div data-v-42f27458="">Spent Amount</div>
                  <div data-v-42f27458="">${data.money}.00</div>
              </div>
              <div data-v-42f27458="" class="detailLi c-row c-row-between c-row-middle">
                  <div data-v-42f27458="">Quantity Purchased</div>
                  <div data-v-42f27458="">${data.amount}</div>
              </div>
              <div data-v-42f27458="" class="detailLi c-row c-row-between c-row-middle">
                  <div data-v-42f27458="">After Tax Amount</div>
                  <div data-v-42f27458="" class="red">${data.price}.00</div>
              </div>
              <div data-v-42f27458="" class="detailLi c-row c-row-between c-row-middle">
                  <div data-v-42f27458="">Tax</div>
                  <div data-v-42f27458="">${data.fee}.00</div>
              </div>
              <div data-v-42f27458="" class="detailLi c-row c-row-between c-row-middle">
                  <div data-v-42f27458="">Opening Price</div>
                  <div data-v-42f27458="" style="display: ${(data.status == 0) ? 'none' : ''};">${data.result}</div>
              </div>
              <div data-v-42f27458="" class="detailLi c-row c-row-between c-row-middle">
                  <div data-v-42f27458="">Results</div>
                  <div data-v-42f27458="" class="c-row" style="display: ${(data.status == 0) ? 'none' : ''};">
                    ${resultData}
                  </div>
              </div>
              <div data-v-42f27458="" class="detailLi c-row c-row-between c-row-middle">
                  <div data-v-42f27458="">Choose</div>
                  <div data-v-42f27458="" class="c-row c-row-middle">
                      <div data-v-42f27458="" class="c-row m-r-5">
                          <div data-v-42f27458="">${(data.join_bet == 'total') ? "SUM" : data.join_bet.toUpperCase()}</div>
                      </div>
                      ${join}
                  </div>
              </div>
              <div data-v-42f27458="" class="detailLi c-row c-row-between c-row-middle">
                  <div data-v-42f27458="">Status</div>
                  <div data-v-42f27458="" class="${(data.status == 1) ? 'green' : 'red'}" style="display: ${(data.status == 0) ? 'none' : ''};">${(data.status == 1) ? 'Success' : 'Fail'}</div>
                  <!---->
              </div>
              <div data-v-42f27458="" class="detailLi c-row c-row-between c-row-middle">
                  <div data-v-42f27458="">Win Or Loss</div>
                  <div data-v-42f27458="" class="${(data.status == 1) ? 'green' : 'red'}" style="display: ${(data.status == 0) ? 'none' : ''};">${(data.status == 1) ? '+' : '-'} ${(data.status == 1) ? data.get : data.price}.00</div>
                  <!---->
              </div>
              <div data-v-42f27458="" class="detailLi c-row c-row-between c-row-middle">
                  <div data-v-42f27458="">Purchase Time</div>
                  <div data-v-42f27458="">${timerJoin(data.time)}</div>
              </div>
          </div>
      </div>
      `);
    });
    $(`#showJoinMe`).html(htmls);
}

function callAjaxMeJoin() {
    $.ajax({
        type: "POST",
        url: "/api/webapi/5d/GetMyEmerdList",
        data: {
            gameJoin: $('html').attr('data-dpr'),
            pageno: "0",
            pageto: "10",
        },
        dataType: "json",
        success: function (response) {
            let data = response.data.gameslist;
            $("#number_result").text("1/" + response.page);
            GetMyEmerdList(data);
            $('.Loading').fadeOut(0);
        },
    });
}

function handleMyEmerdList() {
    $.ajax({
        type: "POST",
        url: "/api/webapi/5d/GetMyEmerdList",
        data: {
            gameJoin: $('html').attr('data-dpr'),
            pageno: "0",
            pageto: "10",
        },
        dataType: "json",
        success: function (response) {
            let data = response.data.gameslist;
            $("#number_result").text("1/" + response.page);
            GetMyEmerdList(data);
            $('.Loading').fadeOut(0);
        },
    });
}


async function showMeJoin() {
    await callAjaxMeJoin();
    setTimeout(() => {
        $('#showJoinMe .hb').click(function (e) {
            e.preventDefault();
            $(this).find('.details').toggleClass("display-none");
        });

        $('.copy-to-img').click(function (e) {
            e.preventDefault();
            var copyText = $(this).attr('data-clipboard-text');
            navigator.clipboard.writeText(copyText);
            alertMess('Copy successful');
        });
    }, 500);
}

var pageno = 0;
var limit = 10;
var page = 1;
$('#GetMyEmerdList').click(function (e) {
    e.preventDefault();
    pageno = 0;
    limit = 10;
    page = 1;
    $('.Loading').fadeIn(0);
    $('#GetNoaverageEmerdList').removeClass('block-click');
    $('#GetNoaverageEmerdList').find('.txt').removeClass('action');
    $(this).addClass('block-click');
    $(this).find('.txt').addClass('action');
    $("#all").fadeOut(0);
    $("#me").fadeIn(0);
    $('#number_result').attr('data-select', 'me');
    showMeJoin();
    $("#previous").addClass("block-click");
    $("#previous").removeClass("action");
    $("#previous .van-icon-arrow").css("color", "#7f7f7f");
    $("#next").removeClass("block-click");
    $("#next").addClass("action");
    $("#next .van-icon-arrow").css("color", "#fff");
});


var pageno = 0;
var limit = 10;
var page = 1;
$("#next").click(function (e) {
    e.preventDefault();
    let check = $('#number_result').attr('data-select');
    $('.Loading').fadeIn(0);
    $("#previous").removeClass("block-click");
    $("#previous").addClass("action");
    $("#previous .van-icon-arrow-left").css("color", "#fff");
    pageno += 10;
    let pageto = limit;
    let url = '';
    if (check == 'all') {
        url = "/api/webapi/5d/GetNoaverageEmerdList";
    } else {
        url = "/api/webapi/5d/GetMyEmerdList";
    }
    $.ajax({
        type: "POST",
        url: url,
        data: {
            gameJoin: $('html').attr('data-dpr'),
            pageno: pageno,
            pageto: pageto,
        },
        dataType: "json",
        success: async function (response) {
            $('.Loading').fadeOut(0);
            if (response.status === false) {
                pageno -= 10;
                $("#next").addClass("block-click");
                $("#next").removeClass("action");
                $("#next .van-icon-arrow").css("color", "#7f7f7f");
                alertMess(response.msg);
                return false;
            }
            let list_orders = response.data.gameslist;
            $("#period").text(response.period);
            $("#number_result").text(++page + "/" + response.page);
            if (check == 'all') {
                ShowListOrder(list_orders);
            } else {
                await GetMyEmerdList(list_orders);
                setTimeout(() => {
                    $('#showJoinMe .hb').click(function (e) {
                        e.preventDefault();
                        $(this).find('.details').toggleClass("display-none");
                    });

                    $('.copy-to-img').click(function (e) {
                        e.preventDefault();
                        var copyText = $(this).attr('data-clipboard-text');
                        navigator.clipboard.writeText(copyText);
                        alertMess('Copy successful');
                    });
                }, 500);
            }
        },
    });
});
$("#previous").click(function (e) {
    e.preventDefault();
    let check = $('#number_result').attr('data-select');
    $('.Loading').fadeIn(0);
    $("#next").removeClass("block-click");
    $("#next").addClass("action");
    $("#next .van-icon-arrow").css("color", "#fff");
    pageno -= 10;
    let pageto = limit;
    let url = '';
    if (check == 'all') {
        url = "/api/webapi/5d/GetNoaverageEmerdList";
    } else {
        url = "/api/webapi/5d/GetMyEmerdList";
    }
    $.ajax({
        type: "POST",
        url: url,
        data: {
            gameJoin: $('html').attr('data-dpr'),
            pageno: pageno,
            pageto: pageto,
        },
        dataType: "json",
        success: async function (response) {
            $('.Loading').fadeOut(0);
            if (page - 1 < 2) {
                $("#previous").addClass("block-click");
                $("#previous").removeClass("action");
                $("#previous .van-icon-arrow-left").css("color", "#7f7f7f");
            }
            if (response.status === false) {
                pageno = 0;
                $("#previous .arr:eq(0)").addClass("block-click");
                $("#previous .arr:eq(0)").removeClass("action");
                $("#previous .van-icon-arrow-left").css("color", "#7f7f7f");
                alertMess(response.msg);
                return false;
            }
            let list_orders = response.data.gameslist;
            $("#period").text(response.period);
            $("#number_result").text(--page + "/" + response.page);
            if (check == 'all') {
                ShowListOrder(list_orders);
            } else {
                await GetMyEmerdList(list_orders);
                setTimeout(() => {
                    $('#showJoinMe .hb').click(function (e) {
                        e.preventDefault();
                        $(this).find('.details').toggleClass("display-none");
                    });

                    $('.copy-to-img').click(function (e) {
                        e.preventDefault();
                        var copyText = $(this).attr('data-clipboard-text');
                        navigator.clipboard.writeText(copyText);
                        alertMess('Copy Successfull');
                    });
                }, 500);
            }
        },
    });
});

$('.circular, #quytacs').click(function (e) {
    e.preventDefault();
    $('.supportss').fadeIn();
    $('.van-overlay').fadeIn();
    $('body').addClass('van-overflow-hidden');
});

$('.submit-support').click(function (e) {
    e.preventDefault();
    downAndHidden();
});

$('#game-join .item').click(async function (e) {
    e.preventDefault();
    let game = $(this).attr('game');
    $('html').attr('data-dpr', game);
    $('.Loading').fadeIn(0);
    await callListOrder();
    await showMeJoin();

    // $('.Loading').fadeOut(0);
    $('.minH .mark-box').hide();

    let actionOld = $('#game-join').find('.action');
    actionOld.find('.img .van-image:eq(0)').fadeOut(0);
    actionOld.find('.img .van-image:eq(1)').fadeIn(0);
    actionOld.removeClass('action block-click');

    $(this).addClass('action block-click');
    $(this).find('.img .van-image:eq(0)').fadeIn(0);
    $(this).find('.img .van-image:eq(1)').fadeOut(0);
});

// Global flag to prevent multiple popups
let popupCurrentlyShowing = false;

// Function to show win/loss popup
function showWinLossPopup(gameData, resultData, duration) {
    var modal = document.getElementById("myModal");
    if (modal) {
        modal.style.display = "block";
        var myModalheader = document.getElementById("myModal_header");
        var myModal_result = document.getElementById("myModal_result");
        var lottery_result = document.getElementById("lottery_result");
        var loss_image = document.getElementById("loss-img");
        var myModal_result_Period = document.getElementById("myModal_result_Period");
        
        if (gameData.get == 0) {
            loss_image.src="/assets/png/missningLBg-ca049a47.png";
            myModalheader.innerHTML = "Sorry";
            myModal_result.innerHTML = "LOSS ";
        } else {
            loss_image.src="/assets/png/missningBg-c1f02bcd.png";
            myModalheader.innerHTML = "Congratulations";
            myModal_result.innerHTML = "WIN :" + gameData.get;
        }
        myModal_result_Period.innerHTML = "Period : " + duration + " " + gameData.stage;
        
        let color;
        let type;

        if (resultData.result >= 0 && resultData.result <= 4) {
            type = "Small";
        } else if (resultData.result >= 5 && resultData.result <= 9) {
            type = "Big";
        }

        if (resultData.result == 0) {
            color = "Red + Violet";
        } else if (resultData.result == 5) {
            color = "Green + Violet";
        } else if (resultData.result % 2 == 0) {
            color = "Red";
        } else {
            color = "Green";
        }

        lottery_result.innerHTML = "Lottery Result:<span class='btn-boox'>" + color + "</span><span class='btn-boox'>" + resultData.result + "</span><span class='btn-boox'>" + type + "</span>";
        
        // Auto-hide popup after 5 seconds and reset flag
        setTimeout(() => {
            if (modal) {
                modal.style.display = "none";
            }
            // Reset the flag to allow new popups
            popupCurrentlyShowing = false;
            console.log('5D popup closed, flag reset');
        }, 5000);
    } else {
        // If modal doesn't exist, reset flag anyway
        popupCurrentlyShowing = false;
        console.log('5D modal not found, flag reset');
    }
}

// Function to clear popup history when user places a new bet
function clearPopupHistory() {
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
        if (key.startsWith('popup_')) {
            sessionStorage.removeItem(key);
        }
    });
    // Reset the popup flag
    popupCurrentlyShowing = false;
    console.log('5D popup history cleared and flag reset');
}

// Add periodic check for new results and popups
function checkForNewResults() {
    // Don't check if popup is currently showing
    if (popupCurrentlyShowing) {
        console.log('5D popup currently showing, skipping check');
        return;
    }
    
    $.ajax({
        type: "POST",
        url: "/api/webapi/5d/GetMyEmerdList",
        data: {
            gameJoin: $('html').attr('data-dpr'),
            pageno: "0",
            pageto: "5",
        },
        dataType: "json",
        success: function(response) {
            let data = response.data.gameslist;
            if (data && data.length > 0) {
                let mostRecentGame = data[0];
                
                // Only show popup if this is a very recent game (within last 30 seconds)
                let gameTime = new Date(mostRecentGame.time || Date.now()).getTime();
                let currentTime = Date.now();
                let timeDiff = currentTime - gameTime;
                
                // Create a unique key for this specific game result with timestamp
                let popupKey = `popup_${mostRecentGame.stage}_${mostRecentGame.get}_${mostRecentGame.money}_${gameTime}`;
                
                console.log('5D checking popup for:', {
                    stage: mostRecentGame.stage,
                    get: mostRecentGame.get,
                    money: mostRecentGame.money,
                    timeDiff: timeDiff,
                    popupKey: popupKey,
                    alreadyShown: sessionStorage.getItem(popupKey)
                });
                
                // If game is very recent (within 30 seconds) and we haven't shown popup for this specific result
                if (timeDiff < 30000 && mostRecentGame.stage && !sessionStorage.getItem(popupKey)) {
                    console.log('5D showing popup for:', popupKey);
                    
                    // Mark this specific popup as shown
                    sessionStorage.setItem(popupKey, 'true');
                    
                    // Set flag to prevent other popups
                    popupCurrentlyShowing = true;
                    
                    // Get the result for this period
                    $.ajax({
                        type: "POST",
                        url: "/api/webapi/5d/GetNoaverageEmerdList",
                        data: {
                            gameJoin: $('html').attr('data-dpr'),
                            pageno: "0",
                            pageto: "10",
                        },
                        dataType: "json",
                        success: function(resultResponse) {
                            let list_orders = resultResponse.data.gameslist;
                            let matchingResult = null;
                            
                            // Find the matching result
                            for (let i = 0; i < list_orders.length; i++) {
                                if (list_orders[i].period == mostRecentGame.stage) {
                                    matchingResult = list_orders[i];
                                    break;
                                }
                            }
                            
                            if (matchingResult) {
                                showWinLossPopup(mostRecentGame, matchingResult, "5D");
                            }
                        }
                    });
                } else {
                    console.log('5D skipping popup - already shown or too old');
                }
            }
        }
    });
}

// Start periodic checks for 5D popups
setInterval(checkForNewResults, 5000); // Check every 5 seconds

// Clear popup history when placing new bets
$('.confirm').click(function() {
    clearPopupHistory();
});

