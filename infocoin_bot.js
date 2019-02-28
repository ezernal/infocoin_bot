process.env["NTBA_FIX_319"] = 1;

const TelegramBot = require('node-telegram-bot-api');
const fetch = require("node-fetch");

// Ссылка на GitHub-репозиторий при вызове команды /source
const repo = 'https://github.com/ezernal/infocoin_bot';

//Токен бота полученный при регистрации у @BotFather
const token = 'YOUR_TELEGRAM_BOT_TOKEN';

const bot = new TelegramBot(token, {polling: true});


// Команда старта Бота.
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Добро пожаловать в мир криптовалют!', {
    parse_mode: "html"
  });
});

// Команда помощи по Боту.
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id, '<b>Команда  /price + и добавляем монету из списка, что бы получилась "/price Dogecoin </b>', {
    parse_mode: "html"
  });
  bot.sendMessage(msg.chat.id, 'Используйте команду "<b>/available</b>" чтобы получить список всех поддерживаемых валют.', {
    parse_mode: "html",
    disable_web_page_preview: true
  });
});

// Ссылка на репозиторий Бота.
bot.onText(/\/aboutme/, (msg) => {
  bot.sendMessage(msg.chat.id, '<a href="' + repo + '">Мой репозиторий на Github</a>', {
    parse_mode: "html"
  });
  bot.sendMessage(msg.chat.id, 'Если хотите поддержать меня спасибо присылать вот сюда: ETH:0x870a60d62480304d7bfaa25da0db3730fcbec580, BTC:147pmNDXCNCgnYpKDp3mSB2wUKQsXx6T9Q', {
    parse_mode: "html",
    disable_web_page_preview: true
  });
});

// Список поддерживааемых монет и ссылки на них на сайте coinmarketcap.com
bot.onText(/\available/, (msg) => {
  var currencies = [
    'bitcoin',
    'ethereum',
    'Dogecoin',
    'waves',
    'bitcoin-cash',
    'ripple',
    'litecoin',
    'cardano',
    'iota',
    'dash',
    'nem',
    'bitcoin-gold',
    'monero',
    'eos',
    'qtum',
    'stellar',
    'verge',
    'ethereum-classic',
    'tron',
    'lisk',
    'nxt'
  ]

  var available = 'Available currencies:' + '\n';
  currencies.forEach(function(currency) {
    available += '<a href="https://coinmarketcap.com/ru/currencies/' + currency + '/">' + currency + '</a>' + '\n';
  });
  bot.sendMessage(msg.chat.id, available, {
    parse_mode: "html",
    disable_web_page_preview: true
  });
});

// Price
bot.onText(/\/price (.+)/, (msg, match) => {
  const resp = match[1].toLowerCase();

  if (resp) {
    switch (resp) {
      case 'bitcoin':
      case 'btc':
        currency = 'bitcoin';
        break;

      case 'ethereum':
      case 'eth':
        currency = 'ethereum';
        break;

      case 'waves':
        currency = 'waves';
        break;

      case 'dogecoin':
        currency = 'dogecoin';
        break;

      case 'bitcoin-cash':
      case 'bch':
        currency = 'bitcoin-cash';
        break;

      case 'ripple':
      case 'xrp':
        currency = 'ripple';
        break;

      case 'litecoin':
      case 'ltc':
        currency = 'litecoin';
        break;

      case 'cardano':
      case 'ada':
        currency = 'cardano';
        break;

      case 'iota':
      case 'miota':
        currency = 'iota';
        break;

      case 'dash':
        currency = 'dash';
        break;

      case 'nem':
      case 'xem':
        currency = 'nem';
        break;

      case 'bitcoin-gold':
      case 'btg':
        currency = 'bitcoin-gold';
        break;

      case 'monero':
      case 'xmr':
        currency = 'monero';
        break;

      case 'eos':
        currency = 'eos';
        break;

      case 'qtum':
        currency = 'qtum';
        break;

      case 'stellar':
      case 'xlm':
        currency = 'stellar';
        break;

      case 'verge':
      case 'xvg':
        currency = 'verge';
        break;

      case 'ethereum-classic':
      case 'etc':
        currency = 'ethereum-classic';
        break;

      case 'tron':
      case 'trx':
        currency = 'tron';
        break;

      case 'tron':
      case 'lisk':
      case 'lsk':
        currency = 'lisk';
        break;

      case 'nxt':
        currency = 'nxt';
        break;

      default:
        bot.sendMessage(msg.chat.id, 'Введите правильное название монеты.');
        throw new Error('Введите правильное название монеты.');
    }

    fetch('https://api.coinmarketcap.com/v1/ticker/' + currency + '/?convert=RUB&USD')
      .then(response => {
        response.json().then(json => {
          var name = '<b>‼ Name: </b>' + '<a href="https://coinmarketcap.com/currencies/' + currency + '">' + `${json[0].name}` + '</a>' + '\n';
          var rank = '<b>⭐ Rank: </b>' + `${json[0].rank}` + '\n';
          var last24h = '<b>⏰ Last 24h: </b>' + `${json[0].percent_change_24h}` + ' %' + '\n';
          var last7d = '<b>⏳ Last 7d: </b>' + `${json[0].percent_change_7d}` + ' %' + '\n';

          var rub = `${json[0].price_rub}`;
          rub = parseFloat(rub).toFixed(2).replace('.', ',');
          switch (rub.toString().split(",")[0].length) {
            case 4:
              rub = rub.replace(/(\d{1})(\d*)/, '$1.$2');
              break;
            case 5:
              rub = rub.replace(/(\d{2})(\d*)/, '$1.$2');
              break;
            case 6:
              rub = rub.replace(/(\d{3})(\d*)/, '$1.$2');
              break;
            case 7:
              rub = rub.replace(/(\d{4})(\d*)/, '$1.$2');
              break;
          }
          var rub = '<b>RUB: </b>' + rub + ' ₽' + '\n';

          var dollar = `${json[0].price_usd}`;
          dollar = parseFloat(dollar).toFixed(2).replace('.', ',');
          switch (dollar.toString().split(",")[0].length) {
            case 4:
              dollar = dollar.replace(/(\d{1})(\d*)/, '$1.$2');
              break;
            case 5:
              dollar = dollar.replace(/(\d{2})(\d*)/, '$1.$2');
              break;
            case 6:
              dollar = dollar.replace(/(\d{3})(\d*)/, '$1.$2');
              break;
            case 7:
              rub = dollar.replace(/(\d{4})(\d*)/, '$1.$2');
              break;
          }
          var usd = '<b>USD: </b>' + dollar + ' $' + '\n';
          bot.sendMessage(msg.chat.id, name + rank + last24h + last7d + rub + usd, {
            parse_mode: "html",
            disable_web_page_preview: true
          });
        });
      })
  }
});
