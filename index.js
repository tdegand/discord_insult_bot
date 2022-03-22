require("dotenv").config(); //initialize dotenv
const axios = require('axios').default;

const {
	Client,
	Intents,
	MessageMentions: { USERS_PATTERN },
} = require("discord.js");

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
}); //create new client

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.CLIENT_TOKEN);

function getUserFromMention(mention) {
	// The id is the first and only match found by the RegEx.
	const matches = mention.matchAll(USERS_PATTERN).next().value;

	// If supplied variable was not a mention, matches will be null instead of an array.
	if (!matches) return;

	// The first element in the matches array will be the entire mention, not just the ID,
	// so use index 1.
	const id = matches[1];

	return client.users.cache.get(id);
}

const getRandomInsult = async () => {
    try {
        let res = await axios({
             url: "https://insult.mattbas.org/api/insult",
             method: 'get',
             timeout: 8000,
             headers: {
                 'Content-Type': 'application/json',
             }
         })
         if(res.status == 200){
            return res.data
         }    
     }
     catch (err) {
         console.error(err);
     }
};

client.on("message", (msg) => {
	const user = getUserFromMention(msg.content);

	if (msg.content === "ping") {
		msg.reply("Pong!");
	}
	if (msg.content.includes("stinky")) {
		msg.reply(`${user.toString()} is fucking stinky!`);
	}
    if(msg.content.includes("insult") && user != undefined ) {
        getRandomInsult().then(res => {
            msg.reply(`${user.toString()}: ${res}`)
        });
    }
});

// https://evilinsult.com/generate_insult.php?lang=en&type=json
// https://insult.mattbas.org/api/insult
