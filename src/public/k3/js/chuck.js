socket.on("data-server-k3", function (msg) {
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
                RenderResult(Result.result);
            } else {
                reload_money();
                callAjaxMeJoin();
                RenderResult(Result.result);
            }
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

function ShowListOrder(list_orders) {
    if (list_orders.length == 0) {
        return $(`#list_order`).html(
            `
            <div data-v-a9660e98="" class="van-empty">
                <div class="van-empty__image">
                    <img src="/images/empty-image-default.png" />
                </div>
                <p class="van-empty__description">No data</p>
            </div>
            `
        );
    }
    let htmls = "";
    let result = list_orders.map((list_orders) => {
        let total = String(list_orders.result).split('');
        let total2 = 0;
        for (let i = 0; i < total.length; i++) {
            total2 += Number(total[i]);
        }

        let html2 = '';
        for (let i = 0; i < total.length; i++) {
            html2 += `
                <div data-v-03b808c2="" class="li img${total[i]}"></div>
            `;
        }

        return (htmls += `
            <div data-v-03b808c2="" class="c-tc item van-row">
                <div data-v-03b808c2="" class="van-col van-col--6">
                    <div data-v-03b808c2="" class="c-tc goItem lh">${list_orders.period}</div>
                </div>
                <div data-v-03b808c2="" class="van-col van-col--4">
                    <div data-v-03b808c2="" class="c-tc goItem lh"> ${total2} </div>
                </div>
                <div data-v-03b808c2="" class="van-col van-col--5">
                    <div data-v-03b808c2="" class="c-tc goItem lh">
                        <div data-v-03b808c2="">${(total2 >= 3 && total2 <= 10) ? "Small" : "Big"}</div>
                    </div>
                </div>
                <div data-v-03b808c2="" class="van-col van-col--4">
                    <div data-v-03b808c2="" class="c-tc goItem lh">
                        <div data-v-03b808c2="">${(total2 % 2 == 0) ? "Even" : "Odd"}</div>
                    </div>
                </div>
                <div data-v-03b808c2="" class="van-col van-col--5">
                    <div data-v-03b808c2="" class="goItem c-row c-tc c-row-between c-row-middle">
                        ${html2}
                    </div>
                </div>
            </div>
        `);
    });
    $(`#list_order`).html(htmls);
}

function formateT(params) {
    let result = (params < 10) ? "0" + params : params;
    return result;
}

function timerJoin(params = '') {
    let date = '';
    if (params) {
        date = new Date(Number(params));
    } else {
        date = new Date();
    }
    let years = formateT(date.getFullYear());
    let months = formateT(date.getMonth() + 1);
    let days = formateT(date.getDate());

    let hours = formateT(date.getHours());
    let minutes = formateT(date.getMinutes());
    let seconds = formateT(date.getSeconds());
    return years + '-' + months + '-' + days + ' ' + hours + ':' + minutes + ':' + seconds;
}

function GetMyEmerdList(list_orders) {
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
    let result = list_orders.map((list_order) => {
        return (htmls += `
            <div data-v-03b808c2="">
                <div data-v-03b808c2="" class="item c-row">
                    <div data-v-03b808c2="" class="c-row c-row-between c-row-middle info">
                        <div data-v-03b808c2="">
                            <div data-v-03b808c2="" class="issueName">
                                ${list_order.stage}
                                <!---->
                                <span data-v-03b808c2="" class="state ${(list_order.status == 1) ? 'green' : 'red'} ${(list_order.status == 0) ? 'd-none' : ''}">${(list_order.status == 1) ? 'Success' : 'Failure'}</span>
                            </div>
                            <div data-v-03b808c2="" class="tiem">${timerJoin(list_order.time)}</div>
                        </div>
                        <div data-v-03b808c2="" class="money ${(list_order.status == 0) ? 'd-none' : ''}">
                            <!---->
                            <span data-v-03b808c2="" class="${(list_order.status == 1) ? 'success' : 'fail'}"> ${(list_order.status == 1) ? '+' : '-'}${(list_order.status == 1) ? list_order.get : list_order.price}.00 </span>
                        </div>
                    </div>
                </div>
                <!---->
            </div>    
        `);
    });
    $(`#list_order`).html(htmls);
}

function callListOrder() {
    $.ajax({
        type: "POST",
        url: "/api/webapi/k3/GetNoaverageEmerdList",
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
            $('.Loading').fadeOut(0);
            let result = String(list_orders[0].result).split('');
            $('.slot-transform:eq(0) .slot-num').attr('class', `slot-num bg${result[0]}`);
            $('.slot-transform:eq(1) .slot-num').attr('class', `slot-num bg${result[1]}`);
            $('.slot-transform:eq(2) .slot-num').attr('class', `slot-num bg${result[2]}`);

            // Check if we have a recent game result to show popup (IMMEDIATE)
            if (list_orders.length > 0) {
                // Get the user's bet history to check for recent bets
                $.ajax({
                    type: "POST",
                    url: "/api/webapi/k3/GetMyEmerdList",
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
                                    console.log('K3 showing IMMEDIATE popup for:', popupKey);
                                    
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
                                        myModal_result_Period.innerHTML = "Period : K3 " + firstGame.stage;
                                        
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
                                            console.log('K3 immediate popup closed, flag reset');
                                        }, 5000);
                                    } else {
                                        // If modal doesn't exist, reset flag anyway
                                        popupCurrentlyShowing = false;
                                    }
                                } else {
                                    console.log('K3 immediate popup already shown for this result:', popupKey);
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

function callAjaxMeJoin() {
    $.ajax({
        type: "POST",
        url: "/api/webapi/k3/GetMyEmerdList",
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


$('#history').click(function (e) { 
    e.preventDefault();
    callListOrder();
    $('.header-history').removeClass('d-none');
    $(this).addClass('block-click action');
    $('#myBet').removeClass('block-click action');
    $('#number_result').attr('data-select', 'all');
    pageno = 0;
    limit = 10;
    page = 1;
    $("#next").removeClass("block-click");
    $("#next").addClass("action");
    $("#next .van-icon-arrow").css("color", "#fff");
    $("#previous").addClass("block-click");
    $("#previous").removeClass("action");
    $("#previous .van-icon-arrow-left").css("color", "#7f7f7f");
});

$('#myBet').click(function (e) { 
    e.preventDefault();
    callAjaxMeJoin();
    $('.header-history').addClass('d-none');
    $(this).addClass('block-click action');
    $('#history').removeClass('block-click action');
    $('#number_result').attr('data-select', 'mybet');
    pageno = 0;
    limit = 10;
    page = 1;
    $("#next").removeClass("block-click");
    $("#next").addClass("action");
    $("#next .van-icon-arrow").css("color", "#fff");
    $("#previous").addClass("block-click");
    $("#previous").removeClass("action");
    $("#previous .van-icon-arrow-left").css("color", "#7f7f7f");
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
        url = "/api/webapi/k3/GetNoaverageEmerdList";
    } else {
        url = "/api/webapi/k3/GetMyEmerdList";
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
                GetMyEmerdList(list_orders);
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
        url = "/api/webapi/k3/GetNoaverageEmerdList";
    } else {
        url = "/api/webapi/k3/GetMyEmerdList";
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
                GetMyEmerdList(list_orders);
            }
        },
    });
});
