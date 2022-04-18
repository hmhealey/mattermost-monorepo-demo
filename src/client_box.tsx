import React, {useState} from 'react';
import {Client4} from '@mattermost/client';

const client = new Client4();

function Login(props: {setConnected: (connected: boolean) => void}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();

        setLoading(true);

        client.login(username, password).then(() => {
            setLoading(false);

            props.setConnected(true);
        }).catch((e) => {
            setLoading(false);

            console.error(e);
        });
    }

    return (
        <form onSubmit={onSubmit}>
            <label>{'Username:'}<input value={username} onChange={(e) => setUsername(e.target.value)}/></label>
            <label>{'Password:'}<input value={password} onChange={(e) => setPassword(e.target.value)}/></label>
            <button type='submit' disabled={loading}>{'Submit'}</button>
        </form>
    )
}

function LoggedIn(props: {setConnected}) {
    const [output, setOutput] = useState('');

    const loadMe = () => {
        client.getMe().then((me) => {
            console.log(me);
            setOutput(JSON.stringify(me, undefined, '    '));
        }).catch((e) => {
            console.error(e);
        });
    };

    const loadClientConfig = () => {
        client.getClientConfigOld().then((cfg) => {
            console.log(cfg);
            setOutput(JSON.stringify(cfg, undefined, '    '));
        }).catch((e) => {
            console.error(e);
        });
    };

    const loadMyChannels = () => {
        client.getAllTeamsChannels().then((cfg) => {
            console.log(cfg);
            setOutput(JSON.stringify(cfg, undefined, '    '));
        }).catch((e) => {
            console.error(e);
        });
    };

    const logout = () => {
        client.logout();
        client.setUrl('');

        props.setConnected(false);
    }

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <button onClick={loadMe}>{'Load me'}</button>
            <button onClick={loadClientConfig}>{'Load client config'}</button>
            <button onClick={loadMyChannels}>{'Load all my channels'}</button>
            <div style={{
                border: '2px rgba(255, 255, 255, 0.2) solid',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                maxHeight: 300,
                overflow: 'auto',
                textAlign: 'left',
                whiteSpace: 'pre-wrap',
                width: 800,
            }}>
                {output}
            </div>
            <button onClick={logout}>{'Logout'}</button>
        </form>
    )
}

export function ClientBox(props: {}) {
    const [connected, setConnected] = useState(false);

    return connected ? <LoggedIn setConnected={setConnected}/> : <Login setConnected={setConnected}/>;
}