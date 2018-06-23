import { h, Component } from 'preact';
import PhotoViewer from './PhotoViewer';
import Error from './Error';
import { Router } from 'preact-router';

function App() {
    return (
        <div>
            <Router>
                <PhotoViewer default />
            </Router>
        </div>
    );
}

export default App;
