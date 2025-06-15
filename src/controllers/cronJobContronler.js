import 'dotenv/config';
import connection from "../config/connectDB.js";
import winGoController from "./winGoController.js";
import k5Controller from "./k5Controller.js";
import k3Controller from "./k3Controller.js";
import cron from 'node-cron';
import { promisify } from 'util';
import request from 'request';

const requestPromise = promisify(request);

const cronJobGame1p = (io) => {
    cron.schedule('*/30 * * * * *', async() => {
        await winGoController.addWinGo(1);
        await winGoController.handlingWinGo1P(1);
        const [winGo1] = await connection.execute('SELECT * FROM `wingo` WHERE `game` = "wingo" ORDER BY `id` DESC LIMIT 2 ', []);
        const data = winGo1; // Cầu mới chưa có kết quả
        io.emit('data-server', { data: data });
    });

    cron.schedule('*/1 * * * *', async() => {
        await winGoController.addWinGo(3);
        await winGoController.handlingWinGo1P(3);
        const [winGo1] = await connection.execute('SELECT * FROM `wingo` WHERE `game` = "wingo3" ORDER BY `id` DESC LIMIT 2 ', []);
        const data = winGo1; // Cầu mới chưa có kết quả
        io.emit('data-server', { data: data });

        await k5Controller.add5D(1);
        await k5Controller.handling5D(1);
        const [k5D] = await connection.execute('SELECT * FROM 5d WHERE `game` = 1 ORDER BY `id` DESC LIMIT 2 ', []);
        const data2 = k5D; // Cầu mới chưa có kết quả
        io.emit('data-server-5d', { data: data2, 'game': '1' });

        await k3Controller.addK3(1);
        await k3Controller.handlingK3(1);
        const [k3] = await connection.execute('SELECT * FROM k3 WHERE `game` = 1 ORDER BY `id` DESC LIMIT 2 ', []);
        const data3 = k3; // Cầu mới chưa có kết quả
        io.emit('data-server-k3', { data: data3, 'game': '1' });
    });

    cron.schedule('*/3 * * * *', async() => {
        await winGoController.addWinGo(5);
        await winGoController.handlingWinGo1P(5);
        const [winGo1] = await connection.execute('SELECT * FROM `wingo` WHERE `game` = "wingo5" ORDER BY `id` DESC LIMIT 2 ', []);
        const data = winGo1; // Cầu mới chưa có kết quả
        io.emit('data-server', { data: data });

        await k5Controller.add5D(3);
        await k5Controller.handling5D(3);
        const [k5D] = await connection.execute('SELECT * FROM 5d WHERE `game` = 3 ORDER BY `id` DESC LIMIT 2 ', []);
        const data2 = k5D; // Cầu mới chưa có kết quả
        io.emit('data-server-5d', { data: data2, 'game': '3' });

        await k3Controller.addK3(3);
        await k3Controller.handlingK3(3);
        const [k3] = await connection.execute('SELECT * FROM k3 WHERE `game` = 3 ORDER BY `id` DESC LIMIT 2 ', []);
        const data3 = k3; // Cầu mới chưa có kết quả
        io.emit('data-server-k3', { data: data3, 'game': '3' });
    });

    cron.schedule('*/5 * * * *', async() => {
        await winGoController.addWinGo(10);
        await winGoController.handlingWinGo1P(10);
        const [winGo1] = await connection.execute('SELECT * FROM `wingo` WHERE `game` = "wingo10" ORDER BY `id` DESC LIMIT 2 ', []);
        const data = winGo1; // Cầu mới chưa có kết quả
        io.emit('data-server', { data: data });
        
        await k5Controller.add5D(5);
        await k5Controller.handling5D(5);
        const [k5D] = await connection.execute('SELECT * FROM 5d WHERE `game` = 5 ORDER BY `id` DESC LIMIT 2 ', []);
        const data2 = k5D; // Cầu mới chưa có kết quả
        io.emit('data-server-5d', { data: data2, 'game': '5' });

        await k3Controller.addK3(5);
        await k3Controller.handlingK3(5);
        const [k3] = await connection.execute('SELECT * FROM k3 WHERE `game` = 5 ORDER BY `id` DESC LIMIT 2 ', []);
        const data3 = k3; // Cầu mới chưa có kết quả
        io.emit('data-server-k3', { data: data3, 'game': '5' });
    });
    
    cron.schedule('*/10 * * * *', async() => {
        // await winGoController.addWinGo(10);
        // await winGoController.handlingWinGo1P(10);
        // const [winGo1] = await connection.execute('SELECT * FROM `wingo` WHERE `game` = "wingo10" ORDER BY `id` DESC LIMIT 2 ', []);
        // const data = winGo1; // Cầu mới chưa có kết quả
        // io.emit('data-server', { data: data });

        
        await k5Controller.add5D(10);
        await k5Controller.handling5D(10);
        const [k5D] = await connection.execute('SELECT * FROM 5d WHERE `game` = 10 ORDER BY `id` DESC LIMIT 2 ', []);
        const data2 = k5D; // Cầu mới chưa có kết quả
        io.emit('data-server-5d', { data: data2, 'game': '10' });

        await k3Controller.addK3(10);
        await k3Controller.handlingK3(10);
        const [k3] = await connection.execute('SELECT * FROM k3 WHERE `game` = 10 ORDER BY `id` DESC LIMIT 2 ', []);
        const data3 = k3; // Cầu mới chưa có kết quả
        io.emit('data-server-k3', { data: data3, 'game': '10' });
    });

    cron.schedule("5-10 0 * * *", async () => {
        try {
            const [directTeam] = await connection.query('SELECT `phone`, `invite`, `code`, `daily_turn_over` FROM turn_over WHERE daily_turn_over >= 10000');
            for (const user of directTeam) {
                const [checkBet] = await connection.query('SELECT DISTINCT phone FROM `minutes_1` WHERE `invite` = ? AND `money` >= 100', [user.code]);
                const [teamLength] = await connection.query('SELECT `phone` FROM users WHERE `invite` = ?', [user.code]);
                if (teamLength.length && checkBet.length >= 10 && user.daily_turn_over >= 10000 && user.daily_turn_over < 30000) {
                    await connection.query('INSERT INTO salary (`phone`, `salary`,`salary_type`, `code`) VALUES (?,?,?,?)', [user.phone, 1000, "Daily", user.code]);
                } else if (teamLength.length && checkBet.length >= 20 && user.daily_turn_over >= 30000 && user.daily_turn_over < 50000) {
                    await connection.query('INSERT INTO salary (`phone`, `salary`,`salary_type`, `code`) VALUES (?,?,?,?)', [user.phone, 3000, "Daily", user.code]);
                } else if (teamLength.length && checkBet.length >= 40 && user.daily_turn_over >= 50000 && user.daily_turn_over < 70000) {
                    await connection.query('INSERT INTO salary (`phone`, `salary`,`salary_type`, `code`) VALUES (?,?,?,?)', [user.phone, 5000, "Daily", user.code]);
                } else if (teamLength.length && checkBet.length >= 60 && user.daily_turn_over >= 70000 && user.daily_turn_over < 90000) {
                    await connection.query('INSERT INTO salary (`phone`, `salary`,`salary_type`, `code`) VALUES (?,?,?,?)', [user.phone, 7000, "Daily", user.code]);
                } else if (teamLength.length && checkBet.length >= 80 && user.daily_turn_over >= 90000 && user.daily_turn_over < 150000) {
                    await connection.query('INSERT INTO salary (`phone`, `salary`,`salary_type`,`code`) VALUES (?,?,?,?)', [user.phone, 9000, "Daily", user.code]);
                } else if (teamLength.length && checkBet.length >= 100 && user.daily_turn_over >= 150000 && user.daily_turn_over < 200000) {
                    await connection.query('INSERT INTO salary (`phone`, `salary`,`salary_type`,`code`) VALUES (?,?,?,?)', [user.phone, 15000, "Daily", user.code]);
                } else if (teamLength.length && checkBet.length >= 120 && user.daily_turn_over >= 200000 && user.daily_turn_over < 250000) {
                    await connection.query('INSERT INTO salary (`phone`, `salary`,`salary_type`,`code`) VALUES (?,?,?,?)', [user.phone, 20000, "Daily", user.code]);
                } else if (teamLength.length && checkBet.length >= 150 && user.daily_turn_over >= 250000 && user.daily_turn_over < 300000) {
                    await connection.query('INSERT INTO salary (`phone`, `salary`,`salary_type`,`code`) VALUES (?,?,?,?)', [user.phone, 25000, "Daily", user.code]);
                } else if (teamLength.length && checkBet.length >= 170 && user.daily_turn_over >= 300000 && user.daily_turn_over < 350000) {
                    await connection.query('INSERT INTO salary (`phone`, `salary`,`salary_type`,`code`) VALUES (?,?,?,?)', [user.phone, 30000, "Daily", user.code]);
                } else if (teamLength.length && checkBet.length >= 200 && user.daily_turn_over >= 350000 && user.daily_turn_over < 400000) {
                    await connection.query('INSERT INTO salary (`phone`, `salary`,`salary_type`,`code`) VALUES (?,?,?,?)', [user.phone, 35000, "Daily", user.code]);
                } else if (teamLength.length && checkBet.length >= 230 && user.daily_turn_over >= 400000 && user.daily_turn_over < 450000) {
                    await connection.query('INSERT INTO salary (`phone`, `salary`,`salary_type`,`code`) VALUES (?,?,?,?)', [user.phone, 40000, "Daily", user.code]);
                } else if (teamLength.length && checkBet.length >= 250 && user.daily_turn_over >= 450000 && user.daily_turn_over < 600000) {
                    await connection.query('INSERT INTO salary (`phone`, `salary`,`salary_type`,`code`) VALUES (?,?,?,?)', [user.phone, 45000, "Daily", user.code]);
                } else if (teamLength.length && checkBet.length >= 300 && user.daily_turn_over >= 600000 && user.daily_turn_over < 800000) {
                    await connection.query('INSERT INTO salary (`phone`, `salary`,`salary_type`,`code`) VALUES (?,?,?,?)', [user.phone, 60000, "Daily", user.code]);
                } else if (teamLength.length && checkBet.length >= 350 && user.daily_turn_over >= 800000 && user.daily_turn_over < 1000000) {
                    await connection.query('INSERT INTO salary (`phone`, `salary`,`salary_type`,`code`) VALUES (?,?,?,?)', [user.phone, 80000, "Daily", user.code]);
                } else if (teamLength.length && checkBet.length >= 400 && user.daily_turn_over >= 1000000 && user.daily_turn_over < 2000000) {
                    await connection.query('INSERT INTO salary (`phone`, `salary`,`salary_type`,`code`) VALUES (?,?,?,?)', [user.phone, 100000, "Daily", user.code]);
                } else if (teamLength.length && checkBet.length >= 500 && user.daily_turn_over >= 2000000) {
                    await connection.query('INSERT INTO salary (`phone`, `salary`,`salary_type`,`code`) VALUES (?,?,?,?)', [user.phone, 200000, "Daily", user.code]);
                }
            }
        await connection.execute('UPDATE users SET roses_today = ?', [0]);
    
        await connection.execute('UPDATE turn_over SET daily_turn_over = ?', [0]);
        await connection.execute('UPDATE point_list SET money = ?', [0]);
        } catch (error) {
            console.error('Error:', error);
        }
    });
    cron.schedule('1-4 0 * * 0', async () => {
        try {
            const currentDate = new Date();
            const oneWeekAgo = new Date(currentDate);
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            const formattedOneWeekAgo = oneWeekAgo.toISOString().slice(0, 19).replace('T', ' ');

            const [weeklyData] = await connection.query(`
              SELECT phone, code, salary_type, salary, date_time
              FROM salary
              WHERE salary >= 2000
              AND date_time >= ?
            `, [formattedOneWeekAgo]);
            for (const user of weeklyData) {
                if (user.code >= 7) {
                    await connection.query('INSERT INTO salary (`phone`, `salary`,`salary_type`,`code`) VALUES (?,?,?,?)', [user.phone, 1200, "Weekly", user.code]);
                }
            }
        } catch (error) {
            console.log('Error:', error);
        }
    });



    cron.schedule('*/4 * * * *', async () => {
        try {
            const [checkRecharge] = await connection.query(`SELECT * FROM recharge WHERE status = 0 AND (utr IS NOT NULL OR type = 'USDT')`);
            const [data] = await connection.query('SELECT recharge_bonus_2, recharge_bonus FROM admin WHERE id = 1');
            const apiKey = "OUQv781gCCuaobTC95SWaeRbOavBm5qyAnWwBkg8jpIfXIuE2aB1nzLsq9cAxkkA";
            for (const item of checkRecharge) {
                try {
                    const response = await requestPromise({
                        method: 'POST',
                        uri: 'https://connectblock.io/upi/check_status.php',
                        headers: {},
                        body: JSON.stringify({
                            utr: item.utr,
                            api_key: apiKey
                        }),
                    });
                    const USDTResponse = await requestPromise({
                        method: 'GET',
                        uri: `https://connectblock.io/upi/gettransactions.php?address=${item.transaction_id}&api_key=${apiKey}`,
                        headers: {},
                    });

                    const jsonParsed = JSON.parse(response.body);
                    const jsonParsedUSDT = JSON.parse(USDTResponse.body);
                    let status = jsonParsed.status;
                    let amount = jsonParsed.amount;

                    if(item.type === 'USDT' && jsonParsedUSDT.message==="OK"){
                        status = jsonParsedUSDT.status;
                        amount = jsonParsedUSDT.result.amount;
                    }
                    const amountInt = parseInt(amount, 10);

                    if (status === 1 || status === 2) {
                        if (amountInt === item.money) {
                            const [code] = await connection.query(`SELECT invite, total_money from users WHERE phone = ?`, [item.phone]);
                            let money = item.money;
                            
                            if(item.type==='USDT' && jsonParsedUSDT.message==="OK"){
                                money = item.money * 90;
                            }
                            let moneyInt = parseInt(money, 10);

                            await connection.query('UPDATE users SET money = money + ?, total_money = total_money + ? WHERE phone = ? ', [moneyInt, moneyInt, item.phone]);
                            await connection.query('UPDATE recharge SET status =? WHERE id_order =? AND phone = ?', [status, item.id_order, item.phone]);

                            let minMoney = data[0].recharge_bonus_2;

                            if (moneyInt >= minMoney) {
                                for (const user of code) {
                                    if (user.total_money <= 0) {
                                        let rechargeBonus = data[0].recharge_bonus;
                                        await connection.query('UPDATE users SET money = CONVERT(money, SIGNED) + ? WHERE code = ?', [rechargeBonus, user.invite]);
                                    }
                                }
                            }
                        } else if (amount !== item.money && amount !== undefined || status === 2) {
                            await connection.query('UPDATE recharge SET status =? WHERE id_order =? AND phone = ?', [2, item.id_order, item.phone]);
                        }
                    }
                    if (status === 0 && item.type ==='upi') {
                        await connection.query('UPDATE recharge SET status =? WHERE id_order =? AND phone = ?', [2, item.id_order, item.phone]);
                    }
                } catch (error) {
                    console.error('API Request Error:', error);
                }
            }
        } catch (error) {
            console.log('Error:', error);
        }
    });

}

export default {
    cronJobGame1p
}