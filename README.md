# Discord Bot (Node.js) - Giveaway

This is a simple Discord bot that allows you to create giveaways.

## Requirements

-   [Node.js](https://nodejs.org/en/) v18.0.0 or higher

## Installation

1. Download the `Repository` and extract it.
2. Open the `config.js` file and fill in the required fields.
3. Open the terminal and type `npm install` to install the required packages.
4. Type `node index.js` to start the bot.

## Config

```js
    token: 'YOUR_BOT_TOKEN' // https://discord.com/developers/app
    clientId: 'YOUR_CLIENT_ID', // https://discord.com/developers/app
    guildId: 'YOUR_GUILD_ID', // https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message

    // webhook
    webhooks: { // https://discord.com/api/webhooks/WEBHOOK_ID/WEBHOOK_TOKEN
        error: { 
            id: 'WEBHOOK_ID',
            token: 'WEBHOOK_TOKEN'
        }
    },
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Contact

Discord: [BadEnd#8883](https://discord.com/users/800422993897586718)