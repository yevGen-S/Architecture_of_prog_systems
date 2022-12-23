import React from 'react';
import { System } from '../../Logic/System';
import Store from '../../Store/Store';

const defaultState = {
    numberOfProducers: 3,
    numberOfDevices: 3,
    numberOfRequests: 10,
    buffSize: 3,
    lambda: 0.1,
    a: 5,
    b: 10,
};

export const InputFrom = ({ sysRef }) => {
    const handleProducersInputOnChange = (e) => {
        Store.numberOfProducers = e.target.value;
    };

    const handleDevicesInputOnChange = (e) => {
        Store.numberOfDevices = e.target.value;
    };

    const handleBufferInputOnChange = (e) => {
        Store.buffSize = e.target.value;
    };

    const handleRequestsInputOnChange = (e) => {
        Store.numberOfRequests = e.target.value;
    };

    const handleLambdaOnChange = (e) => {
        Store.lambda = e.target.value;
    };

    const handleAOnChange = (e) => {
        Store.a = e.target.value;
    };

    const handleBOnChange = (e) => {
        Store.b = e.target.value;
    };

    const handleStateInit = (e) => {
        e.preventDefault();

        Store.increment = 0;

        if (+Store.numberOfProducers >= +Store.numberOfRequests) {
            console.log(Store.numberOfProducers, Store.numberOfRequests )
            console.log(
                'Error: количество заявок на генерации первых интервалов больше заданного '
            );
            return;
        }

        sysRef.current = new System(
            +Store.numberOfProducers || defaultState.numberOfProducers,
            +Store.numberOfDevices || defaultState.numberOfDevices,
            +Store.numberOfRequests || defaultState.numberOfRequests,
            +Store.buffSize || defaultState.buffSize,
            +Store.lambda || defaultState.lambda,
            +Store.a || defaultState.a,
            +Store.b || defaultState.b
        );

        Store.update(sysRef.current);
    };

    return (
        <>
            <form
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    backgroundColor: '#fff',
                    justifyContent: 'space-around',
                    fontWeight: 'bold',
                    fontSize: '20px',
                }}
            >
                <label
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginRight: '40px',
                    }}
                >
                    <span>Количество источников: </span>
                    <input
                        style={{
                            width: '100px',
                            height: '20px',
                            borderRadius: '5px',
                        }}
                        type='number'
                        name='name'
                        onChange={handleProducersInputOnChange}
                    />
                </label>

                <label
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginRight: '40px',
                    }}
                >
                    Количество приборов:
                    <input
                        style={{
                            width: '100px',
                            height: '20px',
                            borderRadius: '5px',
                        }}
                        type='number'
                        name='name'
                        onChange={handleDevicesInputOnChange}
                    />
                </label>

                <label
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginRight: '40px',
                    }}
                >
                    Размер буфера:
                    <input
                        style={{
                            width: '100px',
                            height: '20px',
                            borderRadius: '5px',
                        }}
                        type='number'
                        name='name'
                        onChange={handleBufferInputOnChange}
                    />
                </label>
                <label
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginRight: '40px',
                    }}
                >
                    Количество заявок:
                    <input
                        style={{
                            width: '100px',
                            height: '20px',
                            borderRadius: '5px',
                        }}
                        type='number'
                        name='name'
                        onChange={handleRequestsInputOnChange}
                    />
                </label>

                <label
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginRight: '40px',
                    }}
                >
                    LAMBDA:
                    <input
                        style={{
                            width: '100px',
                            height: '20px',
                            borderRadius: '5px',
                        }}
                        type='number'
                        name='name'
                        onChange={handleLambdaOnChange}
                    />
                </label>

                <label
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginRight: '40px',
                    }}
                >
                    a:
                    <input
                        style={{
                            width: '100px',
                            height: '20px',
                            borderRadius: '5px',
                        }}
                        type='number'
                        name='name'
                        onChange={handleAOnChange}
                    />
                </label>

                <label
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginRight: '40px',
                    }}
                >
                    b:
                    <input
                        style={{
                            width: '100px',
                            height: '20px',
                            borderRadius: '5px',
                        }}
                        type='number'
                        name='name'
                        onChange={handleBOnChange}
                    />
                </label>

                <input
                    type='submit'
                    value='GENERATE FIRST INTERVALS'
                    onClick={handleStateInit}
                    style={{ padding: '3px' }}
                />
            </form>

            <div
                style={{
                    width: `${window.innerWidth}`,
                    height: '5px',
                    backgroundColor: 'black',
                    margin: '10px  auto',
                }}
            />
        </>
    );
};
