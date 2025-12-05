<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <script src="Inscription.js" defer></script>
    <link rel="stylesheet" href="Style_Inscription.css">

</head>
<body>
<form action="index.php?uc=Accueil&action=Connexion" method="POST">

    <!-- NOM -->
    <label for="nom">Nom :</label><br>
    <input type="text" id="nom" name="nom"
           pattern="^[A-Za-zÀ-ÖØ-öø-ÿ\-]{2,}$"
           title="Le nom doit contenir uniquement des lettres (accents autorisés) et au moins 2 caractères."
           required>
    <br><br>

    <!-- PRENOM -->
    <label for="prenom">Prénom :</label><br>
    <input type="text" id="prenom" name="prenom"
           pattern="^[A-Za-zÀ-ÖØ-öø-ÿ\-]{2,}$"
           title="Le prénom doit contenir uniquement des lettres (accents autorisés) et au moins 2 caractères."
           required>
    <br><br>


    <!-- ANNEE -->
    <label for="annee">Année de naissance :</label><br>
    <input type="number" id="annee" name="annee" min="1900" max="2025" required>
    <br><br>


    <!-- EMAIL -->
    <label for="email">Email :</label><br>
    <input type="email" id="email" name="email"
           pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$"
           title="Veuillez entrer une adresse email valide, ex : exemple@gmail.com"
           required>
    <br><br>


    <!-- MOT DE PASSE -->
    <label for="password">Mot de passe : "écriture à l'envers"</label><br>
    <div class="password-container">
        <input type="password" id="password" name="password"
               pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}"
               title="Le mot de passe doit contenir :
- Minimum 8 caractères
- Au moins 1 lettre majuscule
- Au moins 1 lettre minuscule
- Au moins 1 chiffre
- Au moins 1 caractère spécial"
               required>

        <span id="togglePassword" class="toggle-eye">👁️</span>
    </div>
    <br><br>

    <button type="submit" >Valider</button>
</form>

</body>
</html>
