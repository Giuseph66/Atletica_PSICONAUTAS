document.getElementById('registration-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const contact = document.getElementById('contact').value;

    if (name && contact) {
        alert(`Obrigado por se registrar, ${name}! Entraremos em contato pelo número ${contact}.`);
        this.reset();
    } else {
        alert('Por favor, preencha todos os campos.');
    }
});
