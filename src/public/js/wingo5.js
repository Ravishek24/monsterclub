function showListOrder3(list_orders, x) {
    if (list_orders.length == 0) {
      return $(`.game-list .con-box:eq(${x}) .hb`).html(
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
      return (htmls += `
                      <div data-v-a9660e98="" class="c-tc item van-row">
                          <div data-v-a9660e98="" class="van-col van-col--8">
                              <div data-v-a9660e98="" class="c-tc goItem">${
                                list_orders.period
                              }</div>
                          </div>
                          <div data-v-a9660e98="" class="van-col van-col--5">
                              <div data-v-a9660e98="" class="c-tc goItem">
                                  <!---->
                                  <span data-v-a9660e98="" class="${
                                    list_orders.amount % 2 == 0 ? "red" : "green"
                                  }"> ${list_orders.amount} </span>
                              </div>
                          </div>
                          <div data-v-a9660e98="" class="van-col van-col--5">
                              <div data-v-a9660e98="" class="c-tc goItem">
                                  <span data-v-a9660e98=""> ${
                                    list_orders.amount < 5 ? "Small" : "Big"
                                  } </span>
                                  <!---->
                              </div>
                          </div>
                          <div data-v-a9660e98="" class="van-col van-col--6">
                              <div data-v-a9660e98="" class="goItem c-row c-tc c-row-center">
                                  <div data-v-a9660e98="" class="c-tc c-row box c-row-center">
                                      <span data-v-a9660e98="" class="li ${
                                        list_orders.amount % 2 == 0
                                          ? "red"
                                          : "green"
                                      }"></span>
                                      ${
                                        list_orders.amount == 0 ||
                                        list_orders.amount == 5
                                          ? '<span data-v-a9660e98="" class="li violet"></span>'
                                          : ""
                                      }
                                  </div>
                              </div>
                          </div>
                      </div>
                      `);
    });
    $(`.game-list .con-box:eq(${x}) .hb`).prepend(htmls);
    $(`.game-list .con-box:eq(${x}) .hb .c-tc`).last().remove();
  }
  var socket = io();
  var pageno = 0;
  var limit = 10;
  var page = 1;
  socket.on("data-server", function (msg) {
    if(msg.data[0].game != 'wingo5') return;
    $(".Loading").fadeIn(0);
    setTimeout(() => {
      let data1 = msg.data[0]; // lấy ra cầu mới nhất
      let data2 = []; // lấy ra cầu cũ
      let data3 = data2.push(msg.data[1]);
      $(".time-box .out .numbers").text(data1.period);
      showListOrder3(data2, 0);
      pageno = 0;
      limit = 10;
      page = 1;
      $(".game-list .con-box:eq(0) .page-nav .arr:eq(0)").addClass("block-click");
      $(".game-list .con-box:eq(0) .page-nav .arr:eq(0)").removeClass("action");
      $(".game-list .con-box:eq(0) .page-nav .van-icon-arrow-left").css(
        "color",
        "#7f7f7f"
      );
      $(".game-list .con-box:eq(0) .page-nav .arr:eq(1)").removeClass(
        "block-click"
      );
      $(".game-list .con-box:eq(0) .page-nav .arr:eq(1)").addClass("action");
      $(".game-list .con-box:eq(0) .page-nav .van-icon-arrow-right").css(
        "color",
        "#fff"
      );
  
      $(".game-list .con-box:eq(1) .page-nav .arr:eq(0)").addClass("block-click");
      $(".game-list .con-box:eq(1) .page-nav .arr:eq(0)").removeClass("action");
      $(".game-list .con-box:eq(1) .page-nav .van-icon-arrow-left").css(
        "color",
        "#7f7f7f"
      );
      $(".game-list .con-box:eq(1) .page-nav .arr:eq(1)").removeClass(
        "block-click"
      );
      $(".game-list .con-box:eq(1) .page-nav .arr:eq(1)").addClass("action");
      $(".game-list .con-box:eq(1) .page-nav .van-icon-arrow-right").css(
        "color",
        "#fff"
      );
      var firstGame;

$.ajax({
    type: "POST",
    url: "/api/webapi/GetMyEmerdList",
    data: {
        typeid: "5",
        pageno: "0",
        pageto: "10",
        language: "vi",
    },
    dataType: "json",
    success: function(response) {
        let data = response.data.gameslist;
        $(".game-list .con-box:eq(1) .page-nav .number").text(
            "1/" + (response.page ? response.page : '1')
        );

        // Set the value of firstGame to the first game in the gameslist
        firstGame = data[0];

        var lastGame = data[data.length - 1];
        console.log(firstGame);
        showListOrder2(data, 1);

        // Nested AJAX call
        $.ajax({
            type: "POST",
            url: "/api/webapi/GetNoaverageEmerdList",
            data: {
                typeid: "5",
                pageno: "0",
                pageto: "10",
                language: "vi",
            },
            dataType: "json",
            success: function(response) {
    let list_orders = response.data.gameslist;
    $(".time-box .out .numbers").text(response.period);
    $(".game-list .con-box:eq(0) .page-nav .number").text("1/" + response.page);

    // Check if we have a recent game result to show popup (IMMEDIATE)
    if (firstGame && list_orders.length > 0) {
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
                console.log('Showing IMMEDIATE popup for:', popupKey);
                
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
                    myModal_result_Period.innerHTML = "Period : 3min " + firstGame.stage;
                    
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
                        console.log('Immediate popup closed, flag reset');
                    }, 5000);
                } else {
                    // If modal doesn't exist, reset flag anyway
                    popupCurrentlyShowing = false;
                }
            } else {
                console.log('Immediate popup already shown for this result:', popupKey);
            }
        }
    }
    showListOrder(list_orders, 0);
    showListOrder_t(list_orders, 2);
},

        });
    },
});
      fetch("/api/webapi/GetUserInfo")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === false) {
          unsetCookie();
          return false;
        }
        $(".num span").text(`${data.data.money_user}`);
      });
      $(".Loading").fadeOut(0);
    }, 1000);
  });
  // $('body').click(function (e) {
  //     e.preventDefault();
  //     socket.emit('data-server', {
  //         name: 'Longdz',
  //     });
  // });
  
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
  
  fetch("/api/webapi/GetUserInfo")
    .then((response) => response.json())
    .then((data) => {
      if (data.status === false) {
        unsetCookie();
        return false;
      }
      $(".num span").text(`₹ ${data.data.money_user}`);
    });
  $(".reload_money").click(function (e) {
    e.preventDefault();
    $(this).addClass("action block-click");
    setTimeout(() => {
      $(this).removeClass("action block-click");
    }, 3000);
    fetch("/api/webapi/GetUserInfo")
    .then((response) => response.json())
    .then((data) => {
      if (data.status === false) {
        unsetCookie();
        return false;
      }
      $(".num span").text(`₹ ${data.data.money_user}`);
    });
  });
  $(".van-overlay, .foot .left").click(function (e) {
    e.preventDefault();
    $(".van-overlay").fadeOut();
    $('.van-popup-vf').fadeOut(100);
    $(".popup-join").css("transform", "translateY(600px)");
    $(".betting-mark .amount-box .li, .multiple-box .li").css({
      "background-color": "rgb(240, 240, 240)",
      color: "rgb(0, 0, 0)",
    });
    $(".betting-mark .amount-box .li:eq(0), .multiple-box .li:eq(0)").css({
      "background-color": "rgb(240, 240, 240)",
      color: "rgb(255, 255, 255)",
    });
    $(".stepper-box .digit-box input").val(1);
    $(".amount-box").attr("data-money", "1");
    $(".foot .right span:eq(1)").text(1000 + "");
  });
  
  function xlad(x, color) {
    $(".multiple-box .li").css({
      "background-color": "rgb(240, 240, 240)",
      color: "rgb(0, 0, 0)",
    });
    $(`.multiple-box .li:eq(${x})`).css({
      "background-color": `${color}`,
      color: "rgb(255, 255, 255)",
    });
  }
  
  function selectX(x, color) {
    switch (String(x)) {
      case "1":
        xlad(0, color);
        break;
      case "5":
        xlad(1, color);
        break;
      case "10":
        xlad(2, color);
        break;
      case "20":
        xlad(3, color);
        break;
      case "50":
        xlad(4, color);
        break;
      case "100":
        xlad(5, color);
        break;
      default:
        $(".multiple-box .li").css({
          "background-color": "rgb(240, 240, 240)",
          color: "rgb(0, 0, 0)",
        });
        break;
    }
  }
  
  $(".stepper-box .plus").click(function (e) {
    e.preventDefault();
    let color = $(".foot .right").attr("style").split(":");
    color = color[1].split(";")[0].trim();
    let value = $(".stepper-box .digit-box input").val().trim();
    value = Number(value) + 1;
    selectX(value, color);
    if (value > 1) {
      $(".stepper-box .minus").css({
        "background-color": `${color}`,
        color: "#fff",
      });
    } else {
      $(".stepper-box .minus").css({
        "background-color": "rgb(240, 240, 240)",
        color: "rgb(200, 201, 204)",
      });
    }
    $(".stepper-box .digit-box input").val(value);
    totalMoney();
  });
  
  $(".stepper-box .digit-box input").on("input", function () {
    let value = $(this).val();
    let color = $(".foot .right").attr("style").split(":");
    color = color[1].split(";")[0].trim();
    // if (!value)  $(this).val(1);
    value = $(this).val();
    if (value <= 1) {
      $(".stepper-box .minus").css({
        "background-color": "rgb(240, 240, 240)",
        color: "rgb(200, 201, 204)",
      });
    } else if (value) {
      $(".stepper-box .minus").css({
        "background-color": `${color}`,
        color: "rgb(200, 201, 204)",
      });
    }
    selectX(value, color);
    totalMoney();
  });
  
  $(".stepper-box .minus").click(function (e) {
    e.preventDefault();
    let color = $(".foot .right").attr("style").split(":");
    color = color[1].split(";")[0].trim();
    let value = $(".stepper-box .digit-box input").val().trim();
    value = Number(value) - 1;
    if (value <= 0) return;
    selectX(value, color);
    if (value == 1) {
      $(".stepper-box .minus").css({
        "background-color": "rgb(240, 240, 240)",
        color: "rgb(200, 201, 204)",
      });
    }
    $(".stepper-box .digit-box input").val(value);
    totalMoney();
  });
  
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  
  function selectCss(color, bg, text) {
    $(".betting-mark").attr("class", "betting-mark");
    $(".color").css("color", bg);
    $(".color .p-l-10").text(text);
    $(".betting-mark").addClass(color);
    $(".amount-box .li:eq(0)").css("background-color", bg);
    $(".plus").css("background-color", bg);
    $(".multiple-box .li:eq(0)").css("background-color", bg);
    $(".foot .right").css("background-color", bg);
  }
  
  function totalMoney() {
    let value = $(".stepper-box .digit-box input").val().trim();
    let money = $(".amount-box").attr("data-money");
    let total = value * money;
    $(".foot .right span:eq(1)").text(total + "");
  }
  
  function alertBox(join, addText) {
    $(".foot .right").attr("data-join", join);
    switch (join) {
      case "x":
        selectCss("colorgreen", "rgb(92, 186, 71)", addText);
        break;
      case "t":
        selectCss("colorviolet", "rgb(152, 49, 233)", addText);
        break;
      case "d":
        selectCss("colorred", "rgb(251, 78, 78)", addText);
        break;
      case "l":
        selectCss("colorbig", "rgb(255, 168, 46)", addText);
        break;
      case "n":
        selectCss("colorsmall", "rgb(109, 167, 244)", addText);
        break;
      default:
        if (join % 2 == 0) {
          selectCss(`color${join}`, "rgb(251, 78, 78)", addText);
        } else {
          selectCss(`color${join}`, "rgb(92, 186, 71)", addText);
        }
        break;
    }
    $(".van-overlay").fadeIn();
    $(".popup-join").fadeIn();
    $(".stepper-box .minus").css({
      "background-color": "rgb(240, 240, 240)",
      color: "rgb(200, 201, 204)",
    });
    $(".popup-join").css("transform", "translateY(1px)");
    let active = $(".random-box .c-row .active").attr("data-x");
    let color = $(".foot .right").attr("style").split(":");
    color = color[1].split(";")[0].trim();
    $(".stepper-box input").val(active);
    totalMoney();
    selectX(active, color);
    if (active <= 1) {
      $(".stepper-box .minus").css({
        "background-color": "rgb(240, 240, 240)",
        color: "rgb(200, 201, 204)",
      });
    } else {
      $(".stepper-box .minus").css({
        "background-color": `${color}`,
        color: "rgb(255, 255, 255)",
      });
    }
  }
  
  $(".popup-join .info .txt").click(function (e) {
    e.preventDefault();
    $(".popup-qt").fadeIn();
  });
  
  $(".betting-mark .amount-box .li").click(function (e) {
    e.preventDefault();
    let color = $(".foot .right").attr("style").split(":");
    color = color[1].split(";")[0].trim();
    $(".betting-mark .amount-box .li").css({
      "background-color": "rgb(240, 240, 240)",
      color: "rgb(0, 0, 0)",
    });
  
    $(this).css({
      "background-color": `${color}`,
      color: "rgb(255, 255, 255)",
    });
    let thisValue = $(this).attr("data-x");
    $(".amount-box").attr("data-money", thisValue);
    totalMoney();
  });
  $(".multiple-box .li").click(function (e) {
    e.preventDefault();
    let color = $(".foot .right").attr("style").split(":");
    color = color[1].split(";")[0].trim();
    $(".multiple-box .li").css({
      "background-color": "rgb(240, 240, 240)",
      color: "rgb(0, 0, 0)",
    });
    $(this).css({
      "background-color": `${color}`,
      color: "rgb(255, 255, 255)",
    });
    let x = $(this).attr("data-x");
    if (x > 1) {
      $(".stepper-box .minus").css({
        "background-color": `${color}`,
        color: "#fff",
      });
    } else {
      $(".stepper-box .minus").css({
        "background-color": "rgb(240, 240, 240)",
        color: "rgb(200, 201, 204)",
      });
    }
    $(".stepper-box .digit-box input").val(x);
    totalMoney();
  });
  
  $(".popup-qt .van-button").click(function (e) {
    e.preventDefault();
    $(".popup-qt").fadeOut();
  });
  
  $(".con-box button").click(function (e) {
    e.preventDefault();
    let addTop = $(this).attr("data-join"); // Green - do - tim (x - d - t)
    let addText = $(this).text(); // Green - do - tim
    alertBox(addTop, addText);
  });
  $(".number-box button").click(function (e) {
    e.preventDefault();
    let addTop = $(this).text().trim(); // Green - do - tim (x - d - t)
    let addText = $(this).text(); // Green - do - tim
    alertBox(addTop, addText);
  });
  $(".btn-box button").click(function (e) {
    e.preventDefault();
    let addTop = $(this).attr("data-join"); // Green - do - tim (x - d - t)
    let addText = $(this).text(); // Green - do - tim
    alertBox(addTop, addText);
  });
  
  $(".random-box .c-row .item").click(function (e) {
    e.preventDefault();
    $(".random-box .c-row .item").css({
      "background-color": "rgb(240, 240, 240)",
      color: "rgb(0, 0, 0)",
    });
  
    $(this).css({
      "background-color": "rgb(92, 186, 71)",
      color: "rgb(255, 255, 255)",
    });
    $(".random-box .c-row .item").removeClass("active");
    $(this).addClass("active");
  });
  
  $(".random").click(async function (e) {
    e.preventDefault();
    let random = 0;
    for (let i = 0; i < 55; i++) {
      random = Math.floor(Math.random() * 10);
      $(".number-box button").removeClass("action");
      $(`.number-box button:eq(${random})`).addClass("action");
      await sleep(50);
    }
    $(".van-overlay").fadeIn();
    $(".popup-join").fadeIn();
    $(".popup-join").css("transform", "translateY(1px)");
    alertBox(random, random);
  });
  $(".game-list .tab .li:eq(0)").click(function (e) {
    e.preventDefault();
    $(".game-list .con-box").css("display", "none");
    $(".game-list .li .txt").removeClass("action");
    $(".game-list .li .txt:eq(0)").addClass("action");
    $(".game-list .li").removeClass("block-click");
    $(this).addClass("block-click");
    $(".game-list .con-box:eq(0)").css("display", "block");
    $.ajax({
      type: "POST",
      url: "/api/webapi/GetNoaverageEmerdList",
      data: {
        typeid: "5",
        pageno: "0",
        pageto: "10",
        language: "vi",
      },
      dataType: "json",
      success: function (response) {
        let list_orders = response.data.gameslist;
        $(".time-box .out .numbers").text(response.period);
        $(".page-nav .number").text("1/" + response.page);
        $(".game-list .con-box:eq(0) .page-nav .number").text(
          "1/" + response.page
        );
        showListOrder(list_orders, 0);
      },
    });
  });
  $(".game-list .tab .li:eq(1)").click(function (e) {
    e.preventDefault();
    $(".game-list .con-box").css("display", "none");
    $(".game-list .li .txt").removeClass("action");
    $(".game-list .li .txt:eq(1)").addClass("action");
    $(".game-list .li").removeClass("block-click");
    $(this).addClass("block-click");
    $(".game-list .con-box:eq(1)").css("display", "block");
    $.ajax({
      type: "POST",
      url: "/api/webapi/GetMyEmerdList",
      data: {
        typeid: "5",
        pageno: "0",
        pageto: "10",
        language: "vi",
      },
      dataType: "json",
      success: function (response) {
        let data = response.data.gameslist;
        $(".game-list .con-box:eq(1) .page-nav .number").text(
          "1/" + `${(response.page) ? response.page : '1'}`
        );
        showListOrder2(data, 1);
      },
    });
    setTimeout(() => {
      let check = true;
      $("#history-order .item").click(function(e) {
        e.preventDefault();
        let parent = $(this).parent();
        // let show = parent.children();
        let myVar = parent.find(".details");
        if (check) {
          check = false;
          myVar.fadeIn(0);
        } else {
          check = true;
          myVar.fadeOut(0);
        }
      });
    }, 1000);
  });
  $(".game-list .tab .li:eq(2)").click(function (e) {
  e.preventDefault();
  $(".game-list .con-box").css("display", "none");
  $(".game-list .li .txt").removeClass("action");
  $(".game-list .li .txt:eq(2)").addClass("action");
  $(".game-list .li").removeClass("block-click");
  $(this).addClass("block-click");
  $(".game-list .con-box:eq(2)").css("display", "block");
  $.ajax({
    type: "POST",
    url: "/api/webapi/GetNoaverageEmerdList",
    data: {
      typeid: "5",
      pageno: "0",
      pageto: "10",
      language: "vi",
    },
    dataType: "json",
    success: function (response) {
      let list_orders = response.data.gameslist;
      $(".time-box .out .numbers").text(response.period);
      $(".page-nav .number").text("1/" + response.page);
      $(".game-list .con-box:eq(2) .page-nav .number").text(
        "1/" + response.page
      );
      showListOrder_t(list_orders, 2);
      
    },
  });
});
  
  function alertMessJoin(msg) {
    $("body").append(
      `
                  <div data-v-1dcba851="" class="msg">
                      <div data-v-1dcba851="" class="msg-content v-enter-active v-enter-to" style=""> ${msg} </div>
                  </div>
                  `
    );
    setTimeout(() => {
      $(".msg .msg-content").removeClass("v-enter-active v-enter-to");
      $(".msg .msg-content").addClass("v-leave-active v-leave-to");
      setTimeout(() => {
        $("body .msg").remove();
      }, 500);
    }, 1000);
  }
  $(".foot .right").click(function (e) {
    e.preventDefault();
    let join = $(this).attr("data-join");
    let x = $(".stepper-box input").val().trim();
    let money = $(".amount-box").attr("data-money");
    if (!join || !x || !money) {
      return;
    }
    
    // Clear popup history when placing a new bet
    clearPopupHistory();
    
    $(this).addClass("block-click");
    $.ajax({
      type: "POST",
      url: "/api/webapi/action/join",
      data: {
        typeid: "5",
        join: join,
        x: x,
        money: money,
      },
      dataType: "json",
      success: function (response) {
        alertMessJoin(response.message);
        if (response.status === false) return;
        $("#history-order").prepend(response.data);
        $(".total-box .num span").text("₹ " + response.money + ".00");
        socket.emit('data-server_2', { money: x * money, join, time: Date.now(), change: response.change });
      },
    });

    setTimeout(() => {
      $(".van-overlay").fadeOut();
      $(".popup-join").css("transform", "translateY(600px)");
      $(".betting-mark .amount-box .li, .multiple-box .li").css({
        "background-color": "rgb(240, 240, 240)",
        color: "rgb(0, 0, 0)",
      });
      $(".betting-mark .amount-box .li:eq(0), .multiple-box .li:eq(0)").css({
        "background-color": "rgb(240, 240, 240)",
        color: "rgb(255, 255, 255)",
      });
      $(".stepper-box .digit-box input").val(1);
      $(".amount-box").attr("data-money", "1");
      $(".foot .right span:eq(1)").text(1000 + "");
      $(".foot .right").removeClass("block-click");
    }, 500);
  });
  
  function showListOrder(list_orders, x) {
    if (list_orders.length == 0) {
      return $(`.game-list .con-box:eq(${x}) .hb`).html(
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
      return (htmls += `
                      <div data-v-a9660e98="" class="c-tc item van-row">
                          <div data-v-a9660e98="" class="van-col van-col--8">
                              <div data-v-a9660e98="" class="c-tc goItem">${
                                list_orders.period
                              }</div>
                          </div>
                          <div data-v-a9660e98="" class="van-col van-col--5">
                              <div data-v-a9660e98="" class="c-tc goItem">
                                  <!---->
                                  <span data-v-a9660e98="" class="${
                                    list_orders.amount % 2 == 0 ? "red" : "green"
                                  }"> ${list_orders.amount} </span>
                              </div>
                          </div>
                          <div data-v-a9660e98="" class="van-col van-col--5">
                              <div data-v-a9660e98="" class="c-tc goItem">
                                  <span data-v-a9660e98=""> ${
                                    list_orders.amount < 5 ? "Small" : "Big"
                                  } </span>
                                  <!---->
                              </div>
                          </div>
                          <div data-v-a9660e98="" class="van-col van-col--6">
                              <div data-v-a9660e98="" class="goItem c-row c-tc c-row-center">
                                  <div data-v-a9660e98="" class="c-tc c-row box c-row-center">
                                      <span data-v-a9660e98="" class="li ${
                                        list_orders.amount % 2 == 0
                                          ? "red"
                                          : "green"
                                      }"></span>
                                      ${
                                        list_orders.amount == 0 ||
                                        list_orders.amount == 5
                                          ? '<span data-v-a9660e98="" class="li violet"></span>'
                                          : ""
                                      }
                                  </div>
                              </div>
                          </div>
                      </div>
                      `);
    });
    $(`.game-list .con-box:eq(${x}) .hb`).html(htmls);
  }
  
  function showListOrder_t(list_orders, x) {
  if (list_orders.length == 0) {
    return $(`.game-list .con-box:eq(${x}) .hb`).html(
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
  
  let amounts = list_orders.map((order) => order.amount);
  let labels = list_orders.map((order) => order.period % 100);
  

  htmls = `
    <style>
      canvas {
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        transform: rotate(360deg);
        transform-origin: center;
        
      }
    </style>
  
   <canvas id="graphCanvas" width="380" height="400"></canvas>
   
    <script>
    labels1 = ${JSON.stringify(labels)};
    amounts1 = [${amounts.join(', ')}];
    labels1.reverse();
    amounts1.reverse();
    
    data = {
      labels: labels1,
      values: amounts1
    };

       canvas = document.getElementById('graphCanvas');
   ctx = canvas.getContext('2d');

  function createGradient(value, ctx, x, y, prevX, prevY) {
    gradient = ctx.createLinearGradient(prevX, prevY, x, y);
    if (value === 0) {
      gradient.addColorStop(0, 'rgba(149,2,156,1)');
      gradient.addColorStop(0.35, 'rgba(121,9,111,1)');
      gradient.addColorStop(1, 'rgba(1,255,0,1)');
    } else if (value === 5) {
      gradient.addColorStop(0, 'rgba(149,2,156,1)');
      gradient.addColorStop(0.35, 'rgba(121,9,111,1)');
      gradient.addColorStop(1, 'rgba(255,0,14,1)');
    }
    return gradient;
  }

  function plotGraph(data) {
     padding = 50;
     spaceBetween = (canvas.width - padding * 2) / (data.values.length - 1);
    
    ctx.font = '14px Arial';
    ctx.lineWidth = 2;

    // Draw the Y axis labels
    for (let i = 0; i <= 9; i++) {
      ctx.fillText(9 - i, padding - 30, padding + i * (canvas.height - padding * 2) / 9);
    }

    data.values.forEach((value, index) => {
       x = padding + index * spaceBetween;
       y = padding + (9 - value) * (canvas.height - padding * 2) / 9;

      if (index > 0) {
         prevX = padding + (index - 1) * spaceBetween;
         prevY = padding + (9 - data.values[index - 1]) * (canvas.height - padding * 2) / 9;
        
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        
        if (value === 0 || value === 5) {
          ctx.strokeStyle = createGradient(value, ctx, x, y, prevX, prevY);
        } else {
          ctx.strokeStyle = getColorForValue(value);
        }
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = getColorForValue(value);
      ctx.fill();

      ctx.fillText(data.labels[index], x - ctx.measureText(data.labels[index]).width / 2, canvas.height - padding + 20);
    });
  }

  function getColorForValue(value) {
    switch (value) {
      case 1:
      case 3:
      case 7:
      case 9: return 'green';
      case 2:
      case 4:
      case 6:
      case 8: return 'red';
     
      default: return '#000'; // default color
    }
  }

  plotGraph(data);
    </script>
  `;
  
    const $targetDiv = $(`.game-list .con-box:eq(${x}) .hb`);
    $targetDiv.empty();
    $targetDiv.html(htmls);
}
  const isNumber = (params) => {
    let pattern = /^[0-9]*\d$/;
    return pattern.test(params);
  };
  
  function showListOrder2(list_orders, x) {
    if (list_orders.length == 0) {
      return $(`.game-list .con-box:eq(${x}) #history-order`).html(
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
    let i = -1;
    let result = list_orders.map((list_orders) => {
      i++;
      let join = list_orders.bet;
      let color = "";
      if (join == "l") {
        color = "big";
      } else if (join == "n") {
        color = "small";
      } else if (join == "t") {
        color = "violet";
      } else if (join == "d") {
        color = "red";
      } else if (join == "x") {
        color = "green";
      } else if (join == "0") {
        color = "red-violet";
      } else if (join == "5") {
        color = "green-violet";
      } else if (Number(join) % 2 == 0) {
        color = "red";
      } else if (Number(join) % 2 != 0) {
        color = "green";
      }
      if ((!isNumber(join) && join == "l") || join == "n") {
        checkJoin = `
                      <div data-v-a9660e98="" class="van-image" style="width: 30px; height: 30px;">
                          <img src="/images/${
                            join == "n" ? "small" : "big"
                          }.png" class="van-image__img">
                      </div>
                      `;
      } else {
        checkJoin = `
                      <span data-v-a9660e98="">${
                        isNumber(join) ? join : ""
                      }</span>
                      `;
      }
      return (htmls += `
                      <div data-v-a9660e98="" issuenumber="${
                        list_orders.stage
                      }" addtime="${timerJoin(
        list_orders.time
      )}" colour="red" number="6" rowid="${i}" class="hb">
                          <div data-v-a9660e98="" class="item c-row">
                              <div data-v-a9660e98="" class="result">
                                  <div data-v-a9660e98="" class="select select-${color}">
                                      ${checkJoin}    
                                  </div>
                              </div>
                              <div data-v-a9660e98="" class="c-row c-row-between info">
                                  <div data-v-a9660e98="">
                                      <div data-v-a9660e98="" class="issueName">
                                          ${list_orders.stage} 
                                          ${
                                            list_orders.status == 1
                                              ? '<span data-v-a9660e98="" class="state green">Success</span>'
                                              : list_orders.status == 2
                                              ? '<span data-v-a9660e98="" class="state red">Fail</span>'
                                              : ""
                                          }
                                      </div>
                                      <div data-v-a9660e98="" class="tiem">${timerJoin(
                                        list_orders.time
                                      )}</div>
                                  </div>
                                  <div data-v-a9660e98="" class="money">
                                  ${
                                    list_orders.status==1 && list_orders.bet ==0 
                                      ? '<span data-v-a9660e98="" class="success"> + ' +
                                      (parseFloat(4.5) * parseFloat(list_orders.money)).toFixed(2) +
                                        " </span>"
                                      :list_orders.status==1 && list_orders.bet ==5
                                      ? '<span data-v-a9660e98="" class="success"> + ' +
                                      (parseFloat(4.5) * parseFloat(list_orders.money)).toFixed(2)+
                                      " </span>"
                                      : list_orders.status==1 && list_orders.result == 0 && list_orders.bet == 'd'
                                      ? '<span data-v-a9660e98="" class="success"> + ' +
                                      (parseFloat(1.5) * parseFloat(list_orders.money)).toFixed(2) +
                                      " </span>"
                                      : list_orders.status==1 && list_orders.bet == 'd'
                                      ? '<span data-v-a9660e98="" class="success"> + ' +
                                      list_orders.money * 2 +
                                      " </span>"
                                      : list_orders.status==1 && list_orders.bet == 't'
                                      ? '<span data-v-a9660e98="" class="success"> + ' +
                                      (parseFloat(4.5) * parseFloat(list_orders.money)).toFixed(2) +
                                      " </span>"
                                      : list_orders.status==1 && list_orders.result == 5 && list_orders.bet == 'x'
                                      ? '<span data-v-a9660e98="" class="success"> + ' +
                                      (parseFloat(1.5) * parseFloat(list_orders.money)).toFixed(2) +
                                      " </span>"
                                      : list_orders.status==1 && list_orders.bet == 'x'
                                      ? '<span data-v-a9660e98="" class="success"> + ' +
                                      list_orders.money * 2 +
                                      " </span>"
                                      : list_orders.status==1 && list_orders.bet == 'l'
                                      ? '<span data-v-a9660e98="" class="success"> + ' +
                                      list_orders.money * 2 +
                                      " </span>"
                                      : list_orders.status==1 && list_orders.bet == 'n'
                                      ? '<span data-v-a9660e98="" class="success"> + ' +
                                      list_orders.money * 2 +
                                      " </span>"
                                      : list_orders.status==1
                                      ?'<span data-v-a9660e98="" class="success"> + ' +
                                      list_orders.money * 9 +
                                      " </span>"
                                      : list_orders.status == 2
                                      ? '<span data-v-a9660e98="" class="fail"> - ' +
                                        list_orders.money +
                                        "</span>"
                                      : ""
                                  }
                                  </div>
                              </div>
                          </div>
  
                          <div data-v-a9660e98="" class="details" style="display: none">
                              <div data-v-a9660e98="" class="tit">Details</div>
                              <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                                  <div data-v-a9660e98="">Order ID</div>
                                  <div data-v-a9660e98="" data-clipboard-text="${
                                    list_orders.id_product
                                  }" class="tag-read c-row c-row-between c-row-middle">
                                      ${list_orders.id_product}
                                      <img data-v-a9660e98="" width="18px" height="15px" src="/images/copy.png" class="m-l-5">
                                  </div>
                                  </div>
                                  <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                                      <div data-v-a9660e98="">Lottery Period</div>
                                          <div data-v-a9660e98="">${
                                            list_orders.stage
                                          }</div>
                                      </div>
                                      <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                                          <div data-v-a9660e98="">Order Amount</div>
                                          <div data-v-a9660e98="">${
                                            list_orders.money + list_orders.fee
                                          }.00</div>
                                      </div>
                                      <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                                          <div data-v-a9660e98="">Quantity</div>
                                          <div data-v-a9660e98="">${
                                            list_orders.amount
                                          }</div>
                                      </div>
                                      <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                                          <div data-v-a9660e98="">Amount After Tax</div>
                                          <div data-v-a9660e98="" class="red">${
                                            list_orders.money
                                          }.00</div>
                                      </div>
                                      <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                                          <div data-v-a9660e98="">Tax</div>
                                          <div data-v-a9660e98="">${
                                            list_orders.fee
                                          }.00</div>
                                      </div>
                                      <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                                          <div data-v-a9660e98="">Opening Price</div>
                                          <div data-v-a9660e98="">${
                                            list_orders.result
                                          }</div>
                                      </div>
                                      <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                                          <div data-v-a9660e98="">Result</div>
                                      <div data-v-a9660e98="">
                                          <div data-v-a9660e98="" style="display: inline-block; margin-left: 8px;">${
                                            list_orders.result
                                          }</div>
                                          <div data-v-a9660e98="" style="display: inline-block; margin-left: 8px;">${
                                            list_orders.result == 0
                                              ? "Red Violet"
                                              : list_orders.result == 5
                                              ? "Green Violet"
                                              : list_orders.result % 2 == 0
                                              ? "Red"
                                              : "Green"
                                          }</div>
                                          <div data-v-a9660e98="" style="display: inline-block; margin-left: 8px;">${
                                            list_orders.amount < 5 ? "Small" : "Big"
                                          }</div>
                                      </div>
                                  </div>
                                  <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle ">
                                      <div data-v-a9660e98="">Choose</div>
                                      <div data-v-a9660e98="">
                                          <div data-v-a9660e98="">${color}</div>
                                      </div>
                                  </div>
                                  <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                                      <div data-v-a9660e98="">Status</div>
                                      <div data-v-a9660e98="" class="${
                                        list_orders.status == 1
                                          ? "green"
                                          : list_orders.status == 2
                                          ? "red"
                                          : ""
                                      }">${
        list_orders.status == 1
          ? "Success"
          : list_orders.status == 2
          ? "Fail"
          : ""
      }</div>
                                  </div>
                                  <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                                      <div data-v-a9660e98="">Win or Loss</div>
                                      <div data-v-a9660e98="" class="${
                                        list_orders.status == 1
                                          ? "green"
                                          : list_orders.status == 2
                                          ? "red"
                                          : ""
                                      }"> ${
        list_orders.status == 1 ? "+" : list_orders.status == 2 ? "-" : ""
      } ${
        list_orders.status == 0
          ? ""
          :list_orders.status ==1 && list_orders.bet == 0
          ? list_orders.money * 4.5
          :list_orders.status ==1 && list_orders.bet ==5
          ? list_orders.money * 1.5
          : list_orders.status == 1 && list_orders.bet == 't'
          ? list_orders.money * 4.5
          :list_orders.status == 1 && list_orders.result ==0 && list_orders.bet == 'd'
          ? list_orders.money * 1.5
          :list_orders.status == 1 && list_orders.bet == 'd'
          ? list_orders.money * 2
          :list_orders.status == 1 && list_orders.bet == 'x'
          ? list_orders.money * 1.5
          :list_orders.status == 1 && list_orders.result ==5 && list_orders.bet == 'x'
          ? list_orders.money * 1.5
          :list_orders.status == 1 && list_orders.bet == 'l'
          ? list_orders.money * 2
          :list_orders.status == 1 && list_orders.bet == 'n'
          ? list_orders.money * 2
          : list_orders.status == 1
          ? list_orders.money * 9
          : list_orders.money
      }
      </div>
                                  </div>
                                  <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                                      <div data-v-a9660e98="">Order Time</div>
                                      <div data-v-a9660e98="">${timerJoin(
                                        list_orders.time
                                      )}</div>
                                  </div>
                              </div>
                      </div>
                      `);
    });
    $(`.game-list .con-box:eq(${x}) .list #history-order`).html(htmls);
  }
  $.ajax({
    type: "POST",
    url: "/api/webapi/GetNoaverageEmerdList",
    data: {
      typeid: "5",
      pageno: "0",
      pageto: "10",
      language: "vi",
    },
    dataType: "json",
    success: function (response) {
      let list_orders = response.data.gameslist;
      $(".time-box .out .numbers").text(response.period);
      $(".game-list .con-box:eq(0) .page-nav .number").text("1/" + response.page);
      showListOrder(list_orders, 0);
    },
  });
  
  function formateT(params) {
    let result = params < 10 ? "0" + params : params;
    return result;
  }
  
function timerJoin(params = '', addHours = 0) {
  let date = "";
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
  return (
    years +
    "-" +
    months +
    "-" +
    days +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds +
    ":" +
    ampm
  );
}
  
  $.ajax({
    type: "POST",
    url: "/api/webapi/GetMyEmerdList",
    data: {
      typeid: "5",
      pageno: "0",
      pageto: "10",
      language: "vi",
    },
    dataType: "json",
    success: function (response) {
      let data = response.data.gameslist;
      $(".game-list .con-box:eq(1) .page-nav .number").text("1/" + `${(response.page) ? response.page : '1'}`);
      showListOrder2(data, 1);
    },
  });
  
  var pageno = 0;
  var limit = 10;
  var page = 1;
  $(".game-list .con-box:eq(0) .page-nav .arr:eq(1)").click(function (e) {
    e.preventDefault();
    pageno += 10;
    let pageto = limit;
    $.ajax({
      type: "POST",
      url: "/api/webapi/GetNoaverageEmerdList",
      data: {
        typeid: "5",
        pageno: pageno,
        pageto: pageto,
        language: "vi",
      },
      dataType: "json",
      success: function (response) {
        if (response.status === false) {
          pageno -= 10;
          $(".game-list .con-box:eq(0) .page-nav .arr:eq(1)").addClass(
            "block-click"
          );
          $(".game-list .con-box:eq(0) .page-nav .arr:eq(1)").removeClass(
            "action"
          );
          $(".game-list .con-box:eq(0) .page-nav .van-icon-arrow-right").css(
            "color",
            "#7f7f7f"
          );
          alertMessJoin(response.msg);
          return false;
        }
        $(".game-list .con-box:eq(0) .page-nav .arr:eq(0)").removeClass(
          "block-click"
        );
        $(".game-list .con-box:eq(0) .page-nav .arr:eq(0)").addClass("action");
        $(".game-list .con-box:eq(0) .page-nav .van-icon-arrow-left").css(
          "color",
          "#fff"
        );
        page += 1;
        $(".game-list .con-box:eq(0) .page-nav .number").text(
          page + "/" + response.page
        );
        let list_orders = response.data.gameslist;
        $(".time-box .out .numbers").text(response.period);
        showListOrder(list_orders, 0);
      },
    });
  });
  $(".game-list .con-box:eq(0) .page-nav .arr:eq(0)").click(function (e) {
    e.preventDefault();
    $(".game-list .con-box:eq(0) .page-nav .arr:eq(1)").removeClass(
      "block-click"
    );
    $(".game-list .con-box:eq(0) .page-nav .arr:eq(1)").addClass("action");
    $(".game-list .con-box:eq(0) .page-nav .van-icon-arrow-right").css(
      "color",
      "#fff"
    );
    pageno -= 10;
    let pageto = limit;
    $.ajax({
      type: "POST",
      url: "/api/webapi/GetNoaverageEmerdList",
      data: {
        typeid: "5",
        pageno: pageno,
        pageto: pageto,
        language: "vi",
      },
      dataType: "json",
      success: function (response) {
        if (page - 1 <= 1) {
          $(".game-list .con-box:eq(0) .page-nav .arr:eq(0)").addClass(
            "block-click"
          );
          $(".game-list .con-box:eq(0) .page-nav .arr:eq(0)").removeClass(
            "action"
          );
          $(".game-list .con-box:eq(0) .page-nav .van-icon-arrow-left").css(
            "color",
            "#7f7f7f"
          );
        }
        if (response.status === false) {
          pageno = 0;
          $(".game-list .con-box:eq(0) .page-nav .arr:eq(0)").addClass(
            "block-click"
          );
          $(".game-list .con-box:eq(0) .page-nav .arr:eq(0)").removeClass(
            "action"
          );
          $(".game-list .con-box:eq(0) .page-nav .van-icon-arrow-left").css(
            "color",
            "#7f7f7f"
          );
          alertMessJoin(response.msg);
          return false;
        }
        page -= 1;
        $(".game-list .con-box:eq(0) .page-nav .number").text(
          page + "/" + response.page
        );
        let list_orders = response.data.gameslist;
        $(".time-box .out .numbers").text(response.period);
        showListOrder(list_orders, 0);
      },
    });
  });
  
  var pageno = 0;
  var limit = 10;
  var page = 1;
  $(".game-list .con-box:eq(1) .page-nav .arr:eq(1)").click(function (e) {
    e.preventDefault();
    pageno += 10;
    let pageto = limit;
    $.ajax({
      type: "POST",
      url: "/api/webapi/GetMyEmerdList",
      data: {
        typeid: "5",
        pageno: pageno,
        pageto: pageto,
        language: "vi",
      },
      dataType: "json",
      success: function (response) {
        if (response.status === false) {
          pageno -= 10;
          $(".game-list .con-box:eq(1) .page-nav .arr:eq(1)").addClass(
            "block-click"
          );
          $(".game-list .con-box:eq(1) .page-nav .arr:eq(1)").removeClass(
            "action"
          );
          $(".game-list .con-box:eq(1) .page-nav .van-icon-arrow-right").css(
            "color",
            "#7f7f7f"
          );
          alertMessJoin(response.msg);
          return false;
        }
        $(".game-list .con-box:eq(1) .page-nav .arr:eq(0)").removeClass(
          "block-click"
        );
        $(".game-list .con-box:eq(1) .page-nav .arr:eq(0)").addClass("action");
        $(".game-list .con-box:eq(1) .page-nav .van-icon-arrow-left").css(
          "color",
          "#fff"
        );
        page += 1;
        console.log(page);
        $(".game-list .con-box:eq(1) .page-nav .number").text(
          "1/" + `${(response.page) ? response.page : '1'}`
        );
        let list_orders = response.data.gameslist;
        $(".time-box .out .numbers").text(response.period);
        showListOrder2(list_orders, 1);
      },
    });
    setTimeout(() => {
      let check = true;
      $("#history-order .item").click(function (e) {
        e.preventDefault();
        let parent = $(this).parent();
        // let show = parent.children();
        let myVar = parent.find(".details");
        if (check) {
          check = false;
          myVar.fadeIn(0);
        } else {
          check = true;
          myVar.fadeOut(0);
        }
      });
    }, 1000);
  });
  $(".game-list .con-box:eq(1) .page-nav .arr:eq(0)").click(function (e) {
    e.preventDefault();
    $(".game-list .con-box:eq(1) .page-nav .arr:eq(1)").removeClass(
      "block-click"
    );
    $(".game-list .con-box:eq(1) .page-nav .arr:eq(1)").addClass("action");
    $(".game-list .con-box:eq(1) .page-nav .van-icon-arrow-right").css(
      "color",
      "#fff"
    );
    pageno -= 10;
    let pageto = limit;
    $.ajax({
      type: "POST",
      url: "/api/webapi/GetMyEmerdList",
      data: {
        typeid: "5",
        pageno: pageno,
        pageto: pageto,
        language: "vi",
      },
      dataType: "json",
      success: function (response) {
        if (page - 1 <= 1) {
          $(".game-list .con-box:eq(1) .page-nav .arr:eq(0)").addClass(
            "block-click"
          );
          $(".game-list .con-box:eq(1) .page-nav .arr:eq(0)").removeClass(
            "action"
          );
          $(".game-list .con-box:eq(1) .page-nav .van-icon-arrow-left").css(
            "color",
            "#7f7f7f"
          );
        }
        if (response.status === false) {
          pageno = 0;
          $(".game-list .con-box:eq(1) .page-nav .arr:eq(0)").addClass(
            "block-click"
          );
          $(".game-list .con-box:eq(1) .page-nav .arr:eq(0)").removeClass(
            "action"
          );
          $(".game-list .con-box:eq(1) .page-nav .van-icon-arrow-left").css(
            "color",
            "#7f7f7f"
          );
          alertMessJoin(response.msg);
          return false;
        }
        page -= 1;
        $(".game-list .con-box:eq(1) .page-nav .number").text(
          "1/" + `${(response.page) ? response.page : '1'}`
        );
        let list_orders = response.data.gameslist;
        $(".time-box .out .numbers").text(response.period);
        showListOrder2(list_orders, 1);
      },
    });
    setTimeout(() => {
      let check = true;
      $("#history-order .item").click(function (e) {
        e.preventDefault();
        let parent = $(this).parent();
        // let show = parent.children();
        let myVar = parent.find(".details");
        if (check) {
          check = false;
          myVar.fadeIn(0);
        } else {
          check = true;
          myVar.fadeOut(0);
        }
      });
    }, 1000);
  });
  
  window.onload = function() {
    function cownDownTimer() {
      var countDownDate = new Date("2030-07-16T23:59:59.9999999+01:00").getTime();
      setInterval(function() {
        var now = new Date().getTime();
        var distance = countDownDate - now;
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var minute = Math.ceil(minutes % 3);
        var seconds1 = Math.floor((distance % (1000 * 60)) / 10000);
        var seconds2 = Math.floor(((distance % (1000 * 60)) / 1000) % 10);
        // $(".number .item:eq(0)").text(seconds1);
        $(".number .item:eq(1)").text(minute);

        $(".number .item:eq(3)").text(seconds1);
        $(".number .item:eq(4)").text(seconds2);
      }, 100);
      setInterval(() => {
        var now = new Date().getTime();
        var distance = countDownDate - now;
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var minute = Math.ceil(minutes % 3);
        var seconds1 = Math.floor((distance % (1000 * 60)) / 10000);
        var seconds2 = Math.floor(((distance % (1000 * 60)) / 1000) % 10);
        const check_volume = localStorage.getItem('volume');
        if (minute == 0 && seconds1 == 0 && seconds2 <= 5) {
          if (clicked) {
            if (check_volume == 'on') {
                    playAudio1();
                }
          }
        }
        if (minute == 2 && seconds1 == 5 && seconds2 == 9) {
          if (clicked) {
            if (check_volume == 'on') {
                    playAudio2();
                }
          }
        }
      }, 1000);
      setInterval(function() {
        var now = new Date().getTime();
        var distance = countDownDate - now;
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var minute = Math.ceil(minutes % 3);
        var seconds1 = Math.floor((distance % (1000 * 60)) / 10000);
        var seconds2 = Math.floor(((distance % (1000 * 60)) / 1000) % 10);
        if (minute == 0 && seconds1 == 0 && seconds2 <= 5) {
          $(".van-overlay").fadeOut();
          $(".popup-join").css("transform", "translateY(600px)");
          $(".betting-mark .amount-box .li, .multiple-box .li").css({
            "background-color": "rgb(240, 240, 240)",
            color: "rgb(0, 0, 0)",
          });
          $(".betting-mark .amount-box .li:eq(0), .multiple-box .li:eq(0)").css({
            "background-color": "rgb(240, 240, 240)",
            color: "rgb(255, 255, 255)",
          });
          $(".stepper-box .digit-box input").val(1);
          $(".amount-box").attr("data-money", "1");
          $(".foot .right span:eq(1)").text(1000 + "");
  
          $(".box .mark-box ").css("display", "flex");
          $(".box .mark-box .item:eq(0)").text(seconds1);
          $(".box .mark-box .item:eq(1)").text(seconds2);
        } else {
          $(".box .mark-box ").css("display", "none");
        }
      }, 0);
    }
  
    cownDownTimer();
    setTimeout(() => {
      let check = true;
      $("#history-order .item").click(function(e) {
        e.preventDefault();
        let parent = $(this).parent();
        // let show = parent.children();
        let myVar = parent.find(".details");
        if (check) {
          check = false;
          myVar.fadeIn(0);
        } else {
          check = true;
          myVar.fadeOut(0);
        }
      });
    }, 1000);
  };
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
  
  $('.van-notice-bar__wrap .van-notice-bar__content').css({
    'transition-duration': '48.9715s',
    'transform': 'translateX(-2448.57px)',
  });
  setInterval(() => {
    $('.van-notice-bar__wrap .van-notice-bar__content').css({
      'transition-duration': '0s',
      'transform': 'translateX(0)',
    });
    setTimeout(() => {
      $('.van-notice-bar__wrap .van-notice-bar__content').css({
      'transition-duration': '48.9715s',
        'transform': 'translateX(-2448.57px)',
      });
    }, 100);
  }, 48000);
  
  $('.van-button--default').click(function (e) { 
    e.preventDefault();
    $('.van-popup-vf, .van-overlay').fadeOut(100);
  });
  
  $('.circular').click(function (e) { 
    e.preventDefault();
    $('.van-popup-vf, .van-overlay').fadeIn(100);
  });

  let selectPageTime = Number($('html').attr("data-dpr"));
  console.log(selectPageTime - 1);
  $(`.game-betting .box .item:eq(${selectPageTime - 1})`).addClass('action');
  $(`.game-betting .box .item:eq(${selectPageTime - 1}) .img`).addClass('block-click');
  $(`.game-betting .box .item .img .van-image img`).attr('src', '/images/icon-clock.png');
  $(`.game-betting .box .item:eq(${selectPageTime - 1}) .img .van-image img`).attr('src', '/images/icon-clock-a.png');

// Add periodic check for new results and popups
function checkForNewResults() {
    $.ajax({
        type: "POST",
        url: "/api/webapi/GetMyEmerdList",
        data: {
            typeid: "5",
            pageno: "0",
            pageto: "5",
            language: "vi",
        },
        dataType: "json",
        success: function(response) {
            let data = response.data.gameslist;
            if (data && data.length > 0) {
                let mostRecentGame = data[0];
                
                // Only show popup if this is a very recent game (within last 3 minutes)
                let gameTime = new Date(mostRecentGame.time || Date.now()).getTime();
                let currentTime = Date.now();
                let timeDiff = currentTime - gameTime;
                
                // Create a unique key for this specific game result
                let popupKey = `popup_${mostRecentGame.stage}_${mostRecentGame.get}_${mostRecentGame.money}`;
                
                // If game is very recent (within 3 minutes) and we haven't shown popup for this specific result
                if (timeDiff < 180000 && mostRecentGame.stage && !sessionStorage.getItem(popupKey)) {
                    // Mark this specific popup as shown
                    sessionStorage.setItem(popupKey, 'true');
                    
                    // Get the result for this period
                    $.ajax({
                        type: "POST",
                        url: "/api/webapi/GetNoaverageEmerdList",
                        data: {
                            typeid: "5",
                            pageno: "0",
                            pageto: "10",
                            language: "vi",
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
                                showWinLossPopup(mostRecentGame, matchingResult, "3min");
                            }
                        }
                    });
                }
            }
        }
    });
}

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
        
        // Auto-hide popup after 5 seconds
        setTimeout(() => {
            if (modal) {
                modal.style.display = "none";
            }
        }, 5000);
    }
}

// Function to cleanup old popup keys
function cleanupPopupKeys() {
    const keys = Object.keys(sessionStorage);
    const currentTime = Date.now();
    
    keys.forEach(key => {
        if (key.startsWith('popup_')) {
            // Remove popup keys older than 1 hour
            const keyTime = parseInt(key.split('_')[1]) || 0;
            if (currentTime - keyTime > 3600000) { // 1 hour
                sessionStorage.removeItem(key);
            }
        }
    });
}

// Function to clear popup history when user places a new bet
function clearPopupHistory() {
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
        if (key.startsWith('popup_')) {
            sessionStorage.removeItem(key);
        }
    });
}

// Start periodic checking every 20 seconds
setInterval(checkForNewResults, 20000);

// Cleanup old popup keys every 5 minutes
setInterval(cleanupPopupKeys, 300000);