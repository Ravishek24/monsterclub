import 'dotenv/config';
import connection from "../config/connectDB.js";
import jwt from 'jsonwebtoken'
import md5 from "md5";
// import e from "express";

const homePage = async (req, res) => {
    const [settings] = await connection.query('SELECT `app` FROM admin');
    let app = settings[0].app;
    return res.render("home/index.ejs", { app });
}

const fishing = async (req, res) => {
    return res.render("api/fishing.ejs");
}

const jslots = async (req, res) => {
    return res.render("api/jslots.ejs");
}
const poker = async (req, res) => {
    return res.render("api/poker.ejs");
}
const slots = async (req, res) => {
    return res.render("api/slots.ejs");
}
const spribe = async (req, res) => {
    return res.render("api/spribe.ejs");
}
const table = async (req, res) => {
    return res.render("api/table.ejs");
}
const rummy = async (req, res) => {
    return res.render("api/rummy.ejs");
}
const sports = async (req, res) => {
    return res.render("api/sports.ejs");
}
const casino = async (req, res) => {
    return res.render("api/casino.ejs");
}










const activityPage = async (req, res) => {
    return res.render("checkIn/activity.ejs");
}

const rebatePage = async (req, res) => {
    return res.render("checkIn/rebate.ejs");
}

const winstreakPage = async (req, res) => {
    return res.render("checkIn/winstreakBonus.ejs");
}

const agentPage = async (req, res) => {
    return res.render("checkIn/agent.ejs");
}
const giftPage = async (req, res) => {
    return res.render("checkIn/gifts.ejs");
}

const vipPage = async (req, res) => {
    return res.render("checkIn/vip.ejs");
}

const jackpotPage = async (req, res) => {
    return res.render("checkIn/jackpot.ejs");
}
const attenhisPage = async (req, res) => {
    return res.render("checkIn/attendanceHis.ejs");
}

const dailytaskPage = async (req, res) => {
    return res.render("checkIn/dailytask.ejs");
}

const invibonusPage = async (req, res) => {
    return res.render("checkIn/invibonus.ejs");
}

const checkInPage = async (req, res) => {
    return res.render("checkIn/checkIn.ejs");
}

const rewardrulePage = async (req, res) => {
    return res.render("checkIn/rewardRule.ejs");
}

const aviatorPage = async (req, res) => {
    return res.render("checkIn/aviatorDetail.ejs");
}

const invirecordPage = async (req, res) => {
    return res.render("checkIn/inviRecord.ejs");
}

const weeklyPage = async (req, res) => {
    return res.render("checkIn/weeklyDeposit.ejs");
}


const custom = async (req, res) => {
    return res.render("pages/src/components/AboutView.vue");
}

const checkDes = async (req, res) => {
    return res.render("checkIn/checkDes.ejs");
}

const checkRecord = async (req, res) => {
    return res.render("checkIn/checkRecord.ejs");
}


const atbonusPage = async (req, res) => {
    return res.render("checkIn/attendanceBonus.ejs");
}

const rechargebonusPage = async (req, res) => {
    return res.render("checkIn/rechargeBonus.ejs");
}


const addBank = async (req, res) => {
    return res.render("wallet/addbank.ejs");
}

// promotion
const promotionPage = async (req, res) => {
    return res.render("promotion/promotion.ejs");
}

const promotion1Page = async (req, res) => {
    return res.render("promotion/promotion1.ejs");
}

const promotionmyTeamPage = async (req, res) => {
    return res.render("promotion/myTeam.ejs");
}

const promotionDesPage = async (req, res) => {
    return res.render("promotion/promotionDes.ejs");
}

const comhistoryPage = async (req, res) => {
    return res.render("promotion/comhistory.ejs");
}

const tutorialPage = async (req, res) => {
    return res.render("promotion/tutorial.ejs");
}

const bonusRecordPage = async (req, res) => {
    return res.render("promotion/bonusrecord.ejs");
}

const rebateratioPage = async (req, res) => {
    return res.render("promotion/rebateRatio.ejs");
}

const prorulePage = async (req, res) => {
    return res.render("promotion/promotionRule.ejs");
}

const subdataPage = async (req, res) => {
    return res.render("promotion/subData.ejs");
}


const subordinatePage = async (req, res) => {
    return res.render("promotion/subordinate.ejs");
}
const prosharePage = async (req, res) => {
    return res.render("promotion/promotionShare.ejs");
}


// wallet


const transactionhistoryPage = async (req, res) => {
    return res.render("wallet/transactionhistory.ejs");
}


const walletPage = async (req, res) => {
    return res.render("wallet/index.ejs");
}

const rechargePage = async (req, res) => {
    return res.render("wallet/recharge.ejs", {
        MinimumMoney: process.env.MINIMUM_MONEY
    });
}

const rechargerecordPage = async (req, res) => {
    return res.render("wallet/rechargerecord.ejs");
}

const withdrawalPage = async (req, res) => {
    return res.render("wallet/withdrawal.ejs");
}

const withdrawalrecordPage = async (req, res) => {
    return res.render("wallet/withdrawalrecord.ejs");
}
const transfer = async (req, res) => {
    return res.render("wallet/transfer.ejs");
}

// member page
const mianPage = async (req, res) => {
    let auth = req.cookies.auth;
    const [user] = await connection.query('SELECT `level`,`phone` FROM users WHERE `token` = ? ', [auth]);
    const [settings] = await connection.query('SELECT `cskh` FROM admin');
    const [notificationResult] = await connection.query('SELECT * FROM `login_notification` WHERE `phone` = ? AND status = 0', [user[0].phone]);
    let cskh = settings[0].cskh;
    let level = user[0].level;
    let notificationCount = notificationResult.length;
    return res.render("member/index.ejs", { level, cskh, notificationCount});
}
const aboutPage = async (req, res) => {
    return res.render("member/about/index.ejs");
}

const recordsalary = async (req, res) => {
    return res.render("member/about/recordsalary.ejs");
}

const gamehistoryPage = async (req, res) => {
    return res.render("member/gameHistory.ejs");
}

const gamestatPage = async (req, res) => {
    return res.render("member/gameStat.ejs");
}

const settingsPage = async (req, res) => {
    return res.render("member/settings.ejs");
}

const guidelinePage = async (req, res) => {
    return res.render("member/guideline.ejs");
}

const transactionhisPage = async (req, res) => {
    return res.render("member/transactionHis.ejs");
}
const privacyPolicy = async (req, res) => {
    return res.render("member/about/privacyPolicy.ejs");
}

const newtutorial = async (req, res) => {
    return res.render("member/newtutorial.ejs");
}

const avatorPage = async (req, res) => {
    return res.render("member/avator.ejs");
}

const googleverifyPage = async (req, res) => {
    return res.render("member/googleVerify.ejs");
}
const bindmailPage = async (req, res) => {
    return res.render("member/bindMail.ejs");
}

const messagesPage = async (req, res) => {
    return res.render("member/messages.ejs");
}


const forgot = async (req, res) => {
    let auth = req.cookies.auth;
    const [user] = await connection.query('SELECT `time_otp` FROM users WHERE token = ? ', [auth]);
    let time = user[0].time_otp;
    return res.render("member/forgot.ejs", { time });
}

const redenvelopes = async (req, res) => {
    return res.render("member/redenvelopes.ejs");
}

const riskAgreement = async (req, res) => {
    return res.render("member/about/riskAgreement.ejs");
}

const myProfilePage = async (req, res) => {
    return res.render("member/myProfile.ejs");
}
const feedbackPage = async (req, res) => {
    return res.render("member/feedback.ejs");
}

const getSalaryRecord = async (req, res) => {
    const auth = req.cookies.auth;

    const [rows] = await connection.query(`SELECT * FROM users WHERE token = ?`, [auth]);
    let rowstr = rows[0];
    if (!rows) {
        return res.status(200).json({
            message: 'Failed',
            status: false,

        });
    }
    const [getPhone] = await connection.query(
        `SELECT * FROM salary WHERE phone = ? ORDER BY time DESC`,
        [rowstr.phone]
    );


    console.log("asdasdasd : " + [rows.phone])
    return res.status(200).json({
        message: 'Success',
        status: true,
        data: {

        },
        rows: getPhone,
    })
}

export default {
    homePage,
    fishing,
    jslots,
    poker,
    slots,
    spribe,
    table,
    rummy,
    sports,
    casino,
    activityPage,
    rebatePage,
    winstreakPage,
    agentPage,
    giftPage,
    vipPage,
    jackpotPage,
    attenhisPage,
    dailytaskPage,
    invibonusPage,
    checkInPage,
    rewardrulePage,
    aviatorPage,
    invirecordPage,
    weeklyPage,
    custom,
    checkDes,
    checkRecord,
    atbonusPage,
    rechargebonusPage,
    addBank,
    promotionPage,
    promotion1Page,
    promotionmyTeamPage,
    promotionDesPage,
    comhistoryPage,
    tutorialPage,
    bonusRecordPage,
    rebateratioPage,
    prorulePage,
    subdataPage,
    subordinatePage,
    prosharePage,
    transactionhistoryPage,
    walletPage,
    rechargePage,
    rechargerecordPage,
    withdrawalPage,
    withdrawalrecordPage,
    transfer,
    mianPage,
    aboutPage,
    recordsalary,
    gamehistoryPage,
    gamestatPage,
    settingsPage,
    guidelinePage,
    transactionhisPage,
    privacyPolicy,
    newtutorial,
    avatorPage,
    googleverifyPage,
    bindmailPage,
    messagesPage,
    forgot,
    redenvelopes,
    riskAgreement,
    myProfilePage,
    feedbackPage,
    getSalaryRecord
}