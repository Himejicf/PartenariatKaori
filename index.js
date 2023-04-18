const { Client, Intents } = require('discord.js-selfbot-v13');
const fs = require('fs');

// Créer un client Discord avec les intents nécessaires
const client = new Client()

// Définir les identifiants des salons à envoyer les messages avec leur identifiant de serveur correspondant
const channels = {
  '1091238190863613962': 'NightRoom',
  '1093598785587916870': 'Iraku',
  '1011307902985830530': 'Asuu',
  '755523801931841700': 'Mayko',
  '1068844787660242974': 'Mizushi',
  '1083259210961268806': 'miruki',
  '1069999627069304963': 'Les Renards',
  '1068801298671079527': 'Ayume',
  '1071780449015304202': 'Sakana',
  '1075811582489149582': 'Teyvat',
  '908104160908550164': 'Yukiria',
  '1006953952279007403': 'Yumii',
  '1051438820169613383': 'Anime France',
  '946242935324823553': 'Kaori'
};

// Liste des fichiers à envoyer dans chaque canal
const messageFiles = ['./iraku.txt', './nightroom.txt', './asuu.txt', './mayko.txt', './mizushi.txt', './miruki.txt', './lesrenards.txt', './ayume.txt', './sakana.txt', './teyvat.txt', './yukiria.txt', './yumii.txt', './animefrance.txt', './kaori.txt']

// Object contenant les messages déjà postés dans les canaux
const sentMessages = {}

// Fonction d'envoi de message
async function sendMessage(channel, message) {
    try {
        await channel.send(message)
    } catch (error) {
        console.log('Erreur lors de l\'envoi du message', error)
    }
}

// Fonction de récupération et d'envoi de message
function sendMessageFromFile(channel, messageFile) {
    fs.readFile(messageFile, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        // Vérifier si le contenu a déjà été envoyé dans ce canal
        if (!sentMessages[channel.id] || !sentMessages[channel.id].includes(data)) {
            const server = channels[channel.id] || 'inconnu';
            sendMessage(channel, `${data}`);
            // Ajouter le contenu envoyé dans la liste des messages postés
            if (!sentMessages[channel.id]) {
                sentMessages[channel.id] = []
            }
            sentMessages[channel.id].push(data)
        }
    });
}

// Connectez-vous au client Discord en utilisant votre jeton bot
client.login(process.env.TOKEN)

client.once('ready', () => {
    console.log('Le bot est maintenant en ligne')

    // Envoi des messages toutes les secondes
    setInterval(() => {
        Object.entries(channels).forEach(([channelId, server]) => {
            const channel = client.channels.cache.get(channelId)
            if (!channel) {
                console.log('Salon non trouvé')
                return;
            }
            messageFiles.forEach(file => {
                sendMessageFromFile(channel, file)
            })
        })
    }, 1000)

    // Envoi des messages toutes les heures, suivi d'une pause de 24 heures
    setInterval(() => {
        Object.entries(channels).forEach(([channelId, server]) => {
            const channel = client.channels.cache.get(channelId)
            if (!channel) {
                console.log('Salon non trouvé')
                return;
            }
            messageFiles.forEach(file => {
                sendMessageFromFile(channel, file)
            })
        })
    }, 3600000) // envoie toutes les heures (1000 millisecondes x 60 secondes x 60 minutes), suivi d'une pause de 24 heures 

})
