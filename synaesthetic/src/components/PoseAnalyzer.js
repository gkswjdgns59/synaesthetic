
const initMark = {};
const finMark = {};

// analyze object to get results
const analyzeObject = (arr) => {
    let anglesOfElbow = [];
    let steps = [];
    let shoulderHeights = [];
    let anglesOfArm = [];
    let results = {};

    for (let frame = 0; frame < arr.length; frame++) {
        updatePaceMarker(arr[frame].x, frame);

        if (initMark.pos != null && finMark.pos == null) {
            anglesOfElbow.push(arr[frame].angleOfElbow);
            steps.push(arr[frame].step);
            shoulderHeights.push(arr[frame].shoulderHeight);
            anglesOfArm.push(arr[frame].angleOfArm);
        }
    }

    if (steps.length > 20) {
        // average angle of left elbow (11-13-15)
        results['averageAngleOfElbow'] = getRound(getAverage(anglesOfElbow));

        // average length of steps (25-26)
        results['averageStep'] = getRound(getAverage(steps));

        // standard deviation of left shoulder height (11)
        results['svShoulderHeight'] = getRound(getSV(shoulderHeights) * 10000);

        // standard deviation of angle bw left arm (11-13-vertical line)
        results['svAngleOfArm'] = getRound(getSV(anglesOfArm));

        // pace as the number of frames
        if (finMark.pos != null) {
            results['pace'] = finMark.idx - initMark.idx;
        }
    }

    return results;
}

// manage pace marks
const updatePaceMarker = (pos, idx) => {

    if (0.0 < pos < 0.15 || 0.9 < pos < 1.0) {
        // initial mark
        if (initMark.pos == null) {
            initMark['pos'] = pos;
            initMark['idx'] = idx;
            console.log('init!');
        
        // final mark
        } else if (Math.abs(pos - initMark.pos) > 0.6 && finMark.pos == null) {
            finMark['pos'] = pos;
            finMark['idx'] = idx;
            console.log('fin!');
        }
    }   
}

// angle bw left elbow (11-13-15)
const getSingleAngleOfElbow = (shoulder, elbow, wrist) => {
    const s_e = getDistance(shoulder.x, shoulder.y, elbow.x, elbow.y);
    const s_w = getDistance(shoulder.x, shoulder.y, wrist.x, wrist.y);
    const e_w = getDistance(elbow.x, elbow.y, wrist.x, wrist.y);

    return Math.acos((s_e ** 2 + e_w ** 2 - s_w ** 2) / (2 * s_e * e_w)) * 180 / Math.PI;
}

// angle bw left arm (11-13-vertical line)
const getSingleAngleOfArm = (shoulder, elbow) => {
    const ground = {
        x : shoulder.x,
        y : elbow.y
    }

    const s_e = getDistance(shoulder.x, shoulder.y, elbow.x, elbow.y);
    const s_g = getDistance(shoulder.x, shoulder.y, ground.x, ground.y);
    const e_g = getDistance(elbow.x, elbow.y, ground.x, ground.y);

    const angle = Math.acos((s_e ** 2 + s_g ** 2 - e_g ** 2) / (2 * s_e * s_g)) * 180 / Math.PI;

    if (shoulder.x > elbow.x) {
        return -angle;
    } else {
        return angle;
    }
}

// length of steps (25-26)
const getSingleStep = (leftX, rightX) => {
    return Math.abs(leftX - rightX);
}

// general functions for math
const getRound = (num) => {
    return Math.round(num * 1000) / 1000;
} 

const getAverage = (arr) => {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum / arr.length;
}

const getSV = (arr) => {
    const squareOfAverage = getAverage(arr) ** 2;
    const averageOfSquaredArray = getAverage(arr.map((el)=>el**2));

    return averageOfSquaredArray - squareOfAverage;
}

const getDistance = (x1, y1, x2, y2) => {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

module.exports = { getSingleAngleOfElbow, getSingleAngleOfArm, getSingleStep, analyzeObject }