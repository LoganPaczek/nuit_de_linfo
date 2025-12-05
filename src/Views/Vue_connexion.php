<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: Arial, sans-serif;
        }
        .container {
            width: 55%;
            max-width: 600px;
            background: white;
            padding: 40px;
            margin: 40px auto;
        }
        /* --- TITRE AVEC EMOJIS --- */
        .title-connexion {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            margin-bottom: 25px;
        }
        /* Emoji gauche agrandi */
        .emoji-left {
            width: 90px;      /* 👈 emoji agrandi */
            height: auto;
        }
        /* Emoji droite normal */
        .emoji-right {
            width: 90px;      /* 👈 taille normale */
            height: auto;
        }
        .title-connexion h2 {
            font-size: 30px;
            font-weight: bold;
        }
        /* --- FORMULAIRE --- */
        .login-box label {
            font-weight: bold;
        }
        .login-box input {
            width: 100%;
            padding: 12px;
            margin: 8px 0 18px;
            border-radius: 5px;
            border: 1px solid #000;
        }
        /* --- BOUTON + IMAGE --- */
        .button-container {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .login-box button {
            flex: 1;
            padding: 12px;
            background: #000;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .small-image {
            width: 110px;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- TITRE AVEC EMOJI GAUCHE AGRANDI -->
        <div class="title-connexion">
            <img class="emoji-left" src="./images/connexion/file_00000000848c71f4862d5127de943bb7.png" alt="emoji">
            <h2>Connexion</h2>
            <img class="emoji-right" src="./images/connexion/file_00000000848c71f4862d5127de943bb7.png" alt="emoji">
        </div>
        <form class="login-box">
            <label>Email</label>
            <input type="email" placeholder="Votre email" required>
            <label>Mot de passe</label>
            <input type="password" placeholder="Votre mot de passe" required>
            <div class="button-container">
                <button type="submit">Se connecter</button>
                <img class="small-image" src="./images/connexion/welcome_team.jpg" alt="emoji">
            </div>
        </form>
    </div>
</body>
</html>