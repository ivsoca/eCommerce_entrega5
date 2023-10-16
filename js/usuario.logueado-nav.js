const perfil = document.getElementById('perfil');
const tarjeta = document.getElementById('tarjeta');

perfil.addEventListener('click', () => {
    tarjeta.style.display = (tarjeta.style.display === 'block') ? 'none' : 'block';
});
