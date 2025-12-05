/**
 * 🎮 Jeu des Choix Éco-Tech - Version MODULAIRE & RESPONSIVE
 * Importable dans N'IMPORTE QUEL DIV
 * @param {string} containerId - ID du div cible (défaut: 'gameTable')
 */
function creerJeuChoix(containerId = 'gameTable') {
    const questions = [
        { gauche: "Google", droite: "Ecosia", consequence: { droite: "18 millions d'arbres plantés ✅", gauche: "Aucun arbre planté ❌" } },
        { gauche: "Microsoft Office", droite: "LibreOffice", consequence: { droite: "Économie de 99 €/an ✅", gauche: "Coût : 99 €/an ❌" } },
        { gauche: "Photoshop", droite: "GIMP", consequence: { droite: "Économie de 288 €/an ✅", gauche: "Coût : 288 €/an ❌" } },
        { gauche: "Cisco", droite: "Cyberini", consequence: { droite: "Coût : 400 € ✅", gauche: "Licence commerciale ❌" } },
        { gauche: "Google Drive", droite: "Nextcloud", consequence: { droite: "Coût : 40 € ✅", gauche: "Abonnement payant ❌" } },
    ];

    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`❌ Div #${containerId} non trouvé !`);
        return;
    }

    // Nettoie le container
    container.innerHTML = '';

    // Titre responsive
    const titre = document.createElement('h1');
    titre.textContent = '🎮 Jeu des Choix Éco-Tech';
    titre.style.cssText = `
        text-align: center;
        color: white;
        margin-bottom: 20px;
        font-size: clamp(1.5em, 5vw, 2.5em);
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    `;
    container.appendChild(titre);

    // Tableau principal
    const table = document.createElement('table');
    table.id = 'gameTable';
    table.style.cssText = `
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        background: rgba(255,255,255,0.95);
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        table-layout: fixed;
    `;
    
    questions.forEach((q, index) => {
        const row = document.createElement("tr");

        // Colonne 1 - Propriétaire (BLEU)
        const col1 = document.createElement("td");
        const btn1 = document.createElement("button");
        btn1.textContent = q.gauche;
        btn1.className = "proprietaire";
        btn1.onclick = () => afficherResultat(index, q.consequence.gauche, 'negatif');
        col1.appendChild(btn1);

        // Colonne 2 - Alternative (VERT)
        const col2 = document.createElement("td");
        const btn2 = document.createElement("button");
        btn2.textContent = q.droite;
        btn2.className = "alternative";
        btn2.onclick = () => afficherResultat(index, q.consequence.droite, 'positive');
        col2.appendChild(btn2);

        // Colonne 3 - Résultat
        const col3 = document.createElement("td");
        col3.className = "result";
        col3.id = `result-${index}`;

        row.append(col1, col2, col3);
        table.appendChild(row);
    });

    container.appendChild(table);
}

/**
 * Affiche le résultat avec animation
 */
function afficherResultat(index, texte, classe) {
    const result = document.getElementById(`result-${index}`);
    if (result) {
        result.textContent = texte;
        result.className = `result ${classe}`;
    }
}

// 🚀 AUTO-LANCEMENT dans #gameTable par défaut
document.addEventListener('DOMContentLoaded', () => {
    creerJeuChoix(); 
});

// Export global pour utilisation manuelle
window.creerJeuChoix = creerJeuChoix;
