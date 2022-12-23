import { makeAutoObservable } from 'mobx';
import { Mode } from '../Logic/Mode';

class Store {
    devices;
    producers;
    eventCalendar;
    buffer;

    refusedRequests;

    numberOfProduceedRequests = 0;
    numberOfHandledRequests = 0;

    mode = Mode.STEP_BY_STEP;

    increment = 0;

    currentTime;

    loggedProducers;
    loggedDevices;
    loggedBuffer;
    loggedRefuses;

    /**
     * Input
     */
    numberOfProducers;
    numberOfDevices;
    numberOfRequests;
    buffSize;
    lambda;
    a;
    b;

    constructor() {
        makeAutoObservable(this);
    }

    update(system) {
        this.devices = deepCopy(system.devices);
        this.producers = deepCopy(system.producers);
        this.eventCalendar = deepCopy(system.eventCalendar.eventCalendar);
        this.buffer = [...system.buffer];

        this.numberOfProduceedRequests = system.numberOfProduceedRequests;
        this.numberOfHandledRequests = system.numberOfHandledRequests;
        this.refusedRequests = deepCopy(system.refusedRequests);

        this.increment++;

        this.log(system.logger);
    }

    log(logger) {
        this.loggedBuffer = [...logger.buffer];
        this.loggedDevices = [...logger.devices];
        this.loggedProducers = [...logger.producers];
        this.loggedRefuses = [...logger.refuses];
    }

    updateTime(time) {
        this.currentTime = time;
    }

    changeMode() {
        if (this.mode === Mode.STEP_BY_STEP) {
            this.mode = Mode.AUTOMATIC;
        } else {
            this.mode = Mode.STEP_BY_STEP;
        }
    }
}

const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

export default new Store();
