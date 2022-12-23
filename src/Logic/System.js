import Store from '../Store/Store';
import { Device } from './Device';
import { EventCalendar } from './EventCalendar';
import { Logger } from './Logger';
import { Mode } from './Mode';
import { Producer } from './Producer';
import { SpecialEvent } from './SpecialEvent';
import { SpecialEventTypes } from './SpecialEvents';

export class System {
    eventCalendar;
    devices = [];
    producers = [];
    buffer = [];

    refusedRequests = [];

    devicesPointer = 0;

    numberOfProduceedRequests = 0;
    numberOfHandledRequests = 0;
    numberOfRequests;

    #isProducing = true;
    #isSysWorning = true;

    END_OF_WORK = false;

    mode = Mode.STEP_BY_STEP;

    constructor(
        numberOfProducers,
        numberOfDevices,
        numberOfRequests,
        buffSize,
        lambda,
        a,
        b
    ) {
        this.eventCalendar = new EventCalendar();
        this.logger = new Logger();

        this.#initDevices(numberOfDevices, lambda);
        this.#initProducers(numberOfProducers, a, b);
        this.numberOfRequests = numberOfRequests;
        this.#initBuffer(buffSize);

        this.#generateFirstIntervalsByProducers();
        this.numberOfProduceedRequests = numberOfProducers;
    }

    #initDevices(numberOfDevices, lambda) {
        for (let i = 1; i <= numberOfDevices; i++) {
            this.devices.push(new Device(i, lambda));
        }
    }

    #initProducers(numberOfProducers, a, b) {
        for (let i = 1; i <= numberOfProducers; i++) {
            this.producers.push(new Producer(i, a, b));
        }
    }

    #initBuffer(buffSize) {
        for (let i = 0; i < buffSize; i++) {
            this.buffer.push(false);
        }
    }

    #generateFirstIntervalsByProducers() {
        this.producers.forEach((producer, index) => {
            const time = producer.produceInterval();

            const event = new SpecialEvent(
                index + 1,
                1,
                SpecialEventTypes.NEW_REQUEST,
                producer,
                time
            );

            this.eventCalendar.addSpecialEvent(event);

            this.logger.logProducer(event.id, { ...event });
        });
    }

    handleNextEvent() {
        const nextEvent = this.eventCalendar.getEvent();
        if (nextEvent.type === SpecialEventTypes.END_OF_WORK) {
            console.log('System finish work');
            return;
        }
        Store.updateTime(nextEvent.time);
        this.#handleEvent(nextEvent);
    }

    #handleEvent(event) {
        switch (event.type) {
            case SpecialEventTypes.NEW_REQUEST:
                // console.log('NEW EVENT');

                if (this.#isProducing) {
                    this.numberOfProduceedRequests++;
                    /**
                     * Defined number of requests incomed
                     */
                    if (
                        this.numberOfProduceedRequests === this.numberOfRequests
                    ) {
                        this.#isProducing = false;

                        this.eventCalendar.addSpecialEvent(
                            new SpecialEvent(
                                0,
                                0,
                                SpecialEventTypes.END_OF_WORK,
                                null,
                                9999999
                            )
                        );
                    }

                    const newEvent = JSON.parse(JSON.stringify(event));

                    newEvent.id.orderId++;
                    newEvent.time =
                        event.time + event.eventProducer.produceRequestInterval;

                    this.eventCalendar.addSpecialEvent(newEvent);

                    this.logger.logProducer(newEvent.id, { ...newEvent });
                }

                if (this.#isSysWorning) {
                    /**
                     * Check free devices
                     */
                    if (this.#isThereFreeDevices()) {
                        // console.log('ЕСТЬ СВОБОДНЫЙ ПРИБОР');

                        this.#findFreeDeviceOnRingAndSetBusy(event);
                    } else {
                        /**
                         * No free devices
                         */
                        if (this.#isBufferFull()) {
                            // console.log('БУФЕР ПОЛОН');

                            this.#refuseBiggestRequestSourceId(event);
                            return;
                        } else {
                            for (let i = 0; i < this.buffer.length; i++) {
                                if (this.buffer[i] === false) {
                                    this.buffer[i] = { event: event, id: i };

                                    this.logger.logBuffer({
                                        id: i,
                                        event: event,
                                        timeStart: event.time,
                                        timeEnd: null,
                                    });

                                    // console.log(
                                    //     'БУФФЕР ЗАЛОГГИРОВАН',
                                    //     this.logger.buffer
                                    // );
                                    return;
                                }
                            }
                        }
                    }
                }

                break;

            case SpecialEventTypes.DEVICE_RELEASED:
                // console.log('DEVICE_RELEASED');

                if (!this.#isSysWorning) {
                    return;
                }

                event.eventProducer.setFree();
                this.numberOfHandledRequests++;

                if (this.numberOfHandledRequests === this.numberOfRequests) {
                    this.END_OF_WORK = true;

                    this.#isSysWorning = false;
                }

                if (this.#isBufferEmpty()) {
                    return;
                } else {
                    this.#chooseRequestFromBufferPriorityBySourceId(event);
                }

                break;
            case SpecialEventTypes.END_OF_WORK:
                // console.log('END_OF_WORK');

                break;
            default:
                if (event.type === undefined) {
                    break;
                }
                throw new Error(`No such type in system  ${event.type}`);
        }
    }

    #chooseRequestFromBufferPriorityBySourceId(event) {
        const fullfieldBufferCells = this.buffer.filter(
            (buffCell) => buffCell !== false
        );

        const minSourceId = Math.min(
            ...fullfieldBufferCells.map((ev) => {
                return ev.event.id.sourceId;
            })
        );

        // console.log(minSourceId);

        const requestPackage = fullfieldBufferCells.filter(
            (buffCell) => buffCell.event.id.sourceId === minSourceId
        );

        requestPackage.sort((a, b) => {
            return a.event.orderId - b.event.orderId;
        });

        const chosenRequest = JSON.parse(JSON.stringify(requestPackage[0]));
        chosenRequest.event.time = event.time;

        // console.log('CHOSEN REQUEST', chosenRequest);

        this.#findFreeDeviceOnRingAndSetBusy(chosenRequest.event);
        this.logger.endBufferTime(
            chosenRequest.event.id,
            event.time
        );

        this.buffer.forEach((buffCel, index) => {
            if (
                buffCel !== false &&
                buffCel.event.id.sourceId === chosenRequest.event.id.sourceId &&
                buffCel.event.id.orderId === chosenRequest.event.id.orderId
            ) {
                this.buffer[index] = false;
                /***
                 * Log time end
                 */
                // console.log('БУФФЦЕЛ', buffCel);
                // console.log(this.logger.buffer);
            }
        });
    }

    #refuseBiggestRequestSourceId(event) {
        // console.log(this.buffer, 'this buffer');
        const maxSourceId = Math.max(
            ...this.buffer.map((ev) => ev.event.id.sourceId)
        );

        const refuseRequestsPackage = this.buffer.filter((buffCell) => {
            return buffCell.event.id.sourceId === maxSourceId;
        });

        refuseRequestsPackage.sort((a, b) => {
            return a.event.orderId - b.event.orderId;
        });

        // console.log('ОТКЛОНЕНА ЗАЯВКА', refuseRequestsPackage[0].event);

        const refuseRequest = JSON.parse(
            JSON.stringify(refuseRequestsPackage[0])
        );
        refuseRequest.event.time = event.time;

        this.refusedRequests.push(refuseRequest.event);
        this.logger.logRefuse(refuseRequest.event);

        this.logger.endBufferTime(refuseRequest.event.id, event.time);

        for (let i = 0; i < this.buffer.length; i++) {
            if (
                this.buffer[i].event.id.sourceId ===
                    refuseRequest.event.id.sourceId &&
                this.buffer[i].event.id.orderId ===
                    refuseRequest.event.id.orderId
            ) {
                this.buffer[i] = { event: event, id: i };

                this.logger.logBuffer({
                    id: i,
                    event: event,
                    timeStart: event.time,
                    timeEnd: null,
                });

                this.numberOfHandledRequests++;

                return;
            }
        }
    }

    #isThereFreeDevices() {
        const isFreeDevice = (currentDevice) => !currentDevice.isBusy;
        return this.devices.some(isFreeDevice);
    }

    #findFreeDeviceOnRingAndSetBusy(event) {
        while (1) {
            if (this.devicesPointer >= this.devices.length) {
                this.devicesPointer = 0;
            }

            const currentDevice = this.devices[this.devicesPointer];

            if (!currentDevice.isBusy) {
                currentDevice.setBusy();

                const time = +(event.time + currentDevice.handleRequestTime());

                const newEvent = new SpecialEvent(
                    event.id.sourceId,
                    event.id.orderId,
                    SpecialEventTypes.DEVICE_RELEASED,
                    currentDevice,
                    time
                );

                this.eventCalendar.addSpecialEvent(newEvent);

                this.logger.logDevice({
                    event: { ...newEvent },
                    timeStart: event.time,
                    timeEnd: newEvent.time,
                });

                return;
            } else {
                this.devicesPointer++;
            }
        }
    }

    #isBufferEmpty() {
        return this.buffer.every((buffCel) => buffCel === false);
    }

    #isBufferFull() {
        return this.buffer.every((buffCel) => buffCel !== false);
    }

    autoMode() {
        // console.log(Store.mode);
        if (Store.mode === Mode.AUTOMATIC) {
            while (!this.END_OF_WORK) {
                this.handleNextEvent();
            }
        }
        Store.update(this);
    }
}
