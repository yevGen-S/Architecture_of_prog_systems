import React from 'react';
import Store from '../../Store/Store';
import { v4 as uuid } from 'uuid';
import { Line, Text } from 'react-konva';
import { observer } from 'mobx-react-lite';

export const Producers = observer(
    ({ stageRef, unitConversion, getCoordinatesForDash, offsetX, offsetY }) => {
        return (
            <>
                {/* PRODUCERS */}
                {Store?.producers?.map((producer, index) => {
                    const text = `И${index + 1}`;
                    return (
                        <>
                            <Text
                                key={uuid()}
                                fontSize={14}
                                text={text}
                                wrap='char'
                                align='center'
                                x={5}
                                y={offsetY- 15 + index * offsetY}
                            />
                            <Line
                                key={uuid()}
                                strokeWidth={1}
                                opacity={0.4}
                                stroke='blue'
                                points={[
                                    offsetX,
                                    offsetY + index * offsetY,
                                    stageRef.current?.width() +
                                        unitConversion(Store?.currentTime),
                                    offsetY + index * offsetY,
                                ]}
                            />
                        </>
                    );
                })}

                {/* DASHES */}
                {Store?.loggedProducers?.map((producer) => {
                    return (
                        <Line
                            key={uuid()}
                            strokeWidth={5}
                            stroke='black'
                            opacity={1}
                            points={getCoordinatesForDash(
                                producer.id.sourceId,
                                producer.event.time,
                                'producer'
                            )}
                        />
                    );
                })}

                {/* DASH TEXT */}
                {Store?.loggedProducers?.map((producer) => {
                    const coords = getCoordinatesForDash(
                        producer.id.sourceId,
                        producer.event.time,
                        'producer'
                    );
                    return (
                        <Text
                            key={uuid()}
                            fontSize={13}
                            text={`${producer.id.sourceId}.${producer.id.orderId}`}
                            wrap='char'
                            align='center'
                            x={coords[0] - 10}
                            y={coords[1] - 13}
                        />
                    );
                })}
            </>
        );
    }
);
