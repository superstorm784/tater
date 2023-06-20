import React from 'react';
import './Tater.scss';
import Editor from './editor/Editor';

function Tater() {
    return (
        <div id="tater">
            <header className="tt-header">
            </header>
            <main>
                <Editor />
            </main>
        </div>
    );
}

export default Tater;
