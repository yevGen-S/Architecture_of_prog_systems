export class SpecialEvent {
    id;
    type;
    eventProducer;
    time;
    

    constructor(sourceId, orderId, eventType, eventProducer, time) {
        this.id = {
            sourceId: sourceId,
            orderId: orderId,
        };
        this.type = eventType;
        this.eventProducer = eventProducer;
        this.time = time;
    }
}
