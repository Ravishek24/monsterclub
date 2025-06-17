import 'dotenv/config';
import connection from "../config/connectDB.js";

const winGoPage = async (req, res) => {
    return res.render("bet/wingo/win.ejs");
}

const winGoPage3 = async (req, res) => {
    return res.render("bet/wingo/win3.ejs");
}

const winGoPage5 = async (req, res) => {
    return res.render("bet/wingo/win5.ejs");
}

const winGoPage10 = async (req, res) => {
    return res.render("bet/wingo/win10.ejs");
}

const isNumber = (params) => {
    let pattern = /^[0-9]*\d$/;
    return pattern.test(params);
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

const rosesPlus = async (auth, money) => {
    try {
        const [levels] = await connection.query('SELECT * FROM level');

        const [users] = await connection.query('SELECT `phone`, `code`, `invite`, `user_level`, `total_money` FROM users WHERE token = ? AND veri = 1 AND proxy = 0 LIMIT 1', [auth]);
        const userInfo = users[0];

        const [firstInvitees] = await connection.query('SELECT `phone`, `code`, `invite`, `rank`, `user_level`, `total_money` FROM users WHERE code = ? AND veri = 1 AND proxy = 0 LIMIT 1', [userInfo.invite]);
        let currentInvitee = firstInvitees[0];

        if (userInfo.total_money >= 100 && currentInvitee) {

            for (let levelIndex = 1; levelIndex <= 12; levelIndex++) {
                let rosesF = 0;

                if (currentInvitee.user_level >= levelIndex && currentInvitee.total_money >= 100) {
                    rosesF = (money / 100) * levels[levelIndex - 1].f1;

                    if (rosesF > 0) {
                        const updateResult = await connection.query(
                            'UPDATE users SET money = money + ?, roses_f1 = roses_f1 + ?, roses_today = roses_today + ? WHERE phone = ?',
                            [rosesF, rosesF, rosesF, currentInvitee.phone]
                        );                        
                        const timeNow = Date.now();
                        await connection.execute(
                            `INSERT INTO roses SET phone = ?, code = ?, invite = ?, f1 = ?, time = ?`,
                            [currentInvitee.phone, currentInvitee.code, currentInvitee.invite, rosesF, timeNow]
                        );
                        await connection.execute(
                            `INSERT INTO turn_over (phone, code, invite, daily_turn_over, total_turn_over)
                            VALUES (?, ?, ?, ?, ?)
                            ON DUPLICATE KEY UPDATE
                            daily_turn_over = daily_turn_over + ?, 
                            total_turn_over = total_turn_over + ?`,
                            [currentInvitee.phone, currentInvitee.code, currentInvitee.invite, money, money, money, money]
                        );

                        // Team commission
                        const phoneNumbers = [];
                        let currentInvite = userInfo.invite;

                        for (let level = 0; level < 5; level++) {
                            const [team] = await connection.query(
                                'SELECT `phone`, `code`, `invite`, `rank`, `user_level`, `total_money` FROM users WHERE code = ? AND veri = 1 AND proxy = 0 LIMIT 1',
                                [currentInvite]
                            );

                            if (team.length > 0) {
                                const teamData = team[0];
                                phoneNumbers.push(teamData.phone);
                                currentInvite = teamData.invite;
                            } else {
                                break;
                            }
                        }

                        const calculatedAmounts = [];

                        for (let i = 0; i < phoneNumbers.length; i++) {
                            let calculatedMoney = (money / 100) * levels[i+1].f1;
                            calculatedAmounts.push(calculatedMoney);
                        }

                        for (let i = 0; i < phoneNumbers.length; i++) {
                            await connection.query(
                                'UPDATE users SET money = money + ?, roses_f = roses_f + ?, roses_today = roses_today + ? WHERE phone = ?',
                                [calculatedAmounts[i], calculatedAmounts[i], calculatedAmounts[i], phoneNumbers[i]]
                            );
                        }
                    }
                }

                const [nextInvitees] = await connection.query('SELECT `phone`, `code`, `invite`, `rank`, `user_level`, `total_money` FROM users WHERE code = ? AND veri = 1 AND proxy = 0 LIMIT 1', [currentInvitee.invite]);
                if (nextInvitees.length > 0) {
                    currentInvitee = nextInvitees[0];
                } else {
                    break;
                }
            }
        }
    } catch (error) {
        console.error('Error in rosesPlus:', error);
    }
};

const betWinGo = async (req, res) => {
    let { typeid, join, x, money } = req.body;
    let auth = req.cookies.auth;

    if (typeid != 1 && typeid != 3 && typeid != 5 && typeid != 10) {
        return res.status(200).json({
            message: 'Error!',
            status: true
        });
    }

    let gameJoin = '';
    if (typeid == 1) gameJoin = 'wingo';
    if (typeid == 3) gameJoin = 'wingo3';
    if (typeid == 5) gameJoin = 'wingo5';
    if (typeid == 10) gameJoin = 'wingo10';

    // Get the current active period instead of MAX period
    const [activePeriodRow] = await connection.query(`SELECT period FROM wingo WHERE game = '${gameJoin}' AND status = 0 ORDER BY period DESC LIMIT 1`);
    
    if (!activePeriodRow[0]) {
        return res.status(200).json({
            message: 'No active game period found!',
            status: false
        });
    }
    
    let period = activePeriodRow[0].period;

    const [user] = await connection.query('SELECT `phone`, `code`, `invite`, `level`, `money`, `proxy` FROM users WHERE token = ? AND veri = 1  LIMIT 1 ', [auth]);
    if (!user[0] || !isNumber(x) || !isNumber(money)) {
        return res.status(200).json({
            message: 'Error!',
            status: true
        });
    }

    let userInfo = user[0];
    let fee = (x * money) * 0.02;
    let total = (x * money) - fee;
    let timeNow = Date.now();
    let check = userInfo.money - total;

    let date = new Date();
    let years = formateT(date.getFullYear());
    let months = formateT(date.getMonth() + 1);
    let days = formateT(date.getDate());
    let id_product = years + months + days + Math.floor(Math.random() * 1000000000000000);

    let formatTime = timerJoin();

    let color = '';
    if (join == 'l') {
        color = 'big';
    } else if (join == 'n') {
        color = 'small';
    } else if (join == 't') {
        color = 'violet';
    } else if (join == 'd') {
        color = 'red';
    } else if (join == 'x') {
        color = 'green';
    } else if (join == '0') {
        color = 'red-violet';
    } else if (join == '5') {
        color = 'green-violet';
    } else if (join % 2 == 0) {
        color = 'red';
    } else if (join % 2 != 0) {
        color = 'green';
    }

    let checkJoin = '';

    if (!isNumber(join) && join == 'l' || join == 'n') {
        checkJoin = `
        <div data-v-a9660e98="" class="van-image" style="width: 30px; height: 30px;">
            <img src="/images/${(join == 'n') ? 'small' : 'big'}.png" class="van-image__img">
        </div>
        `
    } else {
        checkJoin = `<span data-v-a9660e98="">${(isNumber(join)) ? join : ''}</span>`
    }

    let result = `
    <div data-v-a9660e98="" issuenumber="${period}" addtime="${formatTime}" rowid="1" class="hb">
        <div data-v-a9660e98="" class="item c-row">
            <div data-v-a9660e98="" class="result">
                <div data-v-a9660e98="" class="select select-${(color)}">
                    ${checkJoin}
                </div>
            </div>
            <div data-v-a9660e98="" class="c-row c-row-between info">
                <div data-v-a9660e98="">
                    <div data-v-a9660e98="" class="issueName">
                        ${period}
                    </div>
                    <div data-v-a9660e98="" class="tiem">${formatTime}</div>
                </div>
            </div>
        </div>
        <!---->
    </div>
    `;

    let checkTime = timerJoin(date.getTime());

    if (check >= 0) {
        const sql = `INSERT INTO minutes_1 SET 
        id_product = ?,
        phone = ?,
        code = ?,
        invite = ?,
        stage = ?,
        level = ?,
        money = ?,
        amount = ?,
        fee = ?,
        \`get\` = ?,
        game = ?,
        bet = ?,
        status = ?,
        today = ?,
        time = ?,
        proxy = ?`;
        await connection.execute(sql, [id_product, userInfo.phone, userInfo.code, userInfo.invite, period, userInfo.level, total, x, fee, 0, gameJoin, join, 0, checkTime, timeNow, userInfo.proxy]);
        await connection.execute('UPDATE `users` SET `money` = `money` - ? WHERE `token` = ? ', [money * x, auth]);
        const [users] = await connection.query('SELECT `money`, `level` FROM users WHERE token = ? AND veri = 1  LIMIT 1 ', [auth]);
        await rosesPlus(auth, money * x);
        return res.status(200).json({
            message: 'Successful bet',
            status: true,
            data: result,
            change: users[0].level,
            money: users[0].money,
        });
    } else {
        return res.status(200).json({
            message: 'The amount is not enough',
            status: false
        });
    }
}

const listOrderOld = async (req, res) => {
    let { typeid, pageno, pageto } = req.body;

    if (typeid != 1 && typeid != 3 && typeid != 5 && typeid != 10) {
        return res.status(200).json({
            message: 'Error!',
            status: true
        });
    }
    if (pageno < 0 || pageto < 0) {
        return res.status(200).json({
            code: 0,
            msg: "No more data",
            data: {
                gameslist: [],
            },
            status: false
        });
    }
    let auth = req.cookies.auth;
    const [user] = await connection.query('SELECT `phone`, `code`, `invite`, `level`, `money` FROM users WHERE token = ? AND veri = 1  LIMIT 1 ', [auth]);

    let game = '';
    if (typeid == 1) game = 'wingo';
    if (typeid == 3) game = 'wingo3';
    if (typeid == 5) game = 'wingo5';
    if (typeid == 10) game = 'wingo10';

    const [wingo] = await connection.query(`SELECT * FROM wingo WHERE status != 0 AND game = '${game}' ORDER BY id DESC LIMIT ${pageno}, ${pageto} `);
    const [wingoAll] = await connection.query(`SELECT * FROM wingo WHERE status != 0 AND game = '${game}' `);
    const [period] = await connection.query(`SELECT period FROM wingo WHERE status = 0 AND game = '${game}' ORDER BY id DESC LIMIT 1 `);
    if (!wingo[0]) {
        return res.status(200).json({
            code: 0,
            msg: "No more data",
            data: {
                gameslist: [],
            },
            status: false
        });
    }
    if (!pageno || !pageto || !user[0] || !wingo[0] || !period[0]) {
        return res.status(200).json({
            message: 'Error!',
            status: true
        });
    }
    let page = Math.ceil(wingoAll.length / 10);
    return res.status(200).json({
        code: 0,
        msg: "Receive success",
        data: {
            gameslist: wingo,
        },
        period: period[0].period,
        page: page,
        status: true
    });
}

const GetMyEmerdList = async (req, res) => {
    let { typeid, pageno, pageto } = req.body;

    if (typeid != 1 && typeid != 3 && typeid != 5 && typeid != 10) {
        return res.status(200).json({
            message: 'Error!',
            status: true
        });
    }

    if (pageno < 0 || pageto < 0) {
        return res.status(200).json({
            code: 0,
            msg: "No more data",
            data: {
                gameslist: [],
            },
            status: false
        });
    }
    let auth = req.cookies.auth;

    let game = '';
    if (typeid == 1) game = 'wingo';
    if (typeid == 3) game = 'wingo3';
    if (typeid == 5) game = 'wingo5';
    if (typeid == 10) game = 'wingo10';

    const [user] = await connection.query('SELECT `phone`, `code`, `invite`, `level`, `money` FROM users WHERE token = ? AND veri = 1 LIMIT 1 ', [auth]);
    const [minutes_1] = await connection.query(`SELECT * FROM minutes_1 WHERE phone = ? AND game = '${game}' ORDER BY id DESC LIMIT ${Number(pageno) + ',' + Number(pageto)}`, [user[0].phone]);
    const [minutes_1All] = await connection.query(`SELECT * FROM minutes_1 WHERE phone = ? AND game = '${game}' ORDER BY id DESC `, [user[0].phone]);

    if (!minutes_1[0]) {
        return res.status(200).json({
            code: 0,
            msg: "No more data",
            data: {
                gameslist: [],
            },
            status: false
        });
    }
    if (!pageno || !pageto || !user[0] || !minutes_1[0]) {
        return res.status(200).json({
            message: 'Error!',
            status: true
        });
    }
    let page = Math.ceil(minutes_1All.length / 10);

    let datas = minutes_1.map((data) => {
        let { id, phone, code, invite, level, game, ...others } = data;
        return others;
    });

    return res.status(200).json({
        code: 0,
        msg: "Receive success",
        data: {
            gameslist: datas,
        },
        page: page,
        status: true
    });
}

// FIXED: Enhanced addWinGo function with proper period management and locking
const addWinGo = async (game) => {
    try {
        let join = '';
        if (game == 1) join = 'wingo';
        if (game == 3) join = 'wingo3';
        if (game == 5) join = 'wingo5';
        if (game == 10) join = 'wingo10';

        console.log(`Processing ${join} game ${game}...`);

        // STEP 1: Get the highest period using K3's simple approach
        const [maxPeriodRow] = await connection.query(`SELECT MAX(CAST(period AS UNSIGNED)) as period FROM wingo WHERE game = ?`, [join]);
        let period = maxPeriodRow[0]?.period || 0;
        
        // STEP 2: Handle initialization (like K3)
        if (period === 0 || period === null) {
            console.log(`No existing periods found for ${join}, initializing with period 1`);
            const timeNow = Date.now();
            const sql = `INSERT INTO wingo SET period = ?, amount = ?, game = ?, status = ?, time = ?`;
            await connection.execute(sql, [1, 0, join, 0, timeNow]);
            
            // Initialize admin setting if needed
            let adminColumn = '';
            if (game == 1) adminColumn = 'wingo1';
            if (game == 3) adminColumn = 'wingo3';
            if (game == 5) adminColumn = 'wingo5';
            if (game == 10) adminColumn = 'wingo10';
            
            await connection.execute(`UPDATE admin SET ${adminColumn} = ?`, ['-1']);
            return;
        }

        // STEP 3: Get admin settings (single query like K3)
        const [setting] = await connection.query('SELECT * FROM admin WHERE id = 1');
        if (!setting || setting.length === 0) {
            console.error('No admin settings found for WinGo');
            return;
        }

        let timeNow = Date.now();

        // STEP 4: Determine next result based on admin settings
        let nextResult = '';
        if (game == 1) nextResult = setting[0].wingo1;
        if (game == 3) nextResult = setting[0].wingo3;
        if (game == 5) nextResult = setting[0].wingo5;
        if (game == 10) nextResult = setting[0].wingo10;

        let newArr = '';
        let result = 0;
        
        if (nextResult == '-1' || !nextResult) {
            // Generate random WinGo result: single digit 0-9
            result = Math.floor(Math.random() * 10);
            newArr = '-1';
        } else {
            let arr = nextResult.split('|');
            let check = arr.length;
            if (check == 1) {
                newArr = '-1';
            } else {
                for (let i = 1; i < arr.length; i++) {
                    newArr += arr[i] + '|';
                }
                newArr = newArr.slice(0, -1);
            }
            if (arr[0] !== undefined && arr[0] !== '') {
                result = parseInt(arr[0]);
                // Validate result is between 0-9
                if (isNaN(result) || result < 0 || result > 9) {
                    result = Math.floor(Math.random() * 10);
                }
            } else {
                // Fallback to random if no valid result
                result = Math.floor(Math.random() * 10);
            }
        }

        // STEP 5: Update current period with result (simple update like K3)
        await connection.execute(`UPDATE wingo SET amount = ?, status = ? WHERE period = ? AND game = ?`, [result, 1, period, join]);

        // STEP 6: Create next period (simple insert like K3)
        const nextPeriod = Number(period) + 1;
        const sql = `INSERT INTO wingo SET period = ?, amount = ?, game = ?, status = ?, time = ?`;
        await connection.execute(sql, [nextPeriod, 0, join, 0, timeNow]);

        // STEP 7: Update admin settings (simple update like K3)
        let adminColumn = '';
        if (game == 1) adminColumn = 'wingo1';
        if (game == 3) adminColumn = 'wingo3';
        if (game == 5) adminColumn = 'wingo5';
        if (game == 10) adminColumn = 'wingo10';

        await connection.execute(`UPDATE admin SET ${adminColumn} = ?`, [newArr]);

        console.log(`${join}: Period ${period} completed with result ${result}, Period ${nextPeriod} started`);
        
    } catch (error) {
        console.error(`Error in addWinGo for game ${game}:`, error);
    }
}

// FIXED: Enhanced handlingWinGo1P function with better error handling
const handlingWinGo1P = async (typeid) => {
    try {
        let game = '';
        if (typeid == 1) game = 'wingo';
        if (typeid == 3) game = 'wingo3';
        if (typeid == 5) game = 'wingo5';
        if (typeid == 10) game = 'wingo10';

        console.log(`Processing winnings for ${game}...`);

        // STEP 1: Get the latest completed period (like K3's approach)
        const [winGoNow] = await connection.query(`SELECT * FROM wingo WHERE status = 1 AND game = ? ORDER BY id DESC LIMIT 1`, [game]);
        if (!winGoNow[0]) {
            console.log(`No completed periods found for ${game}`);
            return;
        }

        const currentPeriod = winGoNow[0].period;
        const result = Number(winGoNow[0].amount);
        
        console.log(`Processing ${game} period ${currentPeriod} with result ${result}`);

        // STEP 2: Update all pending bets with the result (single query like K3)
        await connection.execute(`UPDATE minutes_1 SET result = ? WHERE status = 0 AND game = ? AND stage = ?`, [result, game, currentPeriod]);

        // STEP 3: Mark losing bets based on result (simplified logic like K3)
        // Handle number-specific losing bets
        const losingConditions = {
            0: "bet NOT IN ('l', 'n', 'd', '0', 't')",
            1: "bet NOT IN ('l', 'n', 'x', '1')",
            2: "bet NOT IN ('l', 'n', 'd', '2')",
            3: "bet NOT IN ('l', 'n', 'x', '3')",
            4: "bet NOT IN ('l', 'n', 'd', '4')",
            5: "bet NOT IN ('l', 'n', 'x', '5', 't')",
            6: "bet NOT IN ('l', 'n', 'd', '6')",
            7: "bet NOT IN ('l', 'n', 'x', '7')",
            8: "bet NOT IN ('l', 'n', 'd', '8')",
            9: "bet NOT IN ('l', 'n', 'x', '9')"
        };

        // Mark losing number/color bets in single query
        if (losingConditions[result]) {
            await connection.execute(
                `UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = ? AND stage = ? AND ${losingConditions[result]}`, 
                [game, currentPeriod]
            );
        }

        // Handle big/small losing bets
        const bigSmallLoser = result < 5 ? 'l' : 'n';
        await connection.execute(
            `UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = ? AND stage = ? AND bet = ?`, 
            [game, currentPeriod, bigSmallLoser]
        );

        // STEP 4: Process winning bets (simplified like K3's plusMoney function)
        await processWinningBets(game, currentPeriod);

        console.log(`Completed processing ${game} period ${currentPeriod}`);
        
    } catch (error) {
        console.error(`Error in handlingWinGo1P for game ${typeid}:`, error);
    }
}


const processWinningBets = async (game, currentPeriod) => {
    try {
        // Get all winning bets for this period (like K3's approach)
        const [winningOrders] = await connection.execute(
            `SELECT id, phone, bet, money, result FROM minutes_1 WHERE status = 0 AND game = ? AND stage = ?`, 
            [game, currentPeriod]
        );

        if (winningOrders.length === 0) {
            console.log(`No winning bets for ${game} period ${currentPeriod}`);
            return;
        }

        console.log(`Processing ${winningOrders.length} winning bets for ${game} period ${currentPeriod}`);

        // Process each winning bet (like K3's loop approach)
        for (let order of winningOrders) {
            let nhan_duoc = 0;
            let bet = order.bet;
            let total = order.money;
            let id = order.id;
            let phone = order.phone;
            let result = Number(order.result);

            // Calculate winnings based on WinGo payout rules (simplified logic)
            if (bet === 'l' || bet === 'n') {
                // Big/Small bets
                nhan_duoc = total * 2;
            } else if (result === 0 || result === 5) {
                // Special cases for 0 and 5
                if (bet === 'd' || bet === 'x') {
                    nhan_duoc = total * 1.5;
                } else if (bet === 't' || bet === '0' || bet === '5') {
                    nhan_duoc = total * 4.5;
                }
            } else {
                // Regular number bets
                if (result.toString() === bet) {
                    nhan_duoc = total * 9; // Exact number match
                } else if ((result % 2 === 1 && bet === 'x') || (result % 2 === 0 && bet === 'd')) {
                    nhan_duoc = total * 2; // Color match
                }
            }

            if (nhan_duoc > 0) {
                // Update user balance and bet record (like K3's approach)
                await connection.execute('UPDATE `users` SET `money` = `money` + ? WHERE `phone` = ?', [nhan_duoc, phone]);
                await connection.execute('UPDATE `minutes_1` SET `get` = ?, `status` = 1 WHERE `id` = ?', [nhan_duoc, id]);
                
                console.log(`Paid ${nhan_duoc} to user ${phone} for bet ${bet} on result ${result}`);
            }
        }

    } catch (error) {
        console.error('Error processing winning bets:', error);
    }
}

// ADDITIONAL HELPER FUNCTIONS FOR BETTER PERIOD MANAGEMENT

// Function to initialize game periods if they don't exist
const initializeGamePeriods = async () => {
    const games = [
        { id: 1, name: 'wingo' },
        { id: 3, name: 'wingo3' },
        { id: 5, name: 'wingo5' },
        { id: 10, name: 'wingo10' }
    ];

    for (let game of games) {
        try {
            const [existingPeriods] = await connection.query(
                `SELECT COUNT(*) as count FROM wingo WHERE game = ?`, 
                [game.name]
            );
            
            if (existingPeriods[0].count === 0) {
                // Create initial period
                const timeNow = Date.now();
                await connection.execute(
                    `INSERT INTO wingo SET period = ?, amount = 0, game = ?, status = 0, time = ?`,
                    [1, game.name, timeNow]
                );
                console.log(`Initialized first period for ${game.name}`);
            }
        } catch (error) {
            console.error(`Error initializing periods for ${game.name}:`, error);
        }
    }
}

// Function to get current active period for a game
const getCurrentActivePeriod = async (gameType) => {
    let gameName = '';
    if (gameType == 1) gameName = 'wingo';
    if (gameType == 3) gameName = 'wingo3';
    if (gameType == 5) gameName = 'wingo5';
    if (gameType == 10) gameName = 'wingo10';

    const [activePeriod] = await connection.query(
        `SELECT period, status FROM wingo WHERE game = ? AND status = 0 ORDER BY period DESC LIMIT 1`,
        [gameName]
    );

    return activePeriod[0] || null;
}

// Function to check for orphaned bets (bets without corresponding period)
const cleanupOrphanedBets = async () => {
    const games = ['wingo', 'wingo3', 'wingo5', 'wingo10'];
    
    for (let game of games) {
        try {
            // Find bets that don't have corresponding wingo periods
            const [orphanedBets] = await connection.query(`
                SELECT m.* FROM minutes_1 m 
                LEFT JOIN wingo w ON m.stage = w.period AND m.game = w.game 
                WHERE m.game = ? AND w.period IS NULL AND m.status = 0
            `, [game]);
            
            if (orphanedBets.length > 0) {
                console.log(`Found ${orphanedBets.length} orphaned bets for ${game}`);
                
                // Mark orphaned bets as cancelled (status = 3) and refund
                for (let bet of orphanedBets) {
                    await connection.execute(
                        `UPDATE minutes_1 SET status = 3 WHERE id = ?`,
                        [bet.id]
                    );
                    
                    // Refund the money
                    await connection.execute(
                        `UPDATE users SET money = money + ? WHERE phone = ?`,
                        [bet.money, bet.phone]
                    );
                    
                    console.log(`Refunded ${bet.money} to user ${bet.phone} for orphaned bet`);
                }
            }
        } catch (error) {
            console.error(`Error cleaning up orphaned bets for ${game}:`, error);
        }
    }
}

// Function to ensure period continuity
const ensurePeriodContinuity = async (gameType) => {
    let gameName = '';
    if (gameType == 1) gameName = 'wingo';
    if (gameType == 3) gameName = 'wingo3';
    if (gameType == 5) gameName = 'wingo5';
    if (gameType == 10) gameName = 'wingo10';

    try {
        // Get all periods for this game
        const [periods] = await connection.query(
            `SELECT period FROM wingo WHERE game = ? ORDER BY CAST(period AS UNSIGNED) ASC`,
            [gameName]
        );

        if (periods.length === 0) {
            // No periods exist, create the first one
            const timeNow = Date.now();
            await connection.execute(
                `INSERT INTO wingo SET period = 1, amount = 0, game = ?, status = 0, time = ?`,
                [gameName, timeNow]
            );
            console.log(`Created initial period 1 for ${gameName}`);
            return;
        }

        // Check for gaps in period sequence
        let expectedPeriod = 1;
        let missingPeriods = [];

        for (let row of periods) {
            let currentPeriod = parseInt(row.period);
            while (expectedPeriod < currentPeriod) {
                missingPeriods.push(expectedPeriod);
                expectedPeriod++;
            }
            expectedPeriod = currentPeriod + 1;
        }

        // Fill in missing periods
        for (let missingPeriod of missingPeriods) {
            const timeNow = Date.now();
            await connection.execute(
                `INSERT INTO wingo SET period = ?, amount = 0, game = ?, status = 1, time = ?`,
                [missingPeriod, gameName, timeNow]
            );
            console.log(`Created missing period ${missingPeriod} for ${gameName}`);
        }

        // Ensure there's always one active period
        const [activePeriods] = await connection.query(
            `SELECT COUNT(*) as count FROM wingo WHERE game = ? AND status = 0`,
            [gameName]
        );

        if (activePeriods[0].count === 0) {
            // No active period, create one
            const [lastPeriod] = await connection.query(
                `SELECT MAX(CAST(period AS UNSIGNED)) as maxPeriod FROM wingo WHERE game = ?`,
                [gameName]
            );
            
            let nextPeriod = (lastPeriod[0].maxPeriod || 0) + 1;
            const timeNow = Date.now();
            
            await connection.execute(
                `INSERT INTO wingo SET period = ?, amount = 0, game = ?, status = 0, time = ?`,
                [nextPeriod, gameName, timeNow]
            );
            console.log(`Created active period ${nextPeriod} for ${gameName}`);
        }

    } catch (error) {
        console.error(`Error ensuring period continuity for ${gameName}:`, error);
    }
}

// Enhanced timer function that handles all games sequentially to prevent conflicts
const processAllWinGoGamesSimple = async () => {
    const startTime = Date.now();
    const games = [1, 3, 5, 10];
    
    try {
        console.log('Starting WinGo games processing...');
        
        // Process each game sequentially (like K3) but without artificial delays
        for (let game of games) {
            try {
                const gameStartTime = Date.now();
                
                // Process period generation and bet handling
                await addWinGo(game);
                await handlingWinGo1P(game);
                
                const gameProcessTime = Date.now() - gameStartTime;
                console.log(`✓ Game ${game} completed in ${gameProcessTime}ms`);
                
            } catch (error) {
                console.error(`✗ Error processing game ${game}:`, error);
            }
        }
        
        const totalTime = Date.now() - startTime;
        console.log(`All WinGo games processed in ${totalTime}ms`);
        
    } catch (error) {
        console.error('Error in processAllWinGoGamesSimple:', error);
    }
}

const initializeWinGoPeriods = async () => {
    const games = [
        { id: 1, name: 'wingo', admin: 'wingo1' },
        { id: 3, name: 'wingo3', admin: 'wingo3' },
        { id: 5, name: 'wingo5', admin: 'wingo5' },
        { id: 10, name: 'wingo10', admin: 'wingo10' }
    ];

    for (let game of games) {
        try {
            const [existingPeriods] = await connection.query(
                `SELECT COUNT(*) as count FROM wingo WHERE game = ?`, 
                [game.name]
            );
            
            if (existingPeriods[0].count === 0) {
                // Create initial period
                const timeNow = Date.now();
                await connection.execute(
                    `INSERT INTO wingo SET period = ?, amount = ?, game = ?, status = ?, time = ?`,
                    [1, 0, game.name, 0, timeNow]
                );
                
                // Initialize admin setting
                await connection.execute(`UPDATE admin SET ${game.admin} = ?`, ['-1']);
                
                console.log(`Initialized first period for ${game.name}`);
            }
        } catch (error) {
            console.error(`Error initializing periods for ${game.name}:`, error);
        }
    }
}

export default {
    winGoPage,
    winGoPage3,
    winGoPage5,
    winGoPage10,
    betWinGo,
    listOrderOld,
    GetMyEmerdList,
    addWinGo,
    handlingWinGo1P,
    initializeGamePeriods,
    getCurrentActivePeriod,
    cleanupOrphanedBets,
    ensurePeriodContinuity,
    processAllWinGoGamesSimple,
    processWinningBets,
    
}