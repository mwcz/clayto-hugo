import { h, Component } from 'preact';
import linkState from 'linkstate';

import Photo from './Photo';

class PhotoViewer extends Component {
    constructor(props) {
        super(props);

        window.PhotoViewer = this;

        this.state = {
            photos: null,
            activepid: null,
            loading: true,
        };

        this.pushState = this.pushState.bind(this);
        this.activatePid = this.activatePid.bind(this);
        this.deactivatePid = this.deactivatePid.bind(this);
    }
    componentDidMount() {
        fetch('./photos.json')
            .then(rsp => rsp.json())
            .then(photos => {
                // const photos = sortBy(photoData, 'post_date').reverse();
                this.setState({
                    photos,
                    activepid: -1,
                    loading: false
                });
            })
            .catch(err => console.error(err));
    }
    activatePid(activepid) {
        this.setState({ activepid });
    }
    pidActivator(activepid) {
        return () => this.activatePid(activepid);
    }
    deactivatePid() {
        this.setState({ activepid: -1 });
    }
    pushState(evt) {
        // const country = evt.target.dataset.country;
        // evt.preventDefault();
        // history.pushState({ country }, '', country);
        // return false;
    }
    render(props, { photos, activepid, loading }) {
        return (
            <div class="photos">
                {loading
                        ? <p>Please wait...</p>
                        : (photos.map((p, i, c) => {
                            const prev = c[i+1] && c[i+1].id;
                            const next = c[i-1] && c[i-1].id;
                            return <Photo {...p}
                                selected={activepid === p.id}
                                key={p.id}
                                selectNext={this.pidActivator(next)}
                                selectPrev={this.pidActivator(prev)}
                                active={p.id === activepid}
                                select={this.pidActivator(p.id)}
                                deselect={this.deactivatePid}
                            />;
                        }))
                }
            </div>
        );
    }
}

export default PhotoViewer;
