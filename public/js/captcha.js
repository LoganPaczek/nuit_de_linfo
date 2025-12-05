function captchaPopup() {
    const overlay = document.createElement("div");
    overlay.className = "captcha-overlay";

    const popup = document.createElement("div");
    popup.className = "captcha-popup";

    const captchaDiv = document.createElement("div");
    captchaDiv.className = "captcha-code";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Recopiez le code";
    input.className = "captcha-input";

    const button = document.createElement("button");
    button.textContent = "Vérifier";
    button.className = "captcha-button";
     
    
    popup.addEventListener("click", function(event) {//pour enlever l'écoute du click au niveau du pop up
        event.stopPropagation();
    });

    popup.appendChild(captchaDiv);
    popup.appendChild(input);
    popup.appendChild(button);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    function genererCaptcha() {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        let code = "";
        for (let i = 0; i < 5; i++) {
            code += chars[Math.floor(Math.random() * chars.length)];
        }
        captchaDiv.textContent = code;
        return code;
    }

    function verifierCaptcha() {
        if (input.value === captchaDiv.textContent) {
            //alert("✔️ CAPTCHA correct !");
            document.body.removeChild(overlay);
        } else {
            alert("Incorrect, nouveau code généré.");
            genererCaptcha();
            input.value = "";
        }

    }
        
        button.addEventListener("click", verifierCaptcha);
        
       input.addEventListener("keydown", function(event) {
       if (event.key === "Enter") { // si c'est la touche ENTER
           verifierCaptcha();        // on déclenche la vérification
           }
       });

    
    input.focus();

    genererCaptcha();
}



function ecouterSouris() {//écoute le clavier à chaque fois que l'utilisateur clique
    document.addEventListener("click", function() {
         if (!document.querySelector(".captcha-overlay")) {
            captchaPopup();
        }
    });
}
