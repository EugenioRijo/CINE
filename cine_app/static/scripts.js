function SeleccionarAsiento(asiento) {
    const element = document.querySelector(`div[data-id='${asiento}']`);
    element.classList.toggle('seleccionado');
}
