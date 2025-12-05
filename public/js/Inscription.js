const champs = ["nom", "prenom", "email", "password"];
const vraiTexte = {};

function activerInversion(id) {
    const input = document.getElementById(id);
    vraiTexte[id] = "";

    input.addEventListener("keydown", e => {
        const key = e.key;

        if (key.length === 1) { 
            e.preventDefault();
            vraiTexte[id] += key;
        } else if (key === "Backspace") {
            e.preventDefault();
            vraiTexte[id] = vraiTexte[id].slice(0, -1);
        } else {
            return;
        }

        input.value = [...vraiTexte[id]].reverse().join("");
        input.setSelectionRange(input.value.length, input.value.length);
    });

    input.addEventListener("paste", e => {
        e.preventDefault();
        vraiTexte[id] += e.clipboardData.getData("text");
        input.value = [...vraiTexte[id]].reverse().join("");
        input.setSelectionRange(input.value.length, input.value.length);
    });
}

window.onload = () => champs.forEach(activerInversion);




// Afficher / masquer le mot de passe
document.getElementById("togglePassword").onclick = () => {
    const pwd = document.getElementById("password");

    if (pwd.type === "password") {
        pwd.type = "text";
        document.getElementById("togglePassword").textContent = "🙈";
    } else {
        pwd.type = "password";
        document.getElementById("togglePassword").textContent = "👁️";
    }
};


//

const anneeInput = document.getElementById("annee");

const message = document.createElement("div");
message.style.marginTop = "5px";
anneeInput.insertAdjacentElement("afterend", message);

anneeInput.addEventListener("input", () => {
    const annee = anneeInput.value;

    // si moins de 4 chiffres → on efface le message
    if (annee.length !== 4) {
        message.textContent = "";
        return;
    }

    // appel AJAX vers le bon chemin
    fetch("check_year.php?annee=" + annee)
        .then(res => res.json())
        .then(data => {
            if (data.existe === true) {

                // message pro
                message.textContent = "⚠️ Cette année existe déjà ! Veuillez en saisir une autre.";
                message.style.color = "red";

                // vider la zone de saisie
                anneeInput.value = "";

                // optionnel : remettre le focus dans le champ
                anneeInput.focus();
            } 
            else {
                message.textContent = "✔ Année disponible";
                message.style.color = "green";
            }
        })
        .catch(() => {
            message.textContent = "Erreur lors de la vérification.";
            message.style.color = "orange";
        });
});









