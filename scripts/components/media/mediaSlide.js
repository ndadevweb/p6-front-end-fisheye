import { ButtonLeft, ButtonRight, ButtonClose } from '../ui/index.js';

/**
 * Lightbox / slide
 *
 * Gere l'affichage, la navigation, l'interaction de chaque element media
 */
export default class MediaSlide {
  /**
   * - Element qui active l'ouverture de la modal
   * - Liste des elements media
   * - Callback de fermeture de la modal
   *
   * @param {Object} {Element, Element[], Function}
   */
  constructor({ mediaElementActive, mediaElements, callbackToClose }) {
    this.mediaElements = Array.from(mediaElements);
    this.currentIndex = this.mediaElements.findIndex((element) => element === mediaElementActive);
    this.maxIndex = mediaElements.length - 1;
    this.callbackToClose = callbackToClose;
    this.initElements();
    this.bindMethods();
  }

  /**
   * Initialise les elements pour le slide / lightbox
   */
  initElements() {
    this.mediaElementActive = this.currentElement();
    this.mediaSlideElement = document.createElement('div');
    this.buttonLeftElement = ButtonLeft();
    this.buttonRightElement = ButtonRight();
    this.buttonCloseModal = ButtonClose({ className: 'btn-close--orange' });
    this.optionsMediaVideo();
  }

  /**
   * Bind les methodes utilisees pour le traitement des evenements
   */
  bindMethods() {
    this.close = this.close.bind(this);
    this.handleKeyUpButtonClose = this.handleKeyUpButtonClose.bind(this);
    this.handleClickChangeMedia = this.handleClickChangeMedia.bind(this);
    this.handleKeyUpGlobal = this.handleKeyUpGlobal.bind(this);
  }

  /**
   * Initialise les evenements pour interagir avec le contenu de la modal
   */
  addEvents() {
    this.buttonCloseModal.addEventListener('click', this.close);
    this.buttonCloseModal.addEventListener('keyup', this.handleKeyUpButtonClose);
    this.buttonLeftElement.addEventListener('click', this.handleClickChangeMedia);
    this.buttonRightElement.addEventListener('click', this.handleClickChangeMedia);
    document.body.addEventListener('keyup', this.handleKeyUpGlobal);
  }

  /**
   * Gestion des touches clavier ( Enter, Space )
   * pour fermer la modal
   *
   * @param {Event} event
   */
  handleKeyUpButtonClose(event) {
    if ([' ', 'Enter'].includes(event.key) === true && event.target.classList.contains('btn-close') === true) {
      this.close(event);
    }
  }

  /**
   * Gestion des boutons Fleche Gauche et Fleche Droite
   * pour changer de media
   *
   * @param {Event} event
   */
  handleClickChangeMedia(event) {
    const { direction } = event.target.dataset;

    this.change(direction);
  }

  /**
   * Gestion des touches clavier Escape, ArrowLeft, ArrowRight, Home, End
   *
   * - Escape : Ferme la modal
   * - ArrowLeft | ArrowRight : Affiche le media precedent / suivant
   * - Home | End : Affiche le premier / dernier element
   *
   * @param {Event} event
   * @returns {null}
   */
  handleKeyUpGlobal(event) {
    const keysAllowed = {
      ArrowLeft: 'left',
      ArrowRight: 'right',
      Home: 'first',
      End: 'end',
    };

    if (Object.keys(keysAllowed).includes(event.key) === false) {
      return null;
    }

    if (event.key === 'Escape') {
      this.close(event);

      return null;
    }

    this.change(keysAllowed[event.key]);

    return null;
  }

  /**
   * Retourne un element contenant le media a afficher
   *
   * @returns {Element}
   */
  currentElement() {
    const cloneCardElement = this.mediaElements[this.currentIndex].cloneNode(true);
    const mediaElement = cloneCardElement.querySelector('.media-container-source > img');

    if (mediaElement !== null) {
      const imageName = cloneCardElement.querySelector('h3').textContent;

      mediaElement.alt = imageName;
    }

    return cloneCardElement;
  }

  /**
   * Met a jour l'index pour recuperer l'element precedent
   */
  previous() {
    this.currentIndex = this.currentIndex === 0 ? this.maxIndex : this.currentIndex - 1;
  }

  /**
   * Met a jour l'index pour recuperer l'element suivant
   */
  next() {
    this.currentIndex = this.currentIndex === this.maxIndex ? 0 : this.currentIndex + 1;
  }

  /**
   * Met a jour l'index pour recuperer le premier element
   */
  first() {
    this.currentIndex = 0;
  }

  /**
   * Met a jour l'index pour recuperer le dernier element
   */
  end() {
    this.currentIndex = this.maxIndex;
  }

  /**
   * Met a jour le conteneur pour afficher le media
   * et positionne le focus sur l'element correspondant
   *
   * @throws A valid "direction" value must be specified
   */
  change(direction) {
    switch (direction) {
      case 'left':
        this.previous();
        this.buttonLeftElement.focus();
        break;
      case 'right':
        this.next();
        this.buttonRightElement.focus();
        break;
      case 'first':
        this.first();
        this.buttonLeftElement.focus();
        break;
      case 'end':
        this.end();
        this.buttonRightElement.focus();
        break;
      default:
        throw new Error('A valid "direction" value must be specified');
    }

    const newElement = this.currentElement();

    newElement.querySelector('.media-like').remove();
    newElement.setAttribute('tabindex', 0);
    newElement.addEventListener('click', this.handleEvent);

    this.mediaElementActive.replaceWith(newElement);
    this.mediaElementActive = newElement;
    this.optionsMediaVideo();
  }

  /**
   * Gestion de la fermeture de la modal
   *
   * - Appel callback de la fonction de fermeture de l'objet Modal
   * - Suppression des evenements clavier utilises lorsque la modal media est active
   */
  close() {
    document.body.removeEventListener('keyup', this.handleKeyUpGlobal);
    this.callbackToClose();
  }

  /**
   * Ajout des attributs sur le media video qui est affiche
   */
  optionsMediaVideo() {
    const elementVideo = this.mediaElementActive.querySelector('video');

    if (elementVideo !== null) {
      elementVideo.setAttribute('tabindex', 0);
      elementVideo.preload = 'none';
      elementVideo.loop = 'true';
      elementVideo.controls = 'true';
      elementVideo.autoplay = 'true';
    }
  }

  /**
   * Retourne le composant construit
   * Si le media est un element video celui-ci est automatiquement lance
   *
   * @returns {Element}
   */
  buildComponent() {
    this.mediaSlideElement.classList.add('media-slide-container');
    this.mediaElementActive.querySelector('.media-like').remove();
    this.mediaElementActive.setAttribute('aria-keyshortcuts', 'ArrowLeft, ArrowRight, Home, End, Escape');
    this.mediaElementActive.setAttribute('tabindex', 0);
    this.buttonLeftElement.setAttribute('aria-label', 'Previous image');
    this.buttonRightElement.setAttribute('aria-label', 'Next image');
    this.buttonCloseModal.setAttribute('aria-label', 'image closeup view');
    this.buttonCloseModal.setAttribute('aria-keyshortcuts', 'Escape');
    this.addEvents();

    this.mediaSlideElement.append(
      this.buttonLeftElement,
      this.mediaElementActive,
      this.buttonCloseModal,
      this.buttonRightElement,
    );

    return this.mediaSlideElement;
  }

  /**
   * @see buildComponent
   * @returns {Element}
   */
  render() {
    return this.buildComponent();
  }
}
