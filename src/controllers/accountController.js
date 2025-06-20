import 'dotenv/config';
import connection from "../config/connectDB.js";
import jwt from 'jsonwebtoken'
import md5 from "md5";
import request from 'request';
import e from "express";

let timeNow = Date.now();

const randomString = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}


const randomNumber = (min, max) => {
    return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

const isNumber = (params) => {
    let pattern = /^[0-9]*\d$/;
    return pattern.test(params);
}

const ipAddress = (req) => {
    let ip = '';
    if (req.headers['x-forwarded-for']) {
        ip = req.headers['x-forwarded-for'].split(",")[0];
    } else if (req.connection && req.connection.remoteAddress) {
        ip = req.connection.remoteAddress;
    } else {
        ip = req.ip;
    }
    return ip;
}

const timeCreate = () => {
    const d = new Date();
    const time = d.getTime();
    return time;
}

const loginPage = async (req, res) => {
    return res.render("account/login.ejs");
}

const registerPage = async (req, res) => {
    return res.render("account/register.ejs");
}

const forgotPage = async (req, res) => {
    return res.render("account/forgot.ejs");
}

const login = async (req, res) => {
    let { username, pwd } = req.body;

    if (!username || !pwd || !username) {
        return res.status(200).json({
            message: 'ERROR!!!'
        });
    }

    try {
        const [rows] = await connection.query('SELECT * FROM users WHERE phone = ? AND password = ? ', [username, md5(pwd)]);
        const currentDateTime = getCurrentDateTime();
        const notificationText = `Your account was just logged in at ${currentDateTime}. If you have any questions, please contact our online customer service for assistance. We wish you happy gaming and great profits!`;
        
        if (rows.length == 1) {
            if (rows[0].status == 1) {
                const { password, money, ip, veri, ip_address, status, time, ...others } = rows[0];
                const accessToken = jwt.sign({
                    user: { ...others },
                    timeNow: timeNow
                }, process.env.JWT_ACCESS_TOKEN, { expiresIn: "1d" });
                await connection.execute('UPDATE `users` SET `token` = ? WHERE `phone` = ? ', [md5(accessToken), username]);
                await connection.query(
                    'INSERT INTO `login_notification` (`name`, `phone`, `notification_text`, `today`) VALUES (?, ?, ?, ?)',
                    ["LOGIN NOTIFICATION", username, notificationText, currentDateTime]
                );

                return res.status(200).json({
                    message: 'Login Successfully!',
                    status: true,
                    token: accessToken,
                    value: md5(accessToken)
                });
            } else {
                return res.status(200).json({
                    message: 'Account has been locked',
                    status: false
                });
            }
        } else {
            return res.status(200).json({
                message: 'Incorrect Username or Password',
                status: false
            });
        }
    } catch (error) {
        if (error) console.log(error);
        return res.status(500).json({
            message: error.message,
            status: false
        });
    }
}

function getCurrentDateTime() {
    const options = {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };

    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-IN', options);
    const parts = formatter.formatToParts(now);
    
    let year, month, day, hours, minutes, seconds;

    // Extract the formatted parts
    parts.forEach(part => {
        switch (part.type) {
            case 'year':
                year = part.value;
                break;
            case 'month':
                month = part.value;
                break;
            case 'day':
                day = part.value;
                break;
            case 'hour':
                hours = part.value;
                break;
            case 'minute':
                minutes = part.value;
                break;
            case 'second':
                seconds = part.value;
                break;
        }
    });

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const register = async (req, res) => {
    let now = new Date().getTime();
    let { username, password, inviteCode } = req.body;

    if (!username || !password || !inviteCode) {
        return res.status(400).json({
            message: 'Missing required fields',
            status: false
        });
    }

    if (username.length < 9 || username.length > 10 || !isNumber(username)) {
        return res.status(400).json({
            message: 'Invalid phone number',
            status: false
        });
    }

    const [results] = await connection.query('SELECT MAX(id_user) AS maxId FROM users'); 
    let lastId = results[0].maxId;
    let id_user = parseInt(lastId, 10) + 1;
    let otp2 = randomNumber(100000, 999999);
    let name_user = "Member" + randomNumber(10000, 99999);
    let code = randomString(5) + randomNumber(10000, 99999);
    let ip = ipAddress(req);
    let time = timeCreate();

    try {
        const [existingUser] = await connection.query('SELECT * FROM users WHERE phone = ?', [username]);
        if (existingUser.length > 0 && existingUser[0].veri === 1) {
            return res.status(400).json({
                message: 'Phone number already registered',
                status: false
            });
        }

        const [referrer] = await connection.query('SELECT * FROM users WHERE code = ?', [inviteCode]);
        if (referrer.length === 0) {
            return res.status(400).json({
                message: 'Referrer code does not exist',
                status: false
            });
        }

        const [ipUsers] = await connection.query('SELECT * FROM users WHERE ip_address = ?', [ip]);
        if (ipUsers.length > 3) {
            return res.status(400).json({
                message: 'IP address has reached registration limit',
                status: false
            });
        }

        let referrerPhone = referrer[0].level === 2 ? referrer[0].phone : referrer[0].ctv;

        const [adminSettings] = await connection.query('SELECT signup_bonus FROM admin WHERE id = 1');
        const signupBonus = parseInt(adminSettings[0].signup_bonus);

        const hashedPassword = md5(password);

        const sql = `
            INSERT INTO users 
            (id_user, phone, name_user, img_user, password, plain_password, money, code, invite, ctv, veri, otp, ip_address, status, time) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        await connection.execute(sql, [id_user, username, name_user, '8-ea087ede.png', hashedPassword, password, signupBonus, code, inviteCode, referrerPhone, 1, otp2, ip, 1, time]);
        await connection.execute('INSERT INTO point_list (phone) VALUES (?)', [username]);

        const [inviteUsers] = await connection.query('SELECT * FROM users WHERE invite = ?', [inviteCode]);
        if (referrer[0].name_user !== 'Admin') {
            let levels = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38, 41, 44];

            for (let i = 0; i < levels.length; i++) {
                if (inviteUsers.length >= levels[i]) {
                    await connection.execute('UPDATE users SET user_level = ? WHERE code = ?', [i + 1, inviteCode]);
                } else {
                    break;
                }
            }
        }

        await connection.execute('INSERT INTO turn_over (phone, code, invite) VALUES (?, ?, ?)', [username, code, inviteCode]);

        return res.status(200).json({
            message: "Registered successfully",
            status: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Server error',
            status: false
        });
    }
}

const verifyCode = async (req, res) => {
    let phone = req.body.phone;
    let now = new Date().getTime();
    let timeEnd = (+new Date) + 1000 * (60 * 2 + 0) + 500;
    let otp = randomNumber(100000, 999999);

    if (phone.length < 9 || phone.length > 10 || !isNumber(phone)) {
        return res.status(200).json({
            message: 'phone error',
            status: false
        });
    }

    const [rows] = await connection.query('SELECT * FROM users WHERE `phone` = ?', [phone]);
    if (rows.length == 0) {
        await request(`http://47.243.168.18:9090/sms/batch/v2?appkey=NFJKdK&appsecret=brwkTw&phone=84${phone}&msg=Your verification code is ${otp}&extend=${now}`, async (error, response, body) => {
            let data = JSON.parse(body);
            if (data.code == '00000') {
                await connection.execute("INSERT INTO users SET phone = ?, otp = ?, veri = 0, time_otp = ? ", [phone, otp, timeEnd]);
                return res.status(200).json({
                    message: 'Submitted successfully',
                    status: true,
                    timeStamp: timeNow,
                    timeEnd: timeEnd,
                });
            }
        });
    } else {
        let user = rows[0];
        if (user.time_otp - now <= 0) {
            request(`http://47.243.168.18:9090/sms/batch/v2?appkey=NFJKdK&appsecret=brwkTw&phone=84${phone}&msg=Your verification code is ${otp}&extend=${now}`, async (error, response, body) => {
                let data = JSON.parse(body);
                if (data.code == '00000') {
                    await connection.execute("UPDATE users SET otp = ?, time_otp = ? WHERE phone = ? ", [otp, timeEnd, phone]);
                    return res.status(200).json({
                        message: 'Submitted successfully',
                        status: true,
                        timeStamp: timeNow,
                        timeEnd: timeEnd,
                    });
                }
            });
        } else {
            return res.status(200).json({
                message: 'Send SMS regularly',
                status: false,
                timeStamp: timeNow,
            });
        }
    }

}

const verifyCodePass = async (req, res) => {
    let phone = req.body.phone;
    let now = new Date().getTime();
    let timeEnd = (+new Date) + 1000 * (60 * 2 + 0) + 500;
    let otp = randomNumber(100000, 999999);

    if (phone.length < 9 || phone.length > 10 || !isNumber(phone)) {
        return res.status(200).json({
            message: 'phone error',
            status: false
        });
    }

    const [rows] = await connection.query('SELECT * FROM users WHERE `phone` = ? AND veri = 1', [phone]);
    if (rows.length == 0) {
        return res.status(200).json({
            message: 'Account does not exist',
            status: false,
            timeStamp: timeNow,
        });
    } else {
        let user = rows[0];
        if (user.time_otp - now <= 0) {
            request(`http://47.243.168.18:9090/sms/batch/v2?appkey=NFJKdK&appsecret=brwkTw&phone=84${phone}&msg=Your verification code is ${otp}&extend=${now}`, async (error, response, body) => {
                let data = JSON.parse(body);
                if (data.code == '00000') {
                    await connection.execute("UPDATE users SET otp = ?, time_otp = ? WHERE phone = ? ", [otp, timeEnd, phone]);
                    return res.status(200).json({
                        message: 'Submitted successfully',
                        status: true,
                        timeStamp: timeNow,
                        timeEnd: timeEnd,
                    });
                }
            });
        } else {
            return res.status(200).json({
                message: 'Send SMS regularly',
                status: false,
                timeStamp: timeNow,
            });
        }
    }

}

const forGotPassword = async (req, res) => {
    let username = req.body.username;
    let otp = req.body.otp;
    let pwd = req.body.pwd;
    let now = new Date().getTime();
    let timeEnd = (+new Date) + 1000 * (60 * 2 + 0) + 500;
    let otp2 = randomNumber(100000, 999999);

    if (username.length < 9 || username.length > 10 || !isNumber(username)) {
        return res.status(200).json({
            message: 'phone error',
            status: false
        });
    }

    const [rows] = await connection.query('SELECT * FROM users WHERE `phone` = ? AND veri = 1', [username]);
    if (rows.length == 0) {
        return res.status(200).json({
            message: 'Account does not exist',
            status: false,
            timeStamp: timeNow,
        });
    } else {
        let user = rows[0];
        if (user.time_otp - now > 0) {
            if (user.otp == otp) {
                await connection.execute("UPDATE users SET password = ?, otp = ?, time_otp = ? WHERE phone = ? ", [md5(pwd), otp2, timeEnd, username]);
                return res.status(200).json({
                    message: 'Change password successfully',
                    status: true,
                    timeStamp: timeNow,
                    timeEnd: timeEnd,
                });
            } else {
                return res.status(200).json({
                    message: 'OTP code is incorrect',
                    status: false,
                    timeStamp: timeNow,
                });
            }
        } else {
            return res.status(200).json({
                message: 'OTP code has expired',
                status: false,
                timeStamp: timeNow,
            });
        }
    }

}

const keFuMenu = async(req, res) => {
    let auth = req.cookies.auth;

    const [users] = await connection.query('SELECT `level`, `ctv` FROM users WHERE token = ?', [auth]);

    let telegram = '';
    if (users.length == 0) {
        let [settings] = await connection.query('SELECT `telegram`, `cskh` FROM admin');
        telegram = settings[0].telegram;
    } else {
        if (users[0].level != 0) {
            var [settings] = await connection.query('SELECT * FROM admin');
        } else {
            var [check] = await connection.query('SELECT `telegram` FROM point_list WHERE phone = ?', [users[0].ctv]);
            if (check.length == 0) {
                var [settings] = await connection.query('SELECT * FROM admin');
            } else {
                var [settings] = await connection.query('SELECT `telegram` FROM point_list WHERE phone = ?', [users[0].ctv]);
            }
        }
        telegram = settings[0].telegram;
    }
    
    return res.render("keFuMenu.ejs", {telegram}); 
}

export default {
    loginPage,
    registerPage,
    forgotPage,
    login,
    register,
    verifyCode,
    verifyCodePass,
    forGotPassword,
    keFuMenu
}