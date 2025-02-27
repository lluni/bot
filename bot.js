const debug = require('debug')('kcapp-bot:bot');
const sleep = require('./sleep');

/** Array of Bogey numbers */
exports.BOGEY_NUMBERS = [169, 168, 166, 165, 163, 162, 159];

/** Miss */
const MISS = 0;
/** Multiplier Single */
const SINGLE = 1;
/** Multiplier Double */
const DOUBLE = 2;
/** Multiplier Triple */
const TRIPLE = 3;

const BULLSEYE = 25;

/** Array holding all values of the dart board in a circular order */
const BOARD = [ 20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5 ];

/** Array holding multiplier values of the dart board in a circular order */
const BOARD_MULTIPLIERS = [ SINGLE, TRIPLE, SINGLE, DOUBLE ];

/** Preferred checkouts for different numbers */
const CHECKOUT_GUIDE = {
    170: [{ score: 20, multiplier: TRIPLE }, { score: 20, multiplier: TRIPLE }, { score: BULLSEYE, multiplier: DOUBLE }],
    167: [{ score: 20, multiplier: TRIPLE }, { score: 19, multiplier: TRIPLE }, { score: BULLSEYE, multiplier: DOUBLE }],
    164: [{ score: 19, multiplier: TRIPLE }, { score: 19, multiplier: TRIPLE }, { score: BULLSEYE, multiplier: DOUBLE }],
    161: [{ score: 20, multiplier: TRIPLE }, { score: 17, multiplier: TRIPLE }, { score: BULLSEYE, multiplier: DOUBLE }],
    160: [{ score: 20, multiplier: TRIPLE }, { score: 20, multiplier: TRIPLE }, { score: 20, multiplier: DOUBLE }],
    158: [{ score: 20, multiplier: TRIPLE }, { score: 20, multiplier: TRIPLE }, { score: 19, multiplier: DOUBLE }],
    157: [{ score: 19, multiplier: TRIPLE }, { score: 20, multiplier: TRIPLE }, { score: 20, multiplier: DOUBLE }],
    156: [{ score: 20, multiplier: TRIPLE }, { score: 20, multiplier: TRIPLE }, { score: 18, multiplier: DOUBLE }],
    155: [{ score: 20, multiplier: TRIPLE }, { score: 19, multiplier: TRIPLE }, { score: 19, multiplier: DOUBLE }],
    154: [{ score: 20, multiplier: TRIPLE }, { score: 18, multiplier: TRIPLE }, { score: 20, multiplier: DOUBLE }],
    153: [{ score: 20, multiplier: TRIPLE }, { score: 19, multiplier: TRIPLE }, { score: 18, multiplier: DOUBLE }],
    152: [{ score: 20, multiplier: TRIPLE }, { score: 20, multiplier: TRIPLE }, { score: 16, multiplier: DOUBLE }],
    151: [{ score: 20, multiplier: TRIPLE }, { score: 17, multiplier: TRIPLE }, { score: 20, multiplier: DOUBLE }],
    150: [{ score: 20, multiplier: TRIPLE }, { score: 18, multiplier: TRIPLE }, { score: 18, multiplier: DOUBLE }],
    149: [{ score: 20, multiplier: TRIPLE }, { score: 19, multiplier: TRIPLE }, { score: 16, multiplier: DOUBLE }],
    148: [{ score: 20, multiplier: TRIPLE }, { score: 20, multiplier: TRIPLE }, { score: 14, multiplier: DOUBLE }],
    147: [{ score: 20, multiplier: TRIPLE }, { score: 17, multiplier: TRIPLE }, { score: 18, multiplier: DOUBLE }],
    146: [{ score: 20, multiplier: TRIPLE }, { score: 18, multiplier: TRIPLE }, { score: 16, multiplier: DOUBLE }],
    145: [{ score: 20, multiplier: TRIPLE }, { score: 15, multiplier: TRIPLE }, { score: 20, multiplier: DOUBLE }],
    144: [{ score: 20, multiplier: TRIPLE }, { score: 20, multiplier: TRIPLE }, { score: 12, multiplier: DOUBLE }],
    143: [{ score: 20, multiplier: TRIPLE }, { score: 17, multiplier: TRIPLE }, { score: 16, multiplier: DOUBLE }],
    142: [{ score: 20, multiplier: TRIPLE }, { score: 14, multiplier: TRIPLE }, { score: 20, multiplier: DOUBLE }],
    141: [{ score: 20, multiplier: TRIPLE }, { score: 19, multiplier: TRIPLE }, { score: 12, multiplier: DOUBLE }],
    140: [{ score: 20, multiplier: TRIPLE }, { score: 16, multiplier: TRIPLE }, { score: 16, multiplier: DOUBLE }],
    139: [{ score: 20, multiplier: TRIPLE }, { score: 13, multiplier: TRIPLE }, { score: 20, multiplier: DOUBLE }],
    138: [{ score: 20, multiplier: TRIPLE }, { score: 16, multiplier: TRIPLE }, { score: 15, multiplier: DOUBLE }],
    137: [{ score: 18, multiplier: TRIPLE }, { score: 17, multiplier: TRIPLE }, { score: 16, multiplier: DOUBLE }],
    136: [{ score: 20, multiplier: TRIPLE }, { score: 20, multiplier: TRIPLE }, { score: 8, multiplier: DOUBLE }],
    135: [{ score: 20, multiplier: TRIPLE }, { score: 13, multiplier: TRIPLE }, { score: 18, multiplier: DOUBLE }],
    134: [{ score: 20, multiplier: TRIPLE }, { score: 14, multiplier: TRIPLE }, { score: 16, multiplier: DOUBLE }],
    133: [{ score: 20, multiplier: TRIPLE }, { score: 19, multiplier: TRIPLE }, { score: 8, multiplier: DOUBLE }],
    132: [{ score: 20, multiplier: TRIPLE }, { score: 16, multiplier: TRIPLE }, { score: 12, multiplier: DOUBLE }],
    131: [{ score: 20, multiplier: TRIPLE }, { score: 13, multiplier: TRIPLE }, { score: 16, multiplier: DOUBLE }],
    130: [{ score: 20, multiplier: TRIPLE }, { score: 18, multiplier: TRIPLE }, { score: 8, multiplier: DOUBLE }],
    129: [{ score: 19, multiplier: TRIPLE }, { score: 16, multiplier: TRIPLE }, { score: 12, multiplier: DOUBLE }],
    128: [{ score: 20, multiplier: TRIPLE }, { score: 20, multiplier: TRIPLE }, { score: 4, multiplier: DOUBLE }],
    127: [{ score: 20, multiplier: TRIPLE }, { score: 17, multiplier: TRIPLE }, { score: 8, multiplier: DOUBLE }],
    126: [{ score: 19, multiplier: TRIPLE }, { score: 19, multiplier: SINGLE }, { score: BULLSEYE, multiplier: DOUBLE }],
    125: [{ score: 20, multiplier: TRIPLE }, { score: 19, multiplier: TRIPLE }, { score: 4, multiplier: DOUBLE }],
    124: [{ score: 20, multiplier: TRIPLE }, { score: 16, multiplier: TRIPLE }, { score: 8, multiplier: DOUBLE }],
    123: [{ score: 20, multiplier: TRIPLE }, { score: 13, multiplier: TRIPLE }, { score: 12, multiplier: DOUBLE }],
    122: [{ score: 18, multiplier: TRIPLE }, { score: 18, multiplier: SINGLE }, { score: BULLSEYE, multiplier: DOUBLE }],
    121: [{ score: 19, multiplier: TRIPLE }, { score: 14, multiplier: SINGLE }, { score: BULLSEYE, multiplier: DOUBLE }],
    120: [{ score: 20, multiplier: TRIPLE }, { score: 20, multiplier: SINGLE }, { score: 20, multiplier: DOUBLE }],
    119: [{ score: 20, multiplier: TRIPLE }, { score: 19, multiplier: SINGLE }, { score: 20, multiplier: DOUBLE }],
    118: [{ score: 20, multiplier: TRIPLE }, { score: 18, multiplier: SINGLE }, { score: 20, multiplier: DOUBLE }],
    117: [{ score: 20, multiplier: TRIPLE }, { score: 17, multiplier: SINGLE }, { score: 20, multiplier: DOUBLE }],
    116: [{ score: 20, multiplier: TRIPLE }, { score: 16, multiplier: SINGLE }, { score: 20, multiplier: DOUBLE }],
    115: [{ score: 20, multiplier: TRIPLE }, { score: 15, multiplier: SINGLE }, { score: 20, multiplier: DOUBLE }],
    114: [{ score: 20, multiplier: TRIPLE }, { score: 14, multiplier: SINGLE }, { score: 20, multiplier: DOUBLE }],
    113: [{ score: 20, multiplier: TRIPLE }, { score: 13, multiplier: SINGLE }, { score: 20, multiplier: DOUBLE }],
    112: [{ score: 20, multiplier: TRIPLE }, { score: 12, multiplier: SINGLE }, { score: 20, multiplier: DOUBLE }],
    111: [{ score: 20, multiplier: TRIPLE }, { score: 19, multiplier: SINGLE }, { score: 16, multiplier: DOUBLE }],
    110: [{ score: 20, multiplier: TRIPLE }, { score: 10, multiplier: SINGLE }, { score: 20, multiplier: DOUBLE }],
    109: [{ score: 19, multiplier: TRIPLE }, { score: 12, multiplier: SINGLE }, { score: 20, multiplier: DOUBLE }],
    108: [{ score: 20, multiplier: TRIPLE }, { score: 16, multiplier: SINGLE }, { score: 16, multiplier: DOUBLE }],
    107: [{ score: 19, multiplier: TRIPLE }, { score: 10, multiplier: SINGLE }, { score: 20, multiplier: DOUBLE }],
    106: [{ score: 20, multiplier: TRIPLE }, { score: 10, multiplier: SINGLE }, { score: 18, multiplier: DOUBLE }],
    105: [{ score: 20, multiplier: TRIPLE }, { score: 13, multiplier: SINGLE }, { score: 16, multiplier: DOUBLE }],
    104: [{ score: 20, multiplier: TRIPLE }, { score: 12, multiplier: SINGLE }, { score: 16, multiplier: DOUBLE }],
    103: [{ score: 19, multiplier: TRIPLE }, { score: 10, multiplier: SINGLE }, { score: 18, multiplier: DOUBLE }],
    102: [{ score: 20, multiplier: TRIPLE }, { score: 10, multiplier: SINGLE }, { score: 16, multiplier: DOUBLE }],
    101: [{ score: 17, multiplier: TRIPLE }, { score: 10, multiplier: SINGLE }, { score: 20, multiplier: DOUBLE }],
    100: [{ score: 20, multiplier: TRIPLE }, { score: 20, multiplier: DOUBLE }],
    99: [{ score: 19, multiplier: TRIPLE }, { score: 10, multiplier: SINGLE }, { score: 16, multiplier: DOUBLE }],
    98: [{ score: 20, multiplier: TRIPLE }, { score: 19, multiplier: DOUBLE }],
    97: [{ score: 19, multiplier: TRIPLE }, { score: 20, multiplier: DOUBLE }],
    96: [{ score: 20, multiplier: TRIPLE }, { score: 18, multiplier: DOUBLE }],
    95: [{ score: 19, multiplier: TRIPLE }, { score: 19, multiplier: DOUBLE }],
    94: [{ score: 18, multiplier: TRIPLE }, { score: 20, multiplier: DOUBLE }],
    93: [{ score: 19, multiplier: TRIPLE }, { score: 18, multiplier: DOUBLE }],
    92: [{ score: 20, multiplier: TRIPLE }, { score: 16, multiplier: DOUBLE }],
    91: [{ score: 17, multiplier: TRIPLE }, { score: 20, multiplier: DOUBLE }],
    90: [{ score: 18, multiplier: TRIPLE }, { score: 18, multiplier: DOUBLE }],
    89: [{ score: 19, multiplier: TRIPLE }, { score: 16, multiplier: DOUBLE }],
    88: [{ score: 16, multiplier: TRIPLE }, { score: 20, multiplier: DOUBLE }],
    87: [{ score: 17, multiplier: TRIPLE }, { score: 18, multiplier: DOUBLE }],
    86: [{ score: 18, multiplier: TRIPLE }, { score: 16, multiplier: DOUBLE }],
    85: [{ score: 15, multiplier: TRIPLE }, { score: 20, multiplier: DOUBLE }],
    84: [{ score: 16, multiplier: TRIPLE }, { score: 18, multiplier: DOUBLE }],
    83: [{ score: 17, multiplier: TRIPLE }, { score: 16, multiplier: DOUBLE }],
    82: [{ score: 14, multiplier: TRIPLE }, { score: 20, multiplier: DOUBLE }],
    81: [{ score: 15, multiplier: TRIPLE }, { score: 18, multiplier: DOUBLE }],
    80: [{ score: 16, multiplier: TRIPLE }, { score: 16, multiplier: DOUBLE }],
    79: [{ score: 13, multiplier: TRIPLE }, { score: 20, multiplier: DOUBLE }],
    78: [{ score: 18, multiplier: TRIPLE }, { score: 12, multiplier: DOUBLE }],
    77: [{ score: 15, multiplier: TRIPLE }, { score: 16, multiplier: DOUBLE }],
    76: [{ score: 20, multiplier: TRIPLE }, { score: 8, multiplier: DOUBLE }],
    75: [{ score: 13, multiplier: TRIPLE }, { score: 18, multiplier: DOUBLE }],
    74: [{ score: 14, multiplier: TRIPLE }, { score: 16, multiplier: DOUBLE }],
    73: [{ score: 19, multiplier: TRIPLE }, { score: 8, multiplier: DOUBLE }],
    72: [{ score: 16, multiplier: TRIPLE }, { score: 12, multiplier: DOUBLE }],
    71: [{ score: 13, multiplier: TRIPLE }, { score: 16, multiplier: DOUBLE }],
    70: [{ score: 18, multiplier: TRIPLE }, { score: 8, multiplier: DOUBLE }],
    69: [{ score: 19, multiplier: SINGLE }, { score: BULLSEYE, multiplier: DOUBLE }],
    68: [{ score: 20, multiplier: TRIPLE }, { score: 4, multiplier: DOUBLE }],
    67: [{ score: 17, multiplier: TRIPLE }, { score: 8, multiplier: DOUBLE }],
    66: [{ score: 10, multiplier: TRIPLE }, { score: 18, multiplier: DOUBLE }],
    65: [{ score: 19, multiplier: TRIPLE }, { score: 4, multiplier: DOUBLE }],
    64: [{ score: 16, multiplier: TRIPLE }, { score: 8, multiplier: DOUBLE }],
    63: [{ score: 13, multiplier: TRIPLE }, { score: 12, multiplier: DOUBLE }],
    62: [{ score: 10, multiplier: TRIPLE }, { score: 16, multiplier: DOUBLE }],
    61: [{ score: 15, multiplier: TRIPLE }, { score: 8, multiplier: DOUBLE }],
    60: [{ score: 20, multiplier: SINGLE }, { score: 20, multiplier: DOUBLE }],
    59: [{ score: 19, multiplier: SINGLE }, { score: 20, multiplier: DOUBLE }],
    58: [{ score: 18, multiplier: SINGLE }, { score: 20, multiplier: DOUBLE }],
    57: [{ score: 17, multiplier: SINGLE }, { score: 20, multiplier: DOUBLE }],
    56: [{ score: 16, multiplier: SINGLE }, { score: 20, multiplier: DOUBLE }],
    55: [{ score: 15, multiplier: SINGLE }, { score: 20, multiplier: DOUBLE }],
    54: [{ score: 14, multiplier: SINGLE }, { score: 20, multiplier: DOUBLE }],
    53: [{ score: 13, multiplier: SINGLE }, { score: 20, multiplier: DOUBLE }],
    52: [{ score: 12, multiplier: SINGLE }, { score: 20, multiplier: DOUBLE }],
    51: [{ score: 19, multiplier: SINGLE }, { score: 16, multiplier: DOUBLE }],
    50: [{ score: 10, multiplier: SINGLE }, { score: 20, multiplier: DOUBLE }],
    49: [{ score: 17, multiplier: SINGLE }, { score: 16, multiplier: DOUBLE }],
    48: [{ score: 16, multiplier: SINGLE }, { score: 16, multiplier: DOUBLE }],
    47: [{ score: 15, multiplier: SINGLE }, { score: 16, multiplier: DOUBLE }],
    46: [{ score: 6, multiplier: SINGLE }, { score: 20, multiplier: DOUBLE }],
    45: [{ score: 13, multiplier: SINGLE }, { score: 16, multiplier: DOUBLE }],
    44: [{ score: 12, multiplier: SINGLE }, { score: 16, multiplier: DOUBLE }],
    43: [{ score: 3, multiplier: SINGLE }, { score: 20, multiplier: DOUBLE }],
    42: [{ score: 10, multiplier: SINGLE }, { score: 16, multiplier: DOUBLE }],
    41: [{ score: 9, multiplier: SINGLE }, { score: 16, multiplier: DOUBLE }]
}

/**
 * Get a random value from the given array
 * @param {array} list - List of values
 */
function getRandom(list) {
    return parseInt(list[Math.floor(Math.random() * list.length)]);
}

/** Check if the two darts are equal
 * @param {object} - First dart
 * @param {object} - Second dart
 */
function isEqual(dart1, dart2) {
    return dart1.score === dart2.score && dart1.multiplier === dart2.multiplier;
}

/**
 * Get adjacent elements from the list of the given idx
 * @param {array} list - List to get adjecent elements from
 * @param {int} idx - Index of element to get adjacent from
 * @param {int} number - Number of adjacent elements to get
 */
function getAdjacent(list, idx, number) {
    const newList = [];

    for (let i = 1; i <= number; i++) {
        if (idx - i < 0) {
            newList.push(list[list.length + idx - i]);
        } else {
            newList.push(list[idx - i]);
        }
        if (idx + i >= list.length) {
            newList.push(list[list.length - idx - i]);
        } else {
            newList.push(list[idx + i]);
        }
    }
    return newList;
}

/**
 * Check if we are successful with the given percentage
 * @param {int} targetPercentage - Percetage chance we are successful
 */
function isSuccessful(targetPercentage) {
    return Math.random() < targetPercentage;
}

/**
 * Undo the previous visit
 */
exports.undoVisit = () => {
    this.totalVisits--;
}

/**
 * Attempt a throw at the given number
 *
 * @param {int} number - Number we are aiming for
 * @param {int} multiplier - Multiplier we are aiming for
 */
exports.attemptThrow = (number, multiplier) => {
    let score = number;
    const hitrate = this.bot.hitrates[multiplier];
    if (!isSuccessful(hitrate)) {
        if (multiplier == TRIPLE) {
            // We either hit single, or adjacent
            if (isSuccessful(this.bot.hitrates[SINGLE])) {
                multiplier = SINGLE;
            } else {
                score = getRandom(getAdjacent(BOARD, BOARD.indexOf(score), this.bot.miss_range));
                multiplier = SINGLE;
            }
        } else if (multiplier === DOUBLE) {
            // We either hit miss, or single
            if (isSuccessful(this.bot.hitrates[MISS])) {
                score = 0;
                multiplier = SINGLE;
            } else {
                multiplier = SINGLE;
            }
        } else {
            // We hit adajcent
            score = getRandom(getAdjacent(BOARD, BOARD.indexOf(score), this.bot.miss_range));
            multiplier = getRandom(getAdjacent(BOARD_MULTIPLIERS, BOARD_MULTIPLIERS.indexOf(multiplier), 1));
        }
    }
    const dart = { score: score, multiplier: multiplier };
    debug(`Throw ${JSON.stringify(dart)}`);
    return dart;
}

/**
 * Attempt to checkout based on the current score
 *
 * @param {int} - Current score
 * @param {int} - Number of darts thrown
 */
exports.attemptCheckout = (currentScore, thrown) => {
    const darts = [];
    if (currentScore > 40) {
        const checkout = CHECKOUT_GUIDE[currentScore];
        if (3 - thrown >= checkout.length) {
            debug(`Trying for a big checkout: ${currentScore}`);
            for (let i = thrown; i < checkout.length; i++) {
                const dart = this.attemptThrow(checkout[i].score, checkout[i].multiplier);
                darts.push(dart);
                if (!isEqual(dart, checkout[i])) {
                    break;
                }
                currentScore -= dart.score * dart.multiplier;
                if (currentScore <= 0) {
                    break;
                }
            }
        } else {
            debug("We don't have enough darts, just score");
            // We cannot complete a perfect checkout, so lets just score some points
            // TODO improve
            for (let i = thrown; i < 3; i++) {
                const dart = this.attemptThrow(20, 1);
                darts.push(dart);
                currentScore -= dart.score * dart.multiplier;
                if (currentScore <= 1) {
                    break;
                }
            }
        }
    } else {
        // Only attempt checkout if we have an even number
        while (currentScore % 2 !== 0) {
            const dart = this.attemptThrow(1, 1);
            darts.push(dart);
            currentScore -= dart.score * dart.multiplier;
            if (currentScore <= 0) {
                break;
            }
        }

        if (currentScore > 1) {
            debug(`Score is ${currentScore}, trying to checkout`);
            for (let i = thrown; i < 3; i++) {
                if (currentScore % 2 === 0) {
                    const dart = this.attemptThrow(currentScore / 2, 2);
                    darts.push(dart);
                    currentScore -= dart.score * dart.multiplier;
                    if (currentScore <= 0) {
                        break;
                    }
                } else {
                    const dart = this.attemptThrow(1, 1);
                    darts.push(dart);
                    currentScore -= dart.score * dart.multiplier;
                    if (currentScore <= 0) {
                        break;
                    }
                }
            }
        }
    }
    return darts;
}

/**
 * Score a visit
 * @param {object} - Socket for scoring
 */
exports.score = async (socket) => {
    if (this.visits[this.totalVisits]) {
        const visit = this.visits[this.totalVisits];
        // We have a previous visit, just re use it
        socket.emitThrow(visit[0]);
        await sleep(100);
        socket.emitThrow(visit[1]);
        await sleep(100);
        socket.emitThrow(visit[2]);
        await sleep(100);
        this.totalVisits++;
        return;
    }

    const player = socket.currentPlayer;
    let thrown = 0;
    while (thrown < 3 && player.current_score > 0) {
        if (player.current_score > 170 || this.BOGEY_NUMBERS.includes(player.current_score)) {
            const dart = this.attemptThrow(20, 3);
            socket.emitThrow(dart);
            await sleep(100);
            thrown++;
        } else {
            const darts = this.attemptCheckout(player.current_score, thrown);
            for (let i = 0; i < darts.length; i++) {
                const dart = darts[i];
                player.current_score -= dart.score * dart.multiplier;
                socket.emitThrow(dart);
                await sleep(100);
                if (player.current_score <= 1) {
                    break;
                }
            }
            thrown += darts.length;
        }
    }
    this.totalVisits++;
    this.visits.push(socket.throws);
}

/**
 * Create a new bot with the given skill
 * @param {int} - Skill level of the bot
 */
exports.setup = (botSkill) => {
    this.bot = botSkill;
    debug(`Configured "${this.bot.name}" bot => ${JSON.stringify(this.bot)}`);
}

module.exports = (id, skill) => {
    this.id = id;
    this.setup(skill);
    this.visits = [];
    this.totalVisits = 0;
    return this;
}
