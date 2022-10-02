/**
 * Retourne un element contenant un element MediaImage ou MediaVideo
 *
 * @param {Object} props
 * @returns {MediaImage | MediaVideo}
 */
export const MediaSource = (props) => {
    const { hasImage } = props;
    const mediaSource = hasImage === true ? MediaImage(props) : MediaVideo(props);
    const mediaContainer = document.createElement('div');

    mediaContainer.classList.add('media-container-source');
    mediaContainer.append(mediaSource);

    return mediaContainer;
};

/**
 * Retourne un element image
 *
 * @param {Object} props
 * @returns {Element}
 */
export const MediaImage = (props) => {
    const { pathImage } = props;
    const imageElement = document.createElement('img');

    imageElement.src = pathImage;
    imageElement.alt = '';

    return imageElement;
};

/**
 * Retourne un element video
 *
 * @param {Object} props
 * @returns {Element}
 */
export const MediaVideo = (props) => {
    const { pathVideo } = props;
    const videoElement = document.createElement('video');
    const linkElement = document.createElement('a');
    const textNode = 'Votre navigateur ne permet pas de lire les vidéos. Mais vous pouvez toujours';

    linkElement.textContent = 'La télécharger';
    linkElement.href = pathVideo;

    videoElement.src = pathVideo;
    videoElement.append(textNode);
    videoElement.append(linkElement);

    return videoElement;
};
