import React from 'react';
import './assets/fonts/stylesheet.css'
import './App.css';
import layout from './app.module.css';
import { Colors } from './dev/Colors';

function App() {
    return (
        <div className={"App " + layout.app}>
            <header className={layout.header}>HEADER </header>
            <div className={layout.container}>
                <main className={layout.content}>
                    CENTER
                    <Colors/>
                </main>
                <nav className={layout.nav}>NAV</nav>
                <aside className={layout.aside}>ASIDE</aside>
            </div>
            <footer className={layout.footer}>FOOTER</footer>
        </div>
    );
}

export default App;
