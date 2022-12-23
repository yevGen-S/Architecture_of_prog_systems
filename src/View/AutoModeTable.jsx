import React from 'react';
import Store from '../Store/Store';
import { Table } from './Table/Table';

const sourcesColumns = [
    'Номер источника',
    'Количество заявок',
    'P_отк',
    'T_преб',
    'T_БП',
    'T_обсл',
    'Д_БП',
    'Д_обсл',
];

const devicesColumns = ['Номер прибора', 'Коэффициент использования'];

export const AutoModeTable = ({ sysRef }) => {
    const handleOnClick = () => {
        sysRef.current.autoMode();
        // console.log(Store?.loggedDevices);
    };

    return (
        <>
            <button
                onClick={handleOnClick}
                style={{
                    backgroundColor: 'green',
                    height: '30px',
                    borderRadius: '10px',
                    opacity: '90%',
                }}
            >
                {' '}
                Start auto mode{' '}
            </button>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h1 style={{ textAlign: 'center' }}>Сводная таблица</h1>
                </div>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        marginTop: '30px',
                    }}
                >
                    <Table
                        columns={sourcesColumns}
                        cellWidth={'150px'}
                        rows={Store?.producers?.map((producer) => {
                            const numberOfProducer = producer.id;
                            let numberOfRequestsFromProducer = 0;

                            Store?.loggedProducers.forEach((producer) => {
                                if (
                                    producer.event.id.sourceId ===
                                    numberOfProducer
                                ) {
                                    numberOfRequestsFromProducer++;
                                }
                            });

                            const numberOfRefusesForProducer =
                                Store?.loggedRefuses?.filter((refuse) => {
                                    return (
                                        refuse.id.sourceId === numberOfProducer
                                    );
                                }).length;

                            const probabilityOfRefuseToProducer =
                                numberOfRefusesForProducer /
                                numberOfRequestsFromProducer;

                            let sumTimeRequestInBuffer = 0;
                            let sumTimeRequsetSquaresinBuffer = 0;

                            Store?.loggedBuffer?.forEach((buffer) => {
                                if (
                                    buffer.event.id.sourceId ===
                                    numberOfProducer
                                ) {
                                    sumTimeRequestInBuffer +=
                                        buffer.timeEnd - buffer.timeStart;

                                    sumTimeRequsetSquaresinBuffer +=
                                        (buffer.timeEnd - buffer.timeStart) **
                                        2;
                                }
                            });

                            // console.log(
                            //     'ВРЕМЯ ПРЕБ ЗАЯВОК В БУФЕРЕ, в КВАДРТАРЕ',
                            //     sumTimeRequestInBuffer,
                            //     sumTimeRequsetSquaresinBuffer
                            // );

                            const averangeTimeInBuffer =
                                sumTimeRequestInBuffer /
                                numberOfRequestsFromProducer;

                            let sumTimeHandlingRequest = 0;
                            let sumTimeSquareHandlingRequest = 0;

                            Store?.loggedDevices?.forEach((device) => {
                                if (
                                    device.event.id.sourceId ===
                                    numberOfProducer
                                ) {
                                    sumTimeHandlingRequest +=
                                        device.timeEnd - device.timeStart;

                                    sumTimeSquareHandlingRequest +=
                                        (device.timeEnd - device.timeStart) **
                                        2;
                                }
                            });

                            // console.log(
                            //     'ВРЕМЯ ОБРАБОТКИ ЗАЯВ, в КВАДРТАРЕ',
                            //     sumTimeHandlingRequest,
                            //     sumTimeSquareHandlingRequest
                            // );

                            const avetageTimeOfHandling =
                                sumTimeHandlingRequest /
                                numberOfRequestsFromProducer;

                            const disperseOfBuffer =
                                sumTimeRequsetSquaresinBuffer /
                                    numberOfRequestsFromProducer -
                                    averangeTimeInBuffer ** 2 || 0;

                            const disperseOfhandling =
                                sumTimeSquareHandlingRequest /
                                    numberOfRequestsFromProducer -
                                    avetageTimeOfHandling ** 2 || 0;

                            // if (
                            //     disperseOfhandling < 0 ||
                            //     disperseOfBuffer < 0
                            // ) {
                            //     console.log(
                            //         'ДИСПЕРСИИ',
                            //         disperseOfBuffer,
                            //         disperseOfhandling
                            //     );

                            //     console.log('BUFFER LOG', Store.loggedBuffer);
                            //     console.log('DEVICES LOG', Store.loggedDevices);
                            // }

                            return [
                                numberOfProducer,
                                numberOfRequestsFromProducer,
                                probabilityOfRefuseToProducer.toFixed(2),
                                isNaN(
                                    averangeTimeInBuffer + avetageTimeOfHandling
                                )
                                    ? 0
                                    : (
                                          averangeTimeInBuffer +
                                          avetageTimeOfHandling
                                      ).toFixed(2),
                                isNaN(averangeTimeInBuffer)
                                    ? 0
                                    : averangeTimeInBuffer.toFixed(2),
                                isNaN(avetageTimeOfHandling)
                                    ? 0
                                    : avetageTimeOfHandling.toFixed(2),
                                disperseOfBuffer.toFixed(2),
                                disperseOfhandling.toFixed(2),
                            ];
                        })}
                    />

                    <Table
                        columns={devicesColumns}
                        cellWidth={'150px'}
                        rows={Store?.devices?.map((device) => {
                            const numberOfDevice = device.id;
                            let timeOfDeviceWork = 0;

                            Store?.loggedDevices?.forEach((device) => {
                                if (
                                    numberOfDevice ===
                                    device.event.eventProducer.id
                                ) {
                                    timeOfDeviceWork +=
                                        device.timeEnd - device.timeStart;
                                }
                            });

                            const sumTime = Store.currentTime;

                            const coefOfUse = timeOfDeviceWork / sumTime;
                            return [
                                numberOfDevice,
                                (isNaN(coefOfUse) ? 0 : coefOfUse).toFixed(2),
                            ];
                        })}
                    />
                </div>
            </div>
        </>
    );
};
