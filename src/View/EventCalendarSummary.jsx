import React from 'react';
import Store from '../Store/Store';
import { v4 as uuid } from 'uuid';
import { Mode } from '../Logic/Mode';

export const EventCalendarSummary = ({ handleOnClick }) => {
    return (
        <div
            style={{
                width: '100wh',
                height: '100vh',
                backgroundColor: 'blueviolet',
            }}
        >
            <button
                style={{ width: '100px', height: '30px', borderRadius: '10px' }}
                onClick={handleOnClick}
                disabled={Store.mode === Mode.AUTOMATIC}
            >
                NEXT EVENT
            </button>

            <div
                style={{
                    flexDirection: 'column',
                    lineHeight: '30px',
                }}
            >
                <h1>Calendar of events</h1>
                {Store?.eventCalendar?.map((event) => {
                    return <div key={uuid()}>{JSON.stringify(event)}</div>;
                })}
            </div>

            {/* 
        Producers, devices, buffer.
    */}
            <div>
                <h3>Producers</h3>
                {/* {Store?.producers?.map((producer) => {
                    return <div key={uuid()}> {JSON.stringify(producer)} </div>;
                })} */}
                {Store?.loggedProducers?.map((producer) => {
                    return <div key={uuid()}> {JSON.stringify(producer)} </div>;
                })}

                <h3>Devices</h3>

                {/* {Store?.devices?.map((devices) => {
                    return <div key={uuid()}> {JSON.stringify(devices)} </div>;
                })} */}

                {Store?.loggedDevices?.map((devices) => {
                    return <div key={uuid()}> {JSON.stringify(devices)} </div>;
                })}

                <h3>Buffer</h3>

                {/* {Store?.buffer?.map((buffCell) => {
                    return <div key={uuid()}> {JSON.stringify(buffCell)}</div>;
                })} */}

                {Store?.loggedBuffer?.map((buffCell) => {
                    return <div key={uuid()}> {JSON.stringify(buffCell)}</div>;
                })}

                <h3>Refused requests </h3>
                {JSON.stringify(Store?.loggedRefuses)}
            </div>
        </div>
    );
};
