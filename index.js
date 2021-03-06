const Discord = require("discord.js");
const config = require("./config.json");
const fs = require("fs");
const client = new Discord.Client();
client.commands = new Discord.Collection();

fs.readdir("./comandos/", (err, files) => {
    if (err) console.error(err);

    let arquivojs = files.filter(f => f.split(".").pop() === "js");
    arquivojs.forEach((f, i) => {
        let props = require(`./comandos/${f}`);
        console.log(`Comando ${f} inicou com sucesso`)
        client.commands.set(props.help.name, props);
    });
});

// um evento ready, que traduzindo, fica 'pronto'. Como ele diz, iremos criar o evento para verificar se o bot está pronto para ligar.
client.on('ready', () => { // setando o evento com nosso Discord.Client
    console.log(`Bot foi iniciado com sucesso`); // caso não haja erro, o bot enviara no console que ligou
    
    // agora, iremos criar uma presence para nosso bot, porém, vai ser alternativa. Ou seja, alternando entre o que colocarmos abaixo
    var tabela = [ // criando uma variavel, nomeada de tabela 

// uma notinha: toda vez que for criar uma nova presence na nossa tabela, bote uma vírgula no final!
        {name: 'Minecraft', type: 'PLAYING'}, 
        {name: 'Spotify', type: 'LISTENING'},
        {name: 'YouTube', type: 'WATCHING'},
        {name: 'amor para todos!', type: 'STREAMING', url: 'https://twitch.tv/younguei'}
    ];
// criando uma function...
    function setStatus() { // nomeamos ela de: setStatus
        // agora, iremos criar um sistema randômico, alternando entre as opções que criamos para a tabela
        var altstatus = tabela[Math.floor(Math.random() * tabela.length)]
        client.user.setPresence({game: altstatus}) // por fim, setando a presence. No caso, o jogo é a variavel que criamos 'altstatus'
    }
    setStatus(); // para finalizar, puxamos a function que criamos no inicio
    setInterval(() => setStatus(), 15000) // e adicionamos um intervalo entre as presences
});  

client.on('guildMemberAdd', membro => { // definimos o nome desse evento, como: membro
    var canal = client.channels.get("id do canal"); // puxamos o ID do canal, onde enviaremos a embed, para o canal de boas-vindas
    var cargo = membro.guild.roles.get("id do cargo"); // puxamos o ID de um cargo, no qual, iremos adicionar para o membro

// criando a embed de boas-vindas!
    let embedi = new Discord.RichEmbed()
    
    .setTitle(`WELCOME`) 
    .setDescription(`Olá **${membro.user.username}**, seja muito bem vindo (ou vinda) ao \`Discord Lab 🧪\`! Somos uma comunidade focada no aprendizado e auxílio aos programadores, os quais estão sempre ativos para ajudar você também. Esperamos que goste, estamos à disposição! ✨`) 
    .setThumbnail(membro.displayAvatarURL)
    .setColor('BLUE')
    .addField(`__**SOBRE NÓS**__`, `:busts_in_silhouette: Usuários: \`${membro.guild.memberCount}\`\n<:DL_bot:693959313198153820> Meu prefixo é: \`${config.prefix}\`\n<:DL_github:693136690801410178> Repositório: [Discord-Lab](https://github.com/young-js) \n<:DL_twitter:693132106255040671> Twitter: [@Discord_Lab](https://twitter.com/Discord_Lab)`)
    .setFooter(`ID do Usuário: ${membro.id}`)
    
    canal.send(embedi)
});

client.on('guildMemberRemove', membro => { // setamos o nome de membro
    var canal = client.channels.get("id do canal"); // puxando o ID de um canal para enviar a mensagem
    var server = client.guilds.get
    // criando uma embed
    let embed = new Discord.RichEmbed()

    .setTitle(`SAÍDA`)
    .setDescription(`Nós infelizmente deixamos de contar com a presença de \`${membro.user.tag}\`, agora, estamos com \`${client.users.size}\` usuários no \`Discord Lab 🧪\`!`)
    .setColor('RED')
    .setFooter(`ID do Usuário: ${membro.id}`)

    canal.send(`**${membro.user.tag}**`, embed)

});
client.on('message', message => { // nome desse evento, foi setado como: message
    if (message.author.bot) return; // puxando o nome definido, bloquearemos o uso de comandos por outros bots
    if (message.channel.type === "dm") return; // caso seja uma mensagem privada ao nosso bot, não retornaremos

    let prefix = config.prefix; // puxando o prefixo do nosso bot
    if (!message.content.startsWith(prefix)) return; // para evitar bugs, setaremos uma function, definindo que o bot respondera apenas para mensagens que possuem seu prefixo, no inicio
    var args = message.content.substring(config.prefix.length).split(" "); // definindo o que seria os argumentos
    let cmd = args.shift().toLowerCase(); // puxando dos args, setaremos que o bot pode responder sim, a comandos com a letra inicial maiuscula

    let command = client.commands.get(cmd) // puxaremos o conteudo de tal comando
    if (command) { // caso o membro utilize um comando inexistente, daremos o erro
    command.run(client, message, args); // essa é a base de todo arquivo js
  } else {
    message.reply(`hmmm :thinking: Não encontrei esse comando.`); // mensagem de comando inexistente
  }
})

client.login(config.token);
