import { h, Component } from 'preact';

class Photo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isActive: false,
            activeImg: false,
            activeClass: false,
            loadingThumb: true,
            loadingFull: true,
        };

        this.timeouts = {};

        this.showPhoto = this.showPhoto.bind(this);
        this.hidePhoto = this.hidePhoto.bind(this);
        this.togglePhoto = this.togglePhoto.bind(this);
        this.doneLoadingFull = this.doneLoadingFull.bind(this);
        this.doneLoadingThumb = this.doneLoadingThumb.bind(this);
    }
    togglePhoto() {
        const alreadyActive = this.props.active;
        if (alreadyActive) {
            this.hidePhoto();
        }
        else {
            this.showPhoto();
        }
    }
    showPhoto() {
        // set to active to create the <img>, wait briefly before setting the
        // active class.  if class is there before <img>, the transition won't
        // happen
        this.setState({ isActive: true, activeImg: true });
        window.p = this;
        this.props.select();
        this.timeouts.addClass = setTimeout(
            () => {
                this.setState({ activeClass: true });
            },
            50
        );
        // cancel the remove image timeout, in case it's still pending
        clearTimeout(this.timeouts.removeImage);
    }
    hidePhoto() {
        // set active indicator to false, and remove class.  wait a bit before
        // removing the image, so the transition can play.
        this.setState({ isActive: false, activeClass: false });
        this.props.deselect();
        this.timeouts.removeImage = setTimeout(
            () => {
                this.setState({ activeImg: false });
            },
            500
        );
        // cancel the add class timeout, in case it's still pending
        clearTimeout(this.timeouts.addClass);
    }
    doneLoadingFull() {
        this.setState({
            loadingFull: false,
        });
    }
    doneLoadingThumb() {
        this.setState({
            loadingThumb: false,
        });
    }
    render({ title, image, thumbnail, id, color0, active, selectNext, selectPrev }, { isActive, activeImg, activeClass, loadingThumb, loadingFull }) {
        return (
            <span>
                <span class="photo thumb" onclick={this.showPhoto} data-title={title} data-pid={id} data-color={color0}>
                    <img src={thumbnail} onload={this.doneLoadingThumb} />
                    {loadingThumb && <p>Loading...</p>}
                </span>
                <span class={ activeClass ? "photo full active" : "photo full" } onclick={this.hidePhoto} data-title={title} data-pid={id} data-color={color0}>
                    {/* if this is the active image, or it's already been loaded, display the img */}
                    { (activeImg || !loadingFull) && <img src={image} onclick={selectNext} onload={this.doneLoadingFull} />}
                    {loadingFull && <p>Loading...</p>}
                </span>
            </span>
        );
    }
}

export default Photo;
