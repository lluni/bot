const debug = require('debug')('kcapp-bot:main');
const decache = require('decache');
const sleep = require('./sleep');

let firstThrow = true;

async function doScore(socket, bot) {
    const player = socket.currentPlayer;
    if (player.player_id === bot.id) {
        if (firstThrow) {
            debug(`Waiting because of first throw`);
            await sleep(5000); // wait for page to load
        }
        await sleep(500);
        await bot.score(socket);
        await sleep(1000);
        socket.emitVisit();
    }
    firstThrow = false;
}

async function handleScoreUpdate(socket, data, bot) {
    const leg = data.leg;
    if (leg.is_finished) {
        return;
    } else if (leg.current_player_id !== bot.id) {
        debug(`[${leg.id}] Not our turn, waiting...`);
    } else if (data.is_undo) {
        debug(`[${leg.id}] Recevied undo visit, forwarding`);
        bot.undoVisit();
        socket.emit('undo_visit', {});
    } else {
        doScore(socket, bot);
    }
}

module.exports = (botId, sioURL, sioPort = 3000, apiURL = 'http://localhost:8001', protocol = 'http') => {
    return {
        playLeg: (legId, botSkill) => {
            const bot = require('./bot')(botId, botSkill);

            const kcapp = require('kcapp-sio-client/kcapp')(sioURL, sioPort, 'kcapp-bot', protocol);
             // Make sure we get a separate instance for each leg we connect to...
            decache('kcapp-sio-client/kcapp');
            kcapp.connectLegNamespace(legId, (socket) => {
                debug(`[${legId}] kcapp-bot connected to leg`);
                firstThrow = true;

                socket.on('score_update', (data) => {
                    handleScoreUpdate(socket, data, bot);
                });
                socket.on('leg_finished', (data) => {
                    debug(`[${legId}] Leg is finished`);
                    socket.disconnect();
                });
                doScore(socket, bot);
            });
        },
        replayLeg: (legId, playerId, startingScore = 301) => {
            const bot = require('./replay-bot')(botId, legId, playerId, apiURL, startingScore);

            const kcapp = require('kcapp-sio-client/kcapp')(sioURL, sioPort, 'kcapp-bot', protocol);
             // Make sure we get a separate instance for each leg we connect to...
            decache('kcapp-sio-client/kcapp');
            kcapp.connectLegNamespace(legId, (socket) => {
                debug(`[${legId}] replay-bot connected to leg`);
                firstThrow = true;

                socket.on('score_update', (data) => {
                    handleScoreUpdate(socket, data, bot);
                });
                socket.on('leg_finished', (data) => {
                    debug(`[${legId}] Leg is finished`);
                    socket.disconnect();
                });
                doScore(socket, bot);
            });
        }
    };
};
