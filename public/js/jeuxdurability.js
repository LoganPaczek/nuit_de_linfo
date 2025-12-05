function initJeuTriDechets(containerId, options = {}) {
    const defaultItems = [
        { id: 'cable', img: '../../public/image/flappyHearth/durabilite/cables.png', context: 'Câble grillé défectueux', correct: 'trash' },
        { id: 'imprimante', img: '../../public/image/flappyHearth/durabilite/imprimante.png', context: 'Imprimante non reconnue', correct: 'recycle' },
        { id: 'ordi1', img: '../../public/image/flappyHearth/durabilite/ordinateur.png', context: 'Ordinateur grillé HS', correct: 'trash' },
        { id: 'ordi2', img: '../../public/image/flappyHearth/durabilite/ordinateur.png', context: 'Ordinateur batterie HS', correct: 'recycle' },
        { id: 'telephone', img: '../../public/image/flappyHearth/durabilite/telephone.png', context: 'Téléphone écran cassé', correct: 'recycle' }
    ];

    const items = options.items || defaultItems;

    const container = document.getElementById(containerId);
    if (!container) {
        console.error('DIV container non trouvé:', containerId);
        return;
    }
    
    container.className = 'game-container';
    
    // 1. Injecte HTML avec images poubelles
    container.innerHTML = `
        <h2>${options.title || 'Tri des Déchets'}</h2>
        <div class="score">Score: <span id="score_${containerId}">0</span>/5</div>
        <div class="feedback" id="feedback_${containerId}"></div>
        <div class="bins">
            <div class="bin trash" id="trash_${containerId}">
                <img src="../../public/image/flappyHearth/durabilite/trash.jpg" class="bin-icon" alt="Poubelle Générale">
                <label>Poubelle Générale</label>
            </div>
            <div class="bin recycle" id="recycle_${containerId}">
                <img src="../../public/image/flappyHearth/durabilite/recyclage.jpg" class="bin-icon" alt="Recyclage">
                <label>Recyclage</label>
            </div>
        </div>
        <div class="items" id="items_${containerId}"></div>
        <button id="reset_${containerId}">Rejouer</button>
    `;

    // 2. Variables globales
    window[`items_${containerId}`] = items;
    window[`score_${containerId}`] = 0;

    // 3. Fonctions principales
    window[`dragStart_${containerId}`] = function(e) {
        e.dataTransfer.setData('text/plain', e.target.parentNode.dataset.id);
        const context = e.target.nextElementSibling.cloneNode(true);
        context.style.position = 'fixed';
        context.style.zIndex = '1000';
        context.style.background = 'rgba(255,255,255,0.9)';
        context.style.padding = '5px';
        context.style.borderRadius = '4px';
        document.body.appendChild(context);
        e.dataTransfer.setDragImage(context, 10, 10);
        setTimeout(() => document.body.removeChild(context), 0);
    };

    window[`dragOver_${containerId}`] = function(e) {
        e.preventDefault();
    };

    window[`showFeedback_${containerId}`] = function(msg, color) {
        const fb = document.getElementById(`feedback_${containerId}`);
        if (fb) {
            fb.textContent = msg;
            fb.style.color = color;
            setTimeout(() => fb.textContent = '', 2000);
        }
    };

    window[`drop_${containerId}`] = function(e, binType) {
        e.preventDefault();
        const itemId = e.dataTransfer.getData('text/plain');
        const itemData = window[`items_${containerId}`].find(i => i.id === itemId);
        const item = document.querySelector(`#${containerId} [data-id="${itemId}"]`);
        
        if (itemData && itemData.correct === binType) {
            window[`showFeedback_${containerId}`]('✅ Bien trié ! +1', 'green');
            item.classList.add('dropped');
            window[`score_${containerId}`] += 1;
            document.getElementById(`score_${containerId}`).textContent = window[`score_${containerId}`];
            e.currentTarget.classList.add('win');
            setTimeout(() => e.currentTarget.classList.remove('win'), 500);
            if (window[`score_${containerId}`] === 5) {
                window[`showFeedback_${containerId}`]('🎉 Parfait ! Jeu terminé.', 'gold');
            }
        } else {
            window[`showFeedback_${containerId}`]('❌ Mauvais tri !', 'red');
        }
    };

    // 4. setupBins CORRIGÉ (évite doublons)
    window[`setupBins_${containerId}`] = function() {
        const trash = document.getElementById(`trash_${containerId}`);
        const recycle = document.getElementById(`recycle_${containerId}`);
        const resetBtn = document.getElementById(`reset_${containerId}`);
        
        if (trash && recycle && resetBtn) {
            // ✅ SUPPRIME TOUS anciens listeners
            const clearListeners = () => {
                const oldTrashDrop = window[`dropHandlerTrash_${containerId}`];
                const oldRecycleDrop = window[`dropHandlerRecycle_${containerId}`];
                if (oldTrashDrop) trash.removeEventListener('drop', oldTrashDrop);
                if (oldRecycleDrop) recycle.removeEventListener('drop', oldRecycleDrop);
            };
            clearListeners();
            
            // ✅ NOUVEAUX handlers uniques
            window[`dropHandlerTrash_${containerId}`] = function(e) { window[`drop_${containerId}`](e, 'trash'); };
            window[`dropHandlerRecycle_${containerId}`] = function(e) { window[`drop_${containerId}`](e, 'recycle'); };
            
            trash.addEventListener('dragover', window[`dragOver_${containerId}`]);
            trash.addEventListener('drop', window[`dropHandlerTrash_${containerId}`]);
            recycle.addEventListener('dragover', window[`dragOver_${containerId}`]);
            recycle.addEventListener('drop', window[`dropHandlerRecycle_${containerId}`]);
            
            resetBtn.onclick = function() {  // onclick simple (pas addEventListener)
                document.querySelectorAll(`#${containerId} .item`).forEach(i => i.classList.remove('dropped'));
                window[`initJeu_${containerId}`]();
            };
        }
    };

    // 5. initJeu CORRIGÉ
    window[`initJeu_${containerId}`] = function() {
        const itemsContainer = document.getElementById(`items_${containerId}`);
        if (!itemsContainer) return;
        
        itemsContainer.innerHTML = '';
        window[`score_${containerId}`] = 0;
        document.getElementById(`score_${containerId}`).textContent = '0';
        
        window[`items_${containerId}`].forEach(item => {
            const div = document.createElement('div');
            div.className = 'item';
            div.draggable = true;
            div.dataset.id = item.id;
            div.innerHTML = `<img src="${item.img}" alt="${item.context}"><div class="context">${item.context}</div>`;
            div.addEventListener('dragstart', window[`dragStart_${containerId}`]);
            itemsContainer.appendChild(div);
        });
        
        window[`setupBins_${containerId}`]();
    };

    // 6. Lance le jeu
    window[`initJeu_${containerId}`]();
}
