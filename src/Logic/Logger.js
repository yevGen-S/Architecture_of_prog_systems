export class Logger {
    producers;
    devices;
    buffer;
    refuses;

    constructor() {
        this.producers = [];
        this.devices = [];
        this.buffer = [];
        this.refuses = [];
    }

    logProducer(id, event) {
        this.producers.push({ id: id, event: {...event} });
    }

    logDevice(logInfo) {
        this.devices.push({
            event: {...logInfo.event},
            timeStart: logInfo.timeStart,
            timeEnd: logInfo.timeEnd,
        });
    }

    logBuffer(logInfo) {
        this.buffer.push({
            id: logInfo.id,
            event: {...logInfo.event},
            timeStart: logInfo.timeStart,
            timeEnd: logInfo.timeEnd,
        });
    }

    endBufferTime (id, timeEnd) {
        for (let i = 0; i < this.buffer.length; i++) {
            if (
                this.buffer[i].event.id.sourceId === id.sourceId &&
                this.buffer[i].event.id.orderId === id.orderId
            ) {
                this.buffer[i].timeEnd = timeEnd;
            }
        }
    }

    getBufferCell(id) {
        for (let i = 0; i < this.buffer.length; i++) {
            if (
                this.buffer[i].event.id.sourceId === id.sourceId &&
                this.buffer[i].event.id.orderId === id.orderId
            ) {
                // console.log(this.buffer[i]);
                return this.buffer[i];
            }
        }
    }

    logRefuse(event) {
        this.refuses.push({...event});
    }
}
